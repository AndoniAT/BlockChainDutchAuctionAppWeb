"use client"
import { ethers, BigNumber } from "ethers";
import { useEffect, useState, Suspense } from "react";
import { DutchsSkeleton } from '@/app/composants/skeletons';
import DutchWrapper from '@/app/composants/currentDutchWrapper';
import { useMyContext } from '@/app/context';
import { Auction } from "./interfaces/Auction";
import { Article  } from "./interfaces/Article";
import OwnDutchWrapper from "./ownDutchWrapper";

const axios = require('axios');
interface AuctionProps { 
    id:number|BigNumber
};

/**
 * Fonction pour lire le temps écoulé d'une manière plus lisible
 * en passant la totalitré de seconds en paramètre
 * @param seconds
 * @returns
 */
function humanReadableSeconds ( seconds:number ) {
    let sec = seconds % 60;
    let totMin = parseInt( String(seconds / 60) );
    let hour = parseInt( String(totMin / 60) );
    let min = totMin % 60;
    let parseTime = ( val:any ) => `${ (val <= 9 ) ? '0' : ''}${val}`
    return `${parseTime(hour)}:${parseTime(min)}:${parseTime( sec )}`;
}

export const OwnAuctions:React.FC<AuctionProps> = ({  id }) => {
    const [ timeElapsed, setTimeElapsed] = useState<string|null>(null);
    const [ articles, setArticles ] = useState<Article[]>([]);
    const [ currentArticle, setCuerrentArticle ] = useState<Article | null>(null);
    const [ auction, setAuction ] = useState<Auction | null>(null);
    const { contract, provider, signer } = useMyContext();
    const [ signerAddress, setSignerAddress] = useState<any>(null);
    
    const getCurrentPrice = async( contract: ethers.Contract | null, setTimeElapsed:Function) => {
        if( contract && auction ) {
            const startTime = await contract.getStartTime( id );
            const now = Math.floor(new Date().getTime() / 1000);
            const elapsedTime = now - startTime;
            if( auction && !auction.closed ) {
                setTimeElapsed(humanReadableSeconds(elapsedTime));
                // Price 
                const interval = auction.interval;
                const decrements = Math.floor(elapsedTime / interval);
        
                const startingPrice = auction.starting_price;
                const priceDec =  auction.price_decrement;
                const currentPrice = startingPrice - (priceDec * decrements);
                const reservePrice = auction.reserve_price;
                let res = Math.max(currentPrice, reservePrice) / (10 ** 18);
                return res;
            } else {
                const startingPrice = auction.starting_price;
                return startingPrice / (10 ** 18 );
            }
        } else {
            return 0;
        }
    }

    /**
     * Mettre à jour le prix de l'article
     * @param setCuerrentArticle : Fonction pour établit l'article actuel
     * @param daiContract : Le contrat
     * @param setTimeElapsed : Fonction pour établir le temps écoulé
     * @param setArticles : Fonction pour établir les articles
     * @param articles : Liste des articles
     */
    const fetchPrice = async ( setCuerrentArticle:Function, daiContract:ethers.Contract | null,  setTimeElapsed:Function, setArticles:Function, articles:Article[] ) => {
    if( daiContract ) {
            let auction = await daiContract.getAuction(id);
            if(auction) {
                let p = await getCurrentPrice( daiContract, setTimeElapsed );
                let price = p;
                if( auction.currentArticleIndex.toNumber() < auction.articles.length && price) {
                    const articleTemp = await daiContract.callStatic.getCurrentArticle( id );
                    let newArticleTime = { ... articleTemp, currentPrice: ethers.utils.parseUnits(price.toString(), 'ether') };
                    setCuerrentArticle( newArticleTime );

                    // Set the current price to the article
                    let arts = articles.map( a => (a.id.eq(articleTemp.id)) ? newArticleTime : a );

                    // Set the price as tthe price the article has been bought
                    arts = arts.map( a => {
                        let newArt = {
                            ... a,
                            currentPrice: ( a.boughtFor.gt(ethers.utils.parseUnits("0")) )  ? a.boughtFor : a.currentPrice
                        }
                        
                        return newArt;
                    } );

                    setArticles( arts );
                } else {
                    // Set the price as tthe price the article has been bought
                    let arts = articles.map( a => {
                        let newArt = {
                            ... a,
                            currentPrice: ( a.boughtFor.gt(ethers.utils.parseUnits("0")) )  ? a.boughtFor : a.currentPrice
                        }
                        
                        return newArt;
                    } );
                    setArticles( arts );
                }

            }
        }
    }

    /**
     * Obtenir les articles ouverts
     * @returns liste des articles ouverts de l'enchère
     */
    const fetchArticles = async () => {
        const articlesTemp = contract ? await contract.callStatic.getArticles( id ) : [];
        return articlesTemp;
    }

    useEffect(() => {
        
        if( !auction && contract) {
            // Etablir l'enchere
            contract.getAuction(id).then( (auct:Auction) => {
                setAuction(auct)
             } );
        }

        const intervalId = setInterval(() => {
            fetchArticles().then( articlesTemp => {
                if( articlesTemp.length > 0 ) {
                    fetchPrice( setCuerrentArticle, contract, setTimeElapsed, setArticles, articlesTemp );
                }
            } );
        }, 1000);
        
        
        (async() => {
            if( !signerAddress && signer ) {
                setSignerAddress( await signer.getAddress() );
            }

        })();

        return () => clearInterval(intervalId);
    }, [ currentArticle ])
    
    if( articles.length > 0 && !currentArticle ) {
        fetchPrice( setCuerrentArticle, contract, setTimeElapsed, setArticles, articles );
    }

    const changeStateAuction = async () => {
        if( signer && contract && currentArticle ) {
            const bidAmount = ethers.utils.parseUnits('0', 'ether');
            try {
                if( provider ) {
                    const ganacheUrl = process.env.GANACHE_URL;
    
                    const inc_time = await axios.post(ganacheUrl, {
                        jsonrpc: '2.0',
                        method: 'evm_increaseTime',
                        params: [0],
                        id: new Date().getTime()
                    });
    
                    const response = await axios.post(ganacheUrl, {
                        jsonrpc: '2.0',
                        method: 'evm_mine',
                        id: 1,
                    });
                }  

                let functionCall = ( auction?.closed ) ? 'openAuction': 'closeAuction';
                const signedTransaction = await signer.sendTransaction({
                    to: contract.address,
                    value: bidAmount,
                    data: contract.interface.encodeFunctionData(functionCall, [id]),
              } );
              const receipt = await signedTransaction.wait();
              setArticles([]);
              contract.getAuction(id).then( (auct:Auction) => setAuction(auct) );
              setCuerrentArticle(null);
            } catch ( e:any ) {
                console.log( e );
            }
          }
    };

    let style = {
        monEnchere : {
            background: (auction?.auctioneer == (signerAddress)) ? 'rgb(148 190 229)': '#CBCBCB'
        }
    }

    return (
        <>
            <div style={ { ...style.monEnchere, ...{ width: '80%', borderRadius: '10px', minHeight: 'fit-content', padding: '20px', margin:'20px auto' }} }>
                <div className="flex p-4" style={{justifyContent: 'space-between'}}>
                    <h2 style={{fontSize: '20px'}}> Enchère : { auction ? auction.name : '' } { auction?.auctioneer == (signerAddress) ? '- (Mon Enchère)': '' }</h2>
                    {
                        ( auction && auction.currentArticleIndex.toNumber() < auction.articles.length ) ?
                            <button type="button" style={{ padding: '10px 10px', background:'#2fab418a', borderRadius: '10px', cursor: 'pointer'}} onClick={changeStateAuction} > { (auction?.closed) ? "Ouvrir l'enchère" : "Fermer l'enchère" }</button>
                        :
                        <></>
                    }
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<DutchsSkeleton />}>
                    <OwnDutchWrapper data={articles} date={auction?.closed ? null : timeElapsed} current={false} closed={auction?.closed} auctionId={id}/>
                </Suspense>
                </div>
            </div>
        </>
    );
}