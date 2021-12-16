import React, { useEffect } from "react";
import "../index.css";
import { connect } from "../redux/blockchain/blockchainSlice";
import { useAppDispatch, useAppSelector } from "./hooks";

const App = () => {
  const blockchain = useAppSelector((state) => state.blockchain);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(connect());
  }, []);
  console.log(blockchain);

  return (
    <div className="App">
      <h1 className="text-3xl font-bold text-center">Hello web3</h1>
    </div>
  );
};

export default App;
