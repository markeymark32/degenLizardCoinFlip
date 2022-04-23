import React, { useState, useEffect } from "react";
import * as nearAPI from "near-api-js";
import "../Homepage.css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import { Button } from "react-bootstrap";
import RecentPlays from "./RecentPlays";
import BN from "bn.js";
import { numberWithCommas } from "./formatValue";
import { toNear } from "./nearValues";
import LizardNav from "./LizardNav";
import Container from "@mui/material/Container";
import lostAnimation from "./loss.json";
import winAnimation from "./win2.json";
import Lottie from "react-lottie";

const bets = [
  0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6,
  1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3, 3.1, 3.2,
  3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8,
  4.9, 5, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 6, 6.1, 6.2, 6.3, 6.4,
  6.5, 6.6, 6.7, 6.8, 6.9, 7, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 8,
  8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 9, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6,
  9.7, 9.8, 9.9, 10,
];

const { utils, connect, providers } = nearAPI;

function Homepage(props) {
  const [coin, setCoin] = useState("heads");
  const [selectedAmount, setSelectedAmount] = useState(0.1);
  const [volume, setVolume] = useState(0);
  const [nearPrice, setNearPrice] = useState(0);
  const [showLoading, setShowLoading] = useState();
  const [betsArray, setBetsArray] = useState(bets);
  const [flipStatus, setFlipStatus] = useState("");
  const [isHeads, setHeads] = useState("true");

  useEffect(async () => {
    const maxBetFinal = 10;

    if (maxBetFinal > 10) {
      let aux = [];
      for (let i = 6; i <= maxBetFinal; i++) {
        aux.push(i);
      }
      setBetsArray(betsArray.concat(aux));
    }
  }, []);

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
        <Grid container >
          <Grid item xs={12}>
            <LizardNav logo={logo_Degen} />
          </Grid>
          <Grid
            item
            style={{ backgroundColor: "#1f2029", maxWidth: "100%" }}
          >
            <RecentPlays />
          </Grid>
          <Grid
            item
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: "100vh" }}
          >
            {status === "You won!" && (
              <img
                style={{
                  position: "absolute",
                  left: "50%",
                  width: "600px",
                  height: "300px",
                  transform: "translateX(-50%)",
                }}
                src=""
              />
            )}
            <h1 className="home-overlap-title-group proximanova-bold-white-28px-2">
              <span className="proximanova-bold-white-28px-22">
                Welcome to{" "}
              </span>
              <span className="proximanova-bold-green-28px">
                DEGEN Lizards{" "}
              </span>
              <span className="proximanova-bold-white-28px-22">Coin Flip!</span>
            </h1>
            
            {flipStatus.length < 1 && (
              <>
              <div className="home-overlap-group10 border-1px-white-2">
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
                  <Button onClick={(e) => CoinFlip(e)} className="cta double-or-nothing proximanova-extra-normal-white-18px green">
                      Double or Nothing
                  </Button>
              </div>
              <div className="home-overlap-group9">
                <h1 className="volume-flipped-6337320 proximanova-bold-white-28px-2">
                  <span className="proximanova-bold-white-28px-22">Volume: </span>
                  <span className="proximanova-bold-green-28px">
                    {numberWithCommas(volume)} Ⓝ
                  </span>
                </h1>
                <div className="rectangle-6"></div>
              </div></>
              )}
              {flipStatus.length > 0 && (
                <>
                  {flipStatus === "You won!" ? (
                    <>
                      <div
                        style={{
                          position: "relative",
                          width: "280px",
                          height: "250px",
                          margin: "0 auto",
                        }}
                      >
                        <Lottie
                          width={400}
                          height={400}
                          style={{
                            width: "150%",
                            height: "115%",
                            margin: "-10% auto",
                            left: "50%",
                            position: "absolute",
                            transform: "translateX(-50%)",
                          }}
                          options={{
                            loop: false,
                            autoplay: true,
                            animationData: winAnimation,
                            rendererSettings: {
                              preserveAspectRatio: "xMidYMid slice",
                            },
                          }}
                        ></Lottie>
                      </div>
      
                      <div className="mt-3 mb-8 font-bold text-xl">{flipStatus}</div>
                      <div className="cta">
                        <Button onClick={() => (window.location.href = "/")}>
                          <div className="double-or-nothing proximanova-extra-normal-white-18px">
                            Play Again
                          </div>
                        </Button></div>
                  </>
                  ) : (
              <>
                <div
                  style={{
                    position: "relative",
                    width: "280px",
                    height: "250px",
                    margin: "0 auto",
                  }}
                >
                  <Lottie
                    width={400}
                    height={400}
                    style={{
                      width: "150%",
                      height: "115%",
                      margin: "-10% auto",
                      left: "50%",
                      position: "absolute",
                      transform: "translateX(-50%)",
                    }}
                    options={{
                      loop: false,
                      autoplay: true,
                      animationData: lostAnimation,
                      rendererSettings: {
                        preserveAspectRatio: "xMidYMid slice",
                      },
                    }}
                  ></Lottie>
                </div>
                <div className="mt-3 mb-8 font-bold text-xl">{flipStatus}</div>
                <Button onClick={() => (window.location.href = "/")}>
                    <div className="double-or-nothing proximanova-extra-normal-white-18px">
                    Try again
                    </div>
                </Button>

                </>
                )}
            </>
          )}
         
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Homepage;
