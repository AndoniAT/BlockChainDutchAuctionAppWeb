"use client"
import { ethers } from "ethers";
import { useEffect, useState } from "react";  // Import useEffect for side effects in a functional component

interface AuctionProps {}

export function CurrentAuctions(props: AuctionProps) {
    const [ signer, setSigner ] = useState<ethers.providers.JsonRpcSigner | null>(null);
    const [ provider, setProvider ] = useState<ethers.providers.Web3Provider | null>(null);
    const [ balance, setBalance ] = useState<number | null>(null);

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
                console.log('signer!!', signer);
                console.log('prov', provider);
                
                provider.getBalance("0x2ea7A8307450d2C6E43001Bd289a9f1fD9fD853F").then( b => {
                    console.log('balance', b);
                }).catch( e => {
                    console.log('error', e);
                })

                // You can also use an ENS name for the contract address
                const daiAddress = "0x2ea7A8307450d2C6E43001Bd289a9f1fD9fD853F";

                // The ERC-20 Contract ABI, which is a common contract interface
                // for tokens (this is the Human-Readable ABI format)
                const daiAbi = [
                    "function getCurrentPrice() view returns (uint)",
                    "function placeBid(uint articleIndex) payable",
                    "function moveToNextArticle()",

                    // Some details about the token
                    "function name() view returns (string)",
                    "function symbol() view returns (string)",

                    // Get the account balance
                    "function balanceOf(address) view returns (uint)",

                    // Send some of your tokens to someone else
                    "function transfer(address to, uint amount)",

                    // An event triggered whenever anyone transfers to someone else
                    "event Transfer(address indexed from, address indexed to, uint amount)"
                ];

                // The Contract object
                const daiContract = new ethers.Contract(daiAddress, daiAbi, provider);
                
                // Fetch current price asynchronously
                const currentPrice = await daiContract.getCurrentPrice();
                console.log('Current Price:', ethers.utils.formatEther(currentPrice));
 
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
                console.log('Transaction confirmed:', receipt);

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
                    <h1> ENCHERES EN COµURS </h1>
                </div>
                <div style={{ background: '#CBCBCB', width: '80%', margin: '0 auto', borderRadius: '10px', minHeight: '80vh' }}>

                </div>
            </div>
        </>
    );
}
