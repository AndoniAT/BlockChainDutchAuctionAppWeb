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
    date: string|null
};

const DutchWrapper: React.FC<DutchWrapperProps> = ({ data, date }) => {
    let d = data.map( (d, idx) => ( <Card key={idx} title={d.name} value={(d.currentPrice)} date={date}/> ) );
    return (
      <>
        { d }
      </>
      );
}

export default DutchWrapper;


export function Card( { title, value, date } :  {  title:string,  value:number|BigNumber, date:string|null } ) {
  let val = (value instanceof BigNumber ) ? ethers.utils.formatEther( value ) : value;
  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        <h3 className="ml-2 text-sm font-medium">{title} - {date}</h3>
      </div>
      <p
        className={`truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        { val } eth
      </p>
    </div>
  );
}
