import React from "react";
import "../CoinFlip.css";

function CoinFlip(props) {
  const { children } = props;

  return (
    <div className="coin-flip proximanova-bold-green-16px-2">{children}</div>
  );
}

export default CoinFlip;
