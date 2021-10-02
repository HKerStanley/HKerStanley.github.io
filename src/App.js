import * as React from "react";
import { ethers } from "ethers";
import {
  Button,
  Typography,
  ThemeProvider,
  CssBaseline,
} from "@material-ui/core";
import theme from "./theme";
import abi from "./utils/WavePortal.json";

import WaveInput from "./components/WaveInput.jsx";

export default function App() {
  /*
   * Just a state variable we use to store our user's public wallet.
   */
  const [currentAccount, setCurrentAccount] = React.useState("");
  const [lastWaver, setLastWaver] = React.useState("");
  const [allWaves, setAllWaves] = React.useState([]);

  const contractAddress = "0xF09BE6fFeEF0066eF9d0dCc9672D0D02AfeD08c7";

  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllWaves();
        getLastWaver();
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };


  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * Create a method that gets all waves from your contract
   */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach((wave) => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);

        wavePortalContract.on("NewWave", (from, timestamp, message) => {
          console.log("NewWave", from, timestamp, message);

          setAllWaves((prevState) => [
            ...prevState,
            {
              address: from,
              timestamp: new Date(timestamp * 1000),
              message: message,
            },
          ]);
        });
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * Method: Get Last Waver from the contract
   */
  const getLastWaver = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const lastWaver = await wavePortalContract.getLastWaver();

        setLastWaver(lastWaver.toString());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * This runs our function when the page loads.
   */
  React.useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ height: "100vh", textAlign: "center"}}>
        <Typography variant="h3">👋 Hey there! I am Stanley!</Typography>
        <div className="bio">
          I am Stanley from Hong Kong! I love coding, games, basketball and
          food!
          <br />
          Wave at me and lets be friend!
        </div>
        {!currentAccount ? (
          <Button onClick={connectWallet}>Connect Wallet</Button>
        ) : (
          <div>
            {lastWaver && <h3>Last Waver: {lastWaver}</h3>}
            <WaveInput
              contractAddress={contractAddress}
              contractABI={contractABI}
            />
            {allWaves.map((wave, index) => {
              return (
                <div
                  key={index}
                  style={{
                    marginTop: "16px",
                    padding: "8px",
                    border: "5px solid"
                  }}
                >
                  <Typography variant="h4">Wave {index}</Typography>
                  <div>Address: {wave.address}</div>
                  <div>Time: {wave.timestamp.toString()}</div>
                  <div>Message: {wave.message}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}
