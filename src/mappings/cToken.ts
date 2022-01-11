/* eslint-disable prefer-const */ // to satisfy AS compiler

import {
  NewFuseFee,
  Borrow,
  NewAdminFee,
  NewComptroller,
  Mint,
  LiquidateBorrow,
  AccrueInterest,
  RepayBorrow,
  Redeem,
} from "../../generated/templates/CToken/CToken";
import {
  Utility,
  Ctoken as CtokenSchema,
  UnderlyingAsset as UnderlyingAssetSchema,
  Pool as ComptrollerSchema,
} from "../../generated/schema";

import { CToken } from "../../generated/templates/CToken/CToken";
import { ERC20 } from "../../generated/templates/CToken/ERC20";
import { PriceOracle } from "../../generated/templates/CToken/PriceOracle";
import { CToken as CTokenTemplate } from "../../generated/templates";
import {
  log,
  dataSource,
  Address,
  BigDecimal,
  BigInt,
  ethereum,
} from "@graphprotocol/graph-ts";
import {
  BigZero,
  calculateCTokenTotalSupply,
  convertMantissaToAPR,
  convertMantissaToAPY,
  getETHBalance,
  getTotalInUSD,
  updateETHPrice,
} from "./helpers";
import { AccessControlledAggregator } from "../../generated/AccessControlledAggregator/AccessControlledAggregator";
import {
  borrowFromMarket,
  getOrCreateAccount,
  getOrCreateERC20Token,
  getOrCreateMarket,
  getOrCreateMarketWithId,
  ProtocolName,
  ProtocolType,
  repayToMarket,
} from "./simplefi-common";

export function handleNewFuseFee(event: NewFuseFee): void {
  const entity = CtokenSchema.load(event.address.toHexString());
  //entity.fuseFee = event.params.newFuseFeeMantissa;
  updateCtoken(event, entity, event.address);
  entity.save();
}

export function handleNewAdminFee(event: NewAdminFee): void {
  const entity = CtokenSchema.load(event.address.toHexString());
  //entity.adminFee = event.params.newAdminFeeMantissa;

  updateCtoken(event, entity, event.address);
  entity.save();
}

export function handleNewComptroller(event: NewComptroller): void {
  const entity = CtokenSchema.load(event.address.toHexString());
  entity.pool = event.params.newComptroller.toHexString();

  updateCtoken(event, entity, event.address);
  entity.save();
}

// Borrow side
export function handleBorrow(event: Borrow): void {
  log.warning(
    `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 cToken line 45, begin handleBorrow - tx: {} `,
    [event.transaction.hash.toHexString()]
  );

  const cTokenEntity = CtokenSchema.load(event.address.toHexString());
  const cTokenInstance = CToken.bind(event.address);
  const underlyingInstance = ERC20.bind(
    Address.fromString(cTokenEntity.underlying) as Address
  );

  //entity.totalBorrows = event.params.totalBorrows;

  let cTokenAddress = cTokenInstance._address;
  let underlyingAddress = underlyingInstance._address;

  /** BEGIN SimpleFi Shit **/
  const cToken = getOrCreateERC20Token(event, event.address);
  const underlying = getOrCreateERC20Token(
    event,
    Address.fromString(cTokenEntity.underlying) as Address
  );
  const account = getOrCreateAccount(event.params.borrower);
  const market = getOrCreateMarketWithId(
    event,
    event.address.toHexString(),
    cTokenAddress,
    ProtocolName.RARI_FUSE,
    ProtocolType.LENDING,
    [underlying],
    cToken,
    [underlying]
  );
  /** END SimpleFi Shit **/

  // Get the underlying ERC20 balance of the borrower
  let balanceCall = underlyingInstance.try_balanceOf(event.params.borrower);

  log.warning("handleBorrow: trying erc20Balance: token: {} - borrower: {}", [
    underlyingAddress.toHexString(),
    event.params.borrower.toHexString(),
  ]);

  log.info("handleBorrow: CToken: {}", [event.address.toString()]);

  // If you can get the underlyingBalance of this borrower, then update the CToken's data
  // Todo - Fix error on borrow in this codeblock
  if (!balanceCall.reverted) {
    // borrowFromMarket(
    //   event,
    //   account,
    //   market,
    //   event.params.borrowAmount,
    //   [],
    //   [],
    //   balanceCall.value,
    //   [],
    //   []
    // );
    updateCtoken(event, cTokenEntity, cTokenAddress);
  } else {
    log.warning(
      "handleBorrow: erc20 balanceCall Reverted: token: {} - borrower: {}",
      [underlyingAddress.toHexString(), event.params.borrower.toHexString()]
    );
  }

  cTokenEntity.save();

  log.warning(
    `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 cToken line 122, end handleBorrow()`,
    []
  );
}

