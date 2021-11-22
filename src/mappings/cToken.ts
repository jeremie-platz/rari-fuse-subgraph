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

export function handleBorrow(event: Borrow): void {
  log.warning(
    `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 cToken line 45, begin handleBorrow - tx: {} `,
    [event.transaction.hash.toHexString()]
  );
  const entity = CtokenSchema.load(event.address.toHexString());
  //entity.totalBorrows = event.params.totalBorrows;

  const instance = CToken.bind(event.address);
  const cTokenSimpleToken = getOrCreateERC20Token(event, event.address);
  const simpleERC20 = getOrCreateERC20Token(
    event,
    Address.fromString(entity.underlying) as Address
  );
  const erc20 = ERC20.bind(Address.fromString(entity.underlying) as Address);

  const account = getOrCreateAccount(event.params.borrower);
  const market = getOrCreateMarketWithId(
    event,
    event.address.toHexString(),
    instance._address,
    ProtocolName.RARI_FUSE,
    ProtocolType.LENDING,
    [simpleERC20],
    cTokenSimpleToken,
    [simpleERC20]
  );

  let balanceCall = erc20.try_balanceOf(event.params.borrower);
  log.warning("handleBorrow: trying erc20Balance: token: {} - borrower: {}", [
    erc20._address.toHexString(),
    event.params.borrower.toHexString(),
  ]);

  log.info("handleBorrow: CToken: {}", [event.address.toString()]);

  // Todo - Fix error on borrow in this codeblock
  if (!balanceCall.reverted) {
    // log.info(
    //   "handleBorrow: trying borrowFromMarket: borrowAmount - {}, balanceOfBorrower: {} - borrower: {}",
    //   [
    //     event.params.borrowAmount.toString(),
    //     balanceCall.value.toString(),
    //     event.params.borrower.toString(),
    //   ]
    // );
    // borrowFromMarket(event, account, market, event.params.borrowAmount, [], [], balanceCall.value, [], []);
    // updateCtoken(event, entity, event.address);
  } else {
    log.warning(
      "handleBorrow: erc20 balanceCall Reverted: token: {} - borrower: {}",
      [erc20._address.toHexString(), event.params.borrower.toHexString()]
    );
  }

  entity.save();

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
  const entity = CtokenSchema.load(event.address.toHexString());
  //entity.totalBorrows = event.params.totalBorrows;

  const instance = CToken.bind(event.address);
  const cTokenSimpleToken = getOrCreateERC20Token(event, event.address);
  const simpleERC20 = getOrCreateERC20Token(
    event,
    Address.fromString(entity.underlying) as Address
  );
  const erc20 = ERC20.bind(Address.fromString(entity.underlying) as Address);

  const account = getOrCreateAccount(event.params.borrower);
  const market = getOrCreateMarketWithId(
    event,
    event.address.toHexString(),
    instance._address,
    ProtocolName.RARI_FUSE,
    ProtocolType.LENDING,
    [simpleERC20],
    cTokenSimpleToken,
    [simpleERC20]
  );
  repayToMarket(
    event,
    account,
    market,
    event.params.repayAmount,
    [],
    [],
    erc20.balanceOf(event.params.borrower),
    [],
    []
  );

  updateCtoken(event, entity, event.address);
  entity.save();
  log.warning(
    `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 cToken line 168, end handleRepayBorrow()`,
    []
  );
}

export function handleMint(event: Mint): void {
  log.warning(
    `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 cToken line 176, begin handleMint()`,
    []
  );
  const entity = CtokenSchema.load(event.address.toHexString());

  updateCtoken(event, entity, event.address);
  entity.save();
  log.warning(
    `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 cToken line 184, end handleMint()`,
    []
  );
}

