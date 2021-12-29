import React, { useEffect, useState } from "react";
import "../index.css";
import { connect } from "../redux/blockchain/blockchainSlice";
import { fetchData } from "../redux/data/dataSlice";
import { useAppDispatch, useAppSelector } from "./hooks";

const App = () => {
  const blockchain = useAppSelector((state) => state.blockchain);
  const data = useAppSelector((state) => state.data);

  const dispatch = useAppDispatch();

  const [name, setName] = useState("");

  console.log(blockchain);

  useEffect(() => {
    if (blockchain.account !== null) {
      dispatch(fetchData(blockchain.account, blockchain));
    }
  }, [blockchain]);

  const handleMintNFT = (_account: string | null, _name: string) => {
    if (_account !== null && blockchain.pokeToken !== null) {
      blockchain.pokeToken.methods
        .createRandomPokemon(_name)
        .send({ from: _account, value: 1000000000000000000 })
        .once("error", () => {
          console.log("Error minting Pokemon NFT");
        })
        .then((receipt: string) => {
          console.log("Successfully minted NFT!");
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
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/6 self-center"
        >
          Connect wallet
        </button>
        <p className="text-center">Current address: {blockchain.account}</p>
        {blockchain.account && (
            <form className="bg-white rounded px-8 pt-6 pb-8 mb-4 self-center">
              <div className="mb-6 flex flex-col">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  <p className="text-center">Pokemon name</p>
                  <input onChange={(e) => setName(e.target.value)} className="shadow appearance-none border border-grey-500 rounded w-full self-center py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" />
                </label>
                <button type="button" onClick={() => handleMintNFT(blockchain.account, name)} className="self-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Mint Pokemon NFT
                </button>
              </div>
            </form>
        )}
        <div className="flex self-center">
          {data.allOwnerPokemons &&
            data.allOwnerPokemons.map((pokemon) => {
              return (
                <div className="flex flex-col m-2" key={pokemon.id}>
                  <p>ID: {pokemon.id}</p>
                  <p>DNA: {pokemon.dna}</p>
                  <p>Level: {pokemon.level}</p>
                  <p>Name: {pokemon.name}</p>
                  <p>Rarity: {pokemon.rarity}</p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default App;
