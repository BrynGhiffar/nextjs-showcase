import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from '../azureAuth.config';
import { PublicClientApplication } from '@azure/msal-browser';

const msalInstance = new PublicClientApplication(msalConfig);

function MyApp({ Component, pageProps }: AppProps) {
  return ( 
    <MsalProvider instance={msalInstance}>
      <Component {...pageProps} /> 
    </MsalProvider>
  )
}

export default MyApp
