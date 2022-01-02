/* eslint-disable prefer-const */ // to satisfy AS compiler

import {
  MarketListed,
  NewCollateralFactor,
  NewPriceOracle,
} from "../../generated/FusePoolDirectory/Comptroller";
import {
  Ctoken as CtokenSchema,
  UnderlyingAsset as UnderlyingAssetSchema,
  Pool as ComptrollerSchema,
  Utility,
} from "../../generated/schema";

import { CToken } from "../../generated/templates/CToken/CToken";
import { ERC20 } from "../../generated/templates/CToken/ERC20";
import { PriceOracle } from "../../generated/templates/CToken/PriceOracle";
import { CToken as CTokenTemplate } from "../../generated/templates";
import {
  log,
  dataSource,
  Address,
  BigInt,
  BigDecimal,
  DataSourceContext,
} from "@graphprotocol/graph-ts";

import {
  getETHBalance,
  getTotalInUSD,
  calculateCTokenTotalSupply,
  convertMantissaToAPR,
  convertMantissaToAPY,
  BigZero,
} from "./helpers";

import { Comptroller } from "../../generated/templates/Comptroller/Comptroller";
import {
  ADDRESS_ZERO,
  getOrCreateERC20Token,
  getOrCreateMarketWithId,
  ProtocolName,
  ProtocolType,
} from "./simplefi-common";
import {
  updateCTokenCount,
  updateUnderlyingAssetCount,
} from "../utils/updateCount";


// Creates Comptroller contract instance and updates a `Comptroller` entity with its values
function updateFromComptroller(
  entity: ComptrollerSchema | null,
  address: Address
): void {
  const instance = Comptroller.bind(address);
  let liquidationIncentiveCall = instance.try_liquidationIncentiveMantissa();
  let closeFactorCall = instance.try_closeFactorMantissa();

  // let maxAssetsCall = instance.try_maxAssets();
  // if (!maxAssetsCall.reverted) entity.maxAssets = maxAssetsCall.value;

  if (!liquidationIncentiveCall.reverted)
    entity.liquidationIncentive = liquidationIncentiveCall.value;
  if (!closeFactorCall.reverted) entity.closeFactor = closeFactorCall.value;
}

function updateFromLens(
  entity: ComptrollerSchema | null,
  address: Address
): void {}

// Todo - only update the price oracle on the pool
export function handleNewPriceOracle(event: NewPriceOracle): void {
  const comptroll = ComptrollerSchema.load(event.address.toHexString());
  comptroll.priceOracle = event.params.newPriceOracle;
  updateFromComptroller(comptroll, event.address);
  comptroll.save();
}

