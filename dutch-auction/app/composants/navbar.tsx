import Link from "next/link";
import Image from 'next/image'

interface NavBarProps {
  setActiveSection: Function;
}


export function NavBar({setActiveSection}: NavBarProps) {

    const styles = {
        navBarElement: {
            margin: '0 50px',
            cursor: 'pointer'
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
              <li style={styles.navBarElement} onClick={() => {setActiveSection("win");}}>
                  <p>Encheres gagnés</p>
              </li>
              <li style={styles.navBarElement} onClick={() => {setActiveSection("loose");}}>
                  <p>Encheres perdus</p>
              </li>
              <li style={styles.navBarElement} onClick={() => {setActiveSection("now");}}>
                  <p>Encheres en cours</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
}
  