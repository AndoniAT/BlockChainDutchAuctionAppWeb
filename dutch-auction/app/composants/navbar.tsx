import Link from "next/link";
import Image from 'next/image'

interface NavBarProps {}

export function NavBar(props: NavBarProps) {

    const styles = {
        navBarElement: {
            margin: '0 50px'
        }
    };

    return (
      <div className="w-full h-20 sticky top-0" style={{background: '#7EC9EB'}}>
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <ul className="hidden md:flex gap-x-6 text-black">
              <div>
              <Image
                src="/images/ethernum.png"
                width={20}
                height={20}
                alt="Picture of the author"
                />
              </div>
              <li style={styles.navBarElement}>
                <Link href="/about">
                  <p>Encheres gagnés</p>
                </Link>
              </li>
              <li style={styles.navBarElement}>
                <Link href="/services">
                  <p>Encheres perdus</p>
                </Link>
              </li>
              <li style={styles.navBarElement}>
                <Link href="/contacts">
                  <p>Encheres en cours</p>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
}
  