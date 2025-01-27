import React from "react";
import ReactLoading from "react-loading";
import "./Loading.css";
export const Loading = ({
  clazz = "loading",
  height = "10%",
  width = "10%",
}) => (
  <section className={clazz}>
    <ReactLoading
      type={"bubbles"}
      color={"#01516a"}
      height={height}
      width={width}
    />
  </section>
);
