import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";

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
  name: "counter",
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
    connectionSuccess: (state, action: PayloadAction<{account: string, pokeToken: Contract, web3: Web3}>) => {
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

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => {
//   return state.counter.value;
// };

export default blockchainSlice.reducer;
