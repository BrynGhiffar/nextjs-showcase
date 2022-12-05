import navbarStyle from "./navbar.module.scss";
import Image from "next/image";
import logo from "../public/binus-logo.png";
import Link from "next/link";
import Head from 'next/head';
import { useEffect } from "react";
import { useMsal } from '@azure/msal-react';
import { useIsAuthenticated } from '@azure/msal-react';
import { useRouter } from "next/router";
import { useRef } from "react";

export type NavbarProps = {
    isAuthenticated: boolean
};

export default function Navbar(navbarProps: NavbarProps) {

    const { instance, accounts } = useMsal();
    const router = useRouter();
    const account = accounts[0];

    // logout handler
    const handleLogout = (() => {
        instance.logoutRedirect({
            postLogoutRedirectUri: "/",
        });
    });

    useEffect(() => {
        if (account === undefined) {
            router.push("/");
        }
    })

    return (<>
      <Head>
        <title>Showcase Application</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div className={navbarStyle.container}>
            <div className={navbarStyle.title}>
                <Image src={logo} alt="binus logo" height="50" width="81.3" className={navbarStyle.logo}/>
            </div>
            <div className={navbarStyle.options_container}>
                <div className={navbarStyle.options}>
                    <Link href="/home">
                        Home
                    </Link>
                </div>
                <div className={navbarStyle.options}>
                    <Link href="/profile">
                        Profile
                    </Link>
                </div>
                <div className={navbarStyle.options} onClick={handleLogout}>
                    Logout
                </div>
            </div>
        </div>
    </>)
}