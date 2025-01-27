import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { doFetchFault } from "redux/fault/action";
import { Container, Tab, Row } from "react-bootstrap";
import { Loading } from "components/Loading/index";
import { TabsComponent } from "components/Tabs";
import { getFiles } from "service/fault";
import { NavbarComponent } from "components/Navbar";
import { FilesRelatedList } from "templates/Files";
import { parseAudio } from "lib/fileUtils";
import { FAULT_STATES } from "utils/constants";
import DetailPage from "containers/Faults/Forms/Fault";
import { getFaultZip } from "service/fault";
import RelatedCauses from "containers/Faults/RelatedCauses";
import Resolution from "../Resolution";
import lodash from "lodash";
import JSZip from "jszip";

const mapDispatch = (dispatch) => ({
  doFetchFaultAction: (faultId) => dispatch(doFetchFault(faultId)),
});
const mapStateToProps = (state) => {
  return {
    currentFault: state.fault.currentFault,
    loading: state.fault.loading,
    error: state.fault.error,
  };
};

const connector = connect(mapStateToProps, mapDispatch);

const FaultDetail = (props) => {
  const { doFetchFaultAction, currentFault, loading, error } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [fault, setFault] = useState(null);
  const [faultFiles, setFaultFiles] = useState([]);
  const [faultAudios, setFaultAudios] = useState([]);
  const [faultZip, setFaultZip] = useState([]);
  const [selectedTab, setSelectedTab] = useState("fault");
  const faultId = props.match.params.id;
  // if becomes from cause or solution creation
  const {
    createdCause,
    solution: createdSolution,
    methods: createdMethods,
  } = lodash.pick(props.location.state, ["cause", "solution", "methods"]);

  useEffect(() => {
    faultId && doFetchFaultAction(faultId);
  }, [doFetchFaultAction, faultId]);

  useEffect(() => {
    currentFault && setFault(currentFault);
  }, [currentFault]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  useEffect(() => {
    setErrorMessage(null);
  }, [error]);

  useEffect(async () => {
    try {
      const files = fault?.faultFiles && (await getFiles(fault.faultFiles));
      const realFiles = [];
      const realAudios = [];
      files.forEach((f) => {
        if (f.relatedTo === "files") {
          realFiles.push(f);
        } else {
          realAudios.push(parseAudio(f));
        }
      });
      setFaultFiles(realFiles);
      setFaultAudios(realAudios);
    } catch (e) {
      setFaultFiles([]);
      setFaultAudios([]);
    }
    try {
      if (fault?.id) {
        const zipData = await getFaultZip(fault.id);
        JSZip.loadAsync(zipData, { base64: true }).then((zip) => {
          setFaultZip(zip);
        });
      }
    } catch (e) {
      console.log(e);
      setFaultZip({});
    }
  }, [fault]);

  const handleRelateNewCauses = ({ causesToAdd, causesToDelete }) => {
    const cleanLst = fault.causes || [];

    if (causesToDelete?.length > 0) {
      causesToDelete.forEach((c) => {
        const foundCauseIdToDelete = cleanLst.find((_c) => _c.id === c.id);
        if (foundCauseIdToDelete) {
          cleanLst.splice(foundCauseIdToDelete, 1);
        }
      });
    }

    fault.causes = cleanLst.concat([...causesToAdd]);
  };

  const handleForceFetch = () => {
    try {
      setIsLoading(true);
      props.history.replace({ state: {} }); // reset navigation props
      setFault(null);

      doFetchFaultAction(faultId);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

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
        {!isLoading && !errorMessage && fault?.id && (
          <div>
            <Row className="d-block mt-5 ml-0 mr-0">
              <h2 style={{ color: "#01516a" }}>Resumen de Falla </h2>
              <hr />
            </Row>
            <TabsComponent
              defaultVal={selectedTab}
              handleKeyChange={(k) => setSelectedTab(k)}
            >
              <Tab eventKey="fault" title="Detalles">
                <DetailPage
                  createdCause={createdCause}
                  createdSolution={createdSolution}
                  createdMethods={createdMethods}
                  fault={fault}
                  audios={faultAudios}
                  zip={faultZip}
                  startLoading={() => setIsLoading(true)}
                  stopLoading={() => setIsLoading(false)}
                  onRelateNewCauses={(causesObj) =>
                    handleRelateNewCauses(causesObj)
                  }
                  initialCauses={fault.causes}
                  onForceFetch={() => handleForceFetch()}
                />
              </Tab>
              <Tab eventKey="relatedCauses" title="Causas">
                <RelatedCauses
                  causes={fault.causes}
                  faultId={fault.id}
                  handleLoading={(val) => setIsLoading(val)}
                  onRelateNewCauses={(causesObj) =>
                    handleRelateNewCauses(causesObj)
                  }
                  onForceCausesFetch={() => handleForceFetch()}
                />
              </Tab>
              {fault.state === FAULT_STATES.RESOLVED && (
                <Tab eventKey="resolution" title="Resolución">
                  <Resolution faultData={fault} />
                </Tab>
              )}
              <Tab eventKey="files" title="Archivos">
                <FilesRelatedList files={faultFiles} variant="faults" />
              </Tab>
            </TabsComponent>
          </div>
        )}
      </Container>
    </div>
  );
};

export default connector(FaultDetail);
