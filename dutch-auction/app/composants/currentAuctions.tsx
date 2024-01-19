"use client"
import { ethers, BigNumber } from "ethers";
import { useEffect, useState, Suspense } from "react";  // Import useEffect for side effects in a functional component
import { DutchsSkeleton } from '@/app/composants/skeletons';
import DutchWrapper from '@/app/composants/dutchs';
import daiAbi from '@/app/composants/abi';

interface AuctionProps {}
interface Article {
    id:BigNumber,
    name:string,
    currentPrice:number|BigNumber,
    winningBidder:any,
    closed:boolean
}

const address = "0xa33bD5E06A1d0F0E52597e0400bD44EeC77dBdc5";
// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Json ABI format)
const getCurrentPrice = async( contract: ethers.Contract | null, setTimeElapsed:Function) => {
    if( contract ) {
        const startTime = await contract.getStartTime();
        const now = Math.floor(new Date().getTime() / 1000);

        const elapsedTime = now - startTime;
        

        setTimeElapsed(humanReadableSeconds(elapsedTime));
        
        const interval = await contract.INTERVAL();
        const decrements = Math.floor(elapsedTime / interval);

        const startingPrice = await contract.STARTING_PRICE();
        const priceDec = await contract.PRICE_DECREMENT();
        const currentPrice = startingPrice - (priceDec * decrements);
        const reservePrice = await contract.RESERVE_PRICE();
        let res = Math.max(currentPrice, reservePrice) / (10 ** 18);
        return res;
    } else {
        return 0;
    }
}

function humanReadableSeconds ( seconds:number ) {
    let sec = seconds % 60;

    let totMin = parseInt( String(seconds / 60) );
    let hour = parseInt( String(totMin / 60) );
    let min = totMin % 60;
    let parseTime = ( val:any ) => `${ (val <= 9 ) ? '0' : ''}${val}`
    
    return `${parseTime(hour)}:${parseTime(min)}:${parseTime( sec )}`;
  }

const fetchPrice = async ( setCuerrentArticle:Function, daiContract:ethers.Contract | null,  setTimeElapsed:Function ) => {
    if( daiContract ) {
        let price = await getCurrentPrice( daiContract, setTimeElapsed );
        const articleTemp = await daiContract.callStatic.getCurrentArticle();
        setCuerrentArticle( {
            ... articleTemp,
            currentPrice: price
        } );
    }
}


export function CurrentAuctions(props: AuctionProps) {
    const [ timeElapsed, setTimeElapsed] = useState<string|null>(null);
    const [ signer, setSigner ] = useState<ethers.providers.JsonRpcSigner | null>(null);
    const [ provider, setProvider ] = useState<ethers.providers.Web3Provider | null>(null);
    const [ balance, setBalance ] = useState<number | null>(null);
    const [ articles, setArticles ] = useState<Article[]>([]);
    const [ currentArticle, setCuerrentArticle ] = useState<Article | null>(null);
    const [ daiContract, setContract ] = useState<ethers.Contract | null>(null);

    async function connectToEthereum() {
        // Check if running in a browser environment
        if (typeof window !== "undefined") {
            // Connecting to Ethereum: MetaMask
            interface ExtendedWindow extends Window {
                ethereum?: any;
            }

            const extendedWindow = window as ExtendedWindow;

            if (extendedWindow.ethereum) {
                const $provider = new ethers.providers.Web3Provider(extendedWindow.ethereum);
                await $provider.send("eth_requestAccounts", []);
                setProvider( $provider );

                const $signer = $provider.getSigner();
                setSigner($signer);
            } else {
                console.error("MetaMask not detected.");
            }
        }
    }

    const fetchData = async () => {
        try {
            if( !signer || !provider ) {
                connectToEthereum();
            } else {

                const daiAddress = address;

                if ( daiContract ) {
                    if( articles.length == 0 ) {
                        const articlesTemp = await daiContract.callStatic.getArticles();
                        setArticles(articlesTemp);
                    }

                    const articleTemp = await daiContract.callStatic.getCurrentArticle();
                    //console.log(articleTemp.currentPrice);

                    if( currentArticle && articles.length > 0 ) {
                        const articlesTemp = articles.filter( ( a:Article ) => a.id.toNumber() != currentArticle.id.toNumber() )
                        setArticles( articlesTemp );
                    }
                } else {
                    const daiContractTemp = new ethers.Contract(daiAddress, daiAbi, signer);console.log('set contrat');
                    setContract( daiContractTemp );
                }
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        if( address ) {
            fetchData();
        }
    }, [signer, provider, articles, currentArticle, daiContract]);

    useEffect(() => {
        if( address ) {
            const intervalId = setInterval(() => {
                fetchPrice( setCuerrentArticle, daiContract, setTimeElapsed );
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [ currentArticle ])
    
    if( !currentArticle && address ) {
        fetchPrice( setCuerrentArticle, daiContract, setTimeElapsed );
    }

    let time = getCurrentTime();
    return (
        <>
            <div>
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <h1> ENCHERES EN COURS </h1>
                </div>
                <div style={{ background: '#CBCBCB', width: '80%', margin: '0 auto', borderRadius: '10px', minHeight: '80vh', padding: '20px' }}>
                    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-1" style={{marginBottom: '10px'}}>
                        <Suspense fallback={<DutchsSkeleton />}>
                            <DutchWrapper data={( currentArticle ) ? [currentArticle] : []} date={timeElapsed}/>    
                        </Suspense>
                        </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Suspense fallback={<DutchsSkeleton />}>
                       <DutchWrapper data={articles} date={null}/>    
                    </Suspense>
                    </div>
                </div>
            </div>
        </>                
    );
}

function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}