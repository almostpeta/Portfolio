import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Container } from "react-bootstrap";
import { doFetchUser } from "redux/user/action";
import { NavbarComponent } from "components/Navbar";
import { Loading } from "components/Loading";
import { WarningAlert } from "components/UI/Alert";
import EditForm from "./Edit";

const mapDispatch = (dispatch) => ({
  doFetchUserAction: (id) => dispatch(doFetchUser(id)),
});
const mapStateToProps = (state) => ({
  error: state.user.error,
  loading: state.user.loading,
  user: state.user.currentUser,
});
const connector = connect(mapStateToProps, mapDispatch);

const EditUserContainer = (props) => {
  const { doFetchUserAction, user, loading, error, match } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const userId = match.params.id;

  useEffect(() => {
    doFetchUserAction(userId);
  }, [doFetchUserAction]);

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
        {!isLoading && !errorMessage && user && (
          <EditForm user={user} setIsLoading={(v) => setIsLoading(v)} />
        )}
        {!isLoading && errorMessage && <WarningAlert title={errorMessage} />}
      </Container>
    </>
  );
};

export default connector(EditUserContainer);
