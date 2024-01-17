"use client"
import { ethers } from "ethers";
import { useEffect, useState, Suspense } from "react";  // Import useEffect for side effects in a functional component
import { DutchsSkeleton } from '@/app/composants/skeletons';
import DutchWrapper from '@/app/composants/dutchs';

interface AuctionProps {}
interface Article {
    name:string,
    currentPrice:number,
    winningBidder:any,
    closed:boolean
}


// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Json ABI format)
const daiAbi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "articleIndex",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "bidder",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "BidPlaced",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "AUCTION_DURATION",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "PRICE_DECREMENT",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "RESERVE_PRICE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "STARTING_PRICE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "articles",
        "outputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "currentPrice",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "winningBidder",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "closed",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "auctionStartTime",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "auctioneer",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "currentArticleIndex",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getArticleNames",
        "outputs": [
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getArticles",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "currentPrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "winningBidder",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "closed",
                        "type": "bool"
                    }
                ],
                "internalType": "struct DutchAuction.Article[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCurrentPrice",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "moveToNextArticle",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "articleIndex",
                "type": "uint256"
            }
        ],
        "name": "placeBid",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
]

const address = "0x0210B2acA1FCE1d58B1eF33F42B097B7AC2fa0B0";
export function CurrentAuctions(props: AuctionProps) {
    const [ signer, setSigner ] = useState<ethers.providers.JsonRpcSigner | null>(null);
    const [ provider, setProvider ] = useState<ethers.providers.Web3Provider | null>(null);
    const [ balance, setBalance ] = useState<number | null>(null);
    const [ articles, setArticles ] = useState<Article[]>([]);

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
                /*console.log('signer!!', signer);
                console.log('prov', provider);
                
                provider.getBalance(address).then( b => {
                    console.log('balance', b);
                }).catch( e => {
                    console.log('error', e);
                })*/

                // You can also use an ENS name for the contract address
                const daiAddress = address;

                // The Contract object
                const daiContract = new ethers.Contract(daiAddress, daiAbi, signer);
                
                // Fetch current price asynchronously
                const currentPrice = await daiContract.getCurrentPrice();
                //console.log('Current Price:', ethers.utils.formatEther(currentPrice));
                //console.log('check articles', articles);

                if( articles.length == 0) {
                    const articlesTemp = await daiContract.callStatic.getArticles();
                    setArticles(articlesTemp);
                }
                /*

                // Example: Place bid asynchronously
                const articleIndex = 0;
                const bidAmount = ethers.utils.parseEther("1.5");

                // Utilisez le signer pour envoyer la transaction
                const signedTransaction = await signer.sendTransaction({
                    to: daiContract.address,
                    value: bidAmount,
                    data: daiContract.interface.encodeFunctionData('placeBid', [articleIndex]),
                });

                const receipt = await signedTransaction.wait();
                console.log('Transaction confirmed:', receipt);*/
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }
    useEffect(() => {
        fetchData();
    }, [ signer, provider ]);  // Empty dependency array ensures that useEffect runs only once on mount

    fetchData();

    return (
        <>
            <div>
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <h1> ENCHERES EN COURS </h1>
                </div>
                <div style={{ background: '#CBCBCB', width: '80%', margin: '0 auto', borderRadius: '10px', minHeight: '80vh', padding: '20px' }}>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Suspense fallback={<DutchsSkeleton />}>
                       <DutchWrapper data={articles}/>    
                    </Suspense>
                    </div>
                </div>
            </div>
        </>
    );
}
