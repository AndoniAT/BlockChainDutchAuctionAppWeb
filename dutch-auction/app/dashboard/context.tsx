import { createContext, useContext, useState, ReactNode, SetStateAction, Dispatch } from 'react';
import { ethers } from "ethers";


interface MyContextProps {
    children: ReactNode;
}

interface MyContextValue {
    provider: ethers.providers.Web3Provider|null;
    setProvider: Dispatch<SetStateAction<ethers.providers.Web3Provider|null>>;
    signer: ethers.providers.JsonRpcSigner|null;
    setSigner: Dispatch<SetStateAction<ethers.providers.JsonRpcSigner|null>>;
    contract: ethers.Contract|null;
    setContract: Dispatch<SetStateAction<ethers.Contract|null>>;
}

const MyContext = createContext<MyContextValue | null>(null);

export function MyContextProvider({ children }: MyContextProps) {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider|null>(null);
  const [ signer, setSigner ] = useState<ethers.providers.JsonRpcSigner | null>(null);
  const [ contract, setContract ] = useState<ethers.Contract | null>(null);

  const contextValue: MyContextValue = {
    provider,
    setProvider,
    signer,
    setSigner,
    contract,
    setContract
  };

  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
}

export const useMyContext = () => {
    const contextValue = useContext(MyContext);
    if (!contextValue) {
      throw new Error('useMyContext must be used within a MyContextProvider');
    }
    return contextValue;
  };
