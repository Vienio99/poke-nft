import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BlockchainState } from "../blockchain/blockchainSlice";
import { AppDispatch } from "../store";
// import Web3 from "web3";
// import { Contract } from "web3-eth-contract";
// import { AbiItem } from "web3-utils";
// import PokeToken from "../../contracts/PokeToken.json";

// Define a type for the slice state
interface DataState {
  loading: boolean;
  allPokemons: Array<any> | null;
  allOwnerPokemons: Array<any> | null;
  errorMsg: string;
}

// Define the initial state using that type
const initialState: DataState = {
  loading: false,
  allPokemons: [],
  allOwnerPokemons: [],
  errorMsg: "",
};

export const dataSlice = createSlice({
  name: "data",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    fetchDataRequest: () => {
      return {
        ...initialState,
        loading: true,
      };
    },
    fetchDataSuccess: (state, action: PayloadAction<{ allPokemons: Array<any>; allOwnerPokemons: Array<any> }>) => {
      return {
        ...state,
        loading: false,
        allPokemons: action.payload.allPokemons,
        allOwnerPokemons: action.payload.allOwnerPokemons,
      };
    },
    fetchDataFailed: (state, action: PayloadAction<string>) => {
      return {
        ...initialState,
        loading: false,
        errorMsg: action.payload,
      };
    },
  },
});

export const { fetchDataRequest, fetchDataSuccess, fetchDataFailed } = dataSlice.actions;

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    ethereum: any;
  }
}

// TO-DO: change passing blockchain to function to store.getState()
// TO-DO: maybe move it to the App itself?
export const fetchData = (account: string, blockchain: BlockchainState) => {
  return async (dispatch: AppDispatch) => {
    dispatch(fetchDataRequest());
    try {
      const pokeContract = await blockchain.pokeToken;
      // Null check if by any accident the contract didn't load
      if (pokeContract == null) {
        console.log("whatever");
      } else {
        const allPokemons: Array<any> = await pokeContract.methods.getPokemons().call();
        const allOwnerPokemons: Array<any> = await pokeContract.methods.getOwnerPokemons(account).call();
        console.log(allPokemons);
        console.log(allOwnerPokemons);
        dispatch(fetchDataSuccess({ allPokemons, allOwnerPokemons }));
      }
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("error"));
    }
  };
};

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => {
//   return state.counter.value;
// };

export default dataSlice.reducer;
