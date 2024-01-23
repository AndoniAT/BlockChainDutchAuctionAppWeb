import { ethers, BigNumber } from "ethers";
import { useState } from "react";
import { MyContextProvider, useMyContext } from '@/app/dashboard/context';

interface Article {
    id:BigNumber,
    name:string,
    currentPrice:number|BigNumber,
    winningBidder:any,
    closed:boolean,
    boughtFor:number|BigNumber
}

interface DutchWrapperProps {
    data: Article[],
    date: string|null,
    current: boolean,
    buy:Function
};

const DutchWrapper: React.FC<DutchWrapperProps> = ({ data, date, current, buy }) => {
    let d = data.map( (d, idx) => ( <Card key={idx} title={d.name} value={(d.currentPrice)} date={date} current={current} buy={buy}/> ) );
    return (
      <>
        { d }
      </>
      );
}

export default DutchWrapper;


export function Card( { title, value, date, current, buy } :  {  title:string,  value:number|BigNumber, date:string|null, current:boolean|null, buy:Function } ) {
  const { signer, contract } = useMyContext();
  const [ valueOffer, setValueOffer ] = useState<number>(0);
  const [ errMsg, setErrMsg ] = useState<string|null>(null);

  let val = (value instanceof BigNumber ) ? ethers.utils.formatEther( value ) : value;
  let style  = {
    background: current ? '' : '#838383',
    marginBottom: '10px'
  };

  let stylePrice  = {
    background: current ? '' : '#c9c9c9'
  };

  const handleChangeOffer = ( e:any ) => {
    const value = e.target.value ? parseFloat(e.target.value) : 0;
    setValueOffer(value);
  }

  const placeOfferHandle = () => {
    console.log('place');
    buy( valueOffer, setErrMsg );
  }

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm" style={style}>
      <div className="flex p-4" style={{justifyContent: 'space-between'}}>
        <h3 className="ml-2 text-sm font-medium">{title} - {date} {current ? '( en cours )' : ''}</h3>
        { (current) ?
            <div>
              <div style={{textAlign: 'end'}}>
                <input type="number" step="0.1" min="0.2" style={{background:'white', border:'1px solid black', borderRadius: '10px', marginRight:'5px'}} onChange={handleChangeOffer}/>
                <button type="button" style={{ padding: '10px 10px', background:'#2fab418a', borderRadius: '10px', cursor: 'pointer'}} onClick={placeOfferHandle} > Placer une offre </button>
              </div>
              { 
                ( errMsg ) ?
                <p style={{color: 'red', fontSize: '0.7rem'}}>{errMsg}</p>
                :
                <></>
              }
            </div>
          :
          <></>
        }
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
