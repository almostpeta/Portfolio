import React, { useEffect, useState } from "react";
import { createNewFault } from "service/fault";
import { Loading } from "components/Loading/index";
import FaultForm from "../Forms/NewFault";
import { Toast } from "components/Toast";
import { connect } from "react-redux";
import { doFetchUsers } from "redux/user/action";
import { doFetchMachines } from "redux/machine/action";
import { NavbarComponent } from "components/Navbar";
import { doFetchComponents } from "redux/component/action";
import { doFetchPieces } from "redux/piece/action";
import { Container, Row } from "react-bootstrap";
import useTranslate from "hooks/useTranslate";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { WarningAlert } from "components/UI/Alert";

const mapDispatch = (dispatch) => ({
  doFetchUsersAction: () => dispatch(doFetchUsers()),
  doFetchComponentsAction: () => dispatch(doFetchComponents()),
  doFetchMachinesAction: () => dispatch(doFetchMachines()),
  doFetchPiecesAction: () => dispatch(doFetchPieces()),
});
const mapStateToProps = (state) => {
  return {
    users: state.user.users,
    allComponents: state.component.components,
    allMachines: state.machine.machines,
    allPieces: state.piece.pieces,
    loading:
      state.user.loading || state.component.loading || state.piece.loading,
    hasError: state.user.error || state.component.error || state.piece.error,
  };
};

const connector = connect(mapStateToProps, mapDispatch);

const NewFault = (props) => {
  const {
    doFetchUsersAction,
    doFetchComponentsAction,
    doFetchMachinesAction,
    doFetchPiecesAction,
    users,
    allComponents,
    allMachines,
    allPieces,
    loading,
    hasError,
  } = props;
  const t = useTranslate();
  const history = useHistory();

  //REDUX SETTINGS

  const [machines, setMachines] = useState([]);
  const [components, setComponents] = useState([]);
  const [pieces, setPieces] = useState([]);
  const [_users, set_Users] = useState([]);

  useEffect(() => {
    const _initialState = props.location?.state;
    if (_initialState) {
      setFaultData({ ..._initialState });
    }
  }, [props]);

  useEffect(() => {
    doFetchUsersAction();
  }, [doFetchUsersAction]);

  useEffect(() => {
    users && set_Users(users);
  }, [users]);

  useEffect(() => {
    doFetchComponentsAction();
  }, [doFetchComponentsAction]);

  useEffect(() => {
    allComponents && setComponents(allComponents);
  }, [allComponents]);

  useEffect(() => {
    allPieces && setPieces(allPieces);
  }, [allPieces]);

  useEffect(() => {
    doFetchMachinesAction();
  }, [doFetchMachinesAction]);

  useEffect(() => {
    doFetchPiecesAction();
  }, [doFetchPiecesAction]);

  useEffect(() => {
    allMachines && setMachines(allMachines);
  }, [allMachines]);

  // FAULT SETTINGS

  const [faultData, setFaultData] = useState({});
  const [faultFiles, setFaultFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  const handleCancel = () => {
    history.push("/home");
  };

  const handleSubmit = async (inputs, e) => {
    try {
      setIsLoading(true);
      const cleanInputs = {
        ...inputs,
        ...(inputs.end_date_time && {
          end_date_time: moment(inputs.end_date_time).format(
            "YYYY-MM-DDTHH:mm:ss"
          ),
        }),
        clasification: [...inputs.clasification.map((i) => i.value)],
        reporters: [...inputs.reporters.map((i) => i.value)],
        start_date_time: moment(inputs.start_date_time).format(
          "YYYY-MM-DDTHH:mm:ss"
        ),
      };

      const createdFault = await createNewFault(cleanInputs);
      Toast("success", "La falla se ha ingresado correctamente");
      history.push(`/fault/detail/${createdFault.id}`);
    } catch (e) {
      console.error("error", e);
      Toast(
        "error",
        "Ocurrió un error al ingresar la falla. Intentelo nuevamente"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <Loading />}
      <NavbarComponent />
      <Container
        style={{
          maxHeight: "100vh",
          height: "100vh",
        }}
      >
        {!isLoading && !hasError && (
          <div>
            <Row className="d-block mt-5 ml-0 mr-0">
              <h2 style={{ color: "#01516a" }}>Reportar Falla </h2>
              <hr />
            </Row>
            <FaultForm
              initValues={faultData}
              onSubmit={handleSubmit}
              onCancel={() => handleCancel()}
              files={faultFiles}
              isEditing={false}
              datalists={{
                machines,
                components,
                pieces,
                users,
              }}
            />
          </div>
        )}
        {!isLoading && hasError && (
          <Row style={{ margin: "2rem" }}>
            <WarningAlert title="No se puede mostrar el formulario" />
          </Row>
        )}
      </Container>
    </div>
  );
};

export default connector(NewFault);
