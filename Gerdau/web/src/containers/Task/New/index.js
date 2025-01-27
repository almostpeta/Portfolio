import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { doFetchUsers } from "redux/user/action";
import { doFetchComponents } from "redux/component/action";
import { doFetchMachines } from "redux/machine/action";
import { doFetchPieces } from "redux/piece/action";
import { connect } from "react-redux";
import { NavbarComponent } from "components/Navbar";
import { Loading } from "components/Loading";
import { WarningAlert } from "components/UI/Alert";
import NewTaskForm from "./New";

const mapDispatch = (dispatch) => ({
  doFetchUsersAction: () => dispatch(doFetchUsers()),
  doFetchMachinesAction: () => dispatch(doFetchMachines()),
  doFetchComponentsAction: () => dispatch(doFetchComponents()),
  doFetchPiecesAction: () => dispatch(doFetchPieces()),
});
const mapStateToProps = (state) => ({
  error: state.user.error,
  loading: state.user.loading || state.component.loading || state.piece.loading,
  users: state.user.users,
  machines: state.machine.machines,
  components: state.component.components,
  pieces: state.piece.pieces,
});
const connector = connect(mapStateToProps, mapDispatch);

const NewTask = (props) => {
  const {
    doFetchUsersAction,
    doFetchMachinesAction,
    doFetchComponentsAction,
    doFetchPiecesAction,
    users,
    machines,
    components,
    pieces,
    loading,
    error,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigationProps = props.location?.state;

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
          <NewTaskForm
            datalists={{ users, machines, components, pieces }}
            initValues={navigationProps}
            setIsLoading={(v) => setIsLoading(v)}
          />
        )}
        {!isLoading && errorMessage && <WarningAlert title={errorMessage} />}
      </Container>
    </>
  );
};
export default connector(NewTask);
