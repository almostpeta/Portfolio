import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { doFetchSingleSolution } from "redux/solution/action";
import { getFiles } from "service/solution";
import { Container, Tab, Row } from "react-bootstrap";
import { Loading } from "components/Loading/index";
import { NavbarComponent } from "components/Navbar";
import { TabsComponent } from "components/Tabs";
import MethodsRelatedList from "./methodsRelatedList";
import { FilesRelatedList } from "templates/Files";
import Detail from "./Detail";

const mapDispatch = (dispatch) => ({
  doFetchSingleSolutionAction: (solutionId) =>
    dispatch(doFetchSingleSolution(solutionId)),
});
const mapStateToProps = (state) => {
  return {
    currentSolution: state.solution?.currentSolution,
    loading: state.solution?.loading,
    error: state.solution?.error,
  };
};

const connector = connect(mapStateToProps, mapDispatch);

const DetailPage = (props) => {
  const {
    doFetchSingleSolutionAction,
    currentSolution,
    loading,
    error,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [solution, setSolution] = useState(null);
  const [solutionFiles, setSolutionFiles] = useState([]);
  const [selectedTab, setSelectedTab] = useState("solution");

  const solutionId = props.match.params.id;

  useEffect(() => {
    solutionId && doFetchSingleSolutionAction(solutionId);
  }, [doFetchSingleSolutionAction, solutionId]);

  useEffect(async () => {
    try {
      const cleanSolution = currentSolution && { ...currentSolution };
      if (currentSolution?.solutionFiles?.length > 0) {
        const activeFiles = currentSolution.solutionFiles.filter(
          (f) => f.isActive
        );
        const cleanFiles = await getFiles(activeFiles, false);
        setSolution({ ...cleanSolution, files: cleanFiles });
      } else {
        setSolution(cleanSolution);
      }
    } catch (e) {}
  }, [currentSolution]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  useEffect(() => {
    setErrorMessage(null);
  }, [error]);

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
        {!isLoading && !errorMessage && solution?.id && (
          <div>
            <Row className="d-block mt-5 ml-0 mr-0">
              <h2 style={{ color: "#01516a" }}>Resumen de Solución </h2>
              <hr />
            </Row>
            <TabsComponent
              defaultVal={selectedTab}
              handleKeyChange={(k) => setSelectedTab(k)}
            >
              <Tab eventKey="solution" title="Detalles">
                <Detail
                  solution={solution}
                  setLoading={(e) => setIsLoading(e)}
                  onRecordAction={(newSolution) =>
                    setSolution({ ...newSolution })
                  }
                />
              </Tab>
              <Tab eventKey="files" title="Archivos">
                <FilesRelatedList
                  files={solution.files || []}
                  variant="containers.solutions"
                />
              </Tab>
              <Tab eventKey="methods" title="Métodos">
                <MethodsRelatedList
                  methods={solution.methods}
                  solutionId={solution.id}
                  handleLoading={(val) => setIsLoading(val)}
                />
              </Tab>
            </TabsComponent>
          </div>
        )}
      </Container>
    </div>
  );
};

export default connector(DetailPage);
