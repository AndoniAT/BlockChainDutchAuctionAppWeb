'use client';
import { CurrentAuctions } from '@/app/composants/currentAuctions';
import { Auction } from '../composants/interfaces/Auction';
import { useEffect, useState } from 'react';
import { useMyContext } from './context';

const Now = () => {
    const { contract, signer } = useMyContext();
    const [auctions, setAuctions] = useState<any[]>([]);
    
    useEffect(() => {
        if( auctions.length == 0 && contract ) {
          (async () => {
            let auctions = await contract.getAuctions();
            let me = await signer?.getAddress();
            let myAuctions = auctions.filter( (a:Auction) => a.auctioneer == me );
            let otherAuctions = auctions.filter( (a:Auction) => a.auctioneer != me );

            let allAuctions = [ ... otherAuctions, ...myAuctions ];
            console.log('check all', allAuctions.map( (a:any) => {
                return {
                    ... a,
                    id: a.id.toString()
                };
            }));
            allAuctions = allAuctions.map( (a:any) => <CurrentAuctions id={a.id} key={a.id}></CurrentAuctions>);

            setAuctions(allAuctions);
          })();
        }
    }, [] );

    return (
        <>
            <div>
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <h1> ENCHERES EN COURS </h1>
                </div>
                {auctions}
            </div>
        </>
    )
}

export default Now;
  