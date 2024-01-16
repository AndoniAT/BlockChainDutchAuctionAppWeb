"use client"
import { ethers } from "ethers";
import { useEffect } from "react";  // Import useEffect for side effects in a functional component

interface AuctionProps {}

export function CurrentAuctions(props: AuctionProps) {
    useEffect(() => {
        async function connectToEthereum() {
            // Check if running in a browser environment
            if (typeof window !== "undefined") {
                // Connecting to Ethereum: MetaMask
                interface ExtendedWindow extends Window {
                    ethereum?: any;
                }

                const extendedWindow = window as ExtendedWindow;

                if (extendedWindow.ethereum) {
                    const provider = new ethers.providers.Web3Provider(extendedWindow.ethereum);
                    await provider.send("eth_requestAccounts", []);
                    const signer = provider.getSigner();

                    // You can use signer or provider as needed
                } else {
                    console.error("MetaMask not detected.");
                }
            }
        }

        connectToEthereum();
    }, []);  // Empty dependency array ensures that useEffect runs only once on mount

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
