import React, { useState, useEffect } from "react";
import Rankings from "./Rankings";
import "../css/Leaderboard.css";
import RecentPlays from "./RecentPlays";
import Button from "@mui/material/Button";
import LizardNav from "./LizardNav";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

function Leaderboard(props) {
  const LeadTypes = [
    {
      api: "https://indexer-dl.herokuapp.com/api/leaderboard/net-gain/",
      label: "Net Gains",
      value: "net_gains"
    },
    {
      api: "https://indexer-dl.herokuapp.com/api/leaderboard/win-streak/",
      label: "Win Streaks",
      value: "win_streaks"
    },
    {
      api: "https://indexer-dl.herokuapp.com/api/leaderboard/loss-streak/",
      label: "Loss Streaks",
      value: "loss_streaks"
    },
    {
      api: "https://indexer-dl.herokuapp.com/api/leaderboard/volume/",
      label: "Volume",
      value: "volume"
    }
  ];

  const getMonthTimestamp = () => {
    let now = new Date();
    return new Date(now.getFullYear(), now.getMonth()) / 1;
  };

  const getDayTimestamp = () => {
    let now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()) / 1;
  };

  const [stats, setStats] = useState({
    selected: "all",
    timestamp: "0",
    total_flips: 0,
    total_loss: 0,
    total_volume: 0,
    total_won: 0
  });
  const [auxStats, setAuxStats] = useState({
    selected: "all",
    timestamp: 0
  });
  const [leadNetGain, setLeadNetGain] = useState([]);
  const [leadVolume, setLeadVolume] = useState([]);
  const [winStreak, setWinStreak] = useState([]);
  const [lossStreak, setLossStreak] = useState([]);
  const [selectedLeadboard, setSelectedLeadboard] = useState(LeadTypes[0]);
  const [controlState, setControlState] = useState(false);
  const [selectedTime, setSelectedTime] = useState("all");
  const [monthTimestamp, setMonthTimestamp] = useState(getMonthTimestamp);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [analytics, setAnalytics] = useState("Net Gains");
  const [rtl, setRtl] = useState(false);
  const [toggled, setToggled] = useState(false);
  const { logo_Degen } = props;

  const handleRtlChange = (checked) => {
    setRtl(checked);
    //setLocale(checked ? "ar" : "en");
  };

  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  const handleChange = (event) => {
    setAnalytics(event.target.value);
  };

  const formatNumber = (number) => {
    if (number.toFixed(2) % 1 === 0) {
      return number
        ? number
            .toFixed(0)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : 0;
    } else {
      return number
        ? number
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : 0;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setIsLoadingStats(true);
    fetch(`${selectedLeadboard.api}0`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((jsonResponse) => {
        const {
          total_flips,
          total_loss,
          total_volume,
          total_won
        } = jsonResponse;
        setStats({
          ...stats,
          total_flips,
          total_loss,
          total_volume,
          total_won
        });
      });
    fetch(`${selectedLeadboard.api}${monthTimestamp}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((jsonResponse) => {
        setLeadNetGain(jsonResponse.leaderboard);
        setControlState(true);
      })
      .finally(() => {
        setIsLoading(false);
        setIsLoadingStats(false);
      });
  }, []);

  useEffect(() => {
    if (!controlState) return;
    setIsLoading(true);
    fetch(`${selectedLeadboard.api}${monthTimestamp}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((jsonResponse) => {
        if (selectedLeadboard.value === "net_gains") {
          setLeadNetGain(jsonResponse.leaderboard);
        } else if (selectedLeadboard.value === "win_streaks") {
          setWinStreak(jsonResponse.leaderboard);
        } else if (selectedLeadboard.value === "loss_streaks") {
          setLossStreak(jsonResponse.leaderboard);
        } else {
          setLeadVolume(jsonResponse.leaderboard);
        }
      })
      .finally(() => setIsLoading(false));
  }, [selectedLeadboard, selectedTime]);

  useEffect(() => {
    if (!controlState) return;
    setIsLoadingStats(true);
    fetch(`${selectedLeadboard.api}${auxStats.timestamp}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((jsonResponse) => {
        const {
          total_flips,
          total_loss,
          total_volume,
          total_won
        } = jsonResponse;
        setStats({
          selected: auxStats.selected,
          timestamp: auxStats.timestamp,
          total_flips,
          total_loss,
          total_volume,
          total_won
        });
      })
      .finally(() => setIsLoadingStats(false));
  }, [auxStats]);

  return (
    <div
      id="app"
      className={`app ${rtl ? "rtl" : ""} ${toggled ? "toggled" : ""}`}
    >
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "#1a1c24",
          height: "100vh",
          display: "flex"
        }}
      >
        <Grid container>
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
          <Grid
            item
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: "100vh" }}
          >
            <div className="degen_stats">
              <h1 className="title proximanova-bold-white-28px-22">
                <span className="proximanova-bold-green-28px">
                  DEGEN Lizards
                </span>{" "}
                Coin Flip
              </h1>
              <div className="flex-row">
                <div className="statCta">
                  <Button
                    onClick={() =>
                      setAuxStats({ selected: "all", timestamp: 0 })
                    }
                    value="all"
                    className={`${
                      auxStats.selected === "all" ? "active green" : "black"
                    }`}
                  >
                    <div className="proximanova-bold-white-14px">All</div>
                  </Button>
                </div>
                <div className="statCta">
                  <Button
                    onClick={() =>
                      setAuxStats({
                        selected: "current_month",
                        timestamp: getMonthTimestamp()
                      })
                    }
                    value="current_month"
                    className={`${
                      auxStats.selected === "current_month"
                        ? "active green"
                        : "black"
                    }`}
                  >
                    <div className="proximanova-bold-white-14px">
                      Current Month
                    </div>
                  </Button>
                </div>
                <div className="statCta">
                  <Button
                    onClick={() =>
                      setAuxStats({
                        selected: "current_day",
                        timestamp: getDayTimestamp()
                      })
                    }
                    value="current_day"
                    className={`${
                      auxStats.selected === "current_day"
                        ? "active green"
                        : "black"
                    }`}
                  >
                    <div className="proximanova-bold-white-14px">
                      Current Day
                    </div>
                  </Button>
                </div>
              </div>
              <div className="flex-row-1">
                <div className="stats-container">
                  <div className="stats ">
                    <div className="total-flips proximanova-bold-white-16px-3">
                      Total Flips
                    </div>
                    <div className="text-1 proximanova-bold-green-28px ">
                      <h1>{formatNumber(stats.total_flips)}</h1>
                    </div>
                  </div>
                  <div className="stats-1 ">
                    <div className="total-loss proximanova-bold-white-16px-3">
                      Total Loss
                    </div>
                    <div className="text-1 proximanova-bold-green-28px ">
                      <h1>{formatNumber(stats.total_loss)}</h1>
                    </div>
                  </div>
                </div>
                <div className="stats-container-1">
                  <div className="stats-2 ">
                    <div className="total-won proximanova-bold-white-16px-3">
                      Total Won
                    </div>
                    <div className="text-3 proximanova-bold-green-28px ">
                      <h1>{formatNumber(stats.total_won)}</h1>
                    </div>
                  </div>
                  <div className="stats-3 ">
                    <div className="total-volume proximanova-bold-white-16px-3">
                      Total Volume
                    </div>
                    <div className="text-4 proximanova-bold-green-28px">
                      <h1>{formatNumber(stats.total_volume)}</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="leaderboard-1">
              <div className="leaderboard-2 proximanova-bold-white-28px-22">
                Leaderboard
              </div>
              <div className="flex-row">
                <div className="statCta">
                  <Button
                    onClick={() => {
                      setMonthTimestamp(0);
                      setSelectedTime("all");
                    }}
                    className={`${
                      selectedTime === "all" ? "active green" : "black"
                    }`}
                  >
                    <div className="proximanova-bold-white-14px">All</div>
                  </Button>
                </div>
                <div className="statCta">
                  <Button
                    onClick={() => {
                      setMonthTimestamp(getMonthTimestamp);
                      setSelectedTime("current_month");
                    }}
                    className={`${
                      selectedTime === "current_month"
                        ? "active green"
                        : "black"
                    }`}
                  >
                    <div className="proximanova-bold-white-14px">
                      Current Month
                    </div>
                  </Button>
                </div>
                <div className="statCta">
                  <Button
                    onClick={() => {
                      setMonthTimestamp(getDayTimestamp);
                      setSelectedTime("current_day");
                    }}
                    className={`${
                      selectedTime === "current_day" ? "active green" : "black"
                    }`}
                  >
                    <div className="proximanova-bold-white-14px">
                      Current Day
                    </div>
                  </Button>
                </div>
                <div className="filter">
                  <div className="net-gains">
                    <select
                      className="selectpicker statCta proximanova-bold-white-14px"
                      style={{backgroundColor: "#3c3c3c", border: "2px solid", borderColor: "white"}}
                      value={analytics}
                      onChange={handleChange}
                    >
                      <option>Net Gains</option>
                      <option>Win Streaks</option>
                      <option>Loss Streaks</option>
                      <option>Volume</option>
                    </select>
                  </div>
                </div>
              </div>
              <Grid item xs={9}>
                {selectedLeadboard.value === "net_gains" &&
                  leadNetGain.map((lead, index) => (
                    <>
                      <Rankings
                        key={index + 1}
                        number={index + 1}
                        signer={lead.signer_id}
                        amount={formatNumber(lead.net)}
                      />
                    </>
                  ))}
                {selectedLeadboard.value === "volume" &&
                  leadVolume.map((lead, index) => (
                    <Rankings
                      key={index + 1}
                      number={index + 1}
                      signer={lead.signer_id}
                      amount={formatNumber(lead.volume)}
                    />
                  ))}
                {selectedLeadboard.value === "win_streaks" &&
                  winStreak.map((lead, index) => (
                    <Rankings
                      key={index + 1}
                      number={index + 1}
                      signer={lead.signer_id}
                      amount={formatNumber(lead.streak)}
                    />
                  ))}
                {selectedLeadboard.value === "loss_streaks" &&
                  lossStreak.map((lead, index) => (
                    <Rankings
                      key={index + 1}
                      number={index + 1}
                      signer={lead.signer_id}
                      amount={formatNumber(lead.streak)}
                    />
                  ))}
              </Grid>
            </div>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default Leaderboard;
