import { IPublicClientApplication } from "@azure/msal-browser";
import { AccountInfo } from "@azure/msal-browser";
import { loginRequest } from "../azureAuth.config";
import { callMsGraph } from "../azureGraph.config";

export async function getCurrentUserId(instance: IPublicClientApplication, accounts: AccountInfo[]): Promise<string> {
    const account = accounts[0];
    if (account === undefined) {
      console.log("Not logged in");
      return "";
    }
    const response = instance.acquireTokenSilent({
      ...loginRequest,
      account
    });
    const accessToken = (await response).accessToken;
    const graphResponse = await callMsGraph(accessToken);
    return graphResponse.id as string;
}
