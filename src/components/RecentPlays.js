import React, { useState, useEffect, useHistory, useLocation } from "react";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { ProSidebar, Menu, SidebarHeader, SidebarContent } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { useIntl } from "react-intl";
import "../globals.css";

function RecentPlays({ rtl, toggled, handleToggleSidebar }) {
  const [recentPlays, setRecentPlays] = useState([]);
  const intl = useIntl();

  function timeDifference(current, previous) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (!previous) return "";

    if (elapsed < msPerMinute) {
      const seconds = Math.round(elapsed / 1000);
      return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
    } else if (elapsed < msPerHour) {
      const minutes = Math.round(elapsed / msPerMinute);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (elapsed < msPerDay) {
      const hours = Math.round(elapsed / msPerHour);
      return `${hours} ${hours === 1 ? "hour" : "hours "} ago`;
    } else if (elapsed < msPerMonth) {
      const days = Math.round(elapsed / msPerDay);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    } else if (elapsed < msPerYear) {
      const months = Math.round(elapsed / msPerMonth);
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    } else {
      const years = Math.round(elapsed / msPerYear);
      return `${years} ${years === 1 ? "year" : "years"} ago`;
    }
  }

  useEffect(() => {
    fetch("https://indexer-dl.herokuapp.com/api/latest_transactions")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((jsonResponse) => {
        setRecentPlays(
          jsonResponse.data.map((elm) => {
            return {
              amount: (parseFloat(elm.amount) / 1.035).toFixed(1),
              time: timeDifference(new Date(), elm.timestamp ?? null),
              accountId: elm.signer_id ?? "default.near",
              outcome: elm.outcome ? "won" : "lost"
            };
          })
        );
      });
  }, []);

  if (recentPlays.length < 1) return <></>;

  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: "20px",
    height: "100%",
    backgroundColor: "#3c3c3c",
    minWidth: "75%",
    border: "2px solid #ffffff33",
    borderRadius: "10px",
    position: "relative",
    left: "34px",
    minHeight: "106px",
    width: "50%",
    alignItems: "flex-end"
  }));

  return (
      <>
    <div style={{ marginTop: "50px"}}>
      <ProSidebar rtl={rtl}
          toggled={toggled}
          breakPoint="md"
          onToggle={handleToggleSidebar}>
          width="270px"  
        <SidebarHeader>
          <div className="home-recent-plays proximanova-bold-white-22px">
              Recent plays
          </div>
        </SidebarHeader>
        <SidebarContent>
          <Menu iconShape="square">
                          {recentPlays?.map((elm, index) => (
                            <div >
                              <Item sx={{ m: 2 }}>
                                <p style={{ minHeight: "32px", width: "205px" }}>
                                  <span className="proximanova-bold-white-16px-3">
                                    {elm.accountId}
                                  </span>{" "}
                                  <br />
                                  <span className="proximanova-light-white-16px-2">flipped
                                  {elm.amount} Ⓝ and{" "}</span>
                                  {elm.outcome === "won" && (
                                    <span className="proximanova-bold-green-16px-2">
                                      {elm.outcome}.
                                    </span>
                                  )}
                                  {elm.outcome === "lost" && (
                                    <span className="proximanova-bold-coral-red-16px-2">
                                      {elm.outcome} .
                                    </span>
                                  )}
                                </p>
                                <div style={{ textAlign: "right", minHeight: "14px" }}>
                                <span className="proximanova-light-white-16px-2">{elm.time}</span>
                                </div>
                              </Item>
                            </div>
                          ))}
          </Menu>
        </SidebarContent>
      </ProSidebar>
    </div>
          </>
  );
}
export default RecentPlays;
