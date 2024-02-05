"use client"
import { ethers, BigNumber } from "ethers";
import { useEffect, useState, Suspense } from "react";
import { DutchsSkeleton } from '@/app/composants/skeletons';
import DutchWrapper from '@/app/composants/currentDutchWrapper';
import { useMyContext } from '@/app/context';
import { Auction } from "./interfaces/Auction";
import { Article  } from "./interfaces/Article";

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

export const CurrentAuctions:React.FC<AuctionProps> = ({  id }) => {
    const [ timeElapsed, setTimeElapsed] = useState<string|null>(null);
    const [ articles, setArticles ] = useState<Article[]>([]);
    const [ currentArticle, setCuerrentArticle ] = useState<Article | null>(null);
    const [ auction, setAuction ] = useState<Auction | null>(null);
    const { contract, provider, signer } = useMyContext();
    const [ signerAddress, setSignerAddress] = useState<any>(null);
    const getCurrentPrice = async( contract: ethers.Contract | null, setTimeElapsed:Function) => {
        if( auction && contract ) {
            const startTime = await contract.getStartTime( id );
            const now = Math.floor(new Date().getTime() / 1000);
            const elapsedTime = now - startTime;
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
    
            return;
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
            let p = await getCurrentPrice( daiContract, setTimeElapsed );
            let price = p;//await daiContract.callStatic.getCurrentPrice( id );
            const articleTemp = await daiContract.callStatic.getCurrentArticle( id );
            
            let newArticleTime = { ... articleTemp, currentPrice: price  };
            setCuerrentArticle( newArticleTime );

            let find = articles.find( a => a.id.eq(articleTemp.id) ); // Trouver l'article

            if( find ) {
                // Filtrer l'article actuel de la liste des articles pour l'afficher separement
                const articlesTemp = articles.filter( ( a:Article ) => a.id.toNumber() != articleTemp.id.toNumber() )
                setArticles( articlesTemp );
            }
        }
    }

    /**
     * Obtenir les articles ouverts
     * @returns liste des articles ouverts de l'enchère
     */
    const fetchArticles = async () => {
        const articlesTemp = contract ? await contract.callStatic.getOpenArticles( id ) : [];
        return articlesTemp;
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchArticles().then( articlesTemp => {
                if( articlesTemp.length > 0 ) {
                    fetchPrice( setCuerrentArticle, contract, setTimeElapsed, setArticles, articlesTemp );
                }
            } );
        }, 1000);
        
        if( !auction && contract) {
            // Etablir l'enchere
            contract.getAuction(id).then( (auct:Auction) => setAuction(auct) );
        }
        
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

    /**
     * Placer une offre
     * @param valueOffer : Valeur offert
     * @param setErrMsg : Fonction pour établir un message d'erreur
     */
    const placeOfferHandle = async ( valueOffer:number, setErrMsg:Function ) => {
        if( signer && contract && currentArticle ) {
          const articleIndex = currentArticle.id.toNumber() - 1;
          const bidAmount = ethers.utils.parseUnits(valueOffer.toString(), 'ether');
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

            // Envoyer la transaction en envoyant en parametres l'index de l'article et l'id de l'enchère
            const signedTransaction = await signer.sendTransaction({
                  to: contract.address,
                  value: bidAmount,
                  data: contract.interface.encodeFunctionData('placeBid', [articleIndex, id]),
            } );

            const receipt = await signedTransaction.wait();

            //Redemarrer les articles
            setArticles([]);
            contract.getAuction(id).then( (auct:Auction) => setAuction(auct) );
            setCuerrentArticle(null);
          } catch ( e:any ) {
            if( e.data && e.data.message ) {
                let msg = e.data.message;
                setErrMsg( msg );
            } else {
                console.log( e );
            }
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
                <h2 style={{fontSize: '20px'}}> Enchère : { auction ? auction.name : '' } { auction?.auctioneer == (signerAddress) ? '- (Mon Enchère)': '' }</h2>
                <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-1" style={{marginBottom: '10px'}}>
                    <Suspense fallback={<DutchsSkeleton />}>
                        <DutchWrapper data={( currentArticle ) ? [currentArticle] : []} date={timeElapsed} current={true} buy={placeOfferHandle}/>
                    </Suspense>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<DutchsSkeleton />}>
                    <DutchWrapper data={articles} date={null} current={false} buy={()=>{}}/>
                </Suspense>
                </div>
            </div>
        </>
    );
}