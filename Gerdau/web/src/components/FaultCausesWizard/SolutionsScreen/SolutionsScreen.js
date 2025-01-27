import React from "react";
import { Title } from "components/FaultCausesWizard/CauseAssistant/Title";
import Item from "components/UI/Item";

const SolutionsScreen = ({ solutions, onDetailClick }) => {
  return (
    <div style={{ margin: "0.5rem 1rem 0.5rem 1rem" }}>
      {solutions.length > 0 && (
        <>
          <Title></Title>
          {solutions &&
            solutions.map((solution) => (
              <Item
                key={solution.id}
                onDetailClick={onDetailClick}
                item={solution}
                variant="solution"
              />
            ))}
        </>
      )}
    </div>
  );
};

export default SolutionsScreen;
