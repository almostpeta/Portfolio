import React, { useState, useEffect } from "react";
import CauseItem from "components/UI/CauseItem";
import { Title, Subtitle } from "./Title";

const FirstStep = ({
  fault,
  componentCauses,
  pieceCauses,
  mostUsedCauses,
  onDetailClick,
  onSelectClick,
}) => {
  const [receivedComponentCauses, setReceivedComponentCauses] = useState(
    componentCauses
  );
  const [receivedPieceCauses, setReceivedPieceCauses] = useState(pieceCauses);
  const [receivedMostUsedCauses, setReceivedMostUsedCauses] = useState(
    mostUsedCauses
  );

  useEffect(() => {
    componentCauses && setReceivedComponentCauses(componentCauses);
  }, [componentCauses]);

  useEffect(() => {
    pieceCauses && setReceivedPieceCauses(pieceCauses);
  }, [pieceCauses]);

  useEffect(() => {
    mostUsedCauses && setReceivedMostUsedCauses(mostUsedCauses);
  }, [mostUsedCauses]);

  return (
    <div className="my-2 mx-2">
      {receivedComponentCauses.length > 0 && (
        <>
          <Subtitle>
            En base a otras fallas del componente:{" "}
            <span className="font-weight-bold">
              {fault?.component?.internal_name}
            </span>
          </Subtitle>
          {receivedComponentCauses.map((cause) => (
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
      {receivedPieceCauses.length > 0 && (
        <>
          <Subtitle>
            En base a otras fallas de la pieza:{" "}
            <span className="font-weight-bold">
              {fault?.piece?.internal_name}
            </span>
          </Subtitle>
          {receivedPieceCauses.map((cause) => (
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
      {receivedMostUsedCauses.length > 0 && (
        <>
          <Subtitle>Causas más frecuentes del sistema</Subtitle>
          {receivedMostUsedCauses.map((cause) => (
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

export default FirstStep;
