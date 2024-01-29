"use client"
import { useState, Suspense, useEffect } from "react";
import { BigNumber } from "ethers";
import DutchWrapper from '@/app/composants/currentDutchWrapper';
import { DutchsSkeleton } from '@/app/composants/skeletons';
import { Article  } from "./interfaces/Article";
import { useMyContext } from '@/app/dashboard/context';
import { Auction } from "./interfaces/Auction";

interface AuctionProps { id:number|BigNumber }

export const LostAuctions:React.FC<AuctionProps> = ({ id }) => {
    const [ articles, setArticles ] = useState<Article[]>([]);
    const [ auction, setAuction ] = useState<Auction | null>(null);
    const { contract, signer } = useMyContext();
    const [ signerAddress, setSignerAddress] = useState<any>(null);

    /**
     * Ontenir les articles fermés et les filtrer par id ceux qui sont differents à l'id du signer
     * @returns 
     */
    const fetchArticles = async () => {
        if( signer ) {
            try {
                let signerAdress = await signer.getAddress();
                const articlesTemp = contract ? await contract.callStatic.getClosedArticles( id ) : [];
                const artWinningMe = articlesTemp.filter( (art:Article) => art.winningBidder !=  signerAdress ).map( (art:Article) => { return { ...art, currentPrice: art.boughtFor } });
                return artWinningMe;
    
            } catch( e ) {
                console.log(e)
            }
        }
        return [];
    }

    // Mettre à jour les articles
    if( articles.length == 0 && contract && signer ) fetchArticles().then( art => setArticles( art ) )

    // Mettre à jour l'enchère
    if( !auction && contract) contract.getAuction(id).then( (auct:Auction) => setAuction(auct) );
    

    useEffect(() => {
        (async() => {
            if( !signerAddress && signer ) {
                setSignerAddress( await signer.getAddress() );
            }

        })();
    }, []);

    let style = {
        monEnchere : {
            background: (auction?.auctioneer == (signerAddress)) ? 'rgb(148 190 229)': '#CBCBCB'
        }
    }

    return (
        <>
            <div style={ { ...style.monEnchere, ...{ width: '80%', margin: '20px auto', borderRadius: '10px', minHeight: 'fit-content', padding: '20px' }} }>
                <h2 style={{fontSize: '20px'}}> Enchère : { auction ? auction.name : '' } { auction?.auctioneer == (signerAddress) ? ' - (Mon Enchère)': '' }</h2>
                <Suspense fallback={<DutchsSkeleton />}>
                    <DutchWrapper data={articles} date={null} current={false} buy={()=>{}}/>
                </Suspense>
            </div>
        </>
    );
}