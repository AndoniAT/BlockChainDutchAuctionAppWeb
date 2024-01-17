import { ethers } from "ethers";

interface Article {
    name:string,
    currentPrice:number,
    winningBidder:any,
    closed:boolean
}

interface DutchWrapperProps {
    data: Article[];
  }

const DutchWrapper: React.FC<DutchWrapperProps> = ({ data }) => {
    console.log('data', data);
    return (
        <>
          {/* NOTE: comment in this code when you get to this point in the course */}
          {
            data.map( d => <Card title={d.name} value={ethers.utils.formatEther(d.currentPrice)} type="collected" /> )
          }
        </>
      );
}

export default DutchWrapper;


export function Card( { 
        title, 
        value,
        type
    } : 
    { 
        title:string,
        value:number|string,
        type:string
    }) 
    {
  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value} eth
      </p>
    </div>
  );
}
