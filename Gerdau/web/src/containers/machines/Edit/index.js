import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { editMachine } from "service/machine.js";
import { editComponents } from "service/component.js";
import { editPieces } from "service/piece.js";
import { Loading } from "components/Loading/index";
import { MachineForm } from "containers/machines/Forms/Machine";
import { ComponentsTab } from "containers/machines/Tabs/componentsTab";
import { NavbarComponent } from "components/Navbar";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { PiecesTab } from "containers/machines/Tabs/piecesTab";
import { Sidebar } from "components/Sidebar";
import { Toast } from "components/Toast";
import { connect } from "react-redux";
import { getFiles } from "service/component";
import { getFiles as getMachineFiles } from "service/machine";
import { getFiles as getPiecesFiles } from "service/piece";
import { doFetchUsers } from "redux/user/action";
import { doFetchStages } from "redux/stage/action";
import {
  doFetchAreas,
  doFetchPlants,
  doFetchSublevels,
} from "redux/company/action";
import { doFetchMachines, doFetchMachine } from "redux/machine/action";
import { doFetchComponents } from "redux/component/action";
import DeleteModal from "../Delete";
import useTranslate from "hooks/useTranslate";
import allStagesSelector from "selectors/stage/all-stages";
import "./machine.css";

const mapDispatch = (dispatch) => ({
  doFetchUsersAction: () => dispatch(doFetchUsers()),
  doFetchPlantsAction: () => dispatch(doFetchPlants()),
  doFetchAreasAction: () => dispatch(doFetchAreas()),
  doFetchSublevelsAction: () => dispatch(doFetchSublevels()),
  doFetchComponentsAction: () => dispatch(doFetchComponents()),
  doFetchMachinesAction: () => dispatch(doFetchMachines()),
  doFetchMachineAction: (machineId) => dispatch(doFetchMachine(machineId)),
  doFetchStagesAction: () => dispatch(doFetchStages()),
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
    machineLoading: state.machine.machineLoading,
    currentMachine: state.machine.currentMachine,
    // error: state.error
  };
};
const connector = connect(mapStateToProps, mapDispatch);
const EditMachine = (props) => {
  const {
    doFetchUsersAction,
    doFetchPlantsAction,
    doFetchAreasAction,
    doFetchSublevelsAction,
    doFetchComponentsAction,
    doFetchMachinesAction,
    doFetchMachineAction,
    doFetchStagesAction,
    users,
    plants,
    areas,
    sublevels,
    allComponents,
    allMachines,
    currentMachine,
    machineLoading,
  } = props;

  const history = useHistory();

  const machineId = props.match.params.id;
  const t = useTranslate();
  const allStages = useSelector(allStagesSelector);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMachineLoading, setIsMachineLoading] = useState(machineLoading);
  const [machine, setMachine] = useState(currentMachine || {});
  const [components, setComponents] = useState([]);
  const [pieces, setPieces] = useState([{}]);
  const [selectedTab, setSelectedTab] = useState(1);
  const [componentsFiles, setComponentsFiles] = useState([]);
  const [piecesFiles, setPiecesFiles] = useState([]);
  const [machineFiles, setMachineFiles] = useState([]);
  const [componentsDeletedFiles, setComponentsDeletedFiles] = useState([]);
  const [piecesDeletedFiles, setPiecesDeletedFiles] = useState([]);
  const [machineDeletedFiles, setMachineDeletedFiles] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [plantsData, setPlantsData] = useState([]);
  const [areasData, setAreasData] = useState([]);
  const [sublevelsData, setSublevelsData] = useState([]);
  const [componentsData, setComponentsData] = useState([]);
  const [stagesList] = useState([]);
  const [stages, setStages] = useState([]);

  const [machinesData, setMachinesData] = useState([]);
  const machineMessages = "containers.machines.machine";
  const urlParams = new URLSearchParams(props.location.search);
  const selectedTabParam = urlParams.get("selectedTab");
  const [openCollapse, setOpenCollapse] = useState(-1);
  const [parsedPieces, setParsedPieces] = useState(false);
  const [parsedComponents, setParsedComponents] = useState(false);

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
    doFetchMachinesAction();
  }, [doFetchMachinesAction]);

  useEffect(() => {
    doFetchStagesAction();
  }, [doFetchStagesAction]);

  useEffect(() => {
    machineId && doFetchMachineAction(machineId);
  }, [doFetchMachineAction]);

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

  useEffect(() => {
    currentMachine && populateMachineFields(currentMachine);
    currentMachine &&
      currentMachine.components &&
      populateComponentsFields(currentMachine.components);
    let pieces = [];
    currentMachine &&
      currentMachine.components &&
      currentMachine.components.map((component) => {
        pieces = component.pieces && pieces.concat(component.pieces);
      });

    currentMachine &&
      currentMachine.components &&
      pieces &&
      populatePiecesFields(pieces);
  }, [currentMachine]);

  useEffect(() => {
    setIsMachineLoading(machineLoading);
  }, [machineLoading]);

  useEffect(() => {
    //to not set the index to -1 or null and cause confusion with acordion
    if (props.location?.state && components.length > 0 && pieces.length > 0) {
      const variant = props.location.state.variant;
      const recordId = props.location.state.recordId;
      let index = null;

      switch (variant) {
        case "component": {
          setSelectedTab(2);
          index = components.findIndex((c) => c.id === recordId);
          break;
        }
        case "piece": {
          setSelectedTab(3);
          index = pieces.findIndex((p) => p.id === recordId);
          break;
        }
        default:
          setSelectedTab(1);
      }
      index = index >= 0 ? index : null;
      setOpenCollapse(index);
    } else if (components?.length > 0 || pieces?.length > 0) {
      setOpenCollapse(null);
    }
  }, [props]);

  const getAllComponentFiles = async (components) => {
    let allFiles = [];

    components.map((component) => {
      if (component.componentFiles.length > 0) {
        component.componentFiles = component.componentFiles.filter((file) => {
          file.isActive && allFiles.push(file);
          return file.isActive;
        });
      }
    });

    const filesWithData = await getFiles(allFiles);

    components.forEach((components) => {
      components.componentFiles.length > 0 &&
        components.componentFiles.map((file) => {
          const foundFile = filesWithData.find((f) => f.id === file.id);
          file.data = foundFile.data;
        });
    });

    setParsedComponents(true);
    setComponents(components);
  };

  const getAllPiecesFiles = async (pieces) => {
    let allFiles = [];

    pieces.map((piece) => {
      if (piece.pieceFiles.length > 0) {
        piece.pieceFiles = piece.pieceFiles.filter((file) => {
          file.isActive && allFiles.push(file);
          return file.isActive;
        });
      }
    });

    const filesWithData = await getPiecesFiles(allFiles);
    console.log(filesWithData);

    pieces.forEach((piece) => {
      piece.isPiece = true; // to show clone btn
      piece.pieceFiles.length > 0 &&
        piece.pieceFiles.map((file) => {
          const foundFile = filesWithData.find((f) => f.id === file.id);
          file.data = foundFile.data;
        });
    });

    setParsedPieces(true);
    setPieces(pieces);
    console.log("pices", pieces);
  };
  const getAllMachineFiles = async (machine) => {
    let files =
      machine.machineFiles &&
      (await getMachineFiles(machine.machineFiles)).filter(
        (file) => file.isActive
      );
    files && setMachineFiles(files);
  };

  const populateMachineFields = (currentMachine) => {
    let {
      id,
      internal_name,
      serie_number,
      type,
      purchase_number,
      description,
      relevant_data,
      state,
      flat_number,
      working_from_date,
      area,
      sublevel,
      plant,
      make,
      model,
      manufacturer,
      manufacturer_type,
      machineFiles,
      user,
      stages,
    } = currentMachine;
    setMachine({
      internal_name,
      serie_number,
      type,
      working_from_date,
      purchase_number,
      description,
      relevant_data,
      state,
      flat_number,
      make,
      model,
      manufacturer,
      manufacturer_type: manufacturer_type,
      machineFiles,
      maintenance_responsible: user?.id,
      area: area?.id,
      sublevel: sublevel?.id,
      plant: plant?.id,
      stages: stages?.map((s) => ({ value: s.id, label: s.name })),
      id,
    });
    getAllMachineFiles(currentMachine);
  };

  const populateComponentsFields = (components) => {
    const componentsData = components.map((component) => {
      let {
        id,
        machineId,
        internal_name,
        serie_number,
        type,
        working_from_date,
        description,
        relevant_data,
        state,
        make,
        model,
        manufacturer,
        manufacturer_type,
        provider,
        responsibleId,
      } = component;

      return {
        id,
        internal_name,
        serie_number,
        make,
        model,
        manufacturer,
        manufacturer_type,
        provider,
        type,
        state,
        relevant_data,
        description,
        working_from_date,
        manufacturer,
        machineId,
        responsibleId,
      };
    });
    setComponents(componentsData);
    getAllComponentFiles(components);
  };

  const populatePiecesFields = (pieces) => {
    const piecesData = pieces.map((piece) => {
      let {
        id,
        internal_name,
        identifier,
        type,
        working_from_date,
        specifications,
        make,
        model,
        manufacturer,
        manufacturer_type,
        componentId,
        provider,
        responsibleId,
      } = piece;
      return {
        id,
        internal_name,
        identifier,
        manufacturer,
        make,
        model,
        manufacturer_type,
        type,
        provider,
        specifications,
        working_from_date,
        responsibleId,
        componentId,
      };
    });
    setPieces(piecesData);
    getAllPiecesFiles(pieces);
  };
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const validateMachineData = () => {
    console.log("machine", machine);
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
      type,
      stages,
    } = machine;

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
      maintenance_responsible &&
      stages?.length > 0;
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
    const piecesValidation =
      cleanPieces &&
      cleanPieces.map((piece) => {
        const {
          internal_name,
          type,
          manufacturer,
          manufacturer_type,
          responsibleId,
          componentId,
        } = piece;
        const validation =
          !!internal_name &&
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

  const handleEditMachine = async () => {
    const currentTab = () => {
      let tab;
      switch (selectedTab) {
        case 1:
          tab = "la Máquina";
          break;
        case 2:
          tab = "Componentes";
          break;
        case 3:
          tab = "Piezas";
          break;
        default:
          tab = "";
      }
      return tab;
    };

    try {
      // only stores the populated components
      const cleanComponents = components.filter(
        (component) => component.internal_name
      );
      const cleanPieces = pieces.filter((piece) => piece.internal_name);
      const cleanMachine = { ...machine };
      cleanMachine.area = machine.area ? machine.area : null;
      cleanMachine.responsible = machine.responsibleId
        ? machine.responsibleId
        : null;
      cleanMachine.make = machine.make;
      cleanMachine.model = machine.model;
      cleanMachine.type = machine.type ? machine.type : null;
      cleanMachine.state = machine.state ? machine.state : null;
      cleanMachine.manufacturer = machine.manufacturer
        ? machine.manufacturer
        : null;
      cleanMachine.deleteFiles = machineDeletedFiles;
      cleanMachine.sublevel = machine.sublevel ? machine.sublevel : null;
      cleanMachine.working_from_date = moment(
        machine.working_from_date
      ).format();
      cleanMachine.stages = JSON.stringify(machine.stages);

      cleanComponents.map((component) => {
        component.working_from_date = moment(
          component.working_from_date
        ).format();
        component.deleteFiles = componentsDeletedFiles
          .filter((file) => file.componentId === component.id)
          .map((file) => file.id);
      });
      cleanPieces.map((piece) => {
        piece.working_from_date = moment(piece.working_from_date).format();
        piece.deleteFiles = piecesDeletedFiles
          .filter((file) => file.pieceId === piece.id)
          .map((file) => file.id);
      });

      if (selectedTab === 1) {
        if (!validateMachineData()) {
          Toast("error", "Hay campos que requieren atención");
          return;
        }
        if (validateMachineData()) {
          setIsLoading(true);
          console.log("clean machine", cleanMachine);
          await editMachine(cleanMachine, machineId);
        }
      }
      if (selectedTab === 2) {
        console.log("cleanComponents", cleanComponents);
        if (!validateComponentsData(cleanComponents)) {
          Toast("error", "Hay campos que requieren atención");
          return;
        }

        if (!validateMachineData() && validateComponentsData(cleanComponents)) {
          Toast(
            "error",
            "Hay campos en la pestaña de Máquina que requieren atención"
          );
          return;
        }
        if (validateMachineData() && validateComponentsData(cleanComponents)) {
          setIsLoading(true);
          await editComponents(cleanComponents);
        }
      }

      if (selectedTab === 3) {
        if (!validatePiecesData(cleanPieces)) {
          Toast("error", "Hay campos que requieren atención");
          return;
        }

        if (
          !validateMachineData(cleanMachine) &&
          validateComponentsData(cleanComponents) &&
          validatePiecesData(cleanPieces)
        ) {
          Toast(
            "error",
            "Hay campos en la pestaña de Máquina que requieren atención"
          );
          return;
        }

        if (
          validateMachineData(cleanMachine) &&
          validatePiecesData(cleanPieces) &&
          !validateComponentsData(cleanComponents)
        ) {
          Toast(
            "error",
            "Hay campos en la pestaña de Componentes que requieren atención"
          );
          return;
        }

        if (
          !validateMachineData(cleanMachine) &&
          validatePiecesData(cleanPieces) &&
          !validateComponentsData(cleanComponents)
        ) {
          Toast(
            "error",
            "Hay campos en la pestaña de Máquinas y Componentes que requieren atención"
          );
          return;
        }

        if (
          validateMachineData(cleanMachine) &&
          validateComponentsData(cleanComponents) &&
          validatePiecesData(cleanPieces)
        ) {
          setIsLoading(true);
          await editPieces(cleanPieces);
          history.goBack();
        }
      }
      console.log("clean machine", cleanMachine);
      setIsLoading(false);

      Toast("success", "se han guardado los datos " + currentTab());
      setSubmitted(false);
    } catch (e) {
      Toast("error", "Error al guardar los datos " + currentTab());
      console.log(e);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    submitted && handleEditMachine();
  }, [submitted]);

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <div>
      <NavbarComponent />
      <div className="edit-machine">
        <Sidebar
          currentTab={selectedTab}
          setCurrentTab={(tab) => setSelectedTab(tab)}
          onSubmit={(e) => setSubmitted(e)}
          insertedProps={{ insertedMachine: true, insertedComponent: true }}
        >
          <DeleteModal
            showModal={showDeleteModal}
            machineId={machine.id}
            onClose={() => setShowDeleteModal(false)}
          />

          <div
            style={{ maxHeight: "75vh", overflowY: "scroll", height: "75vh" }}
          >
            {isMachineLoading && (
              <div>
                <Loading />
              </div>
            )}
            {selectedTab === 1 && (
              <>
                <MachineForm
                  onChange={(p, v) => machineChange(p, v)}
                  data={machine}
                  allStages={allStages}
                  usersData={usersData}
                  plantsData={plantsData}
                  areasData={areasData}
                  sublevelsData={sublevelsData}
                  onSubmit={(e) => setSubmitted(e)}
                  isSubmited={submitted}
                  files={machineFiles}
                  onChangeFiles={(value) => setMachineFiles(value)}
                  isEditing={true}
                  onDeleteFile={(value) => setMachineDeletedFiles(value)}
                  deleteFiles={machineDeletedFiles}
                  onCancel={handleCancel}
                />
              </>
            )}
            {selectedTab === 2 && parsedComponents && (
              <ComponentsTab
                onChange={(i, p, v) => componentsChange(i, p, v)}
                data={components}
                setData={setComponents}
                machineData={machine}
                onSubmit={(e) => setSubmitted(e)}
                usersData={usersData}
                machinesData={machinesData}
                onChangeFiles={(value) => setComponentsFiles(value)}
                isSubmitted={submitted}
                isEditing={true}
                onDeleteFile={(value) => setComponentsDeletedFiles(value)}
                deleteFiles={componentsDeletedFiles}
                defaultOpenCollapse={openCollapse}
                onCancel={handleCancel}
              ></ComponentsTab>
            )}
            {selectedTab === 3 && parsedPieces && (
              <PiecesTab
                onChange={(i, p, v) => piecesChange(i, p, v)}
                data={pieces}
                setData={setPieces}
                onSubmit={(e) => setSubmitted(e)}
                machinesData={machinesData}
                componentsData={componentsData}
                usersData={usersData}
                isSubmitted={submitted}
                onChangeFiles={(value) => setPiecesFiles(value)}
                isEditing={true}
                onDeleteFile={(value) => setPiecesDeletedFiles(value)}
                deleteFiles={piecesDeletedFiles}
                defaultOpenCollapse={openCollapse}
                onCancel={handleCancel}
              ></PiecesTab>
            )}
          </div>
        </Sidebar>
      </div>
    </div>
  );
};

export default connector(EditMachine);
