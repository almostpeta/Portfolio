import React, { useEffect, useState } from "react";
import { Col, Form, Row, Container } from "react-bootstrap";
import { FileFrame } from "components/FileFrame/FileFrame.tsx";
import { ModalComponent } from "components/Modal/Modal";
import PDFViewer from "components/UI/PDFViewer";
import InnerImageZoom from "react-inner-image-zoom";
import "./FilesUploader.css";

export const FilesUploader = ({
  title,
  placeholder,
  onChange,
  initFiles,
  resourceId,
  onDeleteFile,
}) => {
  const [files, setFiles] = useState(initFiles || []);
  const [randomKey, setRandomKey] = useState("");
  const [selectedFile, setSelectedFile] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setFiles(initFiles);
  }, [initFiles]);

  const handleFileUpload = (event) => {
    const cleanFiles = files ? [...files] : [];
    [...event.target.files].forEach((file) => {
      const ext =
        file && file.name && file.name.substr(file.name.lastIndexOf(".") + 1);
      const type =
        ["pdf", "csv", "docx", "xlsx", "webm"].indexOf(ext) !== -1
          ? ext
          : ["mkv", "mp4", "mov"].indexOf(ext) !== -1
          ? "video"
          : "image";
      file.url = URL.createObjectURL(file);
      file.customType = type;
      file.resourceId = resourceId;
      cleanFiles.push(file);
    });
    setFiles(cleanFiles);
    onChange(cleanFiles);
  };

  const handleClick = (file) => {
    setSelectedFile(file);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const displayModalContent = (file) => {
    let content;
    switch (file.customType) {
      case "image":
        content = (
          <InnerImageZoom
            style={{ maxHeight: "80vh" }}
            src={selectedFile.url}
            zoomSrc={selectedFile.url}
            fullscreenOnMobile={true}
            moveType="drag"
          />
        );
        break;
      case "pdf":
        content = (
          <div>
            <PDFViewer url={file.url} />
          </div>
        );
        break;
      case "video":
        content = (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <video
              muted
              preload={"auto"}
              src={file.url}
              controls
              autoPlay
              style={{
                borderRadius: "10px",
                maxWidth: "100%",
              }}
            />
          </div>
        );
        break;
    }
    return content;
  };

  const removeFile = (indexFile) => {
    const fileList = [...files];
    let deletedItem = fileList.splice(indexFile, 1);
    setFiles(fileList);
    onChange(fileList);
    onDeleteFile && onDeleteFile(deletedItem);
    setRandomKey(Math.random().toString(36));
  };

  return (
    <Container>
      {" "}
      <Form.Group controlId="files" className="mt-4">
        <Form.Label>{title}</Form.Label>
        <Form.Control
          key={randomKey}
          type="file"
          placeholder={placeholder}
          multiple
          onChange={handleFileUpload}
        />
      </Form.Group>
      <Row>
        {files &&
          files.map(
            (file, index) =>
              (!file.relatedTo || file.relatedTo === "files") && (
                <Col lg="sm">
                  <FileFrame
                    key={index}
                    file={file}
                    onClick={() => handleClick(file)}
                    onClose={() => removeFile(index)}
                  />
                </Col>
              )
          )}
      </Row>
      <ModalComponent
        show={showModal}
        onClose={closeModal}
        children={displayModalContent(selectedFile)}
      />
    </Container>
  );
};
