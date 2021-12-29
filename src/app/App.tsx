import React from "react";
import "../index.css";
import { connect } from "../redux/blockchain/blockchainSlice";
import { fetchData } from "../redux/data/dataSlice";
import { useAppDispatch, useAppSelector } from "./hooks";

const App = () => {
  const blockchain = useAppSelector((state) => state.blockchain);
  const dispatch = useAppDispatch();

  console.log(blockchain);

  const handleFetchData = () => {
    if (blockchain.account !== null) {
      dispatch(fetchData(blockchain.account, blockchain));
    }
  };

  const handleMintNFT = (_account: string | null, _name: string) => {
    if (_account !== null && blockchain.pokeToken !== null) {
      blockchain.pokeToken.methods
        .createRandomPokemon(_name)
        .send({ from: _account, value: 1000000000000000000 })
        .once("error", () => {
          console.log("Error minting Pokemon NFT");
        }).then((receipt: string) => {
          console.log("Successfully minted NFT!")
          console.log(receipt);
        });
    }
  };

  return (
    <div className="App">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-center m-5">Hello web3</h1>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            dispatch(connect());
          }}
          className="border border-black w-1/6 self-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Connect wallet
        </button>
        <p className="text-center">Current address: {blockchain.account}</p>
        {blockchain.account && (
          <>
            <button type="button" onClick={handleFetchData} className="border border-black w-1/6 self-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Fetch data
            </button>
            <button type="button" onClick={() => handleMintNFT(blockchain.account, "Clumzy")} className="border border-black w-1/6 self-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Mint Pokemon NFT
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
