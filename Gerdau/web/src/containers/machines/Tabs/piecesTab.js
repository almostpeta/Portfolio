import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { PieceForm } from "containers/machines/Forms/Piece";
import { Collapse } from "components/Collapse/index";
import { Button } from "components/Button";
import { useHistory } from "react-router-dom";
import { Plus } from "react-bootstrap-icons";
import { FaCopy } from "react-icons/fa";
import { deletePieceById } from "service/piece.js";
import useTranslate from "hooks/useTranslate";
import ClonePieceModal from "components/UI/ClonePieceModal";
import { getFiles as getPiecesFiles } from "service/piece";
import { getFileFromBase64, getBlobContentBase64 } from "lib/fileUtils";

const getFileFromUrl = async (url, name, defaultType = "image/jpeg") => {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], name, {
    type: defaultType,
  });
};

export const PiecesTab = ({
  onChange,
  data,
  setData,
  onSubmit,
  machinesData,
  componentsData,
  usersData,
  manufacturersData,
  providersData,
  isSubmitted,
  isEditing,
  files,
  onChangeFiles,
  onDeleteFile,
  deleteFiles,
  defaultOpenCollapse,
  onCancel,
  onFinish,
}) => {
  const setInitialPiece = () => {
    return data;
  };

  const [pieces, setPieces] = useState(setInitialPiece());
  const [showClonePieceModal, setShowClonePieceModal] = useState(false);
  const [deletedPiecesFiles, setDeletedPiecesFiles] = useState(
    deleteFiles || []
  );
  const [forceRerender, setForceRerender] = useState(false);
  const [users, setUsers] = useState(usersData || []);
  const [manufacturers, setManufacturers] = useState(manufacturersData || []);
  const [providers, setProviders] = useState(providersData || []);
  const [submited, setSubmited] = useState(isSubmitted);
  const machineMessages = "containers.machines.piece";
  const t = useTranslate();
  const history = useHistory();

  const detailsHandler = (index) => {
    const pieceId = [...pieces][index].id;
    history.push(`/piece/detail/${pieceId}`);
  };

  const selectMessage = (value) => {
    return t(machineMessages.concat("." + value));
  };

  useEffect(() => {
    setPieces(data);
  }, [data]);

  useEffect(() => {
    usersData && setUsers(usersData);
  }, [usersData]);

  useEffect(() => {
    manufacturersData && setManufacturers(manufacturersData);
  }, [manufacturersData]);

  useEffect(() => {
    providersData && setProviders(providersData);
  }, [providersData]);

  useEffect(() => {
    isSubmitted && setSubmited(isSubmitted);
  }, [isSubmitted]);

  const deleteHandler = (index) => {
    if (window.confirm(selectMessage("deleteComponentConfirmation"))) {
      const pieceId = pieces[index].id;

      if (pieceId) {
        deletePieceById(pieceId)
          .then((res) => {
            deletePieceFromList(index);
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        deletePieceFromList(index);
      }
    }
  };

  const deletePieceFromList = (index) => {
    const piecesList = [...pieces];
    piecesList.splice(index, 1);
    setData(piecesList);
    setForceRerender(true);
  };

  const getPieceWithFileData = async (piece) => {
    let allFiles = [];

    if (piece.pieceFiles.length > 0) {
      piece.pieceFiles = piece.pieceFiles.filter((file) => {
        file.isActive && allFiles.push(file);
        return file.isActive;
      });
    }

    const filesWithData = await getPiecesFiles(allFiles);

    piece.pieceFiles.length > 0 &&
      piece.pieceFiles.map((file) => {
        const foundFile = filesWithData.find((f) => f.id === file.id);
        file.data = foundFile.data;
      });

    return piece;
  };

  const addPieceForm = async (p, fetchData) => {
    let cleanPiece = {};

    if (fetchData && p) {
      const cleanP = await getPieceWithFileData(p);
      p = cleanP;
    }
    if (p) {
      cleanPiece = {
        componentId: p.componentId?.toString() || p.component,
        identifier: p.identifier,
        internal_name: p.internal_name,
        responsibleId: p.responsibleId || p.maintenance_responsible,
        responsible: p.responsible,
        make: p.make,
        manufacturer: p.manufacturer,
        manufacturer_type: p.manufacturer_type,
        model: p.model,
        provider: p.provider,
        specifications: p.specifications,
        type: p.type,
        working_from_date: p.working_from_date,
        pieceFiles:
          p.pieceFiles?.map((f) => ({
            ...f,
            pieceId: null,
            resourceId: null,
          })) || [],
      };

      let fileInstances = [];
      try {
        fileInstances = await Promise.all(
          cleanPiece.pieceFiles.map(async (f) => {
            const fileIns = await getFileFromBase64(
              f.data,
              `cloned_${f.originalName}`
            );
            const fileURL = getBlobContentBase64(f);
            f.url = fileURL;
            return fileIns;
          })
        );
      } catch (err) {}

      cleanPiece.files = fileInstances.length > 0 ? fileInstances : p.files;
      if (p.files?.length > 0) {
        cleanPiece.pieceFiles = p.files;
      }
    }
    cleanPiece.isPiece = true;
    const newData = [...pieces, cleanPiece];
    setData(newData);
  };

  const handleDeleteFile = (value) => {
    const deletedFile = value[0];
    if (deletedFile.id) {
      const deletedFilesList = [...deletedPiecesFiles];
      deletedFilesList.push({
        id: deletedFile.id,
        pieceId: deletedFile.pieceId,
      });
      setDeletedPiecesFiles(deletedFilesList);
      onDeleteFile(deletedFilesList);
    }
  };

  useEffect(() => {
    deleteFiles && setDeletedPiecesFiles(deleteFiles);
  }, [deleteFiles]);

  const setPiecesData = () =>
    pieces &&
    pieces.map((piece, index) => (
      <>
        <div style={{ marginBottom: "20px", overflowX: "scroll" }}>
          <PieceForm
            index={index}
            onChange={onChange}
            data={data[index]}
            machinesData={machinesData}
            componentsData={componentsData}
            usersData={users}
            manufacturersData={manufacturers}
            providersData={providers}
            isSubmitted={submited}
            isEditing={isEditing}
            onDeleteFile={(value) => handleDeleteFile(value)}
          />
        </div>
      </>
    ));

  const handleSelectPiece = (p) => {
    addPieceForm(p, true);
    setShowClonePieceModal(false);
  };

  const handleCloneClick = (index) => {
    const pieceToClone = data[index];
    console.log(pieceToClone);
    addPieceForm(pieceToClone, !!pieceToClone.id);
  };

  return (
    <Container>
      <div>
        <h2 style={{ color: "#01516a" }}>
          {" "}
          {isEditing ? selectMessage("edit_title") : selectMessage("new_title")}
        </h2>
        <hr />
      </div>
      <Collapse
        childrens={setPiecesData()}
        onDelete={(index) => deleteHandler(index)}
        onChangeHeader={(i, v, e) => onChange(i, v, e)}
        headerPlaceholder={"Ingresar nombre interno de la Pieza"}
        data={pieces}
        onDetails={(index) => detailsHandler(index)}
        defaultTitle={"Pieza"}
        titleProp={"internal_name"}
        defaultActiveKey={defaultOpenCollapse}
        onCloneClick={(index) => handleCloneClick(index)}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
          // maxHeight: "40px",
          alignItems: "center",
        }}
      >
        <Button onClick={() => addPieceForm()}>
          <Plus size={25} />
          Agregar Pieza
        </Button>
        <Button onClick={() => setShowClonePieceModal(true)}>
          <FaCopy size={25} />
          Clonar Existente
        </Button>

        <div>
          <Button className="mr-2" onClick={() => onCancel()}>
            Cancelar
          </Button>
          <Button onClick={(e) => onSubmit(e)}>Guardar</Button>
        </div>
      </div>
      {showClonePieceModal && (
        <ClonePieceModal
          onClose={() => setShowClonePieceModal(false)}
          onSelectPiece={(p) => handleSelectPiece(p)}
        />
      )}
    </Container>
  );
};
