import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import useTranslate from "hooks/useTranslate";
import { TextArea } from "components/TextArea";
import { VoiceReproducer } from "components/VoiceReproducer";
import { TrashButton } from "components/UI/Trash";
import { FilesUploader } from "components/FilesUploader";
import { selectFileType, getBlobContentBase64 } from "lib/fileUtils";

const DisplayRow = ({ label, children }) => (
  <Row>
    <Col lg="12">
      <Form.Group controlId={label} className="mt-4">
        <Form.Label>{label}</Form.Label>
        {children}
      </Form.Group>
    </Col>
  </Row>
);

const MethodForm = ({
  data,
  solutionId,
  onChange,
  onSubmit,
  onCancel,
  isSubmitted,
  isEditing,
  files,
  solutionsData,
  onDeleteFile,
  deleteFiles,
}) => {
  const t = useTranslate();
  const [methodData, setMethodData] = useState(data || []);
  const [name, setName] = useState(methodData.name || "");
  const [description, setDescription] = useState(methodData.description || "");
  const [solution, setSolution] = useState(
    methodData.solutionId || solutionId || null
  );
  const [descriptionRecord, setDescriptionRecord] = useState(null);
  const [methodFiles, setMethodFiles] = useState(files || []);
  const [solutions, setSolutions] = useState(solutionsData || []);

  const [methodDeletedFiles, setMethodDeletedFiles] = useState(
    deleteFiles || []
  );
  const handleFileUpload = (files) => {
    setMethodFiles(files);
    onChange("files", files);
  };

  useEffect(() => {
    onChange("name", name);
  }, [name]);

  useEffect(() => {
    solution && setSolution(solution);
    onChange("solutionId", solution);
  }, [solution]);

  useEffect(() => {
    solutions && setSolutions(solutionsData);
  }, [solutionsData]);

  useEffect(() => {
    data && setMethodData(data);
    if (isEditing && data) {
      console.log("DATA METHOD", data.solution?.id);
      setName(data.name);
      !!data.description && setDescription(data.description);
      data.solution && setSolution(data.solution.id);
    }
  }, [data]);

  useEffect(() => {
    if (files && isEditing) {
      setMethodFiles(
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
    files &&
      files.map((a) => {
        if (a.relatedTo === "description_record" && a.isActive) {
          setDescriptionRecord({ ...a, blobURL: getBlobContentBase64(a) });
        }
      });
  }, [files]);

  useEffect(() => {
    onChange("description", description);
  }, [description]);

  const handleRecordChange = (attr, record) => {
    if (
      !record &&
      !window.confirm(t("containers.methods.newMethod.deleteVoiceRecord"))
    ) {
      return;
    }
    let file = null;
    if (record) {
      // add the audio as file
      file = new File([record.arrayBuffer], `${attr}-${name}.webm`, {
        type: "audio/webm",
      });
      file.relatedTo = attr;
    }
    if (attr === "description") {
      !record && handleDeleteFile([descriptionRecord]);
      onChange("description_record", file);
      setDescriptionRecord(record);
    }
  };

  useEffect(() => {
    deleteFiles && setMethodDeletedFiles(deleteFiles);
  }, [deleteFiles]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(false);
    return false;
  };

  const handleSubmitWithMethod = (e) => {
    e.preventDefault();
    onSubmit(true);
    return false;
  };

  const handleDeleteFile = (value) => {
    const deletedFile = value[0];
    if (deletedFile.id) {
      const deletedFilesList = [...methodDeletedFiles];
      deletedFilesList.push(deletedFile.id);
      setMethodDeletedFiles(deletedFilesList);
      onDeleteFile(deletedFilesList);
    }
  };

  return (
    <Container>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <Row className="justify-content-md-center ml-0 mt-5 text-left">
          <h2 style={{ color: "#01516a" }}>
            {!isEditing
              ? t("containers.methods.newMethod.title")
              : t("containers.methods.editMethod.title")}
          </h2>
          <hr />
        </Row>

        <DisplayRow
          label={`*${t("containers.methods.newMethod.name")}`}
          children={
            <>
              <Form.Control
                type="text"
                placeholder="Ingresar título del Método"
                value={name}
                isInvalid={isSubmitted && !name}
                onChange={(e) => setName(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {"Ingrese un valor"}
              </Form.Control.Feedback>
            </>
          }
        />

        <DisplayRow
          label={`${t("containers.methods.newMethod.description")}`}
          children={
            <>
              <TextArea
                includeMicro
                onRecord={(record) => handleRecordChange("description", record)}
                initRecord={descriptionRecord}
                name="Description"
                rows={4}
                value={description}
                placeholder={"Descripción"}
                onChange={(e) => setDescription(e.target.value)}
              />
              {descriptionRecord && (
                <>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      alignItems: "center",
                      marginTop: "10px",
                    }}
                  >
                    <VoiceReproducer src={descriptionRecord.blobURL} />
                    <TrashButton
                      onClick={() => handleRecordChange("description", null)}
                      style={{
                        marginLeft: "5px",
                        marginBottom: "15px",
                      }}
                      size="1x"
                    />
                  </div>
                </>
              )}
            </>
          }
        />
        <DisplayRow
          label={`*${t("containers.methods.newMethod.solution")}`}
          children={
            <>
              <Form.Control
                as="select"
                onChange={(event) => setSolution(event.target.value)}
                isInvalid={isSubmitted && !solution}
                value={solution}
              >
                <option value="" hidden>
                  {"Seleccione una solución"}
                </option>
                {solutions &&
                  solutions.map((sol, i) => (
                    <option key={i} value={sol.id}>
                      {sol.name}
                    </option>
                  ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {"Seleccione un usuario responsable"}
              </Form.Control.Feedback>
            </>
          }
        />
        <div>
          <FilesUploader
            title={"Archivos Adjuntos"}
            onChange={(e) => handleFileUpload(e)}
            placeholder={"Archivos Adjuntos"}
            initFiles={methodFiles}
            onDeleteFile={handleDeleteFile}
          />
        </div>
        <Row className="justify-content-end mt-5 mr-0 mb-5">
          <Button
            variant="outline-primary"
            onClick={() => onCancel()}
            type="button"
            className="center mr-2"
          >
            {`${t("containers.methods.newMethod.cancel")}`}
          </Button>
          <Button
            variant="primary"
            type="submit"
            className={`center ${isEditing ? "" : "mr-2"}`}
          >
            {`${t("containers.methods.newMethod.save")}`}
          </Button>
          {!isEditing && (
            <Button
              variant="primary"
              type="button"
              onClick={handleSubmitWithMethod}
              className="center"
            >
              Guardar y Crear Nuevo
            </Button>
          )}
        </Row>
      </Form>
    </Container>
  );
};

export default MethodForm;
