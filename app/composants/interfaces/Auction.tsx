import { BigNumber } from "ethers";
import { Article } from './Article';

export interface Auction {
    id: number|BigNumber;
    name: string;
    currentArticleIndex: BigNumber,
    auctioneer:any,
    articles: Article[],
    auctionStartTime: number|BigNumber,
    startTimeCurrentAuction: number|BigNumber,
    closed:boolean
    auction_duration:any,
    starting_price:any,
    price_decrement:any,
    reserve_price:any,
    interval:any
}