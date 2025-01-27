import React, { useState, useEffect } from "react";
import Item from "components/UI/Item";
import { Subtitle } from "components/FaultCausesWizard/CauseAssistant/Title";

const FirstStep = ({ solutions, onDetailClick, onSelectClick }) => {
  const [receivedSolutions, setReceivedSolutions] = useState([]);

  useEffect(() => {
    solutions && setReceivedSolutions(solutions);
  }, [solutions]);

  return (
    <div style={{ margin: "0.5rem 1rem 0.5rem 1rem" }}>
      {solutions.length > 0 && (
        <>
          <Subtitle>Soluciones</Subtitle>
          {solutions.map((solution) => (
            <Item
              key={solution.id}
              onDetailClick={onDetailClick}
              onSelectClick={onSelectClick}
              item={solution}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default FirstStep;
