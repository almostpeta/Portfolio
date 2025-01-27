import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { doFetchCause } from "redux/cause/action";
import { Container } from "react-bootstrap";
import { Loading } from "components/Loading/index";
import { doFetchUsers } from "redux/user/action";
import { editCause } from "service/cause";
import { useHistory } from "react-router-dom";
import CauseForm from "containers/Cause/Forms/NewCause";
import { NavbarComponent } from "components/Navbar";
import { WarningAlert } from "components/UI/Alert";
import useTranslate from "hooks/useTranslate";
import { Toast } from "components/Toast";

const mapDispatch = (dispatch) => ({
  doFetchCauseAction: (causeId) => dispatch(doFetchCause(causeId)),
  doFetchUsersAction: () => dispatch(doFetchUsers()),
});
const mapStateToProps = (state) => {
  return {
    currentCause: state.cause.currentCause,
    loading: state.loading,
    error: state.cause.error,
    users: state.user.users,
  };
};

const connector = connect(mapStateToProps, mapDispatch);

const EditCause = (props) => {
  const {
    doFetchCauseAction,
    doFetchUsersAction,
    currentCause,
    loading,
    error,
    users,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [cause, setCause] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const t = useTranslate();
  const history = useHistory();

  const causeId = props.match.params.id;

  useEffect(() => {
    causeId && doFetchCauseAction(causeId);
  }, [doFetchCauseAction, causeId]);

  useEffect(() => {
    currentCause && setCause(currentCause);
  }, [currentCause]);

  useEffect(() => {
    doFetchUsersAction();
  }, [doFetchUsersAction]);

  useEffect(() => {
    users && setUsersList(users);
  }, [users]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  useEffect(() => {
    setErrorMessage(null);
  }, [error]);

  const handleChange = (prop, value) => {
    cause[prop] = value;
  };

  const validateFormData = () => {
    let isValid = true;
    isValid &= !!cause.name;
    isValid &= !!cause.requestedId;
    isValid &= !!cause.status;
    isValid &= !!cause.description;
    return isValid;
  };

  const handleCancel = () => {
    history.push(`/cause/detail/${cause.id}`);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    try {
      const isValid = validateFormData();
      if (!isValid) {
        Toast("error", "Verifique los campos y vuelva a intentarlo");
        return;
      }
      setIsLoading(true);
      console.log(cause);
      editCause(cause, cause.id)
        .then(() => {
          Toast("success", "La causa se ha ingresado correctamente");
          history.push(`/cause/detail/${cause.id}`);
        })
        .catch((error) => {
          console.error("error", error);
          Toast(
            "error",
            "Ocurrió un error al ingresar la causa. Intentelo nuevamente"
          );
        });
    } catch (e) {
      console.error(e);
      Toast(e.message);
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
        {!isLoading && cause?.id && (
          <CauseForm
            usersData={usersList}
            onChange={(p, v) => handleChange(p, v)}
            isSubmitted={submitted}
            onSubmit={() => handleSubmit()}
            onCancel={() => handleCancel()}
            isEditing={true}
            data={cause}
          />
        )}
      </Container>
    </div>
  );
};

export default connector(EditCause);
