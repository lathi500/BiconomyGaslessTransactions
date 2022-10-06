import { useState } from 'react';
import { ethers } from 'ethers'
import Greeter from './config.json'
import { Biconomy } from "@biconomy/mexa";

const greeterAddress = "0xd58a7d2251d43cabb3bd40d1ba645fb834d6893c"

function App() {
  const [greeting, setGreetingValue] = useState()

  async function requestAccounts() {
    return await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  async function setGreeting() {
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await requestAccounts()
      const biconomy = new Biconomy(
        window.ethereum,
        {
          apiKey: "4czy_AuGG.7636710c-904d-45af-ae2c-37b67c32f310",
          debug: true,
          contractAddresses: [greeterAddress]
        }
      );
      const provider = await biconomy.provider;

      const contractInstance = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        biconomy.ethersProvider
      );
      await biconomy.init();

      const { data } = await contractInstance.populateTransaction.setGreeting(greeting)

      let txParams = {
        data: data,
        to: greeterAddress,
        from: accounts[0],
        signatureType: "EIP712_SIGN",
      };

      await provider.send("eth_sendTransaction", [txParams]);
    }
  }

  return (
    <div className="App">
      <div style={containerStyle}>
        <button style={buttonStyle} onClick={fetchGreeting}>Fetch Greeting</button>
        <button style={buttonStyle} onClick={setGreeting}>Set Greeting</button>
        <input style={inputStyle} onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />
      </div>
    </div>
  );
}

const containerStyle = {
  width: '900px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  paddingTop: 100
}

const inputStyle = {
  width: '100%',
  padding: '8px'

}

const buttonStyle = {
  width: '100%',
  marginBottom: 15,
  height: '30px',
}

export default App;