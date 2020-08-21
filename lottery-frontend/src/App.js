import React, { useState, useEffect } from "react";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

function App() {
  const [message, setMessage] = useState("");
  const [contract, setContract] = useState({
    manager: "",
    balance: "",
    players: [],
    value: "",
  });

  useEffect(() => {
    const getManager = async () => {
      const manager = await lottery.methods.manager().call();
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);
      setContract((prev) => {
        return { ...prev, manager, players, balance };
      });
    };
    getManager();
  }, [message]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("Your transaction is being processed!!!");
    const accounts = await web3.eth.getAccounts();
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(contract.value, "ether"),
    });
    setContract((prev) => {
      return { ...prev, value: "" };
    });
    setMessage("You have been entered successfully!!!");
  };

  const onClick = async (e) => {
    setMessage("Your transaction is being processed!!!");
    const accounts = await web3.eth.getAccounts();
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    setMessage("A winner has been picked");
  };

  if (!contract.manager) return <div>Loading...</div>;
  return (
    <div>
      <h2>Lottery Contract</h2>
      <p> This contract is managed by {contract.manager}. </p>
      <p>
        There are currently {contract.players.length} people entered, competing
        to win {web3.utils.fromWei(contract.balance, "ether")} ether!.
      </p>
      <hr />
      <h4>Try your Luck</h4>
      <form onSubmit={onSubmit}>
        <div>
          <label>Amount of ether to enter </label>
          <input
            value={contract.value}
            onChange={(e) => {
              e.persist();
              setContract((prev) => {
                console.log(contract.value);
                return { ...prev, value: e.target.value };
              });
            }}
          ></input>
        </div>
        <button>Enter</button>
      </form>
      <hr />
      <button onClick={onClick}>PickWinner</button>
      <hr />
      <h1>{message}</h1>
    </div>
  );
}

export default App;
