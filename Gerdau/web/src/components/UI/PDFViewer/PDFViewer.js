import React from "react";
import PDFViewer from "mgr-pdf-viewer-react";
import "./PDFViewer.css";

const PDFViewerComponent = ({ url }) => (
  <PDFViewer
    css="pdf-container"
    document={{
      url,
    }}
    hideRotation={true}
  />
);

export default PDFViewerComponent;
