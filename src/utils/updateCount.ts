import { BigInt } from "@graphprotocol/graph-ts";
import { Utility } from "../../generated/schema";
import { BigZero } from "../mappings/helpers";

const ID = "0";

export function updateCount(type: string): void {
  //update ETHUSD price from oracle 0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419

  let util = Utility.load("0");
  if (util == null) {
    util = new Utility("0");
    util.ethPriceInDai = BigZero;
    util.cTokenCount = BigZero;
    util.poolCount = BigZero;
    util.underlyingCount = BigZero;
  }

  let cTokenCount = util.cTokenCount;
  let poolCount = util.poolCount;
  let underlyingCount = util.underlyingCount;

  if (type === "cToken") {
    util.cTokenCount = cTokenCount.plus(BigInt.fromString("1"));
  }
  if (type === "pool") {
    util.poolCount = poolCount.plus(BigInt.fromString("1"));
  }
  if (type === "underlying") {
    util.underlyingCount = underlyingCount.plus(BigInt.fromString("1"));
  }

  util.save();
}
