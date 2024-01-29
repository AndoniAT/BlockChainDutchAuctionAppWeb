'use client';
import { FormEvent, useState } from 'react';
import { ethers } from "ethers";
import daiAbi from '@/app/composants/abi';
import { useMyContext } from './context';

/**
 * Se connecter à Metamask depuis l'application
 * @param address : Address du contrat
 * @param setSigner : Fonction pour établir le signeur
 * @param setProvider : Fonction pour établir le fournisseur
 * @param setContract : Fonction pour établir le contrat
 * @param setTextcontract : Fonction pour etablir le réussite de la connection
 * @returns 
 */
const connectMetamask = async ( address:string, setSigner:Function, setProvider:Function, setContract:Function, setTextcontract:Function ) => {
    if (typeof window !== "undefined") {
      interface ExtendedWindow extends Window { ethereum?: any; }

      const extendedWindow = window as ExtendedWindow;
  
      if (extendedWindow.ethereum) {
          let provider = new ethers.providers.Web3Provider(extendedWindow.ethereum);
          await provider.send("eth_requestAccounts", []);
          setProvider(provider); 
          
          let signer = provider.getSigner();
          setSigner(signer);
          let contract = new ethers.Contract( address, daiAbi, signer );
          await setContract(contract);
          setTextcontract("Connecté au contrat");
      } else {
          console.error("MetaMask not detecté dans le navigateur.");
      }
  }
  
    return;
};

/**
 * Choisir un contract.
 * Fournir l'address du contrat dans l'input pour se connecter
 * @returns 
 */
const ChooseContract = () => {
    const { setProvider, setSigner, setContract } = useMyContext();
    const [ contractText, setTextcontract ] = useState<string>('');

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const formData = new FormData(event.currentTarget)
      let addressContract = formData.get('addressContract')?.toString();
      addressContract = addressContract ? addressContract : '';
      await connectMetamask( addressContract, setSigner, setProvider, setContract, setTextcontract );
    };
  
    return (
      <>
        <div style={{ width: 'fit-content', margin: '0 auto', minWidth: '70%' }}>
          <div style={{ width: '70%', padding: '20px', margin: '13% auto', border: '1px solid #9f9696', borderRadius: '10px' }}>
            <form onSubmit={onSubmit}>
              <div style={{ textAlign: 'center', display: 'inline-flex', flexDirection: 'column', justifyContent: 'center', width: '100%'}}>
                <p>Address du contrat dees enchères</p>
                <input type="text" name="addressContract" style={{ marginBottom: '20px'}}/>
                <button type="submit" style={{ padding: '10px', border: '1px solid black', borderRadius: '10px', background: '#7EC9EB'}}>
                  Se connecter
                </button>
                <p style={{color: "green"}}>{ contractText }</p>
              </div>
            </form>
          </div>
        </div>
      </>
    );
}

export default ChooseContract;