import "regenerator-runtime/runtime";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Coinflip from "./components/Coinflip";
import Leaderboard from "./components/Leaderboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Coinflip {...homepageData} />} />
        <Route
          path="/leaderboard"
          element={<Leaderboard {...leaderboardData} />}
        />
      </Routes>
    </Router>
  );
}

export default App;

const leaderboardData = {
  logo_Degen:
    "https://anima-uploads.s3.amazonaws.com/projects/625b41b9ec989c0bdeba8f2a/releases/625b42d5ec989c0bdeba8f30/img/logo-degen-1@2x.png"
};

const homepageData = {
  logo_Degen:
    "https://anima-uploads.s3.amazonaws.com/projects/625b41b9ec989c0bdeba8f2a/releases/625b42d5ec989c0bdeba8f30/img/logo-degen-1@2x.png"
};
