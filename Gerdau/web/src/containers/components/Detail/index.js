import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import { deleteComponentById } from "service/component";
import moment from "moment";
import {
  doFetchComponent,
  doFetchComponentEvents,
} from "redux/component/action";
import { getFiles } from "service/component";
import Tab from "react-bootstrap/Tab";
import { TabsComponent } from "components/Tabs";
import { NavbarComponent } from "components/Navbar";
import { Loading } from "components/Loading/index";
import ComponentDetail from "./componentDetail";
import { WarningAlert } from "components/UI/Alert";
import PiecesList from "./piecesList";
import { FilesRelatedList } from "templates/Files";
import { StudiesList } from "templates/Studies";
import { FaultsRelatedList } from "templates/FaultsRelatedList";
import Timeline from "templates/timeline";
import TaskList from "templates/Tasks";
import { FieldsHistory } from "templates/FieldsHistory";
import { Toast } from "components/Toast";

const mapDispatch = (dispatch) => ({
  doFetchComponentAction: (componentId) =>
    dispatch(doFetchComponent(componentId)),
  doFetchComponentEventsAction: (
    componentId,
    type,
    order,
    startDate,
    endDate
  ) =>
    dispatch(
      doFetchComponentEvents(componentId, type, order, startDate, endDate)
    ),
});

const mapStateToProps = (state) => ({
  currentComponent: state.component.currentComponent,
  loading: state.component.loading,
  error: state.component.error,
  events: state.component.events,
});

const connector = connect(mapStateToProps, mapDispatch);

const DetailPage = (props) => {
  const {
    doFetchComponentAction,
    doFetchComponentEventsAction,
    currentComponent,
    loading,
    error,
    events,
  } = props;
  const [selectedTab, setSelectedTab] = useState("component");

  const [isLoading, setIsLoading] = useState(false);
  const [component, setComponent] = useState(null);
  const [componentFiles, setComponentFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [componentEvents, setComponentEvents] = useState([]);
  const history = useHistory();
  const componentId = props.match.params.id;

  const [filterInitialValues, setFilterInitialValues] = useState({
    startDate: undefined,
    endDate: undefined,
    type: "all",
    order: "desc",
  });

  useEffect(() => {
    componentId && doFetchComponentAction(componentId);
  }, [doFetchComponentAction, componentId]);

  useEffect(() => {
    componentId &&
      doFetchComponentEventsAction(
        componentId,
        filterInitialValues.type,
        filterInitialValues.order,
        filterInitialValues.startDate
          ? moment(filterInitialValues.startDate).format("YYYY-MM-DDTHH:mm:ss")
          : undefined,
        filterInitialValues.endDate
          ? moment(filterInitialValues.endDate).format("YYYY-MM-DDTHH:mm:ss")
          : undefined
      );
  }, [doFetchComponentEventsAction, componentId]);

  useEffect(() => {
    currentComponent && setComponent(currentComponent);
  }, [currentComponent]);

  useEffect(() => {
    events && setComponentEvents(events);
  }, [events]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  useEffect(() => {
    setErrorMessage(error);
  }, [error]);

  useEffect(async () => {
    component?.componentFiles &&
      (await getFiles(component.componentFiles)
        .then((res) => {
          setComponentFiles(res);
        })
        .catch((error) => {
          console.error(error);
          Toast("error", "No se pudieron cargar los archivos del componente");
          setComponentFiles([]);
        }));
  }, [component]);

  const handleDelete = () => {
    if (!window.confirm("¿Seguro desea eliminar el componente?")) {
      return;
    }
    setIsLoading(true);
    deleteComponentById(component.id)
      .then(() => {
        history.push("/admin/home");
        Toast("success", "Se ha eliminado el componente");
      })
      .catch(() => {
        Toast("success", "No se ha podido eliminar el componente");
      })
      .finally(() => setIsLoading(false));
  };

  const handleSubmit = (initValues) => {
    doFetchComponentEventsAction(
      componentId,
      initValues.type,
      initValues.order,
      initValues.startDate
        ? moment(initValues.startDate).format("YYYY-MM-DDTHH:mm:ss")
        : undefined,
      initValues.endDate
        ? moment(initValues.endDate).format("YYYY-MM-DDTHH:mm:ss")
        : undefined
    );
  };

  return (
    <>
      <NavbarComponent />
      {isLoading && (
        <div>
          <Loading />
        </div>
      )}
      {!isLoading && component?.id && (
        <Container
          style={{
            maxHeight: "100vh",
            height: "100vh",
          }}
        >
          <Row className="d-block mt-5 ml-0 mr-0">
            <h2 style={{ color: "#01516a" }}>Resumen de Componente</h2>
            <hr />
          </Row>
          <TabsComponent
            defaultVal={selectedTab}
            handleKeyChange={(k) => setSelectedTab(k)}
          >
            <Tab eventKey="component" title="Detalles">
              <ComponentDetail
                component={component}
                onDelete={() => handleDelete()}
              />
            </Tab>
            <Tab eventKey="pieces" title="Piezas">
              <PiecesList pieces={component.pieces} />
            </Tab>
            <Tab eventKey="faults" title="Fallas">
              <FaultsRelatedList
                faults={component.faults}
                variant="components"
              />
            </Tab>
            <Tab eventKey="tasks" title="Tareas">
              <TaskList
                tasks={component.tasks || []}
                title="Tareas del Componente"
                emptyTitle="No se han encontrado tareas asociadas al componente"
                navigationProps={{
                  componentId: component.id,
                  machineId: component.machineId,
                }}
              />
            </Tab>
            <Tab eventKey="studies" title="Estudios">
              <StudiesList
                studies={component.studies}
                variant="components"
                resourceId={componentId}
              />
            </Tab>
            <Tab eventKey="files" title="Archivos">
              <FilesRelatedList files={componentFiles} variant="components" />
            </Tab>
            <Tab eventKey="fieldsHistory" title="Historial">
              <FieldsHistory
                fieldsHistory={component.fieldHistories}
                variant="components"
              />
            </Tab>
            <Tab eventKey="timeline" title="Línea de tiempo">
              <Timeline
                component={component}
                elements={componentEvents}
                initialValues={filterInitialValues}
                onSubmit={handleSubmit}
              />
            </Tab>
          </TabsComponent>
        </Container>
      )}
      {!isLoading && errorMessage && (
        <Row style={{ margin: "2rem" }}>
          <WarningAlert title={`No se encontro el componente`} />
        </Row>
      )}
    </>
  );
};

export default connector(DetailPage);
