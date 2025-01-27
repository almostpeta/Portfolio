import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { doFetchSingleSolution } from "redux/solution/action";
import { doFetchCauses } from "redux/cause/action";
import { doFetchUsers } from "redux/user/action";
import { getFiles } from "service/solution";
import { Container, Row } from "react-bootstrap";
import { Loading } from "components/Loading/index";
import { NavbarComponent } from "components/Navbar";
import { WarningAlert } from "components/UI/Alert";
import useTranslate from "hooks/useTranslate";
import EditForm from "./Edit";

const mapDispatch = (dispatch) => ({
  doFetchSingleSolutionAction: (solutionId) =>
    dispatch(doFetchSingleSolution(solutionId)),
  doFetchCausesAction: () => dispatch(doFetchCauses()),
  doFetchUsersAction: () => dispatch(doFetchUsers()),
});
const mapStateToProps = (state) => {
  console.log(state);
  return {
    currentSolution: state.solution?.currentSolution,
    loading:
      state.solution?.loading || state.cause.loading || state.user.loading,
    error: state.solution?.error,
    allCauses: state.cause.causes,
    allUsers: state.user.users,
  };
};

const connector = connect(mapStateToProps, mapDispatch);

const EditPage = (props) => {
  const {
    doFetchSingleSolutionAction,
    currentSolution,
    loading,
    error,
    allCauses,
    doFetchCausesAction,
    doFetchUsersAction,
    allUsers,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [solution, setSolution] = useState(null);
  const [causes, setCauses] = useState([]);
  const [users, setUsers] = useState([]);
  const solutionId = props.match.params.id;
  const t = useTranslate();
  const message = (value) => t(`containers.solutions.edit.${value}`);

  useEffect(() => {
    solutionId && doFetchSingleSolutionAction(solutionId);
  }, [doFetchSingleSolutionAction, solutionId]);

  useEffect(() => {
    doFetchCausesAction();
  }, [doFetchCausesAction]);

  useEffect(() => {
    doFetchUsersAction();
  }, [doFetchUsersAction]);

  useEffect(() => {
    allCauses && setCauses(allCauses);
  }, [allCauses]);

  useEffect(() => {
    allUsers && setUsers(allUsers);
  }, [allUsers]);

  useEffect(async () => {
    try {
      const cleanSolution = currentSolution && { ...currentSolution };
      if (currentSolution?.solutionFiles?.length > 0) {
        const activeFiles = currentSolution.solutionFiles.filter(
          (f) => f.isActive
        );
        const cleanFiles = await getFiles(activeFiles);
        setSolution({ ...cleanSolution, files: cleanFiles, deleteFiles: [] });
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
    <>
      {isLoading && <Loading />}
      <NavbarComponent />
      <Container fluid>
        <Container>
          <Row className="d-block mt-5 ml-0 mr-0">
            <h2 style={{ color: "#01516a" }}>{message("title")}</h2>
            <hr />
          </Row>
        </Container>
        <Container>
          {solution?.id && (
            <EditForm
              setIsLoading={(v) => setIsLoading(v)}
              solution={solution}
              message={message}
              causes={causes}
              users={users || []}
            />
          )}
          {!isLoading && !solution?.id && (
            <Row style={{ margin: "10px" }}>
              <WarningAlert title={message("error_message")} />
              <h5>{errorMessage}</h5>
            </Row>
          )}
        </Container>
      </Container>
    </>
  );
};

export default connector(EditPage);
