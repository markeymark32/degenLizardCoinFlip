import React from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import heads from "../assets/heads.svg";
import { useNear } from "../near";
import { winStates } from "./coinFlipConstants";

const CoinFlipAction = ({ amount, onFlip, winState }) => {
    const near = useNear();
    console.log(winState);
    const { text, color, buttonText } = {
        [winStates.notPlayed]: {
          text: "Bet",
          color: "var(--white)",
          buttonText: "Play",
        },
        [winStates.won]: {
          text: "You won",
          color: "var(--white)",
          buttonText: "Double or nothing",
        },
        [winStates.lost]: {
          text: "You lost",
          color: "var(--white)",
          buttonText: "Play same amount",
        },
      }[winState];
    
      return (
        <div className="pixeloidsans-bold-white-16px">
            
            <div className="pixeloidsans-bold-white-16px" style={{ color }}>{text}</div>
            <div className="pixeloidsans-bold-white-16px" style={{ color }}>
                {amount} NEAR
            </div>
            <Button sx={{textTransform: "none", minWidth: "auto", marginTop: "20px", color: "white", fontSize: "18px", fontFamily: "Proxima Nova-Bold, Helvetica"}} onClick={near.isLoggedIn ? () => onFlip(amount) : near.signIn} className="cta double-or-nothing proximanova-extra-normal-white-18px green">
                <div className="connect-wallet pixeloidsans-bold-white-16px">
                {near.isLoggedIn ? buttonText : "Connect wallet"}
                </div>
            </Button>
        </div>
    );
};
        
export default CoinFlipAction;