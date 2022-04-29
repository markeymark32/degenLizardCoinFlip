import React from "react";
import { IconButton, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import heads from "../../assets/heads.svg";
import tails from "../../assets/tails.svg";
import { coinSide, winStates } from "./coinFlipConstants";  
import Slider from "@mui/material/Slider";

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
                <div className="coinflip">
                  <div className="frame-container">
                    <img
                      className="frame"
                      src="https://anima-uploads.s3.amazonaws.com/projects/625b41b9ec989c0bdeba8f2a/releases/625bf460e3f2510d25456cbc/img/frame-1@2x.svg"
                      alt="Heads"
                    />
                    
                      <Button value="heads" onClick={() => setCoin("heads")} className={`frame-2 proximanova-extra-normal-white-18px ${coin === "heads" ? "active green" : "black"}`}>
                          Heads
                      </Button>
                  </div>
                  <div className="frame-container-1">
                    <img
                      className="frame"
                      src="https://anima-uploads.s3.amazonaws.com/projects/625b41b9ec989c0bdeba8f2a/releases/625bf460e3f2510d25456cbc/img/frame@2x.svg"
                      alt="Tails"
                    />
                      <Button value="tails" onClick={() => setCoin("tails")} className={`frame-3 proximanova-extra-normal-white-18px ${coin === "tails" ? "active green" : "black"}`}>
                          Tails
                      </Button>
                  </div>
                </div>
                <p className="select-the-amount-to-flip proximanova-bold-white-16px-3">
                  {selectTheAmountToFlip}
                </p>
                <div className="slider">
                  <div className="home-overlap-group-1">
                    <Slider
                      style={{ color: "#23ce6b", width: "100%" }}
                      aria-label="Custom marks"
                      defaultValue={0.01}
                      getAriaValueText={valuetext}
                      step={0.1}
                      valueLabelDisplay="on"
                      marks={marks}
                      max={10}
                      mine={0.1}
                      onChange={(e) => setSelectedAmount(e.target.value)}
                    />
                  </div>
                </div>
            </>    
                );
}