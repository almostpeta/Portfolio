import React, { useState, useEffect } from "react";
import { ReactMic } from "react-mic";
import "./styles.css";
export const ReactMicComponent = ({ onStop, style, recording, initRecord }) => {
  const [record, setRecord] = useState(false);
  const [recorded, setRecorded] = useState(null);

  useEffect(() => {
    // initRecord && setRecord(initRecord);
    initRecord && onStop2(initRecord);
  }, [initRecord]);

  useEffect(() => {
    setRecord(recording);
  }, [recording]);

  const onStop2 = async (recordedBlob) => {
    const blob = await fetch(recordedBlob.blobURL).then((r) => r.blob());
    const buffer = await blob.arrayBuffer();
    recordedBlob.arrayBuffer = buffer;
    setRecorded(recordedBlob);
    onStop(recordedBlob);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <ReactMic
        style={style}
        record={record}
        className="sound-wave"
        onStop={(recordedBlob) => onStop && onStop2(recordedBlob)}
        strokeColor="#0084B6"
        backgroundColor="#212121"
      />
      {recorded && (
        <audio controls>
          <source src={recorded.blobURL} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};
