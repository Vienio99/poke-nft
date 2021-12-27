import React from "react";
import "../index.css";
import { connect } from "../redux/blockchain/blockchainSlice";
import { useAppDispatch, useAppSelector } from "./hooks";

const App = () => {
  const blockchain = useAppSelector((state) => state.blockchain);
  const dispatch = useAppDispatch();

  console.log(blockchain);

  const handleConnect = () => {
    dispatch(connect());
  };

  return (
    <div className="App">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-center m-5">Hello web3</h1>
        <button type="button" onClick={handleConnect} className="border border-black w-1/6 self-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Connect wallet
        </button>
        <p className="text-center">Current address: {blockchain.account}</p>
      </div>
    </div>
  );
};

export default App;
