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
import { updateCount } from "../utils/updateCount";

// Creates Comptroller contract instance and updates a `Comptroller` entity with its values
function updateFromComptroller(
  entity: ComptrollerSchema | null,
  address: Address
): void {
  const comptrollerInstance = Comptroller.bind(address);
  let liquidationIncentiveCall = comptrollerInstance.try_liquidationIncentiveMantissa();
  let closeFactorCall = comptrollerInstance.try_closeFactorMantissa();

  // let maxAssetsCall = comptrollerInstance.try_maxAssets();
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

  // Utils
  // let util = Utility.load("0");
  // let ethUSD = util.ethPriceInDai;

  // log.warning(`🚨🚨creating CToken for {}🚨🚨`, [
  //   event.params.cToken.toHexString(),
  // ]);

  //let context = dataSource.context();
  //const index = context.getString("index");

  // log.warning(`updating Comptroller {}🚨🚨`, [event.address.toHexString()]);

  /** Instantiate Entities **/

  // Instantiate Comptroller, add new Market to `assets` list
  const comptroll = ComptrollerSchema.load(event.address.toHexString());
  comptroll.assets = comptroll.assets.concat([
    event.params.cToken.toHexString(),
  ]);

  // Do Comptroller updates
  // TODO - simplify this
  updateFromComptroller(comptroll, event.address);

  /** BEGIN CTOKEN **/

  // Instantiate new CToken for newly listed market
  let ct = new CtokenSchema(event.params.cToken.toHexString());
  ct.pool = event.address.toHexString();

  log.warning(
    `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 below updateFromComptroller`,
    []
  );
  //CTokenTemplate.create(event.params.cToken); 4

  const cTokenInstance = CToken.bind(event.params.cToken);
  const underlyingAddress = cTokenInstance.underlying();
  // log.warning(` CToken underlying is {}🚨🚨`, [underlying.toHexString()]);

  ct.name = cTokenInstance.name();
  ct.symbol = cTokenInstance.symbol();
  ct.decimals = cTokenInstance.decimals();

  /* Begin ERC20 */
  // SimpleFi - Save ERC20 - Simplefi util
  const simpleERC20 = getOrCreateERC20Token(event, underlyingAddress);

  // Fuse - create ERC20 instance
  const erc20 = ERC20.bind(underlyingAddress);

  // Get ERC20 Balance of CToken
  const tryBalance = erc20.try_balanceOf(event.params.cToken);
  if (!tryBalance.reverted) {
    ct.underlyingBalance = tryBalance.value;
  } else {
    // Get ETH Balance - if underlying is ETH
    if (
      underlyingAddress.toHexString() ==
      "0x0000000000000000000000000000000000000000"
    ) {
      ct.underlyingBalance = getETHBalance(event.params.cToken);
    } else {
      // Balance call failed and asset is not ETH -  Instantiate ERC20 Balance to 0

      // log.warning(
      //   `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 line 120, erc20 balance call fails. instantiating to 0`,
      //   []
      // );
      //erc20 balance call failed
      ct.underlyingBalance = BigZero;
    }
  }

  // const cTokenTotalSupply = calculateCTokenTotalSupply(cTokenInstance);
  // ct.totalSupply = cTokenTotalSupply;

  // ct.liquidity = cTokenInstance.getCash();
  /* const _cash = cTokenInstance.try_getCash();
  if (!_cash.reverted) {
    ct.liquidity = _cash.value;
  } */

  // ct.totalBorrow = cTokenInstance.totalBorrowsCurrent();
  /* const _totalBorrows = cTokenInstance.try_totalBorrows();
  if (!_totalBorrows.reverted) {
    ct.totalBorrows = _totalBorrows.value;
  } */

  ct.borrowRatePerBlock = cTokenInstance.borrowRatePerBlock();
  /* const _borrowRatePerBlock = cTokenInstance.try_borrowRatePerBlock();
  if (!_borrowRatePerBlock.reverted) {
    ct.borrowRatePerBlock = _borrowRatePerBlock.value;
  } */

  ct.supplyRatePerBlock = cTokenInstance.supplyRatePerBlock();
  // log.warning("🚨1 setting supplyAPY to {} from {}", [
  //   convertMantissaToAPY(
  //     BigDecimal.fromString(ct.supplyRatePerBlock.toString())
  //   ).toString(),
  //   ct.supplyRatePerBlock.toString(),
  // ]);

  ct.totalReserves = cTokenInstance.totalReserves();
  /*  const _totalReserves = cTokenInstance.try_totalReserves();
   if (!_totalReserves.reverted) {
     ct.totalReserves = _totalReserves.value;
   } */

  ct.reserveFactor = cTokenInstance.reserveFactorMantissa();
  /* const _reserveFactor = cTokenInstance.try_reserveFactorMantissa();
  if (!_reserveFactor.reverted) {
    ct.reserveFactor = _reserveFactor.value;
  } */

  ct.adminFee = cTokenInstance.adminFeeMantissa();
  /* const _adminFee = cTokenInstance.try_adminFeeMantissa();
  if (!_adminFee.reverted) {
    ct.adminFee = _adminFee.value;
  } */

  ct.fuseFee = cTokenInstance.fuseFeeMantissa();
  /*  const _fuseFee = cTokenInstance.try_fuseFeeMantissa();
   if (!_fuseFee.reverted) {
     ct.fuseFee = _fuseFee.value;
   } */

  ct.totalAdminFees = cTokenInstance.totalAdminFees();
  /* const _totalAdminFees = cTokenInstance.try_totalAdminFees();
  if (!_totalAdminFees.reverted) {
    ct.totalAdminFees = _totalAdminFees.value;
  } */

  ct.underlying = underlyingAddress.toHexString();

  // log.warning(
  //   `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 line 195, after all the variable assignments`,
  //   []
  // );

  ct.supplyAPY = convertMantissaToAPY(
    BigDecimal.fromString(ct.supplyRatePerBlock.toString())
  );

  ct.borrowAPR = convertMantissaToAPR(
    BigDecimal.fromString(ct.borrowRatePerBlock.toString())
  );

  // Initialize liquidity/supply/borrow values
  ct.totalSeizedTokens = BigZero;

  ct.totalSupply = BigZero;
  ct.totalBorrow = BigZero;
  ct.liquidity = BigZero;

  ct.totalBorrowUSD = BigZero; //initial setup so ct property is correct type
  ct.totalSupplyUSD = BigZero; //initial setup so ct property is correct type
  ct.liquidityUSD = BigZero; //initial setup so ct property is correct type

  /** END CTOKEN **/

  /** BEGIN UNDERLYING ASSET **/
  //  Load the underlyingasset.
  let underlyingAsset = UnderlyingAssetSchema.load(
    underlyingAddress.toHexString()
  );
  let isNewUnderlyingAsset = underlyingAsset == null;

  // If the underlying underlyingAsset's schema doesn't exist yet in our db, create it
  if (isNewUnderlyingAsset) {
    underlyingAsset = new UnderlyingAssetSchema(
      underlyingAddress.toHexString()
    );
    underlyingAsset.id = underlyingAddress.toHexString();
    underlyingAsset.address = underlyingAddress;

    // New underlying asset is ETH
    if (
      underlyingAddress.toHexString() ==
      "0x0000000000000000000000000000000000000000"
    ) {
      //eth
      underlyingAsset.name = "Ethereum";
      underlyingAsset.symbol = "ETH";
      underlyingAsset.decimals = 18;
    } else if (
      underlyingAddress.toHexString() ==
      "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2"
    ) {
      //MKR (MakerDAO) token
      //very old and uses a unsupported string encoding so setup manually
      underlyingAsset.name = "Maker";
      underlyingAsset.symbol = "MKR";
      underlyingAsset.decimals = 18;
    } else {
      // erc20 - handle normally
      const _decimals = erc20.try_decimals();
      if (!_decimals.reverted) {
        underlyingAsset.decimals = _decimals.value;
      } else {
        log.warning("get decimals failed", []);
      }
      const name = erc20.try_name();
      if (!name.reverted) {
        underlyingAsset.name = name.value;
      }
      const symbol = erc20.try_symbol();
      if (!symbol.reverted) {
        underlyingAsset.symbol = symbol.value;
      }
    }

    // Since this is our first time creating the UnderlyingAsset, we initalize these values
    underlyingAsset.totalSupply = BigZero;
    underlyingAsset.totalBorrow = BigZero;
    underlyingAsset.totalLiquidity = BigZero;

    underlyingAsset.totalLiquidityUSD = BigZero;
    underlyingAsset.totalBorrowUSD = BigZero;
    underlyingAsset.totalSupplyUSD = BigZero;
  }

  // Update the underlyingAsset's pools array with this new pool
  // only add this pool once
  if (!underlyingAsset.pools.includes(event.address.toHexString())) {
    underlyingAsset.pools = underlyingAsset.pools.concat([
      event.address.toHexString(),
    ]);
  }
  // Update this underlying asset's CTokens
  underlyingAsset.ctokens = underlyingAsset.ctokens.concat([
    event.params.cToken.toHexString(),
  ]);

  // Update price from oracle on pool
  // Do a whole lotta shit if you have the oracle price
  const oracle = PriceOracle.bind(comptroll.priceOracle as Address);
  const tryPrice = oracle.try_getUnderlyingPrice(event.params.cToken);
  if (!tryPrice.reverted) {
    let price = tryPrice.value;

    // 1.) Update the underlying Asset's Price
    underlyingAsset.price = price;

    log.info(
      "🏪 1 handleMarketListed: market: {}, price: {}, ctoken.liquidityUSD: {}, underlyingAsset.totalLiquidity: {}, underlyingAsset.totalLiquidityUSD: {}, comptroller.totalLiquidityUSD: {}",
      [
        event.params.cToken.toHexString(),
        price.toString(),
        ct.liquidityUSD.toString(),
        underlyingAsset.totalLiquidity.toString(),
        underlyingAsset.totalLiquidityUSD.toString(),
        comptroll.totalLiquidityUSD.toString(),
      ]
    );
  } else {
    // Unable to get price for underlying Asset from oracle upon market listed. Instantiate the price to 0
    underlyingAsset.price = BigZero;
  }
  underlyingAsset.save();
  /** END UNDERLYING ASSET */

  //push cToken to relevant Pool's array
  comptroll.assets = comptroll.assets.concat([ct.id]);
  comptroll.underlyingAssets = comptroll.underlyingAssets.concat([
    underlyingAddress.toHexString(),
  ]);

  comptroll.save();

  ct.underlying = underlyingAsset.id;
  let context = new DataSourceContext();
  CTokenTemplate.createWithContext(event.params.cToken, context);
  ct.save();

  /** BEGIN SIMPLEFI **/

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

  /** END SIMPLEFI **/

  /** Count **/

  // Update Market Count every time a new market is listed
  updateCount("cToken");

  // Update Underlying Asset Count if this market represented a new underlyingAsset
  if (isNewUnderlyingAsset) {
    updateCount("underlying");
  }

  // log.warning(
  //   `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 line 462, at the end of comptroller`,
  //   []
  // );
}

// Update the CF on that asset
export function handleNewCollateralFactor(event: NewCollateralFactor): void {
  let cToken = CtokenSchema.load(event.params.cToken.toHexString());
  if (event.params.cToken) {
    cToken.collateralFactor = event.params.newCollateralFactorMantissa;
    cToken.save();
  }
}
