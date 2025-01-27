import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { doFetchMethod } from "redux/method/action";
import { Container, Tab, Row } from "react-bootstrap";
import { Loading } from "components/Loading/index";
import { TabsComponent } from "components/Tabs";
import { getFiles } from "service/method";
import { NavbarComponent } from "components/Navbar";
import { FilesRelatedList } from "templates/Files";
import DetailPage from "./Detail";

const mapDispatch = (dispatch) => ({
  doFetchMethodAction: (methodId) => dispatch(doFetchMethod(methodId)),
});
const mapStateToProps = (state) => {
  return {
    currentMethod: state.method.currentMethod,
    loading: state.method.loading,
    error: state.method.error,
  };
};

const connector = connect(mapStateToProps, mapDispatch);

const MethodDetail = (props) => {
  const { doFetchMethodAction, currentMethod, loading, error } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [method, setMethod] = useState(null);
  const [methodFiles, setMethodFiles] = useState([]);
  const [methodAudios, setMethodAudios] = useState([]);
  const [selectedTab, setSelectedTab] = useState("method");

  const methodId = props.match.params.id;

  useEffect(() => {
    methodId && doFetchMethodAction(methodId);
  }, [doFetchMethodAction, methodId]);

  useEffect(() => {
    currentMethod && setMethod(currentMethod);
  }, [currentMethod]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  useEffect(() => {
    setErrorMessage(null);
  }, [error]);

  useEffect(async () => {
    method?.methodFiles &&
      (await getFiles(method.methodFiles)
        .then((res) => {
          const realFiles = [];
          const realAudios = [];
          res.forEach((f) => {
            if (f.relatedTo === "files") {
              realFiles.push(f);
            } else {
              const byteCharacters = atob(f.data);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: "audio/mpeg" });
              const blobURL = URL.createObjectURL(blob);
              const { id, methodId, originalName, relatedTo } = f;
              const obj = {
                id,
                methodId,
                originalName,
                relatedTo,
                blobURL,
              };
              realAudios.push(obj);
            }
          });
          setMethodFiles(realFiles);
          setMethodAudios(realAudios);
        })
        .catch((error) => {
          setMethodFiles([]);
        }));
  }, [method]);

  return (
    <div>
      <NavbarComponent />
      <Container
        style={{
          maxHeight: "100vh",
          height: "100vh",
        }}
      >
        {isLoading && <Loading />}
        {!isLoading && errorMessage && <h5>{errorMessage}</h5>}
        {!isLoading && !errorMessage && method?.id && (
          <div>
            <Row className="d-block mt-5 ml-0 mr-0">
              <h2 style={{ color: "#01516a" }}>Resumen de Método</h2>
              <hr />
            </Row>
            <TabsComponent
              defaultVal={selectedTab}
              handleKeyChange={(k) => setSelectedTab(k)}
            >
              <Tab eventKey="method" title="Detalles">
                <DetailPage
                  method={method}
                  audios={methodAudios}
                  startLoading={() => setIsLoading(true)}
                  stopLoading={() => setIsLoading(false)}
                />
              </Tab>
              <Tab eventKey="files" title="Archivos">
                <FilesRelatedList
                  files={methodFiles}
                  variant="containers.methods"
                />
              </Tab>
            </TabsComponent>
          </div>
        )}
      </Container>
    </div>
  );
};

export default connector(MethodDetail);
