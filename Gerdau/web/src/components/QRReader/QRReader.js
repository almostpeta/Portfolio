import React from "react";
import QrReader from "react-qr-reader";
import { Button } from "react-bootstrap";
import { Toast } from "components/Toast";

export const QRReader = ({ onDismiss, onScan }) => {
  const handleError = (error) => {
    console.log(error);
    Toast("error", error);
  };

  return (
    <>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={(data) => onScan(data)}
      />
      <Button style={{ width: "100%" }} onClick={(e) => onDismiss(e)}>
        Cerrar
      </Button>
    </>
  );
};
