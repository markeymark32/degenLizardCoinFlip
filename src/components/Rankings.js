import React from "react";
import "../Rankings.css";

function Rankings(props) {
  const { number, signer, amount } = props;

  return (
    <div className="rankings-1">
      <div className="number-2 proximanova-regular-normal-white-18px">
        {number}
      </div>
      <div className="signer proximanova-bold-white-16px-3">
        {signer}
      </div>
      <div className="text proximanova-black-white-16px">
        <span className="span-1 proximanova-bold-white-16px-3">{amount}</span>
        <span className="span-1 proximanova-black-green-16px greenColor"> Ⓝ</span>
      </div>
    </div>
  );
}

export default Rankings;
