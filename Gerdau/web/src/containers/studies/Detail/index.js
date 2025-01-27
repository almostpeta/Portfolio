import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { getStudyById, getFiles } from "service/study";
import { getFileFromName } from "service/filesService";
import { NavbarComponent } from "components/Navbar";
import useTranslate from "hooks/useTranslate";
import Tab from "react-bootstrap/Tab";
import { TabsComponent } from "components/Tabs";
import { Loading } from "components/Loading/index";
import { StudyDetail } from "./detail";
import FilesList from "./filesList";
import { Toast } from "components/Toast";

const DetailPage = (props) => {
  const studyId = props.match.params.id;
  const [isLoading, setIsLoading] = useState(false);
  const [study, setStudy] = useState(null);
  const [loadedStudy, setLoadedStudy] = useState(false);
  const [studyFiles, setStudyFiles] = useState([]);
  const [selectedTab, setSelectedTab] = useState("study");
  const [loadedFileNames, setLoadedFileNames] = useState(false);
  const [fileNames, setFileNames] = useState(false);
  const [filesList, setFilesList] = useState([]);

  const t = useTranslate();

  useEffect(() => {
    if (!loadedStudy) {
      setIsLoading(true);
      setLoadedStudy(true);
      getStudyById(studyId)
        .then((res) => {
          console.log(res);
          setStudy(res);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setStudy(null);
          setIsLoading(false);
        });
    }
  }, [loadedStudy, studyId]);

  useEffect(async () => {
    study &&
      (await getFiles(study.studyFiles)
        .then((res) => {
          setStudyFiles(res.filter((file) => file.isActive));
        })
        .catch((error) => {
          console.error(error);
          Toast("error", "No se pudieron cargar los archivos del estudio");
          setStudyFiles([]);
        }));
  }, [study]);

  return (
    <div>
      <NavbarComponent />
      {isLoading && (
        <div>
          <Loading />
        </div>
      )}
      {!isLoading && (
        <Container
          style={{
            maxHeight: "100vh",
            height: "100vh",
          }}
        >
          <TabsComponent
            defaultVal={selectedTab}
            handleKeyChange={(k) => setSelectedTab(k)}
          >
            <Tab eventKey="study" title="Estudio">
              <StudyDetail study={study} />
            </Tab>
            <Tab eventKey="files" title="Archivos">
              <FilesList files={studyFiles} />
            </Tab>
          </TabsComponent>
        </Container>
      )}
    </div>
  );
};

export default DetailPage;
