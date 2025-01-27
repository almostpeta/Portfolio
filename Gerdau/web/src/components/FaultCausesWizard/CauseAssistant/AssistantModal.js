import React from "react";
import FirstStep from "./FirstStep";

const AssistantModal = ({
  fault,
  relatedToComponent,
  relatedToPiece,
  mostUsed,
  onSelectClick,
  onDetailClick,
}) => {
  const componentCauses = [];
  const pieceCauses = [];
  const mostUsedCauses = [];
  if (relatedToComponent) {
    componentCauses.push(...relatedToComponent);
  }
  if (relatedToPiece) {
    pieceCauses.push(...relatedToPiece);
  }
  if (mostUsed) {
    mostUsedCauses.push(...mostUsed);
  }

  return (
    <>
      <FirstStep
        fault={fault}
        componentCauses={componentCauses}
        pieceCauses={pieceCauses}
        mostUsedCauses={mostUsedCauses}
        onDetailClick={onDetailClick}
        onSelectClick={onSelectClick}
      />
    </>
  );
};

export default AssistantModal;
