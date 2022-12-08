import { IPublicClientApplication, AccountInfo } from '@azure/msal-browser';
import { callMsGraph } from "../azureGraph.config";
import { loginRequest } from "../azureAuth.config";

type AzureUserData = {
    providerId: string, 
    username: string,
    useremail: string
}

export async function getCurrentUser(instance: IPublicClientApplication, accounts: AccountInfo[]): Promise<AzureUserData|null> {
    const account = accounts[0];
    if (account === undefined) {
      console.log("Not logged in");
      return null;
    }
    const response = instance.acquireTokenSilent({
      ...loginRequest,
      account
    });
    const accessToken = (await response).accessToken;
    const graphResponse = await callMsGraph(accessToken);
    const userData : AzureUserData = {
        providerId: graphResponse.id,
        username: graphResponse.displayName,
        useremail: graphResponse.mail
    }
    return userData;
}

