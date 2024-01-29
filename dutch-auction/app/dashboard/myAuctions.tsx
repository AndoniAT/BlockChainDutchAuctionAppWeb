'use client';
import { CurrentAuctions } from '@/app/composants/currentAuctions';
import { Auction } from '../composants/interfaces/Auction';
import { useEffect, useState } from 'react';
import { useMyContext } from './context';
import { OwnAuctions } from '../composants/ownAuctions';

const MyAuctions = () => {
    const { contract, signer } = useMyContext();
    const [auctions, setAuctions] = useState<any[]>([]);
    
    useEffect(() => {
        if( auctions.length == 0 && contract && signer ) {
          (async () => {
            let addressSigner = await signer.getAddress();
            let myAuctions = await contract.getAuctionsFor( addressSigner );
            myAuctions = myAuctions.map( (a:any) => <OwnAuctions id={a.id} key={a.id}></OwnAuctions>);
            setAuctions(myAuctions);
          })();
        }
    }, [] );

    return (
        <>
            <div>
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <h1> MES ENCHERES </h1>
                </div>
                {auctions}
            </div>
        </>
    )
}

export default MyAuctions;
  