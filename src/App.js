import "regenerator-runtime/runtime";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import Leaderboard from "./components/Leaderboard";
import { IntlProvider } from "react-intl";

import getConfig from "./config";
const { networkId } = getConfig(process.env.NODE_ENV || "development");

function App() {
  const [locale, setLocale] = useState("en");

  return (
    <IntlProvider locale={locale} >
    <Router>
      <Routes setLocale={setLocale}>
        <Route path="/" element={<Homepage {...homepageData} />} />
        <Route
          path="/leaderboard"
          element={<Leaderboard {...leaderboardData} />}
        />
      </Routes>
    </Router>
    </IntlProvider>
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
