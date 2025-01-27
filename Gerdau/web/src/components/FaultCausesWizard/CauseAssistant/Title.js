import React from "react";

export const Title = ({ children }) => (
  <div
    style={{
      color: "#01516A",
      fontSize: "18px",
      fontWeight: "bold",
    }}
    className="mt-3 my-2 mx-2"
  >
    {children}
  </div>
);

export const Subtitle = ({ children }) => (
  <div
    style={{
      color: "#01516A",
      fontSize: "16px",
      fontWeight: "500",
    }}
    className="mt-4"
  >
    {children}
    <hr className="mt-0" style={{ border: "0.5px solid #01516A" }} />
  </div>
);
