import React, { useState } from "react";
import { IconButton, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import heads from "../assets/heads.svg";
import tails from "../assets/tails.svg";
import { coinSide, winStates } from "./coinFlipConstants";  
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";

const marks = [
    {
      value: 0.1,
      label: "0.1"
    },
    {
      value: 10,
      label: "10"
    }
  ];

  function valuetext(value) {
    return `${value}`;
  }

  function valueLabelFormat(value) {
    return marks.findIndex((mark) => mark.value === value) + 0.1;
  }

export default function CoinflipSelector({
    sideSelected,
    setSideSelected,
    deposit,
    setDeposit,
    setWinState,
  }) {
    const [isHeads, setHeads] = useState("true");
    return (
            <>
            <Box sx={{ alignItems: "center", alignContent: "center", justifyContent: "center"}}>
                <div className="coinflip">
                  <div className="frame-container-1">
                    <img
                      className="frame"
                      src={heads}
                      value="Heads"
                      alt="Heads"
                    />
                    
                      <Button sx={{textTransform: "none", minWidth: "auto", marginTop: "20px", color: "white", fontSize: "18px", fontFamily: "Proxima Nova-Bold, Helvetica"}} value="heads" onClick={(e) => setSideSelected(coinSide.heads)} className={`frame-2 proximanova-extra-normal-white-18px ${sideSelected === coinSide.heads ? "active green" : "black"}`}>
                          Heads
                      </Button>
                  </div>
                  <div className="frame-container-1">
                    <img
                      className="frame"
                      src={tails}
                      value="Tails"
                      alt="Tails"
                    />
                      <Button sx={{textTransform: "none", minWidth: "auto", marginTop: "20px", color: "white", fontSize: "18px", fontFamily: "Proxima Nova-Bold, Helvetica"}} value="tails" onClick={(e) => setSideSelected(coinSide.tails)} className={`frame-3 proximanova-extra-normal-white-18px ${sideSelected === coinSide.tails ? "active green" : "black"}`}>
                          Tails
                      </Button>
                  </div>
                </div>
                <p className="select-the-amount-to-flip proximanova-bold-white-16px-3">
                  Select the N amount to flip
                </p>
                <div className="slider">
                  <div className="home-overlap-group-1">
                    <Slider
                      style={{ color: "#23ce6b", width: "100%" }}
                      aria-label="Custom marks"
                      defaultValue={0.01}
                      getAriaValueText={valuetext}
                      step={0.1}
                      valueLabelDisplay="off"
                      marks={marks}
                      max={10}
                      mine={0.1}
                      onChange={(e) => setDeposit(e.target.value)}
                    />
                  </div>
                </div>
                </Box>
            </>    
                );
}