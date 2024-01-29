'use client';
import { useEffect, useState } from "react";
import { WinAuctions } from "../composants/winAuctions";
import { useMyContext } from "./context";
import { Auction } from "../composants/interfaces/Auction";

const Win = () => {
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
        allAuctions = allAuctions.map( (a:any) => <WinAuctions id={a.id} key={a.id}></WinAuctions>);
        setAuctions(allAuctions);
      })();
    }
  }, [] );

  return (
      <>
        <div>
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <h1> ARTICLES GAGNES </h1>
            </div>
            { auctions }
        </div>
      </>
  );
}

export default Win;