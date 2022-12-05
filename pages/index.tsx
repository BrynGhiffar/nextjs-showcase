import type { NextPage } from 'next'
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../azureAuth.config';
import { useEffect } from 'react';
import { callMsGraph } from '../azureGraph.config';
import { useIsAuthenticated } from '@azure/msal-react';
import { useRouter } from 'next/router';

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
    <div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleFetchGraph}>Log User Data</button>
    </div>
  )
}

export default Login;
