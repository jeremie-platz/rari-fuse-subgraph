/* eslint-disable prefer-const */ // to satisfy AS compiler
import {
  BigInt,
  Address,
  log,
  BigDecimal,
  dataSource,
} from "@graphprotocol/graph-ts";
import { ChainLinkPriceOracle } from "../../generated/templates/CToken/ChainLinkPriceOracle";
import { EthBalance } from "../../generated/templates/CToken/EthBalance";
import { CToken } from "../../generated/templates/CToken/CToken";
import { Utility } from "../../generated/schema";

export function getChainLinkOracle(): string {
  let network = dataSource.network();

  if (network === "arbitrum-one")
    return "0x639fe6ab55c921f74e7fac1ee960c0b6293ba612";

  return "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419";
}

export const BigZero = BigInt.fromString("0");

export function calculateCTokenTotalSupply(instance: CToken): BigInt {
  const liquidity = instance.getCash();
  const totalBorrow = instance.totalBorrowsCurrent();
  const totalReserves = instance.totalReserves();
  const totalAdminFees = instance.totalAdminFees();
  const totalFuseFees = instance.totalFuseFees();
  return liquidity
    .plus(totalBorrow)
    .minus(totalReserves)
    .plus(totalAdminFees)
    .plus(totalFuseFees);
}

export function getETHBalance(address: Address): BigInt {
  log.warning(`getting eth balance for {}`, [address.toHexString()]);
  const instance = EthBalance.bind(
    Address.fromString("0xbb0eba3023a31de8deda15742b7269caf73d0ce1")
  );
  const _balance = instance.try_getETHBalance(address);
  if (_balance.reverted) {
    return BigInt.fromString("0");
  } else {
    return _balance.value;
  }
}

export function updateETHPrice(): void {
  //update ETHUSD price from oracle 0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419
  let chainLinkOracle = getChainLinkOracle();
  let oracle = ChainLinkPriceOracle.bind(Address.fromString(chainLinkOracle));

  let util = Utility.load("0");
  if (util == null) {
    util = new Utility("0");
    util.ethPriceInDai = BigZero;
    util.cTokenCount = BigZero;
    util.poolCount = BigZero;
    util.underlyingCount = BigZero;
  }

  let _price = oracle.try_latestAnswer();
  if (!_price.reverted) {
    // chainlink oracle result div by 1e8
    util.ethPriceInDai = _price.value.div(BigInt.fromString("100000000"));
  }
  
  util.save();
}

export function removeDecimals(value: BigInt | null, decimals: number): BigInt {
  let toDivide = "1";
  for (let i = 0; i < decimals; i++) {
    toDivide = toDivide + "0";
  }
  return value.div(BigInt.fromString(toDivide));
}

export function getTotalInUSD(
  amountNoDecimals: BigInt,
  ethUSD: BigInt,
  underlyingEthPriceNoDecimals: BigInt
): BigInt {
  return removeDecimals(
    amountNoDecimals.times(underlyingEthPriceNoDecimals),
    36
  ).times(ethUSD);
}

export let fixed18 = BigDecimal.fromString("1000000000000000000");
export const secondsInFourDays = BigDecimal.fromString("5760");
export let oneBD = BigDecimal.fromString("1");
function expBD(input: BigDecimal, pow: number): BigDecimal {
  let base = input;
  for (let i = 0; i < pow - 1; i++) {
    base = base.times(input);
  }
  return base;
}
export function convertMantissaToAPY(mantissa: BigDecimal): BigDecimal {
  let base = mantissa
    .div(fixed18)
    .times(secondsInFourDays)
    .plus(oneBD);
  log.warning("base is {}", [base.toString()]);
  const appliedExponenet = expBD(base, 365);
  return BigDecimal.fromString(
    appliedExponenet
      .minus(oneBD)
      .times(BigDecimal.fromString("100"))
      .toString()
  );
  // return (((mantissa.div(BigInt.fromString("1000000000000000000"))).times(BigInt.fromString("4").times(BigInt.fromString("60")).times(BigInt.fromString("24"))).plus(BigInt.fromString("1")).pow(5).pow(72)).minus(BigInt.fromString("1"))).times(BigInt.fromString("100"));
}

export function convertMantissaToAPR(mantissa: BigDecimal): BigDecimal {
  return mantissa
    .times(BigDecimal.fromString("2372500"))
    .div(BigDecimal.fromString("10000000000000000"));
}
