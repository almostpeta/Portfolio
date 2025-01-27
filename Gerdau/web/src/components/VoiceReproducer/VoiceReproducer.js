import React from "react";

export const VoiceReproducer = ({ src }) => {
  return (
    <audio controls>
      <source src={src} type="audio/mpeg" />
      Your browser does not support the element.
    </audio>
  );
};
