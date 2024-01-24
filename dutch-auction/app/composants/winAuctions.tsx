"use client"
import { useEffect, useState, Suspense } from "react";
import { ethers, BigNumber } from "ethers";
import DutchWrapper from '@/app/composants/dutchs';
import { DutchsSkeleton } from '@/app/composants/skeletons';

interface AuctionProps {}
interface Article {
    id:BigNumber,
    name:string,
    currentPrice:number|BigNumber,
    winningBidder:any,
    closed:boolean,
    boughtFor:number|BigNumber,
    bought:number|BigNumber|null
}

import { MyContextProvider, useMyContext } from '@/app/dashboard/context';

export function WinAuctions(props: AuctionProps) {
    const [ articles, setArticles ] = useState<Article[]>([]);
    const {
        contract, provider, signer
    } = useMyContext();

    const fetchArticles = async () => {
        if( signer ) {
            try {
                let signerAdress = await signer.getAddress();
                const articlesTemp = contract ? await contract.callStatic.getClosedArticles() : [];
                const artWinningMe = articlesTemp.filter( (art:Article) => art.winningBidder ==  signerAdress ).map( (art:Article) => { return { ...art, currentPrice: art.boughtFor } });
                return artWinningMe;
    
            } catch( e ) {
                console.log(e)
            }
        }
        return [];
    }

    if( articles.length == 0 && contract && signer ) {
        fetchArticles().then( art => {
            setArticles( art );
        });
    }

    return (
        <>
        <div>
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <h1> ARTICLES GAGNES </h1>
            </div>
            <div style={{ background: '#CBCBCB', width: '80%', margin: '0 auto', borderRadius: '10px', minHeight: '80vh', padding: '20px' }}>
                <Suspense fallback={<DutchsSkeleton />}>
                    <DutchWrapper data={articles} date={null} current={false} buy={()=>{}}/>
                </Suspense>
            </div>
        </div>
        </>
    );
}