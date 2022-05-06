import React, { useState, useEffect } from "react";
import { useCoinFlip } from "../near";
import CoinflipSelector from "./CoinflipSelector";
import CoinFlipAction from "./CoinFlipAction";
import { coinSide, winStates } from "./coinFlipConstants";
import "../css/Homepage.css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
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

  const Title = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: "10px",
    backgroundColor: "inherit",
    boxShadow: "none",
    color: "white",
    fontSize: "28px",
    fontFamily: "Proxima Nova-Extrabold, Helvetica",
    fontWeight: 700,
    overflowWrap: "break-word",
    width: "550px",
    [theme.breakpoints.down("md")]: {
      fontSize: "24px",
      width: "370px"
    }
  }));

  const Vol = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: "10px",
    backgroundColor: "inherit",
    boxShadow: "none",
    color: "white",
    fontSize: "28px",
    fontFamily: "Proxima Nova-Extrabold, Helvetica",
    fontWeight: 700,
    overflowWrap: "break-word",
    width: "340px",
    [theme.breakpoints.down("md")]: {
      fontSize: "24px"
    }
  }));

  return (
    <div
      id="app"
      className={`app ${rtl ? "rtl" : ""} ${toggled ? "toggled" : ""}`}
    >
      <Box
        container
        spacing={2}
        sx={{
          flexGrow: 1,
          bgcolor: "#1a1c24",
          height: "100vh",
          display: "flex",
          width: "100%"
        }}
      >
        <Grid container align="center">
          <Grid item xs={12}>
            <LizardNav
              logo={logo_Degen}
              handleToggleSidebar={handleToggleSidebar}
            />
          </Grid>
          <Grid item style={{ backgroundColor: "#1d1d1d" }}>
            <RecentPlays
              rtl={rtl}
              toggled={toggled}
              handleToggleSidebar={handleToggleSidebar}
            />
          </Grid>
          <Grid item md={8}>
            <Box
              container
              justifyContent="center"
              sx={{
                paddingTop: { xs: "0px", md: "20px" }
              }}
            >
              <Title>
                Welcome to{" "}
                <span style={{ color: "#23ce6b" }}>DEGEN Lizards </span>
                Coin Flip!
              </Title>
            </Box>
            <Box
              container
              justifyContent="center"
              bgcolor="#0000004c"
              sx={{
                alignItems: "center",
                width: "fit-content",
                top: "25px",
                borderRadius: "20px",
                marginBottom: "10px",
                paddingTop: "0px",
                paddingLeft: "24px",
                paddingRight: "24px",
                paddingBottom: "24px"
              }}
            >
              <CoinflipSelector
                sideSelected={sideSelected}
                setSideSelected={setSideSelected}
                deposit={deposit}
                setDeposit={setDeposit}
                setWinState={setWinState}
              />
              <CoinFlipAction
                amount={deposit}
                onFlip={Flip}
                winState={winState}
              />
            </Box>
            <Box
              sx={{
                border: "2px solid white",
                borderRadius: "20px",
                width: "340px"
              }}
            >
              <Vol>
                Volume:
                <span style={{ color: "#23ce6b" }}>
                  {numberWithCommas(volume)} Ⓝ
                </span>
              </Vol>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default Coinflip;
