import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import {
  getMachineById,
  deleteMachine,
  getAllMachineEvents,
} from "service/machine";
import { getFiles } from "service/machine";
import Tab from "react-bootstrap/Tab";
import { NavbarComponent } from "components/Navbar";
import { TabsComponent } from "components/Tabs";
import { Loading } from "components/Loading/index";
import MachineDetail from "./detail";
import { FilesRelatedList } from "templates/Files";
import moment from "moment";
import ComponentList from "./componentList";
import { Toast } from "components/Toast";
import Timeline from "templates/timeline";
import TaskList from "templates/Tasks";

const DetailPage = (props) => {
  const machineId = props.match.params.id;
  const [isLoading, setIsLoading] = useState(false);
  const [machine, setMachine] = useState({});
  const [machineFiles, setMachineFiles] = useState([]);
  const [machineEvents, setMachineEvents] = useState([]);
  const [selectedTab, setSelectedTab] = useState("machine");
  const [filterInitialValues, setFilterInitialValues] = useState({
    startDate: undefined,
    endDate: undefined,
    type: "all",
    order: "desc",
  });

  const history = useHistory();

  useEffect(() => {
    machineId && fetchMachineData();
  }, [machineId]);

  const fetchMachineData = async () => {
    setIsLoading(true);
    getMachineById(machineId)
      .then((res) => {
        console.log("RESPUESTA MACHINE ", res);
        res && setMachine(res);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setMachine({});
        setIsLoading(false);
      });
  };

  useEffect(async () => {
    machine?.machineFiles &&
      getFiles(machine.machineFiles)
        .then((res) => {
          setMachineFiles(res);
        })
        .catch((error) => {
          Toast("error", "No se pudieron cargar los archivos de la máquina");
          setMachineFiles([]);
        });
  }, [machine]);

  useEffect(async () => {
    machine &&
      getAllMachineEvents(
        machineId,
        filterInitialValues.type,
        filterInitialValues.order,
        filterInitialValues.startDate
          ? moment(filterInitialValues.startDate).format("YYYY-MM-DDTHH:mm:ss")
          : undefined,
        filterInitialValues.endDate
          ? moment(filterInitialValues.endDate).format("YYYY-MM-DDTHH:mm:ss")
          : undefined
      )
        .then((res) => {
          setMachineEvents(res);
        })
        .catch(() => {
          Toast("error", "No se pudieron cargar los eventos de la máquina");
          setMachineEvents([]);
        });
  }, [machine]);

  const handleSubmitFilter = (initValues) => {
    getAllMachineEvents(
      machineId,
      initValues.type,
      initValues.order,
      initValues.startDate
        ? moment(initValues.startDate).format("YYYY-MM-DDTHH:mm:ss")
        : undefined,
      initValues.endDate
        ? moment(initValues.endDate).format("YYYY-MM-DDTHH:mm:ss")
        : undefined
    ).then((res) => {
      setMachineEvents(res);
    });
  };

  const handleDelete = () => {
    if (!window.confirm("¿Seguro desea eliminar esta máquina?")) {
      return;
    }
    setIsLoading(true);
    deleteMachine(machine.id)
      .then((response) => {
        history.push("/machines");
        Toast("success", "Máquina eliminada correctamente");
      })
      .catch(() => {
        Toast("error", "No se pudo eliminar la máquina");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      {isLoading && (
        <div>
          <Loading />
        </div>
      )}
      {!isLoading && (
        <div>
          <NavbarComponent />
          <Container
            style={{
              maxHeight: "100vh",
              height: "100vh",
            }}
          >
            <Row className="d-block mt-5 ml-0 mr-0">
              <h2 style={{ color: "#01516a" }}>Resumen de Máquina</h2>
              <hr />
            </Row>
            <TabsComponent
              defaultVal={selectedTab}
              handleKeyChange={(k) => setSelectedTab(k)}
            >
              <Tab eventKey="machine" title="Detalles">
                <MachineDetail
                  machine={machine}
                  onDelete={() => handleDelete()}
                />
              </Tab>
              <Tab eventKey="components" title="Componentes">
                {machine?.components && (
                  <ComponentList components={machine.components} />
                )}
              </Tab>
              <Tab eventKey="files" title="Archivos">
                <FilesRelatedList files={machineFiles} variant="machines" />
              </Tab>
              <Tab eventKey="task" title="Tareas">
                <TaskList
                  tasks={machine.tasks || []}
                  title="Tareas de la Máquina"
                  emptyTitle="No se han encontrado tareas relacionadas a la máquina"
                  navigationProps={{ machineId: machine?.id }}
                />
              </Tab>
              <Tab eventKey="timeline" title="Línea de tiempo">
                <Timeline
                  machine={machine}
                  elements={machineEvents}
                  initialValues={filterInitialValues}
                  onSubmit={handleSubmitFilter}
                />
              </Tab>
            </TabsComponent>
          </Container>
        </div>
      )}
    </>
  );
};

export default DetailPage;