export function handleRepayBorrow(event: RepayBorrow): void {
  log.warning(
    `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 cToken line 128, begin handleRepayBorrow()`,
    []
  );
  let cTokenEntity = CtokenSchema.load(event.address.toHexString());
  //entity.totalBorrows = event.params.totalBorrows;
  let cTokenInstance = CToken.bind(event.address);
  let underlyingInstance = ERC20.bind(
    Address.fromString(cTokenEntity.underlying) as Address
  );

  let cTokenAddress = event.address;
  let underlyingAddress = underlyingInstance._address;

  /* BEGIN SIMPLEFI SHIT */
  // const cTokenSimpleToken = getOrCreateERC20Token(event, cTokenAddress);
  // const simpleERC20 = getOrCreateERC20Token(
  //   event,
  //   Address.fromString(cTokenEntity.underlying) as Address
  // );

  // const account = getOrCreateAccount(event.params.borrower);
  // const market = getOrCreateMarketWithId(
  //   event,
  //   cTokenAddress.toHexString(),
  //   cTokenAddress,
  //   ProtocolName.RARI_FUSE,
  //   ProtocolType.LENDING,
  //   [simpleERC20],
  //   cTokenSimpleToken,
  //   [simpleERC20]
  // );
  // repayToMarket(
  //   event,
  //   account,
  //   market,
  //   event.params.repayAmount,
  //   [],
  //   [],
  //   underlyingInstance.balanceOf(event.params.borrower),
  //   [],
  //   []
  // );
  /* END SIMPLEFI SHIT */

  updateCtoken(event, cTokenEntity, cTokenAddress);
  cTokenEntity.save();
  log.warning(
    `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 cToken line 168, end handleRepayBorrow()`,
    []
  );
}

export function handleLiquidateBorrow(event: LiquidateBorrow): void {
  // log.warning(
  //   `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 cToken line 191, begin handleLiquidateBorrow()`,
  //   []
  // );
  // const entity = CtokenSchema.load(event.address.toHexString());
  // updateCtoken(event, entity, event.address);
  // entity.totalSeizedTokens = entity.totalSeizedTokens.plus(
  //   event.params.seizeTokens
  // );
  // log.warning(`🚨2 update totalSeized to {}`, [
  //   event.params.seizeTokens.toString(),
  // ]);
  // const pool = ComptrollerSchema.load(entity.pool);
  // pool.totalSeizedTokens = pool.totalSeizedTokens.plus(
  //   event.params.seizeTokens
  // );
  // pool.save();
  // entity.save();
  // log.warning(
  //   `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 cToken line 210, end handleLiquidateBorrow()`,
  //   []
  // );
}

// Deposit Side
export function handleMint(event: Mint): void {
  log.warning(
    `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 cToken line 176, begin handleMint()`,
    []
  );
  const cTokenEntity = CtokenSchema.load(event.address.toHexString());

  updateCtoken(event, cTokenEntity, event.address);
  cTokenEntity.save();
  log.warning(
    `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 cToken line 184, end handleMint()`,
    []
  );
}

export function handleWithdraw(event: Redeem): void {
  log.warning(
    `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 cToken line 176, begin handleWithdraw()`,
    []
  );
  const entity = CtokenSchema.load(event.address.toHexString());

  updateCtoken(event, entity, event.address);
  entity.save();
  log.warning(
    `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 cToken line 184, end handleWithdraw()`,
    []
  );
}

export function handleAccrueInterest(event: AccrueInterest): void {
  const entity = CtokenSchema.load(event.address.toHexString());

  updateCtoken(event, entity, event.address);
  entity.save();
}

