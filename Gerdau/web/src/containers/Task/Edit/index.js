import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { doFetchUsers } from "redux/user/action";
import { doFetchComponents } from "redux/component/action";
import { doFetchMachines } from "redux/machine/action";
import { doFetchPieces } from "redux/piece/action";
import { doFetchTask } from "redux/task/action";
import { connect } from "react-redux";
import { NavbarComponent } from "components/Navbar";
import { Loading } from "components/Loading";
import { WarningAlert } from "components/UI/Alert";
import EditForm from "./Edit";

const mapDispatch = (dispatch) => ({
  doFetchUsersAction: () => dispatch(doFetchUsers()),
  doFetchMachinesAction: () => dispatch(doFetchMachines()),
  doFetchComponentsAction: () => dispatch(doFetchComponents()),
  doFetchPiecesAction: () => dispatch(doFetchPieces()),
  doFetchTaskAction: (id) => dispatch(doFetchTask(id)),
});
const mapStateToProps = (state) => ({
  error: state.user.error,
  loading:
    state.user.loading ||
    state.component.loading ||
    state.piece.loading ||
    state.task.loading,
  users: state.user.users,
  machines: state.machine.machines,
  components: state.component.components,
  pieces: state.piece.pieces,
  task: state.task.currentTask,
});
const connector = connect(mapStateToProps, mapDispatch);

const EditTaskContainer = (props) => {
  const {
    doFetchUsersAction,
    doFetchMachinesAction,
    doFetchComponentsAction,
    doFetchPiecesAction,
    doFetchTaskAction,
    users,
    machines,
    components,
    pieces,
    loading,
    error,
    task,
    match,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const taskId = match.params.id;

  useEffect(() => {
    doFetchUsersAction();
  }, [doFetchUsersAction]);

  useEffect(() => {
    doFetchMachinesAction();
  }, [doFetchMachinesAction]);

  useEffect(() => {
    doFetchComponentsAction();
  }, [doFetchComponentsAction]);

  useEffect(() => {
    doFetchPiecesAction();
  }, [doFetchPiecesAction]);

  useEffect(() => {
    taskId && doFetchTaskAction(taskId);
  }, [doFetchTaskAction, taskId]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  useEffect(() => {
    setErrorMessage(error);
  }, [error]);

  return (
    <>
      <NavbarComponent />
      <Container fluid>
        {isLoading && <Loading />}
        {!isLoading && !errorMessage && (
          <EditForm
            datalists={{ users, machines, components, pieces }}
            initValues={task}
            setIsLoading={(v) => setIsLoading(v)}
          />
        )}
        {!isLoading && errorMessage && <WarningAlert title={errorMessage} />}
      </Container>
    </>
  );
};
export default connector(EditTaskContainer);
