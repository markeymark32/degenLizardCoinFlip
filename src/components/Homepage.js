import React, { useState, useEffect } from "react";
import * as nearAPI from "near-api-js";
import "../Homepage.css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import RecentPlays from "./RecentPlays";
import BN from "bn.js";
import { numberWithCommas } from "./formatValue";
import { toNear } from "./nearValues";
import LizardNav from "./LizardNav";
import Container from "@mui/material/Container";

const { utils, connect, providers } = nearAPI;

function Homepage(props) {
  const [coin, setCoin] = useState("heads");
  const [selectedAmount, setSelectedAmount] = useState(0.1);
  const [selected, setSelected] = useState(props.selected);
  const [volume, setVolume] = useState(0);
  const [nearPrice, setNearPrice] = useState(0);
  const [status, setStatus] = useState("");
  const [showLoading, setShowLoading] = useState();

  const { logo_Degen, selectTheAmountToFlip } = props;

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

  function selectedSide(e) {
    console.log(e);
    setCoin(e.target.value);
  }

  useEffect(() => {
    async function fetchData() {
      fetch(`https://indexer-dl.herokuapp.com/api/leaderboard/volume/0`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((jsonResponse) => {
          setVolume(jsonResponse.total_volume.toFixed(2));
        });

      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd"
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((response) => {
          console.log("Near Price", response);
          setNearPrice(response.near.usd);
        });

      const provider = new providers.JsonRpcProvider(
        "https://archival-rpc.mainnet.near.org"
      );

      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = urlSearchParams.get("transactionHashes");

      const result = await provider.txStatus(
        params,
        window.walletConnection._near.config.contractName
      );

      console.log(result.receipts_outcome[0]);

      setStatus(result.receipts_outcome[0].outcome.logs[3]);

      setTimeout(() => {
        setStatus("");
      }, 11000);
    }
    fetchData();
  }, []);

  const CoinFlip = async (e) => {
    console.log(coin);
    console.log(selectedAmount);
    if (!coin) return;
    e.preventDefault();

    setShowLoading(true);

    await setTimeout(() => {
      try {
        window.contract.play(
          {},
          100000000000000,
          new BN(toNear((Number(selectedAmount) * 1.035).toString()))
        );
      } catch (e) {
        alert(
          "Something went wrong! " +
            "Maybe you need to sign out and back in? " +
            "Check your browser console for more info."
        );
        throw e;
      } finally {
        setShowLoading(false);
      }
    }, 2000);
  };

  return (
    <Container maxWidth="xl" sx={{ bgcolor: "#1a1c24" }}>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "#1a1c24",
          height: "100vh",
          display: "flex"
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <LizardNav logo={logo_Degen} />
          </Grid>
          <Grid
            item
            xs={3}
            style={{ backgroundColor: "#1f2029", maxWidth: "100%" }}
          >
            <RecentPlays />
          </Grid>
          <Grid
            item
            xs={6}
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: "100vh" }}
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
              <div className="coinflip">
                <div className="frame-container">
                  <img
                    className="frame"
                    src="https://anima-uploads.s3.amazonaws.com/projects/625b41b9ec989c0bdeba8f2a/releases/625bf460e3f2510d25456cbc/img/frame-1@2x.svg"
                    alt="Heads"
                  />
                  <div className="frame-2">
                    <Button onClick={(e) => setCoin(e.target.value)}>
                      <div className="heads proximanova-extra-normal-white-18px">
                        Heads
                      </div>
                    </Button>
                  </div>
                </div>
                <div className="frame-container-1">
                  <img
                    className="frame"
                    src="https://anima-uploads.s3.amazonaws.com/projects/625b41b9ec989c0bdeba8f2a/releases/625bf460e3f2510d25456cbc/img/frame@2x.svg"
                    alt="Tails"
                  />
                  <div className="frame-3">
                    <Button onClick={(e) => setCoin(e.target.value)}>
                      <div className="tails proximanova-extra-normal-white-18px">
                        Tails
                      </div>
                    </Button>
                  </div>
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
                    onChange={(e) => setSelectedAmount(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="cta">
                <Button onClick={(e) => CoinFlip(e)}>
                  <div className="double-or-nothing proximanova-extra-normal-white-18px">
                    Double or Nothing
                  </div>
                </Button>
              </div>
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
    </Container>
  );
}

export default Homepage;
