import React from "react";

const Box = ({ title, children }) => (
  <div className="machineContainer">
    <div className="machineInfoAndLocation">
      <div style={{ flex: "1" }}>
        <span className="machineTitle">{title}</span>
        <div className="machineBasicData">{children}</div>
      </div>
    </div>
  </div>
);

export default Box;
