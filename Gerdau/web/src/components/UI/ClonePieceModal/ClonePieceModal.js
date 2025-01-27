import React, { useEffect, useState } from "react";
import { ModalComponent } from "components/Modal";
import { Loading } from "components/Loading";
import { getAllPieces } from "service/piece";
import { StdButton } from "components/UI/ActionBtn";
import PieceItem from "components/UI/PieceItem";
import RecordDetailModal from "components/UI/RecordDetailModal";

const ClonePieceModal = ({ onSelectPiece, onClose }) => {
  const [pieces, setPieces] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [error, setError] = useState(null);

  useEffect(async () => {
    try {
      setIsLoading(true);
      const allPieces = await getAllPieces();
      setPieces(allPieces);
    } catch (e) {
      setError(e);
      setPieces(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      <ModalComponent
        show={true}
        title="Clonar Pieza"
        onClose={() => onClose()}
        children={
          <>
            {isLoading && <Loading />}
            {!error && pieces?.length > 0 && (
              <>
                <div className="col-11" style={{ textAlign: "center" }}>
                  Seleccione la pieza que desea clonar
                </div>
                {pieces.map((p) => (
                  <PieceItem
                    piece={p}
                    onSelectClick={(piece) => onSelectPiece(piece)}
                    onDetailClick={(piece) => setCurrentRecord(piece)}
                  />
                ))}
              </>
            )}
            {error && <div>{error}</div>}
            {!error && (!pieces || pieces.length === 0) && (
              <div className="col-11" style={{ textAlign: "center" }}>
                No se encontraron piezas para clonar
              </div>
            )}
          </>
        }
        footer={
          <>
            <div style={{ float: "right" }}>
              <StdButton title="Cerrar" handleClick={() => onClose()} />
            </div>
          </>
        }
      />

      {currentRecord && (
        <RecordDetailModal
          valuesByKey={{
            identifier: {
              title: "Identificador",
              value: currentRecord.identifier,
            },
            component: {
              title: "Componente",
              value: currentRecord.component.internal_name,
            },
            relevant_data: {
              title: "Datos Relevantes",
              value: currentRecord.relevant_data,
            },
          }}
          title={currentRecord.internal_name}
          onClose={() => setCurrentRecord(null)}
        />
      )}
    </>
  );
};

export default ClonePieceModal;
