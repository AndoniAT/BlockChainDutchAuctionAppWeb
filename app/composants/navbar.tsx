import Link from "next/link";
import Image from 'next/image'
import { useMyContext } from "../dashboard/context";

interface NavBarProps {
  setActiveSection: Function,
  active:string
}

export function NavBar({setActiveSection, active}: NavBarProps) {
  const { contract } = useMyContext();
  const selectedColor = '#69accf';

    const styles = {
        navBarElement: {
            margin: '0 50px',
            cursor: 'pointer',
            padding: '10px',
            borderRadius: '10px'
        },
        win : {
          background: (active == 'win') ? selectedColor : ''
        },
        now : {
          background: (active == 'now') ? selectedColor : ''
        },
        loose : {
          background: (active == 'loose') ? selectedColor : ''
        },
        create : {
          background: (active == 'create') ? selectedColor : ''
        },
        myAuctions : {
          background: (active == 'myAuctions') ? selectedColor : ''
        }
    };
    return (
      <div className="w-full h-20 sticky top-0" style={{background: '#7EC9EB'}}>
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <ul className="hidden md:flex gap-x-6 text-black">
              <div onClick={() => {setActiveSection("choose");}}>
              <Image
                src="/images/ethernum.png"
                width={20}
                height={20}
                alt="Picture of the author"
                />
              </div>
              { (contract) ? 
                ( 
                <>
                  <li style={{ ...styles.navBarElement, ...styles.win }} onClick={() => {setActiveSection("win");}}>
                      <p>Encheres gagnés</p>
                  </li>
                  <li style={{ ...styles.navBarElement, ...styles.loose }} onClick={() => {setActiveSection("loose");}}>
                      <p>Encheres perdus</p>
                  </li>
                  <li style={{ ...styles.navBarElement, ...styles.now }} onClick={() => {setActiveSection("now");}}>
                      <p>Encheres en cours</p>
                  </li>
                  <li style={{ ...styles.navBarElement, ...styles.create }} onClick={() => {setActiveSection("create");}}>
                      <p>Creer un Enchere</p>
                  </li>
                  <li style={{ ...styles.navBarElement, ...styles.myAuctions }} onClick={() => {setActiveSection("myAuctions");}}>
                      <p>Mes Encheres</p>
                  </li>
                </>
                ) : 
                <></>
               }
            </ul>
          </div>
        </div>
      </div>
    );
}
  