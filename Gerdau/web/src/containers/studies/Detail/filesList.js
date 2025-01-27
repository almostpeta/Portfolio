import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Loading } from "components/Loading/index";
import { Button, Row, Col, Alert } from "react-bootstrap";
import { Warning } from "components/UI/Warning";
import moment from "moment";
import useTranslate from "hooks/useTranslate";
import { FilesModal } from "components/Modal/Modal";
import { FileFrame } from "components/FileFrame";
import {
  selectFileMimeType,
  selectFileType,
  getBlobContentBase64,
} from "lib/fileUtils";

const FilesList = ({ files }) => {
  const history = useHistory();
  const t = useTranslate();

  const [selectedFile, setSelectedFile] = useState([]);
  const [studyFiles, setStudyFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => setShowModal(false);

  useEffect(() => {
    files &&
      setStudyFiles(
        files.map((file) => {
          return {
            name: file.file,
            url: getBlobContentBase64(file),
            customType: selectFileType(file.file),
          };
        })
      );
  }, [files]);

  const studyMessages = "study.files";
  const selectMessage = (value) => t(studyMessages.concat("." + value));

  const handleClick = (file) => {
    setSelectedFile(file);
    setShowModal(true);
  };

  return (
    <React.Fragment>
      <Row>
        {studyFiles?.length > 0 && (
          <div
            style={{
              display: "flex",
              whiteSpace: "wrap",
            }}
          >
            <div
              style={{
                maxWidth: "1100px",
                overflowX: "scroll",
                display: "flex",
              }}
            >
              {studyFiles &&
                studyFiles.map((file, index) => (
                  <div key={index}>
                    <FileFrame
                      key={index}
                      file={file}
                      onClick={() => handleClick(file)}
                      //Add onClose method for deleting the file
                    />
                  </div>
                ))}
            </div>
            <FilesModal
              show={showModal}
              onClose={closeModal}
              file={selectedFile}
            />
          </div>
        )}
        {!studyFiles ||
          (studyFiles.length === 0 && (
            <Alert variant="warning" style={{ margin: "2rem", width: "100%" }}>
              <Warning size="1x" /> {selectMessage("error_message")}
            </Alert>
          ))}
      </Row>
    </React.Fragment>
  );
};

export default FilesList;
