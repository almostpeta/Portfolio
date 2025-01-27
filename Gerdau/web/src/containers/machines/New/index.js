import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createNewMachine } from "service/machine.js";
import { createNewComponents } from "service/component.js";
import { createNewPieces } from "service/piece.js";
import { Loading } from "components/Loading/index";
import { MachineForm } from "containers/machines/Forms/Machine";
import { NavbarComponent } from "components/Navbar";
import { ComponentsTab } from "containers/machines/Tabs/componentsTab";
import moment from "moment";
import { PiecesTab } from "containers/machines/Tabs/piecesTab";
import { Sidebar } from "components/Sidebar";
import { Toast } from "components/Toast";
import { connect } from "react-redux";
import { doFetchUsers } from "redux/user/action";
import {
  doFetchAreas,
  doFetchPlants,
  doFetchSublevels,
} from "redux/company/action";
import { doFetchMachines } from "redux/machine/action";
import { doFetchComponents } from "redux/component/action";
import { doFetchStages } from "redux/stage/action";
import useTranslate from "hooks/useTranslate";
import DeleteModal from "../Delete";
import allStagesSelector from "selectors/stage/all-stages";
import "./machine.css";

const mapDispatch = (dispatch) => ({
  doFetchUsersAction: () => dispatch(doFetchUsers()),
  doFetchPlantsAction: () => dispatch(doFetchPlants()),
  doFetchAreasAction: () => dispatch(doFetchAreas()),
  doFetchSublevelsAction: () => dispatch(doFetchSublevels()),
  doFetchComponentsAction: () => dispatch(doFetchComponents()),
  doFetchMachinesAction: () => dispatch(doFetchMachines()),
  doFetchStagesAction: () => dispatch(doFetchStages()), // load stages to state
  // resetStateAction: () => dispatch(resetState()),
});
const mapStateToProps = (state) => {
  return {
    users: state.user.users,
    plants: state.company.plants,
    areas: state.company.areas,
    sublevels: state.company.sublevels,
    allComponents: state.component.components,
    allMachines: state.machine.machines,
    // error: state.error
  };
};
const connector = connect(mapStateToProps, mapDispatch);
const NewMachine = (props) => {
  const initialComponentData = () => [{}];
  const {
    doFetchUsersAction,
    doFetchPlantsAction,
    doFetchAreasAction,
    doFetchSublevelsAction,
    doFetchComponentsAction,
    doFetchMachinesAction,
    doFetchStagesAction,
    users,
    plants,
    areas,
    sublevels,
    allComponents,
    allMachines,
  } = props;
  const t = useTranslate();
  const history = useHistory();
  const allStages = useSelector(allStagesSelector);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [machine, setMachine] = useState({});
  const [components, setComponents] = useState([{}]);
  const [pieces, setPieces] = useState([{ isPiece: true }]);
  const [selectedTab, setSelectedTab] = useState(1);
  const [componentsFiles, setComponentsFiles] = useState([]);
  const [piecesFiles, setPiecesFiles] = useState([]);
  const [machineFiles, setMachineFiles] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [plantsData, setPlantsData] = useState([]);
  const [areasData, setAreasData] = useState([]);
  const [sublevelsData, setSublevelsData] = useState([]);
  const [componentsData, setComponentsData] = useState([]);
  const [machineCreatedId, setMachineCreatedId] = useState(null);

  const [machinesData, setMachinesData] = useState([]);
  const machineMessages = "containers.machines.machine";

  useEffect(() => {
    doFetchUsersAction();
  }, [doFetchUsersAction]);

  useEffect(() => {
    doFetchPlantsAction();
  }, [doFetchPlantsAction]);

  useEffect(() => {
    doFetchAreasAction();
  }, [doFetchAreasAction]);

  useEffect(() => {
    doFetchSublevelsAction();
  }, [doFetchSublevelsAction]);

  useEffect(() => {
    doFetchComponentsAction();
  }, [doFetchComponentsAction]);

  useEffect(() => {
    doFetchStagesAction();
  }, [doFetchStagesAction]);

  useEffect(() => {
    doFetchMachinesAction();
  }, [doFetchMachinesAction]);

  useEffect(() => {
    users && setUsersData(users);
  }, [users]);

  useEffect(() => {
    plants && setPlantsData(plants);
  }, [plants]);

  useEffect(() => {
    areas && setAreasData(areas);
  }, [areas]);

  useEffect(() => {
    sublevels && setSublevelsData(sublevels);
  }, [sublevels]);

  useEffect(() => {
    allComponents && setComponentsData(allComponents);
  }, [allComponents]);

  useEffect(() => {
    allMachines && setMachinesData(allMachines);
  }, [allMachines]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [insertedProps, setInsertedProps] = useState({
    insertedMachine: false,
    insertedComponent: false,
  });
  const [submittedComponent, setSubmittedComponent] = useState(false);
  const [submittedPiece, setSubmittedPiece] = useState(false);

  const selectMessage = (value) => {
    return t(machineMessages.concat("." + value));
  };

  const machineChange = (prop, value) => {
    machine[prop] = value;
  };

  const componentsChange = (index, prop, value) => {
    components[index][prop] = value;
  };

  const piecesChange = (index, prop, value) => {
    pieces[index][prop] = value;
  };

  const validateMachineData = (cleanMachine) => {
    const {
      internal_name,
      serie_number,
      plant,
      area,
      sublevel,
      manufacturer,
      manufacturer_type,
      purchase_number,
      maintenance_responsible,
      stages,
      type,
    } = cleanMachine;

    const validation =
      internal_name &&
      serie_number &&
      plant &&
      type &&
      area &&
      sublevel &&
      manufacturer &&
      manufacturer_type &&
      purchase_number &&
      stages?.length > 0 &&
      maintenance_responsible;
    return validation;
  };

  const validateComponentsData = (cleanComponents) => {
    const componentsValidation =
      cleanComponents &&
      cleanComponents.map((component) => {
        const {
          internal_name,
          serie_number,
          type,
          manufacturer,
          manufacturer_type,
          responsibleId,
          machineId,
        } = component;
        const validation =
          !!internal_name &&
          !!serie_number &&
          !!type &&
          !!manufacturer &&
          !!manufacturer_type &&
          !!responsibleId &&
          !!machineId;

        return validation;
      });

    return cleanComponents.length > 0
      ? componentsValidation.every((i) => i === true)
      : false;
  };

  const validatePiecesData = (cleanPieces) => {
    console.log("clean pieces", cleanPieces);
    const piecesValidation =
      cleanPieces &&
      cleanPieces.map((piece) => {
        const {
          internal_name,
          identifier,
          type,
          manufacturer,
          manufacturer_type,
          responsibleId,
          componentId,
        } = piece;
        const validation =
          !!internal_name &&
          !!identifier &&
          !!type &&
          !!manufacturer &&
          !!manufacturer_type &&
          !!responsibleId &&
          !!componentId;
        return validation;
      });

    return cleanPieces.length > 0
      ? piecesValidation.every((i) => i === true)
      : false;
  };

  const handleCreateMachine = async () => {
    try {
      if (insertedProps.insertedMachine) {
        Toast(
          "error",
          "Ya se guardó esta máquina. Si desea editar un campo, dirígase a la pantalla de Editar Máquina"
        );
        return;
      }
      const cleanMachine = {
        ...machine,
        area: machine.area || null,
        floor: machine.floor || null,
        maintenance_responsible: machine.maintenance_responsible || null,
        type: machine.type || null,
        state: machine.state || null,
        sublevel: machine.sublevel || null,
        working_from_date: moment(machine.working_from_date).format(),
        stages: JSON.stringify(machine.stages),
      };

      if (!validateMachineData(cleanMachine)) {
        Toast("error", "Hay campos que requieren atención");
        return false;
      }
      setIsLoading(true);
      const createdMachine = await createNewMachine(cleanMachine);
      setMachineCreatedId(createdMachine.id);
      setInsertedProps({ ...insertedProps, insertedMachine: true });
      doFetchMachinesAction();
      doFetchComponentsAction();
      setIsLoading(false);
      if (submitted) {
        // user clicked on Guardar, not in Guardar e Insertar componentes
        history.push(`/machine/detail/${createdMachine.id}`);
      }
      setSubmitted(false);
      Toast("success", "Se han guardado los datos de la máquina");
      return true;
    } catch (err) {
      if (/Duplicated machine found/.test(err)) {
        Toast(
          "error",
          `Ya existe una máquina ${machine.internal_name} para este subnivel`
        );
      } else {
        Toast("error", "Error al guardar los datos de la máquina");
      }
      setIsLoading(false);
      return false;
    }
  };

  const handleCreateComponent = async () => {
    try {
      if (insertedProps.insertedComponent) {
        Toast(
          "error",
          "Ya se guardaron los componentes. Si desea editarlos, dirígase a la pantalla de Editar Máquina"
        );
        return;
      }
      const cleanComponents = components.filter(
        (component) => component.internal_name
      );

      cleanComponents.map((component) => {
        component.working_from_date = moment(
          component.working_from_date
        ).format();
      });

      if (!validateComponentsData(cleanComponents)) {
        Toast("error", "Hay campos que requieren atención");
        return false;
      }

      setIsLoading(true);
      await createNewComponents(cleanComponents);
      setInsertedProps({ ...insertedProps, insertedComponent: true });
      if (submittedComponent) {
        history.push(`/machine/detail/${machineCreatedId}`);
      }
      setSubmittedComponent(false);
      Toast("success", "Componentes guardados correctamente");
      setIsLoading(false);
      doFetchMachinesAction();
      doFetchComponentsAction();
      return true;
    } catch (err) {
      Toast("error", "Error al guardar los datos de los componentes");
      setIsLoading(false);
      return false;
    }
  };

  const handleCreatePiece = async () => {
    try {
      if (insertedProps.insertedPieces) {
        Toast(
          "error",
          "Ya se guardaron las piezas. Si desea editarlas, dirígase a la pantalla de Editar Máquina"
        );
        return;
      }
      const cleanPieces = pieces.filter((piece) => piece.internal_name);
      cleanPieces.map((piece) => {
        piece.working_from_date = moment(piece.working_from_date).format();
      });

      if (!validatePiecesData(cleanPieces)) {
        Toast("error", "Hay campos que requieren atención");
        return false;
      }
      setIsLoading(true);
      await createNewPieces(cleanPieces);
      setInsertedProps({ ...insertedProps, insertedPieces: true });
      history.push(`/machine/detail/${machineCreatedId}`);
      Toast("success", "Piezas guardadas correctamente");
      setIsLoading(false);
      doFetchMachinesAction();
      doFetchComponentsAction();
      return true;
    } catch (e) {
      Toast("error", "Error al guardar los datos de las piezas");
      setIsLoading(false);
      return false;
    }
  };

  const handleCancel = () => {
    history.goBack();
  };

  useEffect(() => {
    submitted && handleCreateMachine();
  }, [submitted]);

  useEffect(() => {
    submittedComponent && handleCreateComponent();
  }, [submittedComponent]);

  useEffect(() => {
    submittedPiece && handleCreatePiece();
  }, [submittedPiece]);

  const handleSubmit = () => {
    if (selectedTab === 1) {
      setSubmitted(true);
    } else if (selectedTab === 2) {
      setSubmittedComponent(true);
    } else {
      setSubmittedPiece(true);
    }
  };

  const handleSubmitWithVariant = async (variant) => {
    switch (variant) {
      case "component":
        if (await handleCreateMachine()) {
          setSelectedTab(2);
        }
        break;
      case "piece":
        if (await handleCreateComponent()) {
          setSelectedTab(3);
        }
        break;
      default:
        return;
    }
  };

  return (
    <div>
      <NavbarComponent />
      <div className="new-machine">
        <Sidebar
          currentTab={selectedTab}
          setCurrentTab={(tab) => setSelectedTab(tab)}
          onSubmit={(e) => handleSubmit(e)}
          insertedProps={insertedProps}
        >
          <DeleteModal
            showModal={showDeleteModal}
            machineId={machine.id}
            onClose={() => setShowDeleteModal(false)}
          />

          <div
            className="newMachineContainer"
            style={{ maxHeight: "75vh", overflowY: "scroll", height: "75vh" }}
          >
            {isLoading && (
              <div>
                <Loading />
              </div>
            )}
            {selectedTab === 1 && (
              <>
                <MachineForm
                  onChange={(p, v) => machineChange(p, v)}
                  data={machine}
                  usersData={usersData}
                  plantsData={plantsData}
                  areasData={areasData}
                  sublevelsData={sublevelsData}
                  allStages={allStages}
                  onSubmit={(e) => setSubmitted(e)}
                  isSubmited={submitted}
                  files={machineFiles}
                  onChangeFiles={(value) => setMachineFiles(value)}
                  isEditing={false}
                  onCancel={() => handleCancel()}
                  onSubmitWithVariant={handleSubmitWithVariant}
                />
              </>
            )}
            {selectedTab === 2 && (
              <ComponentsTab
                onChange={(i, p, v) => componentsChange(i, p, v)}
                data={components}
                setData={setComponents}
                machineData={machine}
                onSubmit={(e) => setSubmittedComponent(e)}
                usersData={usersData}
                machinesData={machinesData}
                files={componentsFiles}
                onChangeFiles={(value) => setComponentsFiles(value)}
                isSubmitted={submittedComponent}
                isEditing={false}
                onCancel={() => handleCancel()}
                onSubmitWithVariant={handleSubmitWithVariant}
              ></ComponentsTab>
            )}
            {selectedTab === 3 && (
              <PiecesTab
                onChange={(i, p, v) => piecesChange(i, p, v)}
                data={pieces}
                setData={setPieces}
                onSubmit={(e) => setSubmittedPiece(e)}
                machinesData={machinesData}
                componentsData={componentsData}
                usersData={usersData}
                files={piecesFiles}
                onChangeFiles={(value) => setPiecesFiles(value)}
                isSubmitted={submittedPiece}
                isEditing={false}
                onCancel={handleCancel}
              ></PiecesTab>
            )}
          </div>
        </Sidebar>
      </div>
    </div>
  );
};

export default connector(NewMachine);
