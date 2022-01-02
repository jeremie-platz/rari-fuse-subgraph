/* eslint-disable prefer-const */ // to satisfy AS compiler
import { PoolRegistered } from "../../generated/FusePoolDirectory/FusePoolDirectory";
import { MarketListed } from "../../generated/FusePoolDirectory/Comptroller";

import { Comptroller as ComptrollerTemplate } from "../../generated/templates";
import { CToken as CTokenTemplate } from "../../generated/templates/CToken/CToken";
import { Address, DataSourceContext } from "@graphprotocol/graph-ts";
import {
  Ctoken,
  UnderlyingAsset,
  Pool as ComptrollerSchema,
} from "../../generated/schema";

import { Comptroller } from "../../generated/templates/Comptroller/Comptroller";
import { log, BigInt } from "@graphprotocol/graph-ts";
import { updateETHPrice } from "./helpers";
import {
  ADDRESS_ZERO,
  getOrCreateMarketWithId,
  ProtocolName,
  ProtocolType,
} from "./simplefi-common";
import { updateFusePoolCount } from "../utils/updateCount";

/*  var ComptrollerABI = require("../../abis/Comptroller.json");
// Require the web3 node module.
var Web3 = require('web3');
// Show Web3 where it needs to look for a connection to Ethereum.
let web3 = new Web3(new Web3.providers.HttpProvider('https://main-rpc.linkpool.io/'));
 */

export function getAllMarketsInPool(_contract: Comptroller): string[] {
  let allMarketsInPool_ = _contract.getAllMarkets();
  let allMarketsInPool: string[] = [];

  for (let i = 0; i < allMarketsInPool_.length; i++) {
    allMarketsInPool.push(allMarketsInPool_[i].toHexString());
  }

  return allMarketsInPool;
}

export function handlePoolRegistered(event: PoolRegistered): void {
  const index = event.params.index;
  const comptrollerAddress = event.params.pool.comptroller;
  const poolName = event.params.pool.name;

  const comptroller = Comptroller.bind(comptrollerAddress);
  log.warning(`🚨🚨comptroller address is {} for pool {}🚨🚨`, [
    comptrollerAddress.toHexString(),
    poolName,
  ]);

  updateETHPrice();

  const comp = new ComptrollerSchema(comptrollerAddress.toHexString());

  // Get the pool's price oracle
  let priceOracleCall = comptroller.try_oracle();
  if (!priceOracleCall.reverted) {
    comp.priceOracle = priceOracleCall.value;
  } else {
    log.warning("priceOracleCall Reverted", []);
  }

  // TODO - remove: deprecated
  // let maxAssetsCall = comptroller.try_maxAssets();
  // if (!maxAssetsCall.reverted) {
  //   comp.maxAssets = comptroller.maxAssets();
  // } else {
  //   log.warning("maxAssetsCall Reverted", []);
  // }

  // Liquidation Incentive
  let liquidationIncentiveMantissaCall = comptroller.try_liquidationIncentiveMantissa();
  if (!liquidationIncentiveMantissaCall.reverted) {
    comp.liquidationIncentive = liquidationIncentiveMantissaCall.value;
  } else {
    log.warning("liquidationIncentiveMantissaCall Reverted", []);
  }

  // Close Factor
  let closeFactorMantissaCall = comptroller.try_closeFactorMantissa();
  if (!closeFactorMantissaCall.reverted) {
    comp.closeFactor = closeFactorMantissaCall.value;
  } else {
    log.warning("closeFactorMantissaCall Reverted", []);
  }

  // Basics
  comp.address = comptrollerAddress;
  comp.comptroller = comptrollerAddress;
  comp.index = index;
  comp.name = poolName;
  // comp.priceOracle = comptroller.oracle();
  // comp.liquidationIncentive = comptroller.liquidationIncentiveMantissa();
  // comp.maxAssets = comptroller.maxAssets();
  // comp.closeFactor = comptroller.closeFactorMantissa();
  comp.assets = []; //actual ctokens are linked in comptroller.ts mapping
  comp.underlyingAssets = [];
  comp.totalSupplyUSD = BigInt.fromString("0");
  comp.totalBorrowUSD = BigInt.fromString("0");
  comp.totalLiquidityUSD = BigInt.fromString("0");
  comp.totalSeizedTokens = BigInt.fromString("0");
  comp.blockCreated = event.block.number;

  // Instantiate the Comptroller Template for this Fuse Pool so that we can listen to events on it.
  let context = new DataSourceContext();
  ComptrollerTemplate.createWithContext(comptrollerAddress, context);
  comp.save();

  // Increment Pool count aggregate type
  updateFusePoolCount();
}
