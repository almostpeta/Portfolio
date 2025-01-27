import React, { useState, useEffect } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";

import { DatePicker } from "components/UI/DatePicker/index";
import { TextArea } from "components/TextArea";
import { Button } from "components/Button";
import useTranslate from "hooks/useTranslate";
import { selectFileType, getBlobContentBase64 } from "lib/fileUtils";
import { FilesUploader } from "components/FilesUploader";
import "./styles.css";

export const StudyForm = ({
  data,
  onCancel,
  onChange,
  onSubmit,
  onSubmitAndReturn,
  isSubmited,
  isEditing,
  components,
  pieces,
  componentId,
  pieceId,
  onDeleteFile,
  deleteFiles,
  enableSaveAndReturn,
  files,
}) => {
  const t = useTranslate();
  const selectPiece = (pieceId) => {
    const data =
      pieces && pieces.filter((item) => item?.id.toString() === pieceId);
    return data[0] ? data[0] : null;
  };
  const [studyFiles, setStudyFiles] = useState(files || []);
  const [studyDeletedFiles, setStudyDeletedFiles] = useState(deleteFiles || []);
  const [studyData, setStudyData] = useState(data);
  const [internalName, setInternalName] = useState(studyData["internal_name"]);
  const [submited, setSubmited] = useState(isSubmited);
  const [reason, setReason] = useState(studyData["reason"]);
  const [component, setComponent] = useState(
    studyData["componentId"] || componentId
  );
  const [piece, setPiece] = useState(studyData["pieceId"] || pieceId);
  const [date, setDate] = useState(
    (studyData["date"] && new Date(studyData["date"])) || new Date()
  );
  const [forceRerender, setForceRerender] = useState(false);
  const [randomKey, setRandomKey] = useState("");
  const studyMessages = "study.new";

  const selectMessage = (value) => t(studyMessages.concat("." + value));

  useEffect(() => {
    isSubmited && setSubmited(isSubmited);
  }, [isSubmited]);

  useEffect(() => {
    if (!randomKey) {
      setRandomKey(Math.random().toString(36));
    }
    if (forceRerender) {
      setForceRerender(false);
    }
  }, [forceRerender, randomKey]);

  const handleInternalNameChange = (value = "") => {
    setInternalName(value);
    onChange("internal_name", value);
  };

  const handleComponentChange = (value) => {
    setComponent(value);
    onChange("componentId", value);
    setPiece(undefined);
    onChange("pieceId", null);
  };

  const handleReasonChange = (value = "") => {
    setReason(value);
    onChange("reason", value);
  };
  const handleDateChange = (value = null) => {
    setDate(value);
    onChange("date", value);
  };

  const handleFileUpload = (files) => {
    setStudyFiles(files);
    onChange("files", files);
  };

  const piecesOptions = (data) => {
    const objects =
      data &&
      data.map((piece, index) => ({
        name: piece.internal_name || "",
        id: piece.id.toString() || "",
      }));
    return objects;
  };

  const handlePieceChange = (value) => {
    setPiece(value.toString());
    const newPiece = selectPiece(value?.toString());
    if (newPiece) {
      setComponent(newPiece.componentId);
      onChange("componentId", newPiece.componentId);
      onChange("pieceId", value);
    }
  };

  const handleDeleteFile = (value) => {
    const deletedFile = value[0];
    if (deletedFile.id) {
      const deletedFilesList = [...studyDeletedFiles];
      deletedFilesList.push(deletedFile.id);
      setStudyDeletedFiles(deletedFilesList);
      onDeleteFile(deletedFilesList);
    }
  };

  useEffect(() => {
    if (data && isEditing) {
      setStudyData(data);
      handleInternalNameChange(data.internal_name);
      data.date && handleDateChange(new Date(data.date));
      //this line should be always before the handlePieceChange function
      //because when the component changes, it cleans piece value
      data.componentId && handleComponentChange(data.componentId);
      data.pieceId && handlePieceChange(data.pieceId);
      data.reason && handleReasonChange(data.reason);
    }
  }, [data]);

  useEffect(() => {
    !!pieceId && handlePieceChange(pieceId);
  }, [pieceId]);

  useEffect(() => {
    !!componentId && handleComponentChange(componentId);
  }, [componentId]);

  useEffect(() => {}, [components]);

  useEffect(() => {
    if (files && isEditing) {
      setStudyFiles(
        files.map((file) => {
          if (file instanceof File) {
            return file;
          } else {
            return {
              id: file.id,
              componentId: file.componentId,
              name: file.name || file.file,
              url: file.url || getBlobContentBase64(file),
              customType: file.customType || selectFileType(file.file),
              relatedTo: file.relatedTo,
            };
          }
        })
      );
    }
  }, [files]);

  const App = () => {
    return (
      <>
        <Container>
          <div>
            <h2 style={{ color: "#01516a", paddingTop: "30Px" }}>
              {isEditing
                ? selectMessage("edit_title")
                : selectMessage("new_title")}{" "}
            </h2>
            <hr />
          </div>
          <Form>
            <Row className="flex space-between">
              <Col lg="6">
                <Form.Group controlId="name" className="mt-4">
                  <Form.Label>*{selectMessage("internal_name")}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={selectMessage("internal_name")}
                    onChange={(e) => handleInternalNameChange(e.target.value)}
                    value={internalName}
                    isInvalid={submited && !internalName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {"Ingrese un valor"}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>{" "}
              <Col lg="6">
                <Form.Group controlId="Date" className="mt-4">
                  <Form.Label>*{selectMessage("date")}</Form.Label>
                  <br />
                  <DatePicker
                    date={date}
                    onChange={(date) => handleDateChange(date)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg="6">
                <Form.Group controlId="Component" className="mt-4">
                  <Form.Label>*{selectMessage("component")}</Form.Label>
                  <Form.Control
                    required
                    as="select"
                    isInvalid={submited && !component}
                    onChange={(e) => handleComponentChange(e.target.value)}
                    value={component}
                  >
                    <option value="" hidden>
                      {"Seleccionar Componente"}
                    </option>

                    {components &&
                      components.map((u, i) => (
                        <option key={i} value={u.id}>
                          {u.internal_name}
                        </option>
                      ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {"Seleccione un valor"}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group controlId="Piece" className="mt-4">
                  <Form.Label>*{selectMessage("piece")}</Form.Label>

                  <Form.Control
                    required
                    as="select"
                    onChange={(e) => handlePieceChange(e.target.value)}
                    value={piece}
                  >
                    <option value="" hidden>
                      {"Seleccionar Pieza"}
                    </option>
                    {pieces &&
                      piecesOptions(
                        pieces.filter((piece) =>
                          component
                            ? piece.componentId.toString() ===
                              component.toString()
                            : true
                        )
                      ).map((u, i) => (
                        <option key={i} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg="12">
                <Form.Group
                  controlId="reason"
                  className="mt-4"
                  style={{ height: "100%" }}
                >
                  <Form.Label>*{selectMessage("reason")}</Form.Label>
                  <TextArea
                    name="reason"
                    rows={4}
                    value={reason}
                    placeholder={selectMessage("reason")}
                    onChange={(e) => handleReasonChange(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <div>
                <FilesUploader
                  title={selectMessage("files")}
                  onChange={(e) => handleFileUpload(e)}
                  placeholder={"Archivos"}
                  initFiles={studyFiles}
                  onDeleteFile={handleDeleteFile}
                />
              </div>
            </Row>
            <Row className="justify-content-start mt-5">
              <Button onClick={() => onCancel()} variant="outline-primary">
                {selectMessage("cancel_btn")}
              </Button>
            </Row>
            <Row className="justify-content-end mb-5">
              <Button onClick={() => onSubmit(true)}>
                {selectMessage("save_btn")}
              </Button>
              {!isEditing && enableSaveAndReturn && (
                <Button
                  className="center new"
                  onClick={() => onSubmitAndReturn(true)}
                >
                  {selectMessage("save_and_return_btn")}
                </Button>
              )}
            </Row>
          </Form>
        </Container>
      </>
    );
  };

  return <div>{App()}</div>;
};

export default StudyForm;
