import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import PokeToken from "../../contracts/PokeToken.json";
import { AppDispatch } from "../store";

// Define a type for the slice state
interface BlockchainState {
  loading: boolean;
  account: string | null;
  pokeToken: Contract | null;
  web3: Web3 | null;
  errorMsg: string;
}

// Define the initial state using that type
const initialState: BlockchainState = {
  loading: false,
  account: null,
  pokeToken: null,
  web3: null,
  errorMsg: "",
};

export const blockchainSlice = createSlice({
  name: "blockchain",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    connectionRequest: () => {
      return {
        ...initialState,
        loading: true,
      };
    },
    connectionSuccess: (state, action: PayloadAction<{ account: string; pokeToken: Contract; web3: Web3 }>) => {
      return {
        ...state,
        loading: false,
        account: action.payload.account,
        pokeToken: action.payload.pokeToken,
        web3: action.payload.web3,
      };
    },
    connectionFailed: (state, action: PayloadAction<string>) => {
      return {
        ...initialState,
        loading: false,
        errorMsg: action.payload,
      };
    },
    updateAccount: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        account: action.payload,
      };
    },
  },
});

export const { connectionRequest, connectionSuccess, connectionFailed, updateAccount } = blockchainSlice.actions;

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    ethereum: any;
  }
}

export const connect = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(connectionRequest());
    if (window.ethereum) {
      const web3: Web3 = new Web3(window.ethereum);
      // TO-DO: check if user is already connected
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      try {
        const accounts: Array<string> = await window.ethereum.request({
          method: "eth_accounts",
        });
        console.log(`Account ${accounts[0]}`);
        const networkId: keyof typeof PokeToken.networks = await window.ethereum.request({
          method: "net_version",
        });
        // This network id is wrong
        console.log(networkId);
        // TO-DO: change string to network ID
        const pokeTokenNetworkData = await PokeToken.networks["1639484887177"];
        if (networkId) {
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
        console.log(error);
        dispatch(connectionFailed("Something went wrong."));
      }
    } else {
      dispatch(connectionFailed("Install Metamask."));
    }
  }
};

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => {
//   return state.counter.value;
// };

export default blockchainSlice.reducer;
