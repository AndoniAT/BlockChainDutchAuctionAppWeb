'use client';
import { NavBar } from '@/app/composants/navbar';
import { useState } from 'react';
import { MyContextProvider } from '@/app/dashboard/context';
import Now from '@/app/dashboard/now';
import ChooseContract from './chooseContract';
import Win from './win';
import Lost from './lost';

const Menu = () => {
  const [ active, setActive ] = useState<string>('choose');
  const handlerActive = ( act:string ) => setActive(act);

  return (
    <MyContextProvider>
      <NavBar setActiveSection={handlerActive} active={active} />
      { (active == "choose") ? <ChooseContract /> : <></>}
      { (active == "now") ? <Now/> : <></>}
      { (active == "win") ? <Win/> : <></>}
      { (active == "loose") ? <Lost/> : <></>}
    </MyContextProvider>
  )
}

export default Menu;