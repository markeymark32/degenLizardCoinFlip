import React, { useState, useEffect } from "react";

function RecentPlays() {
  const [recentPlays, setRecentPlays] = useState([]);

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

  return (
    <>
      {recentPlays?.map((elm, index) => (
        <div className="home-overlap-group1 border-1px-white-2">
          <p className="wonder1925near-flip proximanova-bold-white-16px-2">
            <span className="proximanova-bold-white-16px-3">
              {elm.accountId}{" "}
            </span>
            <span className="proximanova-light-white-16px-2">
              flipped {elm.amount} Ⓝ and{" "}
            </span>
            {elm.outcome === "won" && (
              <span className="proximanova-bold-green-16px-2">
                {elm.outcome}{" "}
              </span>
            )}
            {elm.outcome === "lost" && (
              <span className="proximanova-bold-coral-red-16px-2">
                {elm.outcome}{" "}
              </span>
            )}
            <span className="proximanova-light-white-16px-2">{elm.time}</span>
          </p>
        </div>
      ))}
    </>
  );
}
export default RecentPlays;
