import React from "react";
import { Subtitle } from "../CauseAssistant/Title";
import CauseItem from "components/UI/CauseItem";

const ManualCauses = ({ causes, onDetailClick, onSelectClick }) => {
  return (
    <div style={{ margin: "0.5rem 1rem 0.5rem 1rem" }}>
      {causes.length > 0 && (
        <>
          <Subtitle>Lista de Causas</Subtitle>
          {causes.map((cause) => (
            <CauseItem
              key={cause.id}
              onDetailClick={onDetailClick}
              isSelected={false}
              onSelectClick={onSelectClick}
              cause={cause}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default ManualCauses;
