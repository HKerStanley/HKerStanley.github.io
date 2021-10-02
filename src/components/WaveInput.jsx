import React from "react";
import { ethers } from "ethers";
import {
  Input,
Button
} from "@material-ui/core";

function WaveInput(props) {

    
    const [waveMessage, setWaveMessage] = React.useState("");

    const wave = async () => {
        try {
          const { ethereum } = window;
    
          if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const waveportalContract = new ethers.Contract(
                props.contractAddress,
                props.contractABI,
              signer
            );
    
            let count = await waveportalContract.getTotalWaves();
            console.log("Retrieved total wave count...", count.toNumber());
    
            const waveTxn = await waveportalContract.wave(waveMessage, { gasLimit: 300000 });
            console.log("Mining...", waveTxn.hash);
    
            await waveTxn.wait();
            console.log("Mined -- ", waveTxn.hash);
    
            count = await waveportalContract.getTotalWaves();
            console.log("Retrieved total wave count...", count.toNumber());
          } else {
            console.log("Ethereum object doesn't exist!");
          }
        } catch (error) {
          console.log(error);
        }
      };

  return (
    <div>
      <Input type="text" placeholder="Leave a message..." onChange={(e) => setWaveMessage(e.target.value)} style={{margin: "5px"}}></Input>
      <Button onClick={wave} variant="contained">
        Wave at Me
      </Button>
    </div>
  );
}

export default WaveInput;
