import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { doFetchCause } from "redux/cause/action";
import { Container, Tab, Row } from "react-bootstrap";
import { Loading } from "components/Loading/index";
import { TabsComponent } from "components/Tabs";
import DetailPage from "containers/Cause/Forms/Cause";
import { NavbarComponent } from "components/Navbar";
import { FaultsRelatedList } from "templates/FaultsRelatedList";
import SolutionsRelatedList from "./solutionsRelatedList";
import { WarningAlert } from "components/UI/Alert";
import useTranslate from "hooks/useTranslate";

const mapDispatch = (dispatch) => ({
  doFetchCauseAction: (causeId) => dispatch(doFetchCause(causeId)),
});
const mapStateToProps = (state) => {
  return {
    currentCause: state.cause.currentCause,
    loading: state.loading,
    error: state.cause.error,
  };
};

const connector = connect(mapStateToProps, mapDispatch);

const CauseDetail = (props) => {
  const { doFetchCauseAction, currentCause, loading, error } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [cause, setCause] = useState(null);
  const [selectedTab, setSelectedTab] = useState("cause");

  const t = useTranslate();
  const causeId = props.match.params.id;

  useEffect(() => {
    causeId && doFetchCauseAction(causeId);
  }, [doFetchCauseAction, causeId]);

  useEffect(() => {
    currentCause && setCause(currentCause);
  }, [currentCause]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  useEffect(() => {
    setErrorMessage(error);
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
        {!isLoading && !errorMessage && cause?.id && (
          <div>
            <Row className="d-block mt-5 ml-0 mr-0">
              <h2 style={{ color: "#01516a" }}>Resumen de Causa</h2>
              <hr />
            </Row>
            <TabsComponent
              defaultVal={selectedTab}
              handleKeyChange={(k) => setSelectedTab(k)}
            >
              <Tab eventKey="cause" title="Detalles">
                <DetailPage
                  cause={cause}
                  startLoading={() => setIsLoading(true)}
                  stopLoading={() => setIsLoading(false)}
                />
              </Tab>
              <Tab eventKey="faults" title="Fallas">
                <FaultsRelatedList faults={cause.faults} variant="causes" />
              </Tab>
              <Tab eventKey="solutions" title="Soluciones">
                <SolutionsRelatedList
                  solutions={cause.solutions}
                  causeId={cause.id}
                />
              </Tab>
            </TabsComponent>
          </div>
        )}
        {!isLoading && !errorMessage && !cause && (
          <Row style={{ margin: "2rem" }}>
            <WarningAlert title={`${t("causes.detail.not_found")}`} />
          </Row>
        )}
      </Container>
    </div>
  );
};

export default connector(CauseDetail);
