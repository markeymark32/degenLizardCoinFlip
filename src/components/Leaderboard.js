import React, { useState, useEffect } from "react";
import Rankings from "./Rankings";
import "../css/Leaderboard.css";
import RecentPlays from "./RecentPlays";
import Button from "@mui/material/Button";
import LizardNav from "./LizardNav";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

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

  const Title = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: "left",
    padding: "10px",
    backgroundColor: "inherit",
    boxShadow: "none",
    color: "white",
    fontSize: "28px",
    fontFamily: "Proxima Nova-Extrabold, Helvetica",
    fontWeight: 700,
    overflowWrap: "break-word",
    [theme.breakpoints.down("md")]: {
      fontSize: "24px"
    }
  }));

  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    alignItems: "center",
    backgroundColor: "#3c3c3c",
    borderRadius: "10px",
    border: "2px solid #ffffff33",
    display: "flex",
    height: "120px",
    padding: "21px 0",
    width: "320px",
    display: "inline-grid"
  }));

  const Buttons = styled(Button)(({ theme }) => ({
    borderRadius: "10px",
    border: "1px solid white"
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
          <Grid item xs={8}>
            <Title>
              <span style={{ color: "#23ce6b" }}>DEGEN Lizard</span> Coin Flip
            </Title>
            <Box sx={{ "& button": { m: 1 } }}>
              <div>
                <Buttons
                  variant="outlined"
                  size="sm"
                  onClick={() => setAuxStats({ selected: "all", timestamp: 0 })}
                  value="all"
                  className={`${
                    auxStats.selected === "all" ? "active green" : "inherit"
                  }`}
                >
                  <div className="proximanova-bold-white-14px">All</div>
                </Buttons>

                <Buttons
                  variant="outlined"
                  size="sm"
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
                      : "inherit"
                  }`}
                >
                  <div className="proximanova-bold-white-14px">
                    Current Month
                  </div>
                </Buttons>

                <Buttons
                  variant="outlined"
                  size="sm"
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
                      : "inherit"
                  }`}
                >
                  <div className="proximanova-bold-white-14px">Current Day</div>
                </Buttons>
              </div>
            </Box>
            <Stack
              sx={{ textAlign: "center" }}
              m={2}
              spacing={2}
              direction={{ xs: "column", md: "row" }}
            >
              <Item>
                <div className="proximanova-bold-white-16px-3">Total Flips</div>
                <div className="proximanova-bold-green-28px ">
                  <h1>{formatNumber(stats.total_flips)}</h1>
                </div>
              </Item>
              <Item>
                <div className="proximanova-bold-white-16px-3">Total Loss</div>
                <div className="proximanova-bold-green-28px ">
                  <h1>{formatNumber(stats.total_loss)}</h1>
                </div>
              </Item>
            </Stack>
            <Stack
              sx={{ textAlign: "center" }}
              spacing={2}
              m={2}
              direction={{ xs: "column", md: "row" }}
            >
              <Item>
                <div className="proximanova-bold-white-16px-3">Total Won</div>
                <div className=" proximanova-bold-green-28px ">
                  <h1>{formatNumber(stats.total_won)}</h1>
                </div>
              </Item>
              <Item>
                <div className="proximanova-bold-white-16px-3">
                  Total Volume
                </div>
                <div className="proximanova-bold-green-28px">
                  <h1>{formatNumber(stats.total_volume)}</h1>
                </div>
              </Item>
            </Stack>
            <Stack>
              <Title>Leaderboard</Title>
              <Box sx={{ "& button": { m: 1 } }}>
                <div>
                  <Buttons
                    variant="outlined"
                    size="sm"
                    onClick={() => {
                      setMonthTimestamp(0);
                      setSelectedTime("all");
                    }}
                    className={`${
                      selectedTime === "all" ? "active green" : "inherit"
                    }`}
                  >
                    <div className="proximanova-bold-white-14px">All</div>
                  </Buttons>

                  <Buttons
                    variant="outlined"
                    size="sm"
                    onClick={() => {
                      setMonthTimestamp(getMonthTimestamp);
                      setSelectedTime("current_month");
                    }}
                    className={`${
                      selectedTime === "current_month"
                        ? "active green"
                        : "inherit"
                    }`}
                  >
                    <div className="proximanova-bold-white-14px">
                      Current Month
                    </div>
                  </Buttons>

                  <Buttons
                    variant="outlined"
                    size="sm"
                    onClick={() => {
                      setMonthTimestamp(getDayTimestamp);
                      setSelectedTime("current_day");
                    }}
                    className={`${
                      selectedTime === "current_day"
                        ? "active green"
                        : "inherit"
                    }`}
                  >
                    <div className="proximanova-bold-white-14px">
                      Current Day
                    </div>
                  </Buttons>

                  <select
                    className="proximanova-bold-white-14px"
                    style={{
                      color: "white",
                      backgroundColor: "inherit",
                      border: "1px solid white",
                      borderRadius: "10px",
                      padding: "7px"
                    }}
                    value={analytics}
                    onChange={handleChange}
                  >
                    <option>Net Gains</option>
                    <option>Win Streaks</option>
                    <option>Loss Streaks</option>
                    <option>Volume</option>
                  </select>
                </div>
              </Box>
              <Grid item xs={8}>
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
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default Leaderboard;
