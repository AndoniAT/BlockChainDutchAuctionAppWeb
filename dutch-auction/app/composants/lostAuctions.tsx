"use client"
import { useState, Suspense } from "react";
import { BigNumber } from "ethers";
import DutchWrapper from '@/app/composants/dutchs';
import { DutchsSkeleton } from '@/app/composants/skeletons';
import { Article  } from "./interfaces/Article";
import { useMyContext } from '@/app/dashboard/context';
import { Auction } from "./interfaces/Auction";

interface AuctionProps { id:number|BigNumber }

export const LostAuctions:React.FC<AuctionProps> = ({ id }) => {
    const [ articles, setArticles ] = useState<Article[]>([]);
    const [ auction, setAuction ] = useState<Auction | null>(null);
    const { contract, signer } = useMyContext();

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
    
    return (
        <>
            <div style={{ background: '#CBCBCB', width: '80%', margin: '20px auto', borderRadius: '10px', minHeight: 'fit-content', padding: '20px' }}>
                <p> Enchère : { auction ? auction.name : '' }</p>
                <Suspense fallback={<DutchsSkeleton />}>
                    <DutchWrapper data={articles} date={null} current={false} buy={()=>{}}/>
                </Suspense>
            </div>
        </>
    );
}