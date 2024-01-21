'use client';
import { NavBar } from '@/app/composants/navbar';
import { FormEvent, useState, createContext, useContext, useEffect } from 'react';
import { ethers, BigNumber } from "ethers";
import daiAbi from '@/app/composants/abi';
import { MyContextProvider, useMyContext } from '@/app/dashboard/context';
import Now from '@/app/dashboard/now';
import ChooseContract from './chooseContract';

const Menu = () => {
  const [ active, setActive ] = useState<string>('choose');

  const handlerActive = ( act:string ) => {
    setActive(act);
  }

  useEffect(() => {
  }, [active])

  return (
    <MyContextProvider>
      <NavBar setActiveSection={handlerActive} />
      { (active == "choose") ? <ChooseContract /> : <></>}
      { (active == "now") ? <Now/> : <></>}
    </MyContextProvider>
  )
}

export default Menu;