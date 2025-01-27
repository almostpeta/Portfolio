import React from "react";
import QRCode from "qrcode.react";

const QRGenerator = ({ value, className }) => (
  <>
    <div className={className}>
      <QRCode value={value} />
    </div>
  </>
);

export const ResponsiveQRGenerator = ({
  value,
  clazz = "col-12 offset-3 pt-3",
}) => (
  <>
    <div className={`d-none d-lg-block ${clazz}`}>
      <QRCode value={value} />
    </div>
  </>
);

export default QRGenerator;
