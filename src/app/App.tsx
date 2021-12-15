import React from "react";
import "../index.css";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { useAppDispatch } from "./hooks";
import { connectionRequest, connectionSuccess, updateAccount, connectionFailed } from "../redux/blockchain/blockchainSlice";
import PokeToken from "../contracts/PokeToken.json";

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    ethereum: any;
  }
}

export const connect = async () => {
  const dispatch = useAppDispatch();
  dispatch(connectionRequest());
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      const accounts: Array<string> = await window.ethereum.request({
        method: "eth_accounts",
      });
      const networkId: string = await window.ethereum.request({
        method: "net_version",
      });
      const pokeTokenNetworkData = await PokeToken.networks[networkId];
      if (pokeTokenNetworkData) {
        const pokeToken = new web3.eth.Contract(PokeToken.abi as AbiItem[], pokeTokenNetworkData.address);
        dispatch(
          connectionSuccess({
            account: accounts[0],
            pokeToken,
            web3,
          })
        );
        window.ethereum.on("accountsChanged", (accounts: Array<string>) => {
          dispatch(updateAccount(accounts[0]));
        });
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });
      } else {
        dispatch(connectionFailed("Change network to Polygon."));
      }
    } catch (error) {
      dispatch(connectionFailed("Something went wrong."));
    }
  } else {
    dispatch(connectionFailed("Install Metamask."));
  }
};

const App = () => {
  return (
    <div className="App">
      <h1 className="text-3xl font-bold text-center">Hello web3</h1>
    </div>
  );
};

export default App;
