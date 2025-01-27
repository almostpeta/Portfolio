import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { FileFrame } from "components/FileFrame";
import { Row, Col, Container } from "react-bootstrap";
import { FilesModal } from "components/Modal/Modal";
import useTranslate from "hooks/useTranslate";
import { WarningAlert } from "components/UI/Alert";
import {
  selectFileMimeType,
  selectFileType,
  getBlobContentBase64,
} from "lib/fileUtils";
import Box from "components/UI/Box";

export const FilesRelatedList = ({ files, variant }) => {
  const history = useHistory();
  const t = useTranslate();

  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filesList, setFilesList] = useState([]);
  const [selectedFile, setSelectedFile] = useState({});

  const closeModal = () => setShowModal(false);

  const fileMessages = `${variant}.detail.related_files`;

  const selectMessage = (value) => t(fileMessages.concat("." + value));

  useEffect(() => {
    const activeFiles = [];
    files &&
      files.map((file) => {
        if (file.isActive) {
          activeFiles.push({
            name: file.originalName,
            url: getBlobContentBase64(file),
            customType: selectFileType(file.file),
          });
        }
      });
    files && setFilesList(activeFiles);
  }, [files]);

  const handleClick = (file) => {
    setSelectedFile(file);
    setShowModal(true);
  };

  return (
    <Container fluid>
      {filesList?.length > 0 && (
        <Box title={"Archivos Adjuntos"}>
          <Row>
            {filesList &&
              filesList.map((file, index) => (
                <Col lg="sm" key={index}>
                  <FileFrame
                    key={index}
                    file={file}
                    onClick={() => handleClick(file)}
                    //Add onClose method for deleting the file
                  />
                </Col>
              ))}
          </Row>
          <FilesModal
            show={showModal}
            onClose={closeModal}
            file={selectedFile}
            title={selectedFile.name}
          />
        </Box>
      )}
      {!files ||
        (filesList.length === 0 && (
          <Row style={{ margin: "10px" }}>
            <WarningAlert title={selectMessage("error_message")} />
          </Row>
        ))}
    </Container>
  );
};
