import navbarStyle from "./navbar.module.scss";
import Image from "next/image";
import logo from "../public/binus-logo.png";
import Link from "next/link";

export default function Navbar() {
    return (<>
        <div className={navbarStyle.container}>
            <div className={navbarStyle.title}>
                <Image src={logo} alt="binus logo" height="50" width="81.3" className={navbarStyle.logo}/>
            </div>
            <div className={navbarStyle.options_container}>
                <div className={navbarStyle.options}>
                    <Link href="/">
                        Home
                    </Link>
                </div>
                <div className={navbarStyle.options}>
                    <Link href="/profile">
                        Profile
                    </Link>
                </div>
            </div>
        </div>
    </>)
}