export function handleLiquidateBorrow(event: LiquidateBorrow): void {
  log.warning(
    `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 cToken line 191, begin handleLiquidateBorrow()`,
    []
  );
  const entity = CtokenSchema.load(event.address.toHexString());

  updateCtoken(event, entity, event.address);
  entity.totalSeizedTokens = entity.totalSeizedTokens.plus(
    event.params.seizeTokens
  );
  log.warning(`🚨2 update totalSeized to {}`, [
    event.params.seizeTokens.toString(),
  ]);
  const pool = ComptrollerSchema.load(entity.pool);
  pool.totalSeizedTokens = pool.totalSeizedTokens.plus(
    event.params.seizeTokens
  );
  pool.save();
  entity.save();
  log.warning(
    `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 cToken line 210, end handleLiquidateBorrow()`,
    []
  );
}

export function handleAccrueInterest(event: AccrueInterest): void {
  const entity = CtokenSchema.load(event.address.toHexString());

  updateCtoken(event, entity, event.address);
  entity.save();
}

function updateCtoken(
  event: ethereum.Event,
  entity: CtokenSchema | null,
  address: Address
): void {
  log.warning(
    `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 cToken line 227, begin updateCtoken()`,
    []
  );
  log.warning("🚨🚨🚨 cToken line 231 Updating Ctoken  now {}", [
    address.toHexString(),
  ]);

  updateETHPrice();

  let util = Utility.load("0");
  const ethUSD = util.ethPriceInDai;

  log.debug("🚨🚨🚨 cToken line 240 updateCtoken: ethUSDPrice: {}", [
    ethUSD.toString(),
  ]);

  //update price from oracle on pool
  const pool = ComptrollerSchema.load(entity.pool);
  const oracle = PriceOracle.bind(pool.priceOracle as Address);
  const asset = UnderlyingAssetSchema.load(entity.underlying);

  log.debug("updateCtoken: asset: {}", [
    pool.address.toHexString(),
    oracle._address.toHexString(),
    asset.address.toHexString(),
  ]);

  const _price = oracle.try_getUnderlyingPrice(address);
  if (!_price.reverted) {
    asset.price = _price.value;
  }
  /* 
        entity.underlyingToken = asset.address;
        entity.underlyingPrice = asset.price; */

  log.debug("🚨🚨🚨 updateCtoken line 263: 3 - {} - {}", [
    entity.id,
    entity.underlying,
  ]);

  const instance = CToken.bind(address);
  const erc20 = ERC20.bind(Address.fromString(entity.underlying));
  const simpleERC20 = getOrCreateERC20Token(
    event,
    Address.fromString(entity.underlying)
  );

  log.debug("🚨🚨🚨 updateCtoken line 275: 4 - {} - {}", [
    entity.id,
    entity.underlying,
  ]);

  entity.name = instance.name();
  entity.symbol = instance.symbol();
  entity.decimals = instance.decimals();
  const _balance = erc20.try_balanceOf(address);
  if (!_balance.reverted) {
    entity.underlyingBalance = _balance.value;
  }

  log.debug("🚨🚨🚨 updateCtoken line 288: 5 - {} - {}", [
    entity.id,
    entity.underlying,
  ]);

  const totalSupply = calculateCTokenTotalSupply(instance);

  log.debug("🚨🚨🚨 updateCtoken line 292: 6 - {} - {}", [
    entity.id,
    entity.underlying,
  ]);

  //this one is seperate from the other if block because usd increase doesn't always mean that real amount increased
  if (entity.totalSupply.ge(_price.value)) {
    asset.totalSupply = asset.totalSupply.plus(
      totalSupply.minus(entity.totalSupply)
    );
  } else {
    asset.totalSupply = asset.totalSupply.minus(
      entity.totalSupply.minus(totalSupply)
    );
    if (BigZero.gt(asset.totalSupply)) {
      asset.totalSupply = BigZero;
    }
  }

  log.debug("🚨🚨🚨 updateCtoken line 314: 7 - {} - {}", [
    entity.id,
    entity.underlying,
  ]);

  entity.totalSupply = totalSupply;
  const newTotalSupplyUSD = getTotalInUSD(totalSupply, ethUSD, asset.price);
  if (entity.liquidityUSD.ge(newTotalSupplyUSD)) {
    //total increased
    pool.totalSupplyUSD = pool.totalSupplyUSD.plus(
      newTotalSupplyUSD.minus(entity.totalSupplyUSD)
    );
    asset.totalSupplyUSD = asset.totalSupplyUSD.plus(
      newTotalSupplyUSD.minus(entity.totalSupplyUSD)
    );
  } else {
    //total decreased
    pool.totalSupplyUSD = pool.totalSupplyUSD.minus(
      entity.totalSupplyUSD.minus(newTotalSupplyUSD)
    );
    asset.totalSupplyUSD = asset.totalSupplyUSD.minus(
      entity.totalSupplyUSD.minus(newTotalSupplyUSD)
    );
    if (BigZero.gt(asset.totalSupplyUSD)) {
      asset.totalSupplyUSD = BigZero;
    }
    if (BigZero.gt(pool.totalSupplyUSD)) {
      pool.totalSupplyUSD = BigZero;
    }
  }
  entity.totalSupplyUSD = newTotalSupplyUSD;

  log.debug("🚨🚨🚨 updateCtoken line 346: 8 - {} - {}", [
    entity.id,
    entity.underlying,
  ]);

  const _cash = instance.try_getCash();
  if (!_cash.reverted) {
    //this one is seperate from the other if block because usd increase doesn't always mean that real amount increased
    if (entity.liquidity.ge(_price.value)) {
      asset.totalLiquidity = asset.totalLiquidity.plus(
        _cash.value.minus(entity.liquidity)
      );
    } else {
      asset.totalLiquidity = asset.totalLiquidity.minus(
        entity.liquidity.minus(_cash.value)
      );
    }

    entity.liquidity = _cash.value;
    //first reset the current liquidity based on updated prices
    asset.totalLiquidityUSD = getTotalInUSD(
      asset.totalLiquidity,
      ethUSD,
      asset.price
    );
    const newLiquidityUSD = getTotalInUSD(_cash.value, ethUSD, asset.price);
    if (entity.liquidityUSD.ge(newLiquidityUSD)) {
      //total increased
      pool.totalLiquidityUSD = pool.totalLiquidityUSD.plus(
        newLiquidityUSD.minus(entity.liquidityUSD)
      );
      asset.totalLiquidityUSD = asset.totalLiquidityUSD.plus(
        newLiquidityUSD.minus(entity.liquidityUSD)
      );
    } else {
      //total decreased
      pool.totalLiquidityUSD = pool.totalLiquidityUSD.minus(
        entity.liquidityUSD.minus(newLiquidityUSD)
      );
      asset.totalLiquidityUSD = asset.totalLiquidityUSD.minus(
        entity.liquidityUSD.minus(newLiquidityUSD)
      );
      if (BigZero.gt(asset.totalLiquidityUSD)) {
        asset.totalLiquidityUSD = BigZero;
      }
      if (BigZero.gt(pool.totalLiquidityUSD)) {
        pool.totalLiquidityUSD = BigZero;
      }
    }
    entity.liquidityUSD = newLiquidityUSD;
  }

  log.debug("🚨🚨🚨 updateCtoken line 398: 9 - {} - {}", [
    entity.id,
    entity.underlying,
  ]);

  const _borrowRatePerBlock = instance.try_borrowRatePerBlock();
  if (!_borrowRatePerBlock.reverted) {
    entity.borrowRatePerBlock = _borrowRatePerBlock.value;
    entity.borrowAPR = convertMantissaToAPR(
      BigDecimal.fromString(_borrowRatePerBlock.value.toString())
    );
  }

  log.debug("🚨🚨🚨 updateCtoken line 411: 10 - {} - {}", [
    entity.id,
    entity.underlying,
  ]);

  const _totalBorrow = instance.try_totalBorrowsCurrent();
  if (!_totalBorrow.reverted) {
    //this one is seperate from the other if block because usd increase doesn't always mean that real amount increased
    if (entity.totalBorrow.ge(_price.value)) {
      asset.totalBorrow = asset.totalBorrow.plus(
        _totalBorrow.value.minus(entity.totalBorrow)
      );
    } else {
      asset.totalBorrow = asset.totalBorrow.minus(
        entity.totalBorrow.minus(_totalBorrow.value)
      );
      if (BigZero.gt(asset.totalBorrow)) {
        asset.totalBorrow = BigZero;
      }
    }

    entity.totalBorrow = _totalBorrow.value;

    const newBorrowUSD = getTotalInUSD(_totalBorrow.value, ethUSD, asset.price);
    if (entity.liquidityUSD.ge(newBorrowUSD)) {
      //total increased
      asset.totalBorrowUSD = asset.totalBorrowUSD.plus(
        newBorrowUSD.minus(entity.totalBorrowUSD)
      );
      pool.totalBorrowUSD = pool.totalBorrowUSD.plus(
        newBorrowUSD.minus(entity.totalBorrowUSD)
      );
    } else {
      //total decreased
      pool.totalBorrowUSD = pool.totalBorrowUSD.minus(
        entity.totalBorrowUSD.minus(newBorrowUSD)
      );
      asset.totalBorrowUSD = asset.totalBorrowUSD.minus(
        entity.totalBorrowUSD.minus(newBorrowUSD)
      );
      if (BigZero.gt(asset.totalBorrowUSD)) {
        asset.totalBorrowUSD = BigZero;
      }
      if (BigZero.gt(pool.totalBorrowUSD)) {
        pool.totalBorrowUSD = BigZero;
      }
    }
    entity.totalBorrowUSD = newBorrowUSD;
  }

  log.debug("🚨🚨🚨 updateCtoken line 461: 11 - {} - {}", [
    entity.id,
    entity.underlying,
  ]);

  const _totalReserves = instance.try_totalReserves();
  if (!_totalReserves.reverted) {
    entity.totalReserves = _totalReserves.value;
  }

  const _reserveFactor = instance.try_reserveFactorMantissa();
  if (!_reserveFactor.reverted) {
    entity.reserveFactor = _reserveFactor.value;
  }

  const _adminFee = instance.try_adminFeeMantissa();
  if (!_adminFee.reverted) {
    entity.adminFee = _adminFee.value;
  }

  const _fuseFee = instance.try_fuseFeeMantissa();
  if (!_fuseFee.reverted) {
    entity.fuseFee = _fuseFee.value;
  }

  const _totalAdminFees = instance.try_totalAdminFees();
  if (!_totalAdminFees.reverted) {
    entity.totalAdminFees = _totalAdminFees.value;
  }

  const _supplyRatePerBlock = instance.try_supplyRatePerBlock();
  if (!_supplyRatePerBlock.reverted) {
    entity.supplyRatePerBlock = _supplyRatePerBlock.value;
    log.warning(
      "🚨🚨🚨🚨 updateCtoken line 494 updating supplyAPY to {} from {}",
      [
        convertMantissaToAPY(
          BigDecimal.fromString(_supplyRatePerBlock.value.toString())
        ).toString(),
        _supplyRatePerBlock.value.toString(),
      ]
    );
    entity.supplyAPY = convertMantissaToAPY(
      BigDecimal.fromString(_supplyRatePerBlock.value.toString())
    );
  }

  log.debug("🚨🚨🚨🚨 updateCtoken line 508: 12 - {} - {}", [
    entity.id,
    entity.underlying,
  ]);

  entity.save();
  pool.save();
  asset.save();

  log.warning(
    `🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 cToken line 515, end updateCtoken()`,
    []
  );
}
