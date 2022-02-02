/* eslint-disable prefer-const */ // to satisfy AS compiler
import { PoolOracle as PoolOracleSchema,
         Pool as PoolSchema,
         Ctoken as CtokenSchema
} from "../../generated/schema";
import { NewOracle } from "../../generated/templates/PoolOracle/MasterPriceOracle";


function handleNewUnderlyingOracle(event: NewOracle): void {
  //let {underlying, newOracle, oldOracle} = event.params
  let underlying = event.params.underlying
  let newOracle = event.params.newOracle
  let oldOracle = event.params.oldOracle

  let masterPriceOracleAddress = event.address
  //underlying to cToken
  //get masterpriceoracle entity
  let poolOracleSchema = PoolOracleSchema.load(masterPriceOracleAddress.toHexString())
  let poolSchema = PoolSchema.load(poolOracleSchema.pool)

  let cToken
  poolSchema.assets.forEach((asset) => {
    let cTokenSchema = CtokenSchema.load(asset)
    if (cTokenSchema.underlying === underlying.toHexString()){
      cToken = cTokenSchema
    }
  })
}