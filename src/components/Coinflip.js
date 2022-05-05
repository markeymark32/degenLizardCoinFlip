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
      console.log(amount);
      console.log(sideSelected);
      coinFlip.play(amount, sideSelected);
    };
    
  return (
    <div id="app" className={`app ${rtl ? "rtl" : ""} ${toggled ? "toggled" : ""}`}>
    
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "#1a1c24",
          height: "100vh",
          display: "flex",
          width: "100%"
        }}
      >
        <Grid container align="center" >
          <Grid item xs={11} sm={11} md={11} lg={11} xl={11}>
            <LizardNav logo={logo_Degen} handleToggleSidebar={handleToggleSidebar}/>
          </Grid>
          <Grid
            item
            sx={{ backgroundColor: "#1d1d1d", top:"80px", display: { xs: 'none', sm: 'block' }  }}
            md={2} lg={2} xl={2}
            align="left"
          >
            <RecentPlays />
              
          </Grid>
          <Grid
          item
            xs={2} sm={3} md={4} lg={5} xl={6}
          >
          <Box sx={{ marginLeft: { xs: "0", md: "150px", lg: "230px"}, width: { xs: "405px", md: "500px"}, paddingTop: { xs: "0px", md: "20px"} }}>
            <h1 className="proximanova-bold-white-28px-2">
              <span className="proximanova-bold-white-28px-22">
                Welcome to{" "}
              </span>
              <span className="proximanova-bold-green-28px">
                DEGEN Lizards{" "}
              </span>
              <span className="proximanova-bold-white-28px-22">Coin Flip!</span>
            </h1>
          </Box>
            <Box bgcolor="#0000004c" direction="column" sx={{ alignItems: "center", width: "350px", top: "25px", borderRadius: "20px", marginLeft: { xs: "12px", md: "170px", lg: "250px"}, marginBottom: "25px", padding: "10px"}}>
                <CoinflipSelector
                    sideSelected={sideSelected}
                    setSideSelected={setSideSelected}
                    deposit={deposit}
                    setDeposit={setDeposit}
                    setWinState={setWinState}
                />
                <CoinFlipAction amount={deposit} onFlip={Flip} winState={winState} />
            </Box>
              <Box sx={{ border: "2px solid white", borderRadius: "20px", width: "360px", marginLeft: { xs: "12px", md: "170px", lg: "250px"}, padding: "20px"}}>
                <h1 className="proximanova-bold-white-28px-2">
                  <span className="proximanova-bold-white-28px-22">Volume: </span>
                  <span className="proximanova-bold-green-28px">
                    {numberWithCommas(volume)} Ⓝ
                  </span>
                </h1>
                
              </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default Coinflip;
