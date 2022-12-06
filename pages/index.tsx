import type { NextPage } from 'next'
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../azureAuth.config';
import { useEffect } from 'react';
import { callMsGraph } from '../azureGraph.config';
import { useIsAuthenticated } from '@azure/msal-react';
import { useRouter } from 'next/router';
import style from "../styles/login.module.scss"
import microsoftIcon from "../public/microsoft.png";
import Image from "next/image";

const Login: NextPage = () => {
  // the index page will be the login page
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();
  const handleLogin = () => {
    instance.loginRedirect(loginRequest)
      .catch(e => console.log(e));
  };
  const handleLogout = () => {
    instance.logoutRedirect({
        postLogoutRedirectUri: "/",
    });
  };

  const handleFetchGraph = async () => {
    const account = accounts[0];
    if (account === undefined) {
      console.log("Not logged in");
      return;
    }
    const response = instance.acquireTokenSilent({
      ...loginRequest,
      account
    });
    const accessToken = (await response).accessToken;
    const graphResponse = await callMsGraph(accessToken);
    console.log(graphResponse);
  }

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated]);

  return (
    <div className={style.container}>
      <div className={style.container_bg}></div>
      <div className={style.wrapper}>
        <h1>Project Showcase</h1>
        <h1>Login</h1>
        <div className={style.button_wrapper}>
          <button className={style.login} onClick={handleLogin}>
            <Image src={microsoftIcon} height={16} width={16}/>
            <code>     </code>Microsoft
          </button>
        </div>
        {/* <button onClick={handleLogout}>Logout</button> */}
        {/* <button onClick={handleFetchGraph}>Log User Data</button> */}
      </div>
    </div>
  )
}

export default Login;
