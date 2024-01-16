import { ethers } from "ethers";
import { NavBar } from '../composants/navbar';
import { CurrentAuctions } from '../composants/currentAuctions';

export default function Page() {
  return (
    <>
      <NavBar />
      <div style={{ background: '#EAEAEA', height: '100vh', }}>
          <CurrentAuctions/>
      </div>
    </>
  );
}
