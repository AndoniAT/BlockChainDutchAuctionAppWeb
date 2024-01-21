'use client';
import { FormEvent } from 'react';
import { ethers } from "ethers";
import daiAbi from '@/app/composants/abi';
import { MyContextProvider, useMyContext } from '@/app/dashboard/context';

const connectMetamask = async ( address:string, setSigner:Function, setProvider:Function, setContract:Function ) => {
    if (typeof window !== "undefined") {
      // Connecting to Ethereum: MetaMask
      interface ExtendedWindow extends Window {
          ethereum?: any;
      }
  
      const extendedWindow = window as ExtendedWindow;
  
      if (extendedWindow.ethereum) {
          let provider = new ethers.providers.Web3Provider(extendedWindow.ethereum);
          await provider.send("eth_requestAccounts", []);
          setProvider(provider); 
          
          let signer = provider.getSigner();
          setSigner(signer);
          let contract = new ethers.Contract( address, daiAbi, signer );
          console.log('contract', contract);
          setContract(contract);
      } else {
          console.error("MetaMask not detected.");
      }
  }
  
    return;
};

const ChooseContract = () => {
    const { 
      provider, setProvider,
      signer, setSigner,
      contract, setContract
    } = useMyContext();
  
    async function onSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const formData = new FormData(event.currentTarget)
      let addressContract = formData.get('addressContract')?.toString();
      addressContract = addressContract ? addressContract : '';
      await connectMetamask( addressContract, setSigner, setProvider, setContract );
      console.log('connected');
    };
  
    return (
      <>
        <div style={{ width: 'fit-content', margin: '0 auto', minWidth: '70%' }}>
          <div style={{ width: '70%', padding: '20px', margin: '13% auto', border: '1px solid #9f9696', borderRadius: '10px' }}>
            <form onSubmit={onSubmit}>
              <div style={{ textAlign: 'center', display: 'inline-flex', flexDirection: 'column', justifyContent: 'center', width: '100%'}}>
                <p>Address du contrat de l'enchere</p>
                <input type="text" name="addressContract" style={{ marginBottom: '20px'}}/>
                <button type="submit" style={{ padding: '10px', border: '1px solid black', borderRadius: '10px', background: '#7EC9EB'}}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
}

export default ChooseContract;