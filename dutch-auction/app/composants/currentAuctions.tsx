"use client"
import { ethers, BigNumber } from "ethers";
import { useEffect, useState, Suspense } from "react";  // Import useEffect for side effects in a functional component
import { DutchsSkeleton } from '@/app/composants/skeletons';
import DutchWrapper from '@/app/composants/dutchs';
import daiAbi from '@/app/composants/abi';
import { MyContextProvider, useMyContext } from '@/app/dashboard/context';
import { cp } from "fs";

interface AuctionProps {}
interface Article {
    id:BigNumber,
    name:string,
    currentPrice:number|BigNumber,
    winningBidder:any,
    closed:boolean
}

const getCurrentPrice = async( contract: ethers.Contract | null, setTimeElapsed:Function) => {
    if( contract ) {
        const startTime = await contract.getStartTime();
        const now = Math.floor(new Date().getTime() / 1000);

        const elapsedTime = now - startTime;
        

        setTimeElapsed(humanReadableSeconds(elapsedTime));
        
        const interval = await contract.INTERVAL();
        const decrements = Math.floor(elapsedTime / interval);

        const startingPrice = await contract.STARTING_PRICE();
        const priceDec = await contract.PRICE_DECREMENT();
        const currentPrice = startingPrice - (priceDec * decrements);
        const reservePrice = await contract.RESERVE_PRICE();
        let res = Math.max(currentPrice, reservePrice) / (10 ** 18);
        return res;
    } else {
        return 0;
    }
}

function humanReadableSeconds ( seconds:number ) {
    let sec = seconds % 60;

    let totMin = parseInt( String(seconds / 60) );
    let hour = parseInt( String(totMin / 60) );
    let min = totMin % 60;
    let parseTime = ( val:any ) => `${ (val <= 9 ) ? '0' : ''}${val}`
    
    return `${parseTime(hour)}:${parseTime(min)}:${parseTime( sec )}`;
}

const fetchPrice = async ( setCuerrentArticle:Function, daiContract:ethers.Contract | null,  setTimeElapsed:Function, setArticles:Function, articles:Article[] ) => {
    if( daiContract ) {
        let price = await getCurrentPrice( daiContract, setTimeElapsed );
        const articleTemp = await daiContract.callStatic.getCurrentArticle();
        setCuerrentArticle( {
            ... articleTemp,
            currentPrice: price
        } );
        let find = articles.find( a => a.id.eq(articleTemp.id) );
        if( find ) {
            const articlesTemp = articles.filter( ( a:Article ) => a.id.toNumber() != articleTemp.id.toNumber() )
            setArticles( articlesTemp );
        }
    }
}

export function CurrentAuctions(props: AuctionProps) {
    const { 
        contract, setContract
      } = useMyContext();
    const [ timeElapsed, setTimeElapsed] = useState<string|null>(null);
    const [ balance, setBalance ] = useState<number | null>(null);
    const [ articles, setArticles ] = useState<Article[]>([]);
    const [ currentArticle, setCuerrentArticle ] = useState<Article | null>(null);

    const fetchArticles = async () => {
        const articlesTemp = contract ? await contract.callStatic.getOpenArticles() : [];
        return articlesTemp;
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchArticles().then( articlesTemp => {
                fetchPrice( setCuerrentArticle, contract, setTimeElapsed, setArticles, articlesTemp );
            } );
        }, 1000);

        return () => clearInterval(intervalId);
    }, [ currentArticle ])
    
    if( articles && !currentArticle ) {
        fetchPrice( setCuerrentArticle, contract, setTimeElapsed, setArticles, articles );
    }

    return (
        <>
            <div>
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <h1> ENCHERES EN COURS </h1>
                </div>
                <div style={{ background: '#CBCBCB', width: '80%', margin: '0 auto', borderRadius: '10px', minHeight: '80vh', padding: '20px' }}>
                    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-1" style={{marginBottom: '10px'}}>
                        <Suspense fallback={<DutchsSkeleton />}>
                            <DutchWrapper data={( currentArticle ) ? [currentArticle] : []} date={timeElapsed} current={true}/>
                        </Suspense>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Suspense fallback={<DutchsSkeleton />}>
                       <DutchWrapper data={articles} date={null} current={false}/>
                    </Suspense>
                    </div>
                </div>
            </div>
        </>                
    );
}