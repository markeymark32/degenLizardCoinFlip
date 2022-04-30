import React, { useState, useEffect } from "react";
import { useCoinFlip } from "../near";
import CoinflipSelector from "./CoinflipSelector";
import CoinFlipAction from "./CoinFlipAction";
import { coinSide, winStates } from "./coinFlipConstants";
import "../css/Homepage.css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import RecentPlays from "./RecentPlays";
import { numberWithCommas } from "./formatValue";
import LizardNav from "./LizardNav";

function Coinflip(props) {
    const [deposit, setDeposit] = useState(0.5);
    const [sideSelected, setSideSelected] = useState(coinSide.heads);
    const [winState, setWinState] = useState(winStates.notPlayed);
    const [volume, setVolume] = useState(0);
    const [status, setStatus] = useState();
    const [rtl, setRtl] = useState(false);
    const [toggled, setToggled] = useState(false);
    const coinFlip = useCoinFlip();
    const { logo_Degen } = props;

    const handleRtlChange = (checked) => {
      setRtl(checked);
    };

    const handleToggleSidebar = (value) => {
      setToggled(value);
    };

    useEffect(() => {
        fetch(`https://indexer-dl.herokuapp.com/api/leaderboard/volume/0`)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
          })
          .then((jsonResponse) => {
            setVolume(jsonResponse.total_volume.toFixed(2));
          });
        setTimeout(() => {
          setStatus("");
        }, 11000);
    }, []);

    useEffect(() => {
        fetch(`https://indexer-dl.herokuapp.com/api/leaderboard/volume/0`)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
          })
          .then((jsonResponse) => {
            setVolume(jsonResponse.total_volume.toFixed(2));
          });
        setTimeout(() => {
          setStatus("");
        }, 11000);
        
      coinFlip.getOutcome().then((result) => {
        if (!result) {
          return;
        }
  
        const { outcome, originalBet } = result;
        console.log(outcome, originalBet);
        if (outcome) {
          setDeposit(originalBet * 2);
          setWinState(winStates.won);
        } else {
          setDeposit(originalBet);
          setWinState(winStates.lost);
        }
      });
    }, []);

    const Flip = async (amount) => {
      coinFlip.play(amount, sideSelected);
    };
    
  return (
    <div id="app" className={`app ${rtl ? "rtl" : ""} ${toggled ? "toggled" : ""}`}>
    
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "#1a1c24",
          height: "100vh",
          display: "flex"
        }}
      >
        <Grid container align="center" justify="center" >
          <Grid item xs={12}>
            <LizardNav logo={logo_Degen} handleToggleSidebar={handleToggleSidebar}/>
          </Grid>
          <Grid
            item
            style={{ backgroundColor: "#1d1d1d", maxWidth: "100%", top:"80px" }}
            
          >
            <RecentPlays rtl={rtl}
              toggled={toggled}
              handleToggleSidebar={handleToggleSidebar}/>
              
          </Grid>
          <Grid
          item
            xs={6}
          >
            <h1 className="home-overlap-title-group proximanova-bold-white-28px-2">
              <span className="proximanova-bold-white-28px-22">
                Welcome to{" "}
              </span>
              <span className="proximanova-bold-green-28px">
                DEGEN Lizards{" "}
              </span>
              <span className="proximanova-bold-white-28px-22">Coin Flip!</span>
            </h1>
            <div className="home-overlap-group10 border-1px-white-2">
                <CoinflipSelector
                    sideSelected={sideSelected}
                    setSideSelected={setSideSelected}
                    deposit={deposit}
                    setDeposit={setDeposit}
                    setWinState={setWinState}
                />
                <CoinFlipAction amount={deposit} onFlip={Flip} winState={winState} />
            </div>
              <div className="home-overlap-group9">
                <h1 className="volume-flipped-6337320 proximanova-bold-white-28px-2">
                  <span className="proximanova-bold-white-28px-22">Volume: </span>
                  <span className="proximanova-bold-green-28px">
                    {numberWithCommas(volume)} Ⓝ
                  </span>
                </h1>
                <div className="rectangle-6"></div>
              </div>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default Coinflip;
