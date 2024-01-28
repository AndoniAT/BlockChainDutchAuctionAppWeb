'use client';
import { useEffect, useState } from "react";
import { LostAuctions } from "../composants/lostAuctions";
import { useMyContext } from "./context";

const Lost = () => {
  const { contract } = useMyContext();
  const [auctions, setAuctions] = useState<any[]>([]);

  useEffect(() => {
    if( auctions.length == 0 && contract ) {
      (async () => {
        let auctions = await contract.getAuctions();
        auctions = auctions.map( (a:any) => <LostAuctions id={a.id} key={a.id}></LostAuctions>);
        setAuctions(auctions);
      })();
    }
  }, [] );

  return (
    <>
        <div>
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <h1> ARTICLES PERDUS </h1>
            </div>
            { auctions }
        </div>
      </>
  );
}

export default Lost;
