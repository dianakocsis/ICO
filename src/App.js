import './App.css';
import { ethers } from 'ethers'
import SpaceCoin from './artifacts/contracts/SpaceCoin.sol/SpaceCoin.json'
import ICO from './artifacts/contracts/ICO.sol/ICO.json'

const spaceCoinAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const icoAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'

function App() {

  async function requestAccount() {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } 
    catch (err) {
      console.log("Error: ", err)
      alert("Login to Metamask first");
    }
  }

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(spaceCoinAddress, SpaceCoin.abi, provider)
      const balance = await contract.balanceOf(account) / (10 ** 18);
      const message = "Balance: " + balance;
      alert(message)
      console.log("Balance: ", balance.toString());
    }
  }

  async function deposit(eths) {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(icoAddress, ICO.abi, signer);
      try {
        const transation = await contract.contribute({nonce: 0, value: ethers.utils.parseEther(eths)});
        await transation.wait();
        alert(`${eths} ether successfully sent to ${icoAddress}`)
        console.log(`${eths} ether successfully sent to ${icoAddress}`);
      }
      catch (err) {
          console.log("Error: ", err)
          var emes = err.data.message
          var mes = emes.split("'", 3)
          const errorMessage = "Transaction failed. Reason: " + mes[1]
          alert(errorMessage)
      }
    }
  }


  return (
    <div className="App">
      <header className="App-header">
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={() => deposit(document.getElementById('contr').value)}>Deposit ETH Below</button> <input type = "text" id="contr"/>
      </header>
    </div>
  );
}

export default App;