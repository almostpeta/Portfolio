import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { doFetchUsers } from "redux/user/action";
import { connect } from "react-redux";
import { NavbarComponent } from "components/Navbar";
import { Loading } from "components/Loading";
import { WarningAlert } from "components/UI/Alert";
import List from "./List";

const mapDispatch = (dispatch) => ({
  doFetchUsersAction: () => dispatch(doFetchUsers()),
});
const mapStateToProps = (state) => ({
  error: state.user.error,
  loading: state.user.loading,
  users: state.user.users,
});
const connector = connect(mapStateToProps, mapDispatch);

const ListContainer = (props) => {
  const { doFetchUsersAction, users, loading, error } = props;
  const [forceRefresh, setForceRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    doFetchUsersAction();
  }, [doFetchUsersAction]);

  useEffect(() => {
    if (forceRefresh) {
      setForceRefresh(false);
      doFetchUsersAction();
    }
  }, [forceRefresh]);

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
          <List
            users={users}
            setIsLoading={(v) => setIsLoading(v)}
            forceRefresh={() => setForceRefresh(true)}
          />
        )}
        {!isLoading && errorMessage && <WarningAlert title={errorMessage} />}
      </Container>
    </>
  );
};
export default connector(ListContainer);
