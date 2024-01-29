import { BigNumber } from "ethers";
import { Article } from './Article';

export interface Auction {
    id: number|BigNumber;
    name: string;
    currentArticleIndex: number|BigNumber,
    auctioneer:any,
    articles: Article[],
    auctionStartTime: number|BigNumber,
    startTimeCurrentAuction: number|BigNumber,
    closed:boolean
}