export function handleMarketListed(event: MarketListed): void {
  log.warning(`🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 handleMarketListed`, []);
  // log.warning(`🚨🚨creating CToken for {}🚨🚨`, [
  //   event.params.cToken.toHexString(),
  // ]);

  //let context = dataSource.context();
  //const index = context.getString("index");

  // log.warning(`updating Comptroller {}🚨🚨`, [event.address.toHexString()]);

  // Instantiate Comptroller, add new Market to `assets` list
  const comptroll = ComptrollerSchema.load(event.address.toHexString());
  comptroll.assets = comptroll.assets.concat([
    event.params.cToken.toHexString(),
  ]);

  // Do updates
  // TODO - simplify this
  updateFromComptroller(comptroll, event.address);

  let ct = new CtokenSchema(event.params.cToken.toHexString());
  ct.pool = event.address.toHexString();

  log.warning(
    `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 below updateFromComptroller`,
    []
  );
  //CTokenTemplate.create(event.params.cToken); 4

  const instance = CToken.bind(event.params.cToken);
  const underlying = instance.underlying();
  // log.warning(` CToken underlying is {}🚨🚨`, [underlying.toHexString()]);

  ct.name = instance.name();
  ct.symbol = instance.symbol();
  ct.decimals = instance.decimals();

  const simpleERC20 = getOrCreateERC20Token(event, underlying);
  const erc20 = ERC20.bind(underlying);
  const _balance = erc20.try_balanceOf(event.params.cToken);
  if (!_balance.reverted) {
    log.warning(`🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 in _balance.reverted`, []);
    ct.underlyingBalance = _balance.value;
  } else {
    if (
      underlying.toHexString() == "0x0000000000000000000000000000000000000000"
    ) {
      log.warning(
        `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 line 112, cToken, underlying asset is ETH`,
        []
      );
      //underlying is ETH
      ct.underlyingBalance = getETHBalance(event.params.cToken);
    } else {
      log.warning(
        `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 line 120, erc20 balance call fails`,
        []
      );
      //erc20 balance call failed
      ct.underlyingBalance = BigInt.fromString("0");
    }
  }

  let util = Utility.load("0");
  const ethUSD = util.ethPriceInDai;

  const oracle = PriceOracle.bind(comptroll.priceOracle as Address);

  const cTokenTotalSupply = calculateCTokenTotalSupply(instance);
  ct.totalSupply = cTokenTotalSupply;

  ct.liquidity = instance.getCash();
  /* const _cash = instance.try_getCash();
  if (!_cash.reverted) {
    ct.liquidity = _cash.value;
  } */

  ct.borrowRatePerBlock = instance.borrowRatePerBlock();
  ct.borrowAPR = convertMantissaToAPR(
    BigDecimal.fromString(ct.borrowRatePerBlock.toString())
  );
  /* const _borrowRatePerBlock = instance.try_borrowRatePerBlock();
  if (!_borrowRatePerBlock.reverted) {
    ct.borrowRatePerBlock = _borrowRatePerBlock.value;
  } */

  ct.totalBorrow = instance.totalBorrowsCurrent();
  /* const _totalBorrows = instance.try_totalBorrows();
  if (!_totalBorrows.reverted) {
    ct.totalBorrows = _totalBorrows.value;
  } */

  ct.totalReserves = instance.totalReserves();
  /*  const _totalReserves = instance.try_totalReserves();
   if (!_totalReserves.reverted) {
     ct.totalReserves = _totalReserves.value;
   } */

  ct.reserveFactor = instance.reserveFactorMantissa();
  /* const _reserveFactor = instance.try_reserveFactorMantissa();
  if (!_reserveFactor.reverted) {
    ct.reserveFactor = _reserveFactor.value;
  } */

  ct.adminFee = instance.adminFeeMantissa();
  /* const _adminFee = instance.try_adminFeeMantissa();
  if (!_adminFee.reverted) {
    ct.adminFee = _adminFee.value;
  } */

  ct.fuseFee = instance.fuseFeeMantissa();
  /*  const _fuseFee = instance.try_fuseFeeMantissa();
   if (!_fuseFee.reverted) {
     ct.fuseFee = _fuseFee.value;
   } */

  ct.totalAdminFees = instance.totalAdminFees();
  /* const _totalAdminFees = instance.try_totalAdminFees();
  if (!_totalAdminFees.reverted) {
    ct.totalAdminFees = _totalAdminFees.value;
  } */

  ct.supplyRatePerBlock = instance.supplyRatePerBlock();
  // log.warning("🚨1 setting supplyAPY to {} from {}", [
  //   convertMantissaToAPY(
  //     BigDecimal.fromString(ct.supplyRatePerBlock.toString())
  //   ).toString(),
  //   ct.supplyRatePerBlock.toString(),
  // ]);

  log.warning(
    `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 line 195, after all the variable assignments`,
    []
  );

  ct.supplyAPY = convertMantissaToAPY(
    BigDecimal.fromString(ct.supplyRatePerBlock.toString())
  );
  /*  const _supplyRatePerBlock = instance.try_supplyRatePerBlock();
   if (!_supplyRatePerBlock.reverted) {
     ct.supplyRatePerBlock = _supplyRatePerBlock.value;
   } */

  //  Load the underlyingasset.
  let asset = UnderlyingAssetSchema.load(underlying.toHexString());
  let newUnderlyingAsset = asset == null;

  // If the underlying doesn't exist yet in our db, create it
  if (asset == null) {
    asset = new UnderlyingAssetSchema(underlying.toHexString());
    asset.id = underlying.toHexString();
    asset.address = underlying;

    // ETH
    if (
      underlying.toHexString() == "0x0000000000000000000000000000000000000000"
    ) {
      //eth
      asset.name = "Ethereum";
      asset.symbol = "ETH";
      asset.decimals = 18;
    } else if (
      underlying.toHexString() == "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2"
    ) {
      //MKR (MakerDAO) token
      //very old and uses a unsupported string encoding so setup manually
      asset.name = "Maker";
      asset.symbol = "MKR";
      asset.decimals = 18;
    } else {
      // erc20 - handle normally
      const _decimals = erc20.try_decimals();
      if (!_decimals.reverted) {
        asset.decimals = _decimals.value;
      } else {
        log.warning("get decimals failed", []);
      }
      const name = erc20.try_name();
      if (!name.reverted) {
        asset.name = name.value;
      }
      const symbol = erc20.try_symbol();
      if (!symbol.reverted) {
        asset.symbol = symbol.value;
      }
    }
  }

  log.warning(
    `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 line 249, after Underlying Asset schema`,
    []
  );

  if (!asset.pools.includes(event.address.toHexString())) {
    // log.warning(`asset {} doesn't yet include {} pool, adding it`, [
    //   asset.id,
    //   event.address.toHexString(),
    // ]);
    //only add pools once
    asset.pools = asset.pools.concat([event.address.toHexString()]);
  } else {
    // log.warning(`skipping pool edition already has it {}`, [
    //   `${asset.pools.includes(event.address.toHexString())}`,
    // ]);
  }

  ct.totalBorrowUSD = BigInt.fromString("0"); //initial setup so ct property is correct type
  asset.totalBorrowUSD = BigInt.fromString("0");
  ct.totalSupplyUSD = BigInt.fromString("0"); //initial setup so ct property is correct type
  asset.totalSupplyUSD = BigInt.fromString("0");
  asset.totalSupply = BigInt.fromString("0");
  asset.totalBorrow = BigInt.fromString("0");
  ct.liquidityUSD = BigInt.fromString("0"); //initial setup so ct property is correct type
  asset.totalLiquidityUSD = BigInt.fromString("0");
  asset.totalLiquidity = BigInt.fromString("0");
  ct.totalSeizedTokens = BigInt.fromString("0");

  log.warning(
    `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 line 278, BigInt logic conversion`,
    []
  );

  //update price from oracle on pool
  const _price = oracle.try_getUnderlyingPrice(event.params.cToken);
  if (!_price.reverted) {
    log.warning(
      `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 line 287, in if statement from oracle pricing`,
      []
    );

    asset.price = _price.value;

    const newSupplyUSD = getTotalInUSD(cTokenTotalSupply, ethUSD, _price.value);

    //this one is seperate from the other if block because usd increase doesn't always mean that real amount increased
    if (ct.totalSupply.ge(cTokenTotalSupply)) {
      asset.totalSupply = asset.totalSupply.plus(
        cTokenTotalSupply.minus(ct.totalSupply)
      );
    } else {
      asset.totalSupply = asset.totalSupply.minus(
        ct.totalSupply.minus(cTokenTotalSupply)
      );
    }

    if (ct.totalSupplyUSD.ge(newSupplyUSD)) {
      //total increased
      comptroll.totalSupplyUSD = comptroll.totalSupplyUSD.plus(
        newSupplyUSD.minus(ct.totalSupplyUSD)
      );
      asset.totalSupplyUSD = asset.totalSupplyUSD.plus(
        newSupplyUSD.minus(ct.totalSupplyUSD)
      );
      asset.totalSupply = asset.totalSupply.plus(
        cTokenTotalSupply.minus(ct.totalSupply)
      );
    } else {
      //total decreased
      comptroll.totalSupplyUSD = comptroll.totalSupplyUSD.minus(
        ct.totalSupplyUSD.minus(newSupplyUSD)
      );
      asset.totalSupplyUSD = asset.totalSupplyUSD.minus(
        ct.totalSupplyUSD.minus(newSupplyUSD)
      );
      if (BigZero.gt(asset.totalSupplyUSD)) {
        asset.totalSupplyUSD = BigZero;
      }
      if (BigZero.gt(comptroll.totalSupplyUSD)) {
        comptroll.totalSupplyUSD = BigZero;
      }
    }
    ct.totalSupplyUSD = newSupplyUSD;

    const newTotalBorrow = instance.totalBorrowsCurrent();
    const newBorrowUSD = getTotalInUSD(newTotalBorrow, ethUSD, _price.value);

    //this one is seperate from the other if block because usd increase doesn't always mean that real amount increased
    if (ct.totalBorrow.ge(newTotalBorrow)) {
      asset.totalBorrow = asset.totalBorrow.plus(
        newTotalBorrow.minus(ct.totalBorrow)
      );
    } else {
      asset.totalBorrow = asset.totalBorrow.minus(
        ct.totalBorrow.minus(newTotalBorrow)
      );
      if (BigZero.gt(asset.totalBorrow)) {
        asset.totalBorrow = BigZero;
      }
    }

    log.warning(
      `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 line 351, after borrow logic`,
      []
    );

    if (ct.totalBorrowUSD.ge(newBorrowUSD)) {
      //total increased
      comptroll.totalBorrowUSD = comptroll.totalBorrowUSD.plus(
        newBorrowUSD.minus(ct.totalBorrowUSD)
      );
      asset.totalBorrowUSD = asset.totalBorrowUSD.plus(
        newBorrowUSD.minus(ct.totalBorrowUSD)
      );
    } else {
      //total decreased
      comptroll.totalBorrowUSD = comptroll.totalBorrowUSD.minus(
        ct.totalBorrowUSD.minus(newBorrowUSD)
      );
      asset.totalBorrowUSD = asset.totalBorrowUSD.minus(
        ct.totalBorrowUSD.minus(newBorrowUSD)
      );
      if (BigZero.gt(asset.totalBorrowUSD)) {
        asset.totalBorrowUSD = BigZero;
      }
      if (BigZero.gt(comptroll.totalBorrowUSD)) {
        comptroll.totalBorrowUSD = BigZero;
      }
    }
    ct.totalBorrowUSD = newBorrowUSD;

    const cash = instance.try_getCash();

    if (!cash.reverted) {
      const newLiquidityUSD = getTotalInUSD(cash.value, ethUSD, _price.value);
      //this one is seperate from the other if block because usd increase doesn't always mean that real amount increased
      if (ct.liquidity.ge(_price.value)) {
        asset.totalLiquidity = asset.totalLiquidity.plus(
          _price.value.minus(ct.liquidity)
        );
      } else {
        asset.totalLiquidity = asset.totalLiquidity.minus(
          ct.liquidity.minus(_price.value)
        );
      }

      if (!ct.liquidityUSD) {
        ct.liquidityUSD = BigInt.fromString("0");
      }
      if (ct.liquidityUSD.ge(newBorrowUSD)) {
        //total increased
        comptroll.totalLiquidityUSD = comptroll.totalLiquidityUSD.plus(
          newLiquidityUSD.minus(ct.liquidityUSD)
        );
        asset.totalLiquidityUSD = asset.totalLiquidityUSD.plus(
          newLiquidityUSD.minus(ct.liquidityUSD)
        );
      } else {
        //total decreased
        comptroll.totalLiquidityUSD = comptroll.totalLiquidityUSD.minus(
          ct.liquidityUSD.minus(newLiquidityUSD)
        );
        asset.totalLiquidityUSD = asset.totalLiquidityUSD.minus(
          ct.liquidityUSD.minus(newLiquidityUSD)
        );
        if (BigZero.gt(asset.totalLiquidityUSD)) {
          asset.totalLiquidityUSD = BigZero;
        }
        if (BigZero.gt(comptroll.totalLiquidityUSD)) {
          comptroll.totalLiquidityUSD = BigZero;
        }
      }

      ct.liquidityUSD = newLiquidityUSD;
    }
  } else {
    asset.price = BigInt.fromString("0");
    ct.totalSupplyUSD = BigZero; //getTotalInUSD(cTokenTotalSupply, ethUSD, BigInt.fromString("0"));
    ct.totalBorrowUSD = BigZero; //getTotalInUSD(instance.totalBorrowsCurrent(), ethUSD, BigInt.fromString("0"));
    ct.liquidityUSD = BigZero; //getTotalInUSD(instance.getCash(), ethUSD, BigInt.fromString("0"));
  }
  asset.ctokens = asset.ctokens.concat([event.params.cToken.toHexString()]);
  //asset.pools = asset.ctokens.concat([event.params.cToken.toHexString()])
  asset.save();

  ct.underlying = asset.id;

  let context = new DataSourceContext();

  CTokenTemplate.createWithContext(event.params.cToken, context);
  ct.save();

  //push cToken to relevant Pool's array
  comptroll.assets = comptroll.assets.concat([ct.id]);
  comptroll.underlyingAssets = comptroll.underlyingAssets.concat([
    underlying.toHexString(),
  ]);

  comptroll.save();

  //create CToken Token interface
  const cTokenSimpleToken = getOrCreateERC20Token(event, event.params.cToken);

  // Create market
  getOrCreateMarketWithId(
    event,
    event.params.cToken.toHexString(),
    event.params.cToken,
    ProtocolName.RARI_FUSE,
    ProtocolType.LENDING,
    [simpleERC20],
    cTokenSimpleToken,
    [simpleERC20]
  );

  // Update Market Count every time a new market is listed
  updateCTokenCount();

  // Update Underlying Asset Count if this market represented a new underlyingAsset
  if (newUnderlyingAsset) {
    updateUnderlyingAssetCount();
  }

  log.warning(
    `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 line 462, at the end of comptroller`,
    []
  );
}

// Update the CF on that asset
export function handleNewCollateralFactor(event: NewCollateralFactor): void {
  // log.debug("yo", []);
  let cToken = CtokenSchema.load(event.params.cToken.toHexString());
  cToken.collateralFactor = event.params.newCollateralFactorMantissa;
  cToken.save();
}
