import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface BlockchainState {
  loading: boolean;
  account: string | null;
  pokeToken: string | null;
  web3: string | null;
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
    connectionRequest: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    connectionSuccess: (state, action: PayloadAction<object>) => {
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
        ...state,
        loading: false,
        errorMsg: action.payload,
      };
    },
  },
});

export const { connectionRequest, connectionSuccess, connectionFailed } = blockchainSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => {
//   return state.counter.value;
// };

export default blockchainSlice.reducer;
