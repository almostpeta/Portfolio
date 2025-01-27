import React, { useState, useEffect } from "react";
import CauseItem from "components/UI/CauseItem";
import { Title, Subtitle } from "./Title";

const SecondStep = ({ similarCauses, onDetailClick, onSelectClick }) => {
  const [receivedSimilarCauses, setReceivedSimilarCauses] = useState(
    similarCauses
  );

  useEffect(() => {
    similarCauses && setReceivedSimilarCauses(similarCauses);
  }, [similarCauses]);

  return (
    <div className="my-2 mx-2">
      {receivedSimilarCauses.similarCauses?.length > 0 && (
        <>
          <Subtitle>
            Causas que podrían interesarte en base a la causas seleccionadas del
            paso 1:{" "}
          </Subtitle>
          {receivedSimilarCauses &&
            receivedSimilarCauses.similarCauses.map((cause) => (
              <CauseItem
                key={cause.id}
                onDetailClick={onDetailClick}
                onSelectClick={onSelectClick}
                cause={cause}
              />
            ))}
        </>
      )}
      {receivedSimilarCauses.restOfCauses?.length > 0 && (
        <>
          <Subtitle>Otras Causas</Subtitle>
          {receivedSimilarCauses.restOfCauses.map((cause) => (
            <CauseItem
              key={cause.id}
              onDetailClick={onDetailClick}
              onSelectClick={onSelectClick}
              cause={cause}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default SecondStep;
