import vending from './Contract/vending.json';
import Web3 from 'web3';
import { useState } from 'react';

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(0);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.requestAccounts();
        setAccounts(accounts);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = vending.networks[networkId];
        const instance = new web3Instance.eth.Contract(
          vending.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContract(instance);

        const balance = await instance.methods.getVendingMachineBalance().call();
        setBalance(balance);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('Web3 not found');
    }
  };
      

  return (
    <div>
    <h1>Vending Machine App</h1>
    {web3 ? (
      <div>
        <p>Connected: {accounts[0]}</p>
        <p>Vending Machine Balance: {balance}</p>
        
      </div>
    ) : (
      <button onClick={connectWallet}>Connect Wallet</button>
    )}
  </div>
  )
}

export default App
