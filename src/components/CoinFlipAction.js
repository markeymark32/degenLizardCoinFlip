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
          color: "var(--caribbean-green-pearl)",
          buttonText: "Play",
        },
        [winStates.won]: {
          text: "You won",
          color: "var(--caribbean-green-pearl)",
          buttonText: "Double or nothing",
        },
        [winStates.lost]: {
          text: "You lost",
          color: "var(--sunset-orange)",
          buttonText: "Play same amount",
        },
      }[winState];
    
      return (
        <div className="youwon">
            
            <div className="you-won">{text}</div>
            <div className="x05-near" style={{ color }}>
                {amount} NEAR
            </div>
            <Button onClick={near.isLoggedIn ? () => onFlip(amount) : near.signIn} className="cta double-or-nothing proximanova-extra-normal-white-18px green">
                <div className="connect-wallet pixeloidsans-bold-white-16px">
                {near.isLoggedIn ? buttonText : "Connect wallet"}
                </div>
            </Button>
        </div>
    );
};
        
export default CoinFlipAction;