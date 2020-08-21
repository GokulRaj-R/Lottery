import Web3 from "web3";

let web3;
// const web3 = new Web3(window.web3.currentProvider);
if (window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false;
  web3 = new Web3(window.ethereum);
}
// Legacy DApp Browsers
else if (window.web3) {
  web3 = new Web3(window.web3.currentProvider);
}
// Non-DApp Browsers
else {
  alert("You have to install MetaMask !");
}

export default web3;
