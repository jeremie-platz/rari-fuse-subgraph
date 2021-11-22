// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Ctoken extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Ctoken entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Ctoken entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Ctoken", id.toString(), this);
  }

  static load(id: string): Ctoken | null {
    return store.get("Ctoken", id) as Ctoken | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get underlying(): string {
    let value = this.get("underlying");
    return value.toString();
  }

  set underlying(value: string) {
    this.set("underlying", Value.fromString(value));
  }

  get pool(): string {
    let value = this.get("pool");
    return value.toString();
  }

  set pool(value: string) {
    this.set("pool", Value.fromString(value));
  }

  get reserveFactor(): BigInt {
    let value = this.get("reserveFactor");
    return value.toBigInt();
  }

  set reserveFactor(value: BigInt) {
    this.set("reserveFactor", Value.fromBigInt(value));
  }

  get adminFee(): BigInt {
    let value = this.get("adminFee");
    return value.toBigInt();
  }

  set adminFee(value: BigInt) {
    this.set("adminFee", Value.fromBigInt(value));
  }

  get fuseFee(): BigInt {
    let value = this.get("fuseFee");
    return value.toBigInt();
  }

  set fuseFee(value: BigInt) {
    this.set("fuseFee", Value.fromBigInt(value));
  }

  get borrowRatePerBlock(): BigInt {
    let value = this.get("borrowRatePerBlock");
    return value.toBigInt();
  }

  set borrowRatePerBlock(value: BigInt) {
    this.set("borrowRatePerBlock", Value.fromBigInt(value));
  }

  get supplyRatePerBlock(): BigInt {
    let value = this.get("supplyRatePerBlock");
    return value.toBigInt();
  }

  set supplyRatePerBlock(value: BigInt) {
    this.set("supplyRatePerBlock", Value.fromBigInt(value));
  }

  get totalBorrow(): BigInt {
    let value = this.get("totalBorrow");
    return value.toBigInt();
  }

  set totalBorrow(value: BigInt) {
    this.set("totalBorrow", Value.fromBigInt(value));
  }

  get totalBorrowUSD(): BigInt {
    let value = this.get("totalBorrowUSD");
    return value.toBigInt();
  }

  set totalBorrowUSD(value: BigInt) {
    this.set("totalBorrowUSD", Value.fromBigInt(value));
  }

  get liquidity(): BigInt {
    let value = this.get("liquidity");
    return value.toBigInt();
  }

  set liquidity(value: BigInt) {
    this.set("liquidity", Value.fromBigInt(value));
  }

  get liquidityUSD(): BigInt {
    let value = this.get("liquidityUSD");
    return value.toBigInt();
  }

  set liquidityUSD(value: BigInt) {
    this.set("liquidityUSD", Value.fromBigInt(value));
  }

  get totalSupply(): BigInt {
    let value = this.get("totalSupply");
    return value.toBigInt();
  }

  set totalSupply(value: BigInt) {
    this.set("totalSupply", Value.fromBigInt(value));
  }

  get totalSupplyUSD(): BigInt {
    let value = this.get("totalSupplyUSD");
    return value.toBigInt();
  }

  set totalSupplyUSD(value: BigInt) {
    this.set("totalSupplyUSD", Value.fromBigInt(value));
  }

  get totalReserves(): BigInt {
    let value = this.get("totalReserves");
    return value.toBigInt();
  }

  set totalReserves(value: BigInt) {
    this.set("totalReserves", Value.fromBigInt(value));
  }

  get totalAdminFees(): BigInt {
    let value = this.get("totalAdminFees");
    return value.toBigInt();
  }

  set totalAdminFees(value: BigInt) {
    this.set("totalAdminFees", Value.fromBigInt(value));
  }

  get name(): string {
    let value = this.get("name");
    return value.toString();
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get symbol(): string {
    let value = this.get("symbol");
    return value.toString();
  }

  set symbol(value: string) {
    this.set("symbol", Value.fromString(value));
  }

  get decimals(): i32 {
    let value = this.get("decimals");
    return value.toI32();
  }

  set decimals(value: i32) {
    this.set("decimals", Value.fromI32(value));
  }

  get underlyingBalance(): BigInt {
    let value = this.get("underlyingBalance");
    return value.toBigInt();
  }

  set underlyingBalance(value: BigInt) {
    this.set("underlyingBalance", Value.fromBigInt(value));
  }

  get borrowAPR(): BigDecimal | null {
    let value = this.get("borrowAPR");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigDecimal();
    }
  }

  set borrowAPR(value: BigDecimal | null) {
    if (value === null) {
      this.unset("borrowAPR");
    } else {
      this.set("borrowAPR", Value.fromBigDecimal(value as BigDecimal));
    }
  }

  get supplyAPY(): BigDecimal | null {
    let value = this.get("supplyAPY");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigDecimal();
    }
  }

  set supplyAPY(value: BigDecimal | null) {
    if (value === null) {
      this.unset("supplyAPY");
    } else {
      this.set("supplyAPY", Value.fromBigDecimal(value as BigDecimal));
    }
  }

  get totalSeizedTokens(): BigInt | null {
    let value = this.get("totalSeizedTokens");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set totalSeizedTokens(value: BigInt | null) {
    if (value === null) {
      this.unset("totalSeizedTokens");
    } else {
      this.set("totalSeizedTokens", Value.fromBigInt(value as BigInt));
    }
  }

  get collateralFactor(): BigInt | null {
    let value = this.get("collateralFactor");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set collateralFactor(value: BigInt | null) {
    if (value === null) {
      this.unset("collateralFactor");
    } else {
      this.set("collateralFactor", Value.fromBigInt(value as BigInt));
    }
  }
}

export class Pool extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Pool entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Pool entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Pool", id.toString(), this);
  }

  static load(id: string): Pool | null {
    return store.get("Pool", id) as Pool | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get blockCreated(): BigInt {
    let value = this.get("blockCreated");
    return value.toBigInt();
  }

  set blockCreated(value: BigInt) {
    this.set("blockCreated", Value.fromBigInt(value));
  }

  get comptroller(): Bytes {
    let value = this.get("comptroller");
    return value.toBytes();
  }

  set comptroller(value: Bytes) {
    this.set("comptroller", Value.fromBytes(value));
  }

  get address(): Bytes | null {
    let value = this.get("address");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set address(value: Bytes | null) {
    if (value === null) {
      this.unset("address");
    } else {
      this.set("address", Value.fromBytes(value as Bytes));
    }
  }

  get assets(): Array<string> | null {
    let value = this.get("assets");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set assets(value: Array<string> | null) {
    if (value === null) {
      this.unset("assets");
    } else {
      this.set("assets", Value.fromStringArray(value as Array<string>));
    }
  }

  get underlyingAssets(): Array<string> | null {
    let value = this.get("underlyingAssets");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set underlyingAssets(value: Array<string> | null) {
    if (value === null) {
      this.unset("underlyingAssets");
    } else {
      this.set(
        "underlyingAssets",
        Value.fromStringArray(value as Array<string>)
      );
    }
  }

  get index(): BigInt | null {
    let value = this.get("index");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set index(value: BigInt | null) {
    if (value === null) {
      this.unset("index");
    } else {
      this.set("index", Value.fromBigInt(value as BigInt));
    }
  }

  get name(): string | null {
    let value = this.get("name");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set name(value: string | null) {
    if (value === null) {
      this.unset("name");
    } else {
      this.set("name", Value.fromString(value as string));
    }
  }

  get priceOracle(): Bytes {
    let value = this.get("priceOracle");
    return value.toBytes();
  }

  set priceOracle(value: Bytes) {
    this.set("priceOracle", Value.fromBytes(value));
  }

  get closeFactor(): BigInt | null {
    let value = this.get("closeFactor");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set closeFactor(value: BigInt | null) {
    if (value === null) {
      this.unset("closeFactor");
    } else {
      this.set("closeFactor", Value.fromBigInt(value as BigInt));
    }
  }

  get liquidationIncentive(): BigInt | null {
    let value = this.get("liquidationIncentive");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set liquidationIncentive(value: BigInt | null) {
    if (value === null) {
      this.unset("liquidationIncentive");
    } else {
      this.set("liquidationIncentive", Value.fromBigInt(value as BigInt));
    }
  }

  get totalBorrowUSD(): BigInt {
    let value = this.get("totalBorrowUSD");
    return value.toBigInt();
  }

  set totalBorrowUSD(value: BigInt) {
    this.set("totalBorrowUSD", Value.fromBigInt(value));
  }

  get totalLiquidityUSD(): BigInt {
    let value = this.get("totalLiquidityUSD");
    return value.toBigInt();
  }

  set totalLiquidityUSD(value: BigInt) {
    this.set("totalLiquidityUSD", Value.fromBigInt(value));
  }

  get totalSupplyUSD(): BigInt {
    let value = this.get("totalSupplyUSD");
    return value.toBigInt();
  }

  set totalSupplyUSD(value: BigInt) {
    this.set("totalSupplyUSD", Value.fromBigInt(value));
  }

  get totalSeizedTokens(): BigInt {
    let value = this.get("totalSeizedTokens");
    return value.toBigInt();
  }

  set totalSeizedTokens(value: BigInt) {
    this.set("totalSeizedTokens", Value.fromBigInt(value));
  }
}

export class UnderlyingAsset extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save UnderlyingAsset entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save UnderlyingAsset entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("UnderlyingAsset", id.toString(), this);
  }

  static load(id: string): UnderlyingAsset | null {
    return store.get("UnderlyingAsset", id) as UnderlyingAsset | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get address(): Bytes {
    let value = this.get("address");
    return value.toBytes();
  }

  set address(value: Bytes) {
    this.set("address", Value.fromBytes(value));
  }

  get name(): string | null {
    let value = this.get("name");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set name(value: string | null) {
    if (value === null) {
      this.unset("name");
    } else {
      this.set("name", Value.fromString(value as string));
    }
  }

  get symbol(): string | null {
    let value = this.get("symbol");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set symbol(value: string | null) {
    if (value === null) {
      this.unset("symbol");
    } else {
      this.set("symbol", Value.fromString(value as string));
    }
  }

  get ctokens(): Array<string> | null {
    let value = this.get("ctokens");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set ctokens(value: Array<string> | null) {
    if (value === null) {
      this.unset("ctokens");
    } else {
      this.set("ctokens", Value.fromStringArray(value as Array<string>));
    }
  }

  get pools(): Array<string> | null {
    let value = this.get("pools");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set pools(value: Array<string> | null) {
    if (value === null) {
      this.unset("pools");
    } else {
      this.set("pools", Value.fromStringArray(value as Array<string>));
    }
  }

  get decimals(): i32 {
    let value = this.get("decimals");
    return value.toI32();
  }

  set decimals(value: i32) {
    this.set("decimals", Value.fromI32(value));
  }

  get price(): BigInt {
    let value = this.get("price");
    return value.toBigInt();
  }

  set price(value: BigInt) {
    this.set("price", Value.fromBigInt(value));
  }

  get totalBorrow(): BigInt {
    let value = this.get("totalBorrow");
    return value.toBigInt();
  }

  set totalBorrow(value: BigInt) {
    this.set("totalBorrow", Value.fromBigInt(value));
  }

  get totalBorrowUSD(): BigInt {
    let value = this.get("totalBorrowUSD");
    return value.toBigInt();
  }

  set totalBorrowUSD(value: BigInt) {
    this.set("totalBorrowUSD", Value.fromBigInt(value));
  }

  get totalLiquidity(): BigInt {
    let value = this.get("totalLiquidity");
    return value.toBigInt();
  }

  set totalLiquidity(value: BigInt) {
    this.set("totalLiquidity", Value.fromBigInt(value));
  }

  get totalLiquidityUSD(): BigInt {
    let value = this.get("totalLiquidityUSD");
    return value.toBigInt();
  }

  set totalLiquidityUSD(value: BigInt) {
    this.set("totalLiquidityUSD", Value.fromBigInt(value));
  }

  get totalSupply(): BigInt {
    let value = this.get("totalSupply");
    return value.toBigInt();
  }

  set totalSupply(value: BigInt) {
    this.set("totalSupply", Value.fromBigInt(value));
  }

  get totalSupplyUSD(): BigInt {
    let value = this.get("totalSupplyUSD");
    return value.toBigInt();
  }

  set totalSupplyUSD(value: BigInt) {
    this.set("totalSupplyUSD", Value.fromBigInt(value));
  }
}

export class Utility extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Utility entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Utility entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Utility", id.toString(), this);
  }

  static load(id: string): Utility | null {
    return store.get("Utility", id) as Utility | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get ethPriceInDai(): BigInt {
    let value = this.get("ethPriceInDai");
    return value.toBigInt();
  }

  set ethPriceInDai(value: BigInt) {
    this.set("ethPriceInDai", Value.fromBigInt(value));
  }

  get priceOracle(): Bytes {
    let value = this.get("priceOracle");
    return value.toBytes();
  }

  set priceOracle(value: Bytes) {
    this.set("priceOracle", Value.fromBytes(value));
  }
}

export class Account extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Account entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Account entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Account", id.toString(), this);
  }

  static load(id: string): Account | null {
    return store.get("Account", id) as Account | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get positions(): Array<string> {
    let value = this.get("positions");
    return value.toStringArray();
  }

  set positions(value: Array<string>) {
    this.set("positions", Value.fromStringArray(value));
  }
}

export class Token extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Token entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Token entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Token", id.toString(), this);
  }

  static load(id: string): Token | null {
    return store.get("Token", id) as Token | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get tokenStandard(): string {
    let value = this.get("tokenStandard");
    return value.toString();
  }

  set tokenStandard(value: string) {
    this.set("tokenStandard", Value.fromString(value));
  }

  get name(): string | null {
    let value = this.get("name");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set name(value: string | null) {
    if (value === null) {
      this.unset("name");
    } else {
      this.set("name", Value.fromString(value as string));
    }
  }

  get symbol(): string | null {
    let value = this.get("symbol");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set symbol(value: string | null) {
    if (value === null) {
      this.unset("symbol");
    } else {
      this.set("symbol", Value.fromString(value as string));
    }
  }

  get decimals(): i32 {
    let value = this.get("decimals");
    return value.toI32();
  }

  set decimals(value: i32) {
    this.set("decimals", Value.fromI32(value));
  }

  get mintedByMarket(): string | null {
    let value = this.get("mintedByMarket");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set mintedByMarket(value: string | null) {
    if (value === null) {
      this.unset("mintedByMarket");
    } else {
      this.set("mintedByMarket", Value.fromString(value as string));
    }
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    return value.toBigInt();
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }
}

export class Market extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Market entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Market entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Market", id.toString(), this);
  }

  static load(id: string): Market | null {
    return store.get("Market", id) as Market | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get account(): string {
    let value = this.get("account");
    return value.toString();
  }

  set account(value: string) {
    this.set("account", Value.fromString(value));
  }

  get protocolName(): string {
    let value = this.get("protocolName");
    return value.toString();
  }

  set protocolName(value: string) {
    this.set("protocolName", Value.fromString(value));
  }

  get protocolType(): string {
    let value = this.get("protocolType");
    return value.toString();
  }

  set protocolType(value: string) {
    this.set("protocolType", Value.fromString(value));
  }

  get inputTokens(): Array<string> {
    let value = this.get("inputTokens");
    return value.toStringArray();
  }

  set inputTokens(value: Array<string>) {
    this.set("inputTokens", Value.fromStringArray(value));
  }

  get outputToken(): string | null {
    let value = this.get("outputToken");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set outputToken(value: string | null) {
    if (value === null) {
      this.unset("outputToken");
    } else {
      this.set("outputToken", Value.fromString(value as string));
    }
  }

  get rewardTokens(): Array<string> | null {
    let value = this.get("rewardTokens");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set rewardTokens(value: Array<string> | null) {
    if (value === null) {
      this.unset("rewardTokens");
    } else {
      this.set("rewardTokens", Value.fromStringArray(value as Array<string>));
    }
  }

  get inputTokenTotalBalances(): Array<string> {
    let value = this.get("inputTokenTotalBalances");
    return value.toStringArray();
  }

  set inputTokenTotalBalances(value: Array<string>) {
    this.set("inputTokenTotalBalances", Value.fromStringArray(value));
  }

  get outputTokenTotalSupply(): BigInt {
    let value = this.get("outputTokenTotalSupply");
    return value.toBigInt();
  }

  set outputTokenTotalSupply(value: BigInt) {
    this.set("outputTokenTotalSupply", Value.fromBigInt(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    return value.toBigInt();
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get positions(): Array<string> {
    let value = this.get("positions");
    return value.toStringArray();
  }

  set positions(value: Array<string>) {
    this.set("positions", Value.fromStringArray(value));
  }

  get history(): Array<string> {
    let value = this.get("history");
    return value.toStringArray();
  }

  set history(value: Array<string>) {
    this.set("history", Value.fromStringArray(value));
  }
}

export class MarketSnapshot extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save MarketSnapshot entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save MarketSnapshot entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("MarketSnapshot", id.toString(), this);
  }

  static load(id: string): MarketSnapshot | null {
    return store.get("MarketSnapshot", id) as MarketSnapshot | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get market(): string {
    let value = this.get("market");
    return value.toString();
  }

  set market(value: string) {
    this.set("market", Value.fromString(value));
  }

  get inputTokenBalances(): Array<string> {
    let value = this.get("inputTokenBalances");
    return value.toStringArray();
  }

  set inputTokenBalances(value: Array<string>) {
    this.set("inputTokenBalances", Value.fromStringArray(value));
  }

  get outputTokenTotalSupply(): BigInt {
    let value = this.get("outputTokenTotalSupply");
    return value.toBigInt();
  }

  set outputTokenTotalSupply(value: BigInt) {
    this.set("outputTokenTotalSupply", Value.fromBigInt(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    return value.toBigInt();
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get transactionHash(): string {
    let value = this.get("transactionHash");
    return value.toString();
  }

  set transactionHash(value: string) {
    this.set("transactionHash", Value.fromString(value));
  }

  get transactionIndexInBlock(): BigInt {
    let value = this.get("transactionIndexInBlock");
    return value.toBigInt();
  }

  set transactionIndexInBlock(value: BigInt) {
    this.set("transactionIndexInBlock", Value.fromBigInt(value));
  }

  get logIndex(): BigInt {
    let value = this.get("logIndex");
    return value.toBigInt();
  }

  set logIndex(value: BigInt) {
    this.set("logIndex", Value.fromBigInt(value));
  }
}

export class Transaction extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Transaction entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Transaction entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Transaction", id.toString(), this);
  }

  static load(id: string): Transaction | null {
    return store.get("Transaction", id) as Transaction | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get transactionHash(): Bytes {
    let value = this.get("transactionHash");
    return value.toBytes();
  }

  set transactionHash(value: Bytes) {
    this.set("transactionHash", Value.fromBytes(value));
  }

  get market(): string {
    let value = this.get("market");
    return value.toString();
  }

  set market(value: string) {
    this.set("market", Value.fromString(value));
  }

  get marketSnapshot(): string {
    let value = this.get("marketSnapshot");
    return value.toString();
  }

  set marketSnapshot(value: string) {
    this.set("marketSnapshot", Value.fromString(value));
  }

  get from(): string {
    let value = this.get("from");
    return value.toString();
  }

  set from(value: string) {
    this.set("from", Value.fromString(value));
  }

  get to(): string | null {
    let value = this.get("to");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set to(value: string | null) {
    if (value === null) {
      this.unset("to");
    } else {
      this.set("to", Value.fromString(value as string));
    }
  }

  get transactionType(): string {
    let value = this.get("transactionType");
    return value.toString();
  }

  set transactionType(value: string) {
    this.set("transactionType", Value.fromString(value));
  }

  get inputTokenAmounts(): Array<string> {
    let value = this.get("inputTokenAmounts");
    return value.toStringArray();
  }

  set inputTokenAmounts(value: Array<string>) {
    this.set("inputTokenAmounts", Value.fromStringArray(value));
  }

  get outputTokenAmount(): BigInt {
    let value = this.get("outputTokenAmount");
    return value.toBigInt();
  }

  set outputTokenAmount(value: BigInt) {
    this.set("outputTokenAmount", Value.fromBigInt(value));
  }

  get rewardTokenAmounts(): Array<string> {
    let value = this.get("rewardTokenAmounts");
    return value.toStringArray();
  }

  set rewardTokenAmounts(value: Array<string>) {
    this.set("rewardTokenAmounts", Value.fromStringArray(value));
  }

  get transferredFrom(): string | null {
    let value = this.get("transferredFrom");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set transferredFrom(value: string | null) {
    if (value === null) {
      this.unset("transferredFrom");
    } else {
      this.set("transferredFrom", Value.fromString(value as string));
    }
  }

  get transferredTo(): string | null {
    let value = this.get("transferredTo");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set transferredTo(value: string | null) {
    if (value === null) {
      this.unset("transferredTo");
    } else {
      this.set("transferredTo", Value.fromString(value as string));
    }
  }

  get gasUsed(): BigInt {
    let value = this.get("gasUsed");
    return value.toBigInt();
  }

  set gasUsed(value: BigInt) {
    this.set("gasUsed", Value.fromBigInt(value));
  }

  get gasPrice(): BigInt {
    let value = this.get("gasPrice");
    return value.toBigInt();
  }

  set gasPrice(value: BigInt) {
    this.set("gasPrice", Value.fromBigInt(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    return value.toBigInt();
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get transactionIndexInBlock(): BigInt {
    let value = this.get("transactionIndexInBlock");
    return value.toBigInt();
  }

  set transactionIndexInBlock(value: BigInt) {
    this.set("transactionIndexInBlock", Value.fromBigInt(value));
  }
}

export class AccountPosition extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save AccountPosition entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save AccountPosition entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("AccountPosition", id.toString(), this);
  }

  static load(id: string): AccountPosition | null {
    return store.get("AccountPosition", id) as AccountPosition | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get positionCounter(): BigInt {
    let value = this.get("positionCounter");
    return value.toBigInt();
  }

  set positionCounter(value: BigInt) {
    this.set("positionCounter", Value.fromBigInt(value));
  }

  get positions(): Array<string> {
    let value = this.get("positions");
    return value.toStringArray();
  }

  set positions(value: Array<string>) {
    this.set("positions", Value.fromStringArray(value));
  }
}

export class Position extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Position entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Position entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Position", id.toString(), this);
  }

  static load(id: string): Position | null {
    return store.get("Position", id) as Position | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get accountPosition(): string {
    let value = this.get("accountPosition");
    return value.toString();
  }

  set accountPosition(value: string) {
    this.set("accountPosition", Value.fromString(value));
  }

  get account(): string {
    let value = this.get("account");
    return value.toString();
  }

  set account(value: string) {
    this.set("account", Value.fromString(value));
  }

  get accountAddress(): string {
    let value = this.get("accountAddress");
    return value.toString();
  }

  set accountAddress(value: string) {
    this.set("accountAddress", Value.fromString(value));
  }

  get market(): string {
    let value = this.get("market");
    return value.toString();
  }

  set market(value: string) {
    this.set("market", Value.fromString(value));
  }

  get marketAddress(): string {
    let value = this.get("marketAddress");
    return value.toString();
  }

  set marketAddress(value: string) {
    this.set("marketAddress", Value.fromString(value));
  }

  get positionType(): string {
    let value = this.get("positionType");
    return value.toString();
  }

  set positionType(value: string) {
    this.set("positionType", Value.fromString(value));
  }

  get outputTokenBalance(): BigInt {
    let value = this.get("outputTokenBalance");
    return value.toBigInt();
  }

  set outputTokenBalance(value: BigInt) {
    this.set("outputTokenBalance", Value.fromBigInt(value));
  }

  get inputTokenBalances(): Array<string> {
    let value = this.get("inputTokenBalances");
    return value.toStringArray();
  }

  set inputTokenBalances(value: Array<string>) {
    this.set("inputTokenBalances", Value.fromStringArray(value));
  }

  get rewardTokenBalances(): Array<string> {
    let value = this.get("rewardTokenBalances");
    return value.toStringArray();
  }

  set rewardTokenBalances(value: Array<string>) {
    this.set("rewardTokenBalances", Value.fromStringArray(value));
  }

  get transferredTo(): Array<string> {
    let value = this.get("transferredTo");
    return value.toStringArray();
  }

  set transferredTo(value: Array<string>) {
    this.set("transferredTo", Value.fromStringArray(value));
  }

  get closed(): boolean {
    let value = this.get("closed");
    return value.toBoolean();
  }

  set closed(value: boolean) {
    this.set("closed", Value.fromBoolean(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    return value.toBigInt();
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get historyCounter(): BigInt {
    let value = this.get("historyCounter");
    return value.toBigInt();
  }

  set historyCounter(value: BigInt) {
    this.set("historyCounter", Value.fromBigInt(value));
  }

  get history(): Array<string> {
    let value = this.get("history");
    return value.toStringArray();
  }

  set history(value: Array<string>) {
    this.set("history", Value.fromStringArray(value));
  }
}

export class PositionSnapshot extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save PositionSnapshot entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save PositionSnapshot entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("PositionSnapshot", id.toString(), this);
  }

  static load(id: string): PositionSnapshot | null {
    return store.get("PositionSnapshot", id) as PositionSnapshot | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get position(): string {
    let value = this.get("position");
    return value.toString();
  }

  set position(value: string) {
    this.set("position", Value.fromString(value));
  }

  get transaction(): string {
    let value = this.get("transaction");
    return value.toString();
  }

  set transaction(value: string) {
    this.set("transaction", Value.fromString(value));
  }

  get outputTokenBalance(): BigInt {
    let value = this.get("outputTokenBalance");
    return value.toBigInt();
  }

  set outputTokenBalance(value: BigInt) {
    this.set("outputTokenBalance", Value.fromBigInt(value));
  }

  get inputTokenBalances(): Array<string> {
    let value = this.get("inputTokenBalances");
    return value.toStringArray();
  }

  set inputTokenBalances(value: Array<string>) {
    this.set("inputTokenBalances", Value.fromStringArray(value));
  }

  get rewardTokenBalances(): Array<string> {
    let value = this.get("rewardTokenBalances");
    return value.toStringArray();
  }

  set rewardTokenBalances(value: Array<string>) {
    this.set("rewardTokenBalances", Value.fromStringArray(value));
  }

  get transferredTo(): Array<string> {
    let value = this.get("transferredTo");
    return value.toStringArray();
  }

  set transferredTo(value: Array<string>) {
    this.set("transferredTo", Value.fromStringArray(value));
  }
}
