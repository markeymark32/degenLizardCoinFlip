import "regenerator-runtime/runtime";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import Leaderboard from "./components/Leaderboard";

import getConfig from "./config";
const { networkId } = getConfig(process.env.NODE_ENV || "development");

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage {...homepageData} />} />
        <Route
          path="/leaderboard"
          element={<Leaderboard {...leaderboardData} />}
        />
      </Routes>
    </Router>
  );
}

export default App;

const coinFlip1Data = {
  children: "Leaderboard"
};

const rankings1Data = {
  number: "1"
};

const rankings2Data = {
  number: "2",
  className: "rankings-2"
};

const rankings3Data = {
  number: "3",
  className: "rankings-3"
};

const rankings4Data = {
  number: "4",
  className: "rankings-4"
};

const rankings5Data = {
  number: "5",
  className: "rankings-5"
};

const rankings6Data = {
  number: "6",
  className: "rankings-6"
};

const rankings7Data = {
  number: "7",
  className: "rankings-7"
};

const rankings8Data = {
  number: "8",
  className: "rankings-8"
};

const rankings9Data = {
  number: "9",
  className: "rankings-9"
};

const rankings10Data = {
  number: "10",
  className: "rankings"
};

const leaderboardData = {
  logo_Degen:
    "https://anima-uploads.s3.amazonaws.com/projects/625b41b9ec989c0bdeba8f2a/releases/625b42d5ec989c0bdeba8f30/img/logo-degen-1@2x.png",
  recentPlays: "Recent plays",
  coinFlip: "Coin Flip",
  title: "DEGEN Lizards Coin Flip",
  all1: "All",
  currentMonth1: "Current Month",
  currentDay1: "Current Day",
  totalFlips: "Total Flips",
  text1: "35,610",
  totalLoss: "Total Loss",
  text2: "31,866.3",
  totalWon: "Total Won",
  text3: "32,033.7",
  totalVolume: "Total Volume",
  text4: "63,899.99",
  leaderboard: "Leaderboard",
  all2: "All",
  currentMonth2: "Current Month",
  currentDay2: "Current Day",
  netGains: "Net Gains",
  surname: "Page",
  number: "1",
  of120: "of 120",
  coinFlipProps: coinFlip1Data,
  rankings1Props: rankings1Data,
  rankings2Props: rankings2Data,
  rankings3Props: rankings3Data,
  rankings4Props: rankings4Data,
  rankings5Props: rankings5Data,
  rankings6Props: rankings6Data,
  rankings7Props: rankings7Data,
  rankings8Props: rankings8Data,
  rankings9Props: rankings9Data,
  rankings10Props: rankings10Data
};

const coinFlipData = {
  children: "Coin Flip"
};

const titleData = {
  spanText1: "Welcome to ",
  spanText2: "DEGEN Lizards",
  spanText3: " Coin Flip!"
};

const homepageData = {
  recentPlays: "Recent plays",
  logo_Degen:
    "https://anima-uploads.s3.amazonaws.com/projects/625b41b9ec989c0bdeba8f2a/releases/625b42d5ec989c0bdeba8f30/img/logo-degen-1@2x.png",
  leaderboard: "Leaderboard",
  spanText33: "Volume Flipped:",
  heads: "Heads",
  tails: "Tails",
  selectTheAmountToFlip: "Select the Ⓝ amount to flip",
  doubleOrNothing: "Double or Nothing",
  coinFlipProps: coinFlipData,
  coinFlipProps2: titleData
};
