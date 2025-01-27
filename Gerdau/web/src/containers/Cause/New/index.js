import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { doFetchUsers } from "redux/user/action";
import { Toast } from "components/Toast";
import { Loading } from "components/Loading/index";
import { Container } from "react-bootstrap";
import useTranslate from "hooks/useTranslate";
import { useHistory } from "react-router-dom";
import { NavbarComponent } from "components/Navbar";
import { createNewCause } from "service/cause";
import NewCauseForm from "../Forms/NewCause";

const mapDispatch = (dispatch) => ({
  doFetchUsersAction: () => dispatch(doFetchUsers()),
});
const mapStateToProps = (state) => {
  return {
    users: state.user.users,
  };
};

const connector = connect(mapStateToProps, mapDispatch);

const NewCause = (props) => {
  const { doFetchUsersAction, users } = props;
  const t = useTranslate();
  const history = useHistory();

  const fallback = props.location.state?.fallback;

  const [usersList, setUsersList] = useState([]);

  // REDUX SETTINGS
  useEffect(() => {
    doFetchUsersAction();
  }, [doFetchUsersAction]);

  useEffect(() => {
    users && setUsersList(users);
  }, [users]);

  // CAUSE SETTINGS

  const [causeData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (prop, value) => {
    causeData[prop] = value;
  };

  const validateFormData = () => {
    let isValid = true;
    isValid &= !!causeData.name;
    isValid &= !!causeData.requestedId;
    isValid &= !!causeData.status;
    isValid &= !!causeData.description;
    return isValid;
  };

  const handleCancel = () => {
    if (fallback) {
      history.push(fallback, {
        cause: {},
      });
    } else {
      history.push("/home");
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitted(true);
      const isValid = validateFormData();
      if (!isValid) {
        Toast("error", "Verifique los campos y vuelva a intentarlo");
        return;
      }

      setIsLoading(true);

      const response = await createNewCause(causeData);

      if (fallback) {
        history.push(fallback, {
          cause: { ...response },
        });
      } else {
        history.push(`/cause/detail/${response.id}`);
      }
      Toast("success", "La causa se ha ingresado correctamente");
    } catch (e) {
      console.error("error", e);
      Toast(
        "error",
        "Ocurrió un error al ingresar la causa. Intentelo nuevamente"
      );
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
        {!isLoading && (
          <NewCauseForm
            usersData={usersList}
            onChange={(p, v) => handleChange(p, v)}
            isSubmitted={submitted}
            onSubmit={() => handleSubmit()}
            onCancel={() => handleCancel()}
            isEditing={false}
            fallback={fallback}
          />
        )}
      </Container>
    </div>
  );
};

export default connector(NewCause);
