import React from "react";
import AnimatedNumber from "react-animated-number";
import Box from "components/UI/Box";

import "./stylesheet.css";

export const DetailBox = ({ title, children, otherChildren }) => {
  const displayBox = children.some(
    (c) => !!c.value || typeof c.value === "number"
  );

  return (
    <>
      {displayBox && (
        <Box title={title} key={`${title}-${Math.random() * 100}`}>
          {children?.map((child, index) => {
            if (child.value || typeof child.value === "number") {
              switch (child.variant) {
                case "link":
                  return (
                    <>
                      <div key={index} className="basicDataItem">
                        <span> {child.label} &ensp;</span>
                        <a href={`${child.href}`}>{child.value} </a>
                      </div>
                    </>
                  );
                case "state":
                  return (
                    <>
                      <div key={index} className="basicDataItem">
                        <div
                          className="machineState"
                          style={{
                            backgroundColor: child.background,
                            fontSize: "15px",
                            color: child.color,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            borderRadius: "5px",
                            padding: "5px 20px 5px 20px",
                          }}
                        >
                          {child.value}
                        </div>
                      </div>
                    </>
                  );
                case "number":
                  return (
                    <>
                      <AnimatedNumber
                        key={index}
                        component="text"
                        value={child.value}
                        style={{
                          transition: "2s ease-out",
                          fontSize: 48,
                          transitionProperty:
                            "background-color, color, opacity",
                        }}
                        // frameStyle={(perc) =>
                        //   perc === 200 ? {} : { backgroundColor: "white" }
                        // }
                        stepPrecision={0}
                        duration={3500}
                        // formatValue={(n) => prettyBytes(n)}
                      />
                    </>
                  );
                case "audio":
                  return (
                    <>
                      <audio key={index} controls>
                        <source src={child.value} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </>
                  );
                default:
                  return (
                    <>
                      <div key={index} className="basicDataItem">
                        <span> {child?.label} &ensp;</span>
                        <div>{child.value} </div>
                      </div>
                    </>
                  );
              }
            }
          })}
        </Box>
      )}
    </>
  );
};