// This just updates everything for the CToken by reading from contract
// Updates underlying data, updates CTokenData, and updates Pool Data
function updateCtoken(
  event: ethereum.Event,
  cTokenEntity: CtokenSchema | null,
  cTokenAddress: Address
): void {
  log.warning(
    `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 cToken line 227, begin updateCtoken()`,
    []
  );
  log.warning("🚨🚨🚨 cToken line 231 Updating Ctoken  now {}", [
    cTokenAddress.toHexString(),
  ]);

  updateETHPrice();

  let util = Utility.load("0");
  let ethUSD = util.ethPriceInDai;

  log.debug("🚨🚨🚨 cToken line 240 updateCtoken: ethUSDPrice: {}", [
    ethUSD.toString(),
  ]);

  //update price from oracle on pool
  let poolEntity = ComptrollerSchema.load(cTokenEntity.pool);
  let underlyingEntity = UnderlyingAssetSchema.load(cTokenEntity.underlying);

  let underlyingAddress = cTokenEntity.underlying;

  let oracleInstance = PriceOracle.bind(poolEntity.priceOracle as Address);
  let cTokenInstance = CToken.bind(cTokenAddress);
  let underlyingInstance = ERC20.bind(
    Address.fromString(cTokenEntity.underlying)
  );

  log.debug("updateCtoken: asset: {}", [
    poolEntity.address.toHexString(),
    oracleInstance._address.toHexString(),
    underlyingEntity.address.toHexString(),
  ]);

  // 1 - Update UNDERLYING price in ETH

  let tryPrice = oracleInstance.try_getUnderlyingPrice(cTokenAddress);
  if (!tryPrice.reverted) {
    let price = tryPrice.value;
    log.debug(
      "🚨🚨🚨 updateCtoken line 263: 3 - id {} - underlying: {} - oldPrice: {} - newPrice: {}",
      [
        cTokenEntity.id,
        cTokenEntity.underlying,
        underlyingEntity.price.toString(),
        price.toString(),
      ]
    );
    underlyingEntity.price = price;
  }
  /* 
        cTokenEntity.underlyingToken = asset.address;
        cTokenEntity.underlyingPrice = asset.price; */

  // SimpleFI
  // const simpleERC20 = getOrCreateERC20Token(
  //   event,
  //   Address.fromString(cTokenEntity.underlying)
  // );

  log.debug("🚨🚨🚨 updateCtoken line 275: 4 - {} - {}", [
    cTokenEntity.id,
    cTokenEntity.underlying,
  ]);

  // Redundant
  // cTokenEntity.name = cTokenInstance.name();
  // cTokenEntity.symbol = cTokenInstance.symbol();
  // cTokenEntity.decimals = cTokenInstance.decimals();

  // 2 - Update the CToken.underlyingBalance
  let tryUnderlyingBalance = underlyingInstance.try_balanceOf(cTokenAddress);
  if (!tryUnderlyingBalance.reverted) {
    cTokenEntity.underlyingBalance = tryUnderlyingBalance.value;
  } else {
    // TODO: do we need this
    // Get ETH Balance - if underlying is ETH, update the ETH balance
    if (underlyingAddress == "0x0000000000000000000000000000000000000000") {
      cTokenEntity.underlyingBalance = getETHBalance(cTokenAddress);
    }
  }

  log.debug(
    "🚨🚨🚨 updateCtoken line 357: 6 - id: {} -  underlying: {} - underlyingBalance: {}",
    [
      cTokenEntity.id,
      cTokenEntity.underlying,
      cTokenEntity.underlyingBalance.toString(),
    ]
  );

  /* BEGIN SUPPLY */
  let newCTokenTotalSupply = calculateCTokenTotalSupply(cTokenInstance);
  let newTotalSupply = newCTokenTotalSupply;
  let oldTotalSupply = cTokenEntity.totalSupply;

  let oldUnderlyingTotalSupply = underlyingEntity.totalSupply;
  let oldUnderlyingTotalSupplyUSD = underlyingEntity.totalSupplyUSD;
  log.debug(
    "🚨🚨🚨 updateCtoken line 372: 6 - id: {} -  underlying: {} - newTotalSupply: {} - oldTotalSupply: {}",
    [
      cTokenEntity.id,
      cTokenEntity.underlying,
      newTotalSupply.toString(),
      cTokenEntity.totalSupply.toString(),
    ]
  );

  //first reset the current USD Value based on updated prices
  cTokenEntity.totalSupplyUSD = getTotalInUSD(
    cTokenEntity.totalSupply,
    ethUSD,
    underlyingEntity.price
  );
  underlyingEntity.totalSupplyUSD = getTotalInUSD(
    underlyingEntity.totalSupply,
    ethUSD,
    underlyingEntity.price
  );
  let oldUpdatedUnderlyingTotalSupplyUSD = underlyingEntity.totalSupplyUSD;

  // Supply
  if (newTotalSupply.gt(oldTotalSupply)) {
    // If NEW totalSupply is greater than OLD totalSupply
    let delta = newTotalSupply.minus(oldTotalSupply);
    underlyingEntity.totalSupply = underlyingEntity.totalSupply.plus(delta);
  } else if (newTotalSupply.lt(oldTotalSupply)) {
    // If NEW totalSupply is less than OLD totalSupply
    let delta = oldTotalSupply.minus(newTotalSupply);
    underlyingEntity.totalSupply = underlyingEntity.totalSupply.minus(delta);
    // Floor of 0
    if (BigZero.gt(underlyingEntity.totalSupply)) {
      underlyingEntity.totalSupply = BigZero;
    }
  }
  cTokenEntity.totalSupply = newCTokenTotalSupply;

  // Supply USD
  let newTotalSupplyUSD = getTotalInUSD(
    newTotalSupply,
    ethUSD,
    underlyingEntity.price
  );
  let oldTotalSupplyUSD = cTokenEntity.totalSupplyUSD;

  log.debug(
    "🚨🚨🚨 updateCtoken: SUPPLY line 420: - id {} - underlying {} - ethUSD: {} -  underlyingPrice: {} -  oldTotalSupply: {} -  oldTotalSupplyUSD: {} - newTotalSupply: {} - newTotalSupplyUSD: {}",
    [
      cTokenEntity.id,
      cTokenEntity.underlying,
      ethUSD.toString(),
      underlyingEntity.price.toString(),
      oldTotalSupply.toString(),
      oldTotalSupplyUSD.toString(),
      newTotalSupply.toString(),
      newTotalSupplyUSD.toString(),
    ]
  );

  if (newTotalSupplyUSD.gt(oldTotalSupplyUSD)) {
    // If NEW totalSupplyUSD is greater than OLD totalSupplyUSD
    let delta = newTotalSupplyUSD.minus(oldTotalSupplyUSD);
    poolEntity.totalSupplyUSD = poolEntity.totalSupplyUSD.plus(delta);
    underlyingEntity.totalSupplyUSD = underlyingEntity.totalSupplyUSD.plus(
      delta
    );
  } else if (newTotalSupplyUSD.lt(oldTotalSupplyUSD)) {
    // If NEW totalSupplyUSD is less than OLD totalSupplyUSD
    //total decreased
    let delta = oldTotalSupplyUSD.minus(newTotalSupplyUSD);
    poolEntity.totalSupplyUSD = poolEntity.totalSupplyUSD.minus(delta);
    underlyingEntity.totalSupplyUSD = underlyingEntity.totalSupplyUSD.minus(
      delta
    );
    // Floor of 0
    if (BigZero.gt(underlyingEntity.totalSupplyUSD)) {
      underlyingEntity.totalSupplyUSD = BigZero;
    }
    if (BigZero.gt(poolEntity.totalSupplyUSD)) {
      poolEntity.totalSupplyUSD = BigZero;
    }
  }
  cTokenEntity.totalSupplyUSD = newTotalSupplyUSD;

  let newUnderlyingTotalSupply = underlyingEntity.totalSupply;
  let newUnderlyingTotalSupplyUSD = underlyingEntity.totalSupplyUSD;
  log.debug(
    "🚨🚨🚨 updateCtoken: UNDERLYING SUPPLY  line 466: - id {} - underlying {} - ethUSD: {} -  underlyingPrice: {} -  oldUnderlyingTotalSupply: {} -  oldUnderlyingTotalSupplyUSD: {} - oldUpdatedUnderlyingTotalSupplyUSD: {} - newUnderlyingTotalSupply: {} - newUnderlyingTotalSupplyUSD: {}",
    [
      cTokenEntity.id,
      cTokenEntity.underlying,
      ethUSD.toString(),
      underlyingEntity.price.toString(),
      oldUnderlyingTotalSupply.toString(),
      oldUnderlyingTotalSupplyUSD.toString(),
      oldUpdatedUnderlyingTotalSupplyUSD.toString(),
      newUnderlyingTotalSupply.toString(),
      newUnderlyingTotalSupplyUSD.toString(),
    ]
  );
  /* END SUPPLY */

  /* BEGIN BORROW */

  let oldUnderlyingTotalBorrow = underlyingEntity.totalBorrow;
  let oldUnderlyingTotalBorrowUSD = underlyingEntity.totalBorrowUSD;

  //first reset the current USD Value based on updated prices
  cTokenEntity.totalBorrowUSD = getTotalInUSD(
    cTokenEntity.totalBorrow,
    ethUSD,
    underlyingEntity.price
  );
  underlyingEntity.totalBorrowUSD = getTotalInUSD(
    underlyingEntity.totalBorrow,
    ethUSD,
    underlyingEntity.price
  );

  let oldUpdatedUnderlyingTotalBorrowUSD = underlyingEntity.totalBorrowUSD;

  // totalBorrow
  let tryTotalBorrow = cTokenInstance.try_totalBorrowsCurrent();
  if (!tryTotalBorrow.reverted) {
    let newTotalBorrow = tryTotalBorrow.value;
    let oldTotalBorrow = cTokenEntity.totalBorrow;

    // If NEW newTotalBorrow is greater than OLD oldTotalBorrow
    if (newTotalBorrow.gt(oldTotalBorrow)) {
      let delta = newTotalBorrow.minus(oldTotalBorrow);
      underlyingEntity.totalBorrow = underlyingEntity.totalBorrow.plus(delta);
    } else if (newTotalBorrow.lt(oldTotalBorrow)) {
      let delta = oldTotalBorrow.minus(newTotalBorrow);
      underlyingEntity.totalBorrow = underlyingEntity.totalBorrow.minus(delta);
      // Floor 0
      if (BigZero.gt(underlyingEntity.totalBorrow)) {
        underlyingEntity.totalBorrow = BigZero;
      }
    }
    cTokenEntity.totalBorrow = tryTotalBorrow.value;

    // totalBorrowUSD
    let newBorrowUSD = getTotalInUSD(
      newTotalBorrow,
      ethUSD,
      underlyingEntity.price
    );
    let oldBorrowUSD = cTokenEntity.totalBorrowUSD;

    log.debug(
      "🚨🚨🚨 updateCtoken BORROW line 500: - id {} - underlying {} - ethPrice: {} -  underlyingPrice: {} - oldBorrow: {} -  oldBorrowUSD: {} - newBorrow: {} - newBorrowUSD: {}",
      [
        cTokenEntity.id,
        cTokenEntity.underlying,
        ethUSD.toString(),
        underlyingEntity.price.toString(),
        oldTotalBorrow.toString(),
        oldBorrowUSD.toString(),
        newTotalBorrow.toString(),
        newBorrowUSD.toString(),
      ]
    );

    if (newBorrowUSD.gt(oldBorrowUSD)) {
      //total increased
      let delta = newBorrowUSD.minus(oldBorrowUSD);
      underlyingEntity.totalBorrowUSD = underlyingEntity.totalBorrowUSD.plus(
        delta
      );
      poolEntity.totalBorrowUSD = poolEntity.totalBorrowUSD.plus(delta);
    } else if (newBorrowUSD.lt(oldBorrowUSD)) {
      //total decreased
      let delta = oldBorrowUSD.minus(newBorrowUSD);
      poolEntity.totalBorrowUSD = poolEntity.totalBorrowUSD.minus(delta);
      underlyingEntity.totalBorrowUSD = underlyingEntity.totalBorrowUSD.minus(
        delta
      );
      // Floor of Zero
      if (BigZero.gt(underlyingEntity.totalBorrowUSD)) {
        underlyingEntity.totalBorrowUSD = BigZero;
      }
      if (BigZero.gt(poolEntity.totalBorrowUSD)) {
        poolEntity.totalBorrowUSD = BigZero;
      }
    }
    let newUnderlyingTotalBorrow = underlyingEntity.totalBorrow;
    let newUnderlyingTotalBorrowUSD = underlyingEntity.totalBorrowUSD;
    log.debug(
      "🚨🚨🚨 updateCtoken: UNDERLYING BORROW  line 466: - id {} - underlying {} - ethUSD: {} -  underlyingPrice: {} -  oldUnderlyingTotalBorrow: {} -  oldUnderlyingTotalBorrowUSD: {} - oldUpdatedUnderlyingTotalBorrowUSD: {} - newUnderlyingTotalBorrow: {} - newUnderlyingTotalBorrowUSD: {}",
      [
        cTokenEntity.id,
        cTokenEntity.underlying,
        ethUSD.toString(),
        underlyingEntity.price.toString(),
        oldUnderlyingTotalBorrow.toString(),
        oldUnderlyingTotalBorrowUSD.toString(),
        oldUpdatedUnderlyingTotalBorrowUSD.toString(),
        newUnderlyingTotalBorrow.toString(),
        newUnderlyingTotalBorrowUSD.toString(),
      ]
    );

    cTokenEntity.totalBorrowUSD = newBorrowUSD;
  }

  /* END BORROW */

  /* BEGIN LIQUIDITY */
  let oldUnderlyingTotalLiquidity = underlyingEntity.totalLiquidity;
  let oldUnderlyingTotalLiquidityUSD = underlyingEntity.totalLiquidityUSD;

  //first reset the current USD Value based on updated prices
  cTokenEntity.liquidityUSD = getTotalInUSD(
    cTokenEntity.liquidity,
    ethUSD,
    underlyingEntity.price
  );
  underlyingEntity.totalLiquidityUSD = getTotalInUSD(
    underlyingEntity.totalLiquidity,
    ethUSD,
    underlyingEntity.price
  );

  let oldUpdatedUnderlyingTotalLiquidityUSD =
    underlyingEntity.totalLiquidityUSD;

  let tryCash = cTokenInstance.try_getCash();
  if (!tryCash.reverted) {
    let newCash = tryCash.value;
    let oldCash = cTokenEntity.liquidity;

    // liquidity
    // If NEW cash is greater than OLD cash
    if (newCash.gt(oldCash)) {
      let delta = newCash.minus(oldCash);
      underlyingEntity.totalLiquidity = underlyingEntity.totalLiquidity.plus(
        delta
      );
    } else if (newCash.lt(oldCash)) {
      let delta = newCash.minus(oldCash);
      underlyingEntity.totalLiquidity = underlyingEntity.totalLiquidity.minus(
        delta
      );
    }

    cTokenEntity.liquidity = newCash;

    // liquidityUSD
    let newLiquidityUSD = getTotalInUSD(
      newCash,
      ethUSD,
      underlyingEntity.price
    );

    let oldLiquidityUSD = cTokenEntity.liquidityUSD;

    log.debug(
      "🚨🚨🚨 updateCtoken line 567: - id {} - underlying {} - ethPrice: {} -  underlyingPrice: {} - oldLiquidity: {} - oldLiquidityUSD: {} - newLiquidity: {} -  newLiquidityUSD: {}",
      [
        cTokenEntity.id,
        cTokenEntity.underlying,
        ethUSD.toString(),
        underlyingEntity.price.toString(),
        oldCash.toString(),
        oldLiquidityUSD.toString(),
        newCash.toString(),
        newLiquidityUSD.toString(),
      ]
    );

    // If NEW cashUSD is greater than OLD cashUSD
    if (newLiquidityUSD.gt(oldLiquidityUSD)) {
      //total increased
      let delta = newLiquidityUSD.minus(oldLiquidityUSD);
      poolEntity.totalLiquidityUSD = poolEntity.totalLiquidityUSD.plus(delta);
      underlyingEntity.totalLiquidityUSD = underlyingEntity.totalLiquidityUSD.plus(
        delta
      );
    } else if (newLiquidityUSD.lt(oldLiquidityUSD)) {
      //total decreased
      let delta = oldLiquidityUSD.minus(newLiquidityUSD);
      poolEntity.totalLiquidityUSD = poolEntity.totalLiquidityUSD.minus(delta);
      underlyingEntity.totalLiquidityUSD = underlyingEntity.totalLiquidityUSD.minus(
        delta
      );
      // Floor 0
      if (BigZero.gt(underlyingEntity.totalLiquidityUSD)) {
        underlyingEntity.totalLiquidityUSD = BigZero;
      }
      if (BigZero.gt(poolEntity.totalLiquidityUSD)) {
        poolEntity.totalLiquidityUSD = BigZero;
      }
    }

    let newUnderlyingTotalLiquidity = underlyingEntity.totalLiquidity;
    let newUnderlyingTotalLiquidityUSD = underlyingEntity.totalLiquidityUSD;
    log.debug(
      "🚨🚨🚨 updateCtoken: UNDERLYING BORROW  line 466: - id {} - underlying {} - ethUSD: {} -  underlyingPrice: {} -  oldUnderlyingTotalLiquidity: {} -  oldUnderlyingTotalLiquidityUSD: {} - oldUpdatedUnderlyingTotalLiquidityUSD: {} - newUnderlyingTotalLiquidity: {} - newUnderlyingTotalLiquidityUSD: {}",
      [
        cTokenEntity.id,
        cTokenEntity.underlying,
        ethUSD.toString(),
        underlyingEntity.price.toString(),
        oldUnderlyingTotalLiquidity.toString(),
        oldUnderlyingTotalLiquidityUSD.toString(),
        oldUpdatedUnderlyingTotalLiquidityUSD.toString(),
        newUnderlyingTotalLiquidity.toString(),
        newUnderlyingTotalLiquidityUSD.toString(),
      ]
    );

    cTokenEntity.liquidityUSD = newLiquidityUSD;
  }
  /* END LIQUIDITY */

  const _totalReserves = cTokenInstance.try_totalReserves();
  if (!_totalReserves.reverted) {
    cTokenEntity.totalReserves = _totalReserves.value;
  }

  const _reserveFactor = cTokenInstance.try_reserveFactorMantissa();
  if (!_reserveFactor.reverted) {
    cTokenEntity.reserveFactor = _reserveFactor.value;
  }

  const _adminFee = cTokenInstance.try_adminFeeMantissa();
  if (!_adminFee.reverted) {
    cTokenEntity.adminFee = _adminFee.value;
  }

  const _fuseFee = cTokenInstance.try_fuseFeeMantissa();
  if (!_fuseFee.reverted) {
    cTokenEntity.fuseFee = _fuseFee.value;
  }

  const _totalAdminFees = cTokenInstance.try_totalAdminFees();
  if (!_totalAdminFees.reverted) {
    cTokenEntity.totalAdminFees = _totalAdminFees.value;
  }

  const _borrowRatePerBlock = cTokenInstance.try_borrowRatePerBlock();
  if (!_borrowRatePerBlock.reverted) {
    cTokenEntity.borrowRatePerBlock = _borrowRatePerBlock.value;
    cTokenEntity.borrowAPR = convertMantissaToAPR(
      BigDecimal.fromString(_borrowRatePerBlock.value.toString())
    );
  }

  const _supplyRatePerBlock = cTokenInstance.try_supplyRatePerBlock();
  if (!_supplyRatePerBlock.reverted) {
    cTokenEntity.supplyRatePerBlock = _supplyRatePerBlock.value;
    log.warning(
      "🚨🚨🚨🚨 updateCtoken SUPPLYAPY,  supplyAPY: {} -  supplyRateMantissa: {}",
      [
        convertMantissaToAPY(
          BigDecimal.fromString(_supplyRatePerBlock.value.toString())
        ).toString(),
        _supplyRatePerBlock.value.toString(),
      ]
    );
    cTokenEntity.supplyAPY = convertMantissaToAPY(
      BigDecimal.fromString(_supplyRatePerBlock.value.toString())
    );
  }

  log.debug("🚨🚨🚨🚨 updateCtoken line 508: 12 - {} - {}", [
    cTokenEntity.id,
    cTokenEntity.underlying,
  ]);

  // Save CToken
  cTokenEntity.save();
  // Save Pool
  poolEntity.save();
  // Save Underlying
  underlyingEntity.save();

  log.warning(
    `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 cToken line 515, end updateCtoken()`,
    []
  );
}
