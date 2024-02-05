import { ethers, BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { MyContextProvider, useMyContext } from '@/app/context';

interface Article {
    id:BigNumber,
    name:string,
    currentPrice:number|BigNumber,
    winningBidder:any,
    closed:boolean,
    boughtFor:number|BigNumber,
    bought:number|BigNumber|null
}

interface DutchWrapperProps {
    data: Article[],
    date: string|null,
    current: boolean,
    closed:boolean|undefined,
    auctionId:number|BigNumber
};

const OwnDutchWrapper: React.FC<DutchWrapperProps> = ({ data, date, current, closed, auctionId }) => {
    const { contract, provider, signer } = useMyContext();
    const [ currentArticleId, setCurrentArticleId ] = useState<BigNumber|null>(null);

    useEffect(() => {
        (async () => {
            try {
                let auction = await contract?.callStatic.getAuction( auctionId );

                if( auction.currentArticleIndex.toNumber() < auction.articles.length ) {
                  const articleTemp = await contract?.callStatic.getCurrentArticle( auctionId );
                  setCurrentArticleId(articleTemp.id);
                }
            } catch(e) {
                console.log(e);
            }
        })();
    }

    )
    let d = data.length > 0 ? data.map( (d, idx) => {
        let date_data = null;
        if( !closed ) {
            if( currentArticleId && d.id.eq(currentArticleId) ) {
                date_data = date;
            }
        }
        return  ( 
                <Card key={idx} title={d.name} value={(d.currentPrice)} date={date_data} current={current} closed={d.closed}/> 
        ) 
    })  : [];

    return (
      <>
        { d }
      </>
      );
}

export default OwnDutchWrapper;


function Card( { title, value, date, current, closed } :  {  title:string,  value:number|BigNumber, date:string|null, current:boolean|null, closed:boolean } ) {

  let val = (value instanceof BigNumber ) ? ethers.utils.formatEther( value ) : value;
  let style  = {
    background: current ? '' : '#838383',
    marginBottom: '10px'
  };

  let stylePrice  = {
    background: current ? '' : '#c9c9c9'
  };

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm" style={style}>
      <div className="flex p-4" style={{justifyContent: 'space-between'}}>
        <h3 className="ml-2 text-sm font-medium">{title} - {date} {current ? '( en cours )' : ''} { ( closed  ) ? '( Fermé )' : '( Ouvert )' }</h3>
      </div>
      <p
        className={`truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
        style={stylePrice}
      >
        { val } eth
      </p>
    </div>
  );
}
