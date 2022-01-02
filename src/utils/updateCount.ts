import { BigInt } from "@graphprotocol/graph-ts";
import {
  CToken_Count as CToken_Count_Schema,
  Pool_Count as Pool_Count_Schema,
  UnderlyingAsset_Count as UnderlyingAsset_Count_Schema,
} from "../../generated/schema";

const ID = "COUNT";

export const updateCTokenCount = (): void => {
  let cTokenCount = CToken_Count_Schema.load(ID);

  if (cTokenCount == null) {
    // Create the single  CToken_Count entity if it doesn't exist
    cTokenCount = new CToken_Count_Schema(ID);
    cTokenCount.count = new BigInt(0);
  } else {
    // If it does exist, get the count, increment it and save it
    cTokenCount.count = cTokenCount.count.plus(new BigInt(1));
  }

  cTokenCount.save();
};

export const updateUnderlyingAssetCount = (): void => {
  let underlyingAssetCount = UnderlyingAsset_Count_Schema.load(ID);

  if (underlyingAssetCount == null) {
    // Create the single  CToken_Count entity if it doesn't exist
    underlyingAssetCount = new UnderlyingAsset_Count_Schema(ID);
    underlyingAssetCount.count = new BigInt(0);
  } else {
    // If it does exist, get the count, increment it and save it
    underlyingAssetCount.count = underlyingAssetCount.count.plus(new BigInt(1));
  }

  underlyingAssetCount.save();
};

export const updateFusePoolCount = (): void => {
  let poolCount = Pool_Count_Schema.load(ID);

  if (poolCount == null) {
    // Create the single  CToken_Count entity if it doesn't exist
    poolCount = new Pool_Count_Schema(ID);
    poolCount.count = new BigInt(0);
  } else {
    // If it does exist, get the count, increment it and save it
    poolCount.count = poolCount.count.plus(new BigInt(1));
  }

  poolCount.save();
};
