import React from "react";
import "../css/Rankings.css";

function Rankings(props) {
  const { number, signer, amount } = props;

  return (
    <div className="rankings-1">
      <div className="number-2 proximanova-regular-normal-white-18px">
        {number}
      </div>
      <div className="signer proximanova-extra-normal-white-16px">
        {signer}
      </div>
      <div className="text proximanova-black-white-16px">
        <span className="span-1 proximanova-black-white-16px-2">{amount}</span>
        <span className="span-1 proximanova-black-green-16px greenColor"> Ⓝ</span>
      </div>
    </div>
  );
}

export default Rankings;
