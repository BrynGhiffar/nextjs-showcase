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
import { LinearProgress } from "@mui/material";

export type NavbarProps = {
    isLoading: boolean
};

export default function Navbar({ isLoading }: NavbarProps) {

    const { instance, accounts } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const router = useRouter();
    const account = accounts[0];

    // logout handler
    const handleLogout = (() => {
        instance.logoutRedirect({
            postLogoutRedirectUri: "/",
        });
    });

    const handleLogin = ( () => {
        router.push("/login")
    })

    return (<>
      <div className={navbarStyle.outer_container}>
        <div className={navbarStyle.container}>
            <div className={navbarStyle.title}>
                <Link href="/">
                    <Image src={logo} alt="binus logo" height="50" width="81.3" className={navbarStyle.logo}/>
                </Link>
            </div>
            <div className={navbarStyle.options_container}>
                <div className={navbarStyle.options}>
                    <Link href="/">
                        Home
                    </Link>
                </div>
                {isAuthenticated ? <div className={navbarStyle.options}>
                 <Link href="/profile">
                        Profile
                    </Link>
                </div> : <div></div>}
                {isAuthenticated ? <div className={navbarStyle.options}>
                <Link href="/poster/create">
                       Create Project
                </Link>
                </div> : <div></div>}
                <div className={navbarStyle.options} onClick={isAuthenticated ? handleLogout : handleLogin}>
                    {isAuthenticated ? <div> Logout </div> : <div> Login </div>}
                </div>
            </div>
        </div>
        {isLoading ? <LinearProgress/> : ""}
      </div>
    </>)
}