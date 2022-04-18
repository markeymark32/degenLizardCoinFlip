import React from "react";
import "../Title.css";

function Title(props) {
  const { spanText1, spanText2, spanText3 } = props;

  return (
    <div className="welcome-to-degen-lizards-coin-flip proximanova-bold-white-28px-2">
      <span className="proximanova-bold-white-28px-22">{spanText1}</span>
      <span className="proximanova-bold-green-28px">{spanText2}</span>
      <span className="proximanova-bold-white-28px-22">{spanText3}</span>
    </div>
  );
}

export default Title;
