import { BigNumber } from "ethers"

export interface Article {
    id:BigNumber,
    name:string,
    currentPrice:number|BigNumber,
    winningBidder:any,
    closed:boolean,
    boughtFor:number|BigNumber
    bought:number|BigNumber|null
}