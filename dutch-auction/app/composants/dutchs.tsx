import { ethers, BigNumber } from "ethers";

interface Article {
    id:BigNumber,
    name:string,
    currentPrice:number|BigNumber,
    winningBidder:any,
    closed:boolean
}

interface DutchWrapperProps {
    data: Article[],
    date: string|null,
    current: boolean
};

const DutchWrapper: React.FC<DutchWrapperProps> = ({ data, date, current }) => {
    let d = data.map( (d, idx) => ( <Card key={idx} title={d.name} value={(d.currentPrice)} date={date} current={current}/> ) );
    return (
      <>
        { d }
      </>
      );
}

export default DutchWrapper;


export function Card( { title, value, date, current } :  {  title:string,  value:number|BigNumber, date:string|null, current:boolean|null } ) {
  let val = (value instanceof BigNumber ) ? ethers.utils.formatEther( value ) : value;
  let style  = {
    background: current ? '' : '#838383'
  };

  let stylePrice  = {
    background: current ? '' : '#c9c9c9'
  };

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm" style={style}>
      <div className="flex p-4">
        <h3 className="ml-2 text-sm font-medium">{title} - {date} {current ? '( en cours )' : ''}</h3>
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
