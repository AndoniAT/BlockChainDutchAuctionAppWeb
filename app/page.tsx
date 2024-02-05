'use client';
import { NavBar } from '@/app/composants/navbar';
import { useState } from 'react';
import { MyContextProvider } from '@/app/context';
import Now from '@/app/now';
import ChooseContract from './chooseContract';
import Win from './win';
import Lost from './lost';
import Create from './create';
import MyAuctions from './myAuctions';

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
      { (active == "create") ? <Create/> : <></>}
      { (active == "myAuctions") ? <MyAuctions/> : <></>}
    </MyContextProvider>
  )
}

export default Menu;