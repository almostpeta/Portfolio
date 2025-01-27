import React, { useEffect, useState } from "react";
import { editFault } from "service/fault";
import { Loading } from "components/Loading/index";
import FaultForm from "../Forms/NewFault";
import { Toast } from "components/Toast";
import { connect } from "react-redux";
import { getFiles } from "service/fault";
import { doFetchUsers } from "redux/user/action";
import { doFetchMachines } from "redux/machine/action";
import { doFetchComponents } from "redux/component/action";
import { NavbarComponent } from "components/Navbar";
import { doFetchPieces } from "redux/piece/action";
import { doFetchFault } from "redux/fault/action";
import { Container, Row } from "react-bootstrap";
import moment from "moment";
import useTranslate from "hooks/useTranslate";
import { useHistory } from "react-router-dom";
import { parseFiles, parseAudio } from "lib/fileUtils";

const mapDispatch = (dispatch) => ({
  doFetchUsersAction: () => dispatch(doFetchUsers()),
  doFetchComponentsAction: () => dispatch(doFetchComponents()),
  doFetchMachinesAction: () => dispatch(doFetchMachines()),
  doFetchPiecesAction: () => dispatch(doFetchPieces()),
  doFetchFaultAction: (id) => dispatch(doFetchFault(id)),
});
const mapStateToProps = (state) => {
  return {
    users: state.user.users,
    usersLoading: state.user.loading,
    allComponents: state.component.components,
    allMachines: state.machine.machines,
    allPieces: state.piece.pieces,
    piecesLoading: state.piece.loading,
    componentsLoading: state.component.loading,
    currentFault: state.fault.currentFault,
    faultLoading: state.fault.loading,
    error:
      state.component.error ||
      state.machine.error ||
      state.piece.error ||
      state.piece.error ||
      state.user.error,
  };
};

const connector = connect(mapStateToProps, mapDispatch);

const EditFault = (props) => {
  const {
    doFetchUsersAction,
    doFetchComponentsAction,
    doFetchMachinesAction,
    doFetchPiecesAction,
    doFetchFaultAction,
    users,
    allComponents,
    allMachines,
    componentsLoading,
    piecesLoading,
    usersLoading,
    allPieces,
    currentFault,
    faultLoading,
    error,
  } = props;
  const t = useTranslate();
  const history = useHistory();
  const faultId = props.match.params.id;

  // FAULT SETTINGS
  const [faultData, setFaultData] = useState({});
  const [isDataParsed, setIsDataParsed] = useState(false);
  const [isFaultLoading, setIsFaultLoading] = useState(false);

  //REDUX SETTINGS
  const [machines, setMachines] = useState([]);
  const [components, setComponents] = useState([]);
  const [pieces, setPieces] = useState(allPieces || []);
  const [_users, set_Users] = useState([]);

  useEffect(() => {
    doFetchUsersAction();
  }, [doFetchUsersAction]);

  useEffect(() => {
    doFetchFaultAction(faultId);
  }, [doFetchFaultAction]);

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
    getAllFaultFiles(currentFault);
  }, [currentFault]);

  useEffect(() => {
    if (error) {
      setIsFaultLoading(false);
      history.push(`/fault/detail/${faultId}`);
      Toast("error", error);
    }
  });

  useEffect(() => {
    if (
      faultData?.id &&
      _users?.length > 0 &&
      pieces?.length > 0 &&
      components?.length > 0 &&
      machines?.length > 0 &&
      !isDataParsed
    ) {
      console.log("faultData", faultData);
      setFaultData({
        ...faultData,
        reporters: faultData.reporters?.map((user) => ({
          label: user.name,
          value: user.id,
        })),
        clasification: faultData.clasification
          ?.split(",")
          .map((c) => ({ value: c, label: c })),
      });
      console.log("fff", faultData.clasification);
      setIsDataParsed(true);
    }
  }, [faultData, _users, machines, components, pieces, isDataParsed]);

  useEffect(() => {
    setIsFaultLoading(faultLoading);
  }, [faultLoading]);

  useEffect(() => {
    doFetchMachinesAction();
  }, [doFetchMachinesAction]);

  useEffect(() => {
    doFetchPiecesAction();
  }, [doFetchPiecesAction]);

  useEffect(() => {
    allMachines && setMachines(allMachines);
  }, [allMachines]);

  useEffect(() => {
    allPieces && setPieces(allPieces);
  }, [allPieces]);

  const getAllFaultFiles = async (fault) => {
    try {
      let cleanFault = { ...fault };
      const files = fault?.faultFiles && (await getFiles(fault.faultFiles));
      const realFiles = [];
      const realAudios = [];
      files &&
        files.forEach((f) => {
          if (!f.isActive) return;

          if (f.relatedTo === "files") {
            realFiles.push(f);
          } else {
            const audio = parseAudio(f);
            cleanFault = {
              ...cleanFault,
              [audio.relatedTo]: audio,
            };
          }
        });

      setFaultData({
        ...cleanFault,
        files: realFiles,
        audios: realAudios,
      });
    } catch (e) {
      console.error("error", e);
      setFaultData(fault);
    }
  };

  const handleCancel = () => {
    history.push(`/fault/detail/${faultData.id}`);
  };

  const redirectToFautList = () => {
    history.push("/fault/list");
  };

  const handleSubmit = async (inputs) => {
    try {
      setIsFaultLoading(true);
      const cleanInputs = {
        ...inputs,
        ...(inputs.end_date_time && {
          end_date_time: moment(inputs.end_date_time).format(
            "YYYY-MM-DDTHH:mm:ss"
          ),
        }),
        clasification: [...inputs.clasification.map((i) => i.value)],
        reporters: [...inputs.reporters?.map((i) => i.value)],
        start_date_time: moment(inputs.start_date_time).format(
          "YYYY-MM-DDTHH:mm:ss"
        ),
      };
      await editFault(cleanInputs);
      Toast("success", "La falla se ha editado correctamente");
      history.push(`/fault/detail/${faultId}`);
    } catch (e) {
      Toast(
        "error",
        "Ocurrió un error al editar la falla. Inténtelo nuevamente"
      );
    } finally {
      setIsFaultLoading(false);
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
        {(!isDataParsed || isFaultLoading) && <Loading />}
        {isDataParsed && (
          <div>
            <Row className="d-block mt-5 ml-0 mr-0">
              <h2 style={{ color: "#01516a" }}>Editar Falla </h2>
              <hr />
            </Row>
            <FaultForm
              initValues={{ ...faultData }}
              onSubmit={handleSubmit}
              onCancel={() => handleCancel()}
              datalists={{
                machines,
                components,
                pieces,
                users,
              }}
              isEditing={true}
            />
          </div>
        )}
      </Container>
    </div>
  );
};

export default connector(EditFault);
