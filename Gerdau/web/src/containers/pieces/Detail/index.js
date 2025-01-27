import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { getPieceById, getFiles, getAllPieceEvents } from "service/piece";
import { getAllStudiesFromPieceId } from "service/study";
import useTranslate from "hooks/useTranslate";
import { NavbarComponent } from "components/Navbar";
import Tab from "react-bootstrap/Tab";
import { TabsComponent } from "components/Tabs";
import { Loading } from "components/Loading/index";
import PieceDetail from "./pieceDetail";
import { StudiesList } from "templates/Studies";
import { FilesRelatedList } from "templates/Files";
import { FaultsRelatedList } from "templates/FaultsRelatedList";
import { FieldsHistory } from "templates/FieldsHistory";
import { Toast } from "components/Toast";
import Timeline from "templates/timeline";
import TasksList from "templates/Tasks";
import moment from "moment";

const DetailPage = (props) => {
  const pieceId = props.match.params.id;
  const [isLoading, setIsLoading] = useState(false);
  const [piece, setPiece] = useState(null);
  const [loadedPiece, setLoadedPiece] = useState(false);
  const [loadedStudies, setLoadedStudies] = useState(false);
  const [studies, setStudies] = useState([]);
  const [pieceFiles, setPieceFiles] = useState([]);
  const [pieceEvents, setPieceEvents] = useState([]);
  const [selectedTab, setSelectedTab] = useState("piece");
  const [filterInitialValues, setFilterInitialValues] = useState({
    startDate: undefined,
    endDate: undefined,
    type: "all",
    order: "desc",
  });

  const t = useTranslate();

  useEffect(() => {
    if (!loadedPiece) {
      setIsLoading(true);
      setLoadedPiece(true);
      getPieceById(pieceId)
        .then((res) => {
          console.log(res);
          setPiece(res);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setPiece(null);
          setIsLoading(false);
        });
    }
  }, [loadedPiece, pieceId]);

  useEffect(() => {
    if (!loadedStudies) {
      setLoadedStudies(true);
      getAllStudiesFromPieceId(pieceId)
        .then((res) => {
          setStudies(res);
        })
        .catch((error) => {
          console.error(error);
          setStudies([]);
        });
    }
  }, [loadedStudies, pieceId]);

  useEffect(async () => {
    piece?.pieceFiles &&
      getFiles(piece.pieceFiles)
        .then((res) => {
          setPieceFiles(res);
        })
        .catch((error) => {
          console.error("error", error);
          Toast("error", "No se pudieron cargar los archivos de la pieza");
          setPieceFiles([]);
        });
  }, [piece]);

  useEffect(async () => {
    piece &&
      getAllPieceEvents(
        pieceId,
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
          setPieceEvents(res);
        })
        .catch(() => {
          Toast("error", "No se pudieron cargar los eventos de la Pieza");
          setPieceEvents([]);
        });
  }, [piece]);

  const handleSubmitFilter = (initValues) => {
    getAllPieceEvents(
      pieceId,
      initValues.type,
      initValues.order,
      initValues.startDate
        ? moment(initValues.startDate).format("YYYY-MM-DDTHH:mm:ss")
        : undefined,
      initValues.endDate
        ? moment(initValues.endDate).format("YYYY-MM-DDTHH:mm:ss")
        : undefined
    ).then((res) => {
      setPieceEvents(res);
    });
  };

  return (
    <div>
      <NavbarComponent />
      {isLoading && (
        <div>
          <Loading />
        </div>
      )}
      {!isLoading && (
        <Container
          style={{
            maxHeight: "100vh",
            height: "100vh",
          }}
        >
          <Row className="d-block mt-5 ml-0 mr-0">
            <h2 style={{ color: "#01516a" }}>Resumen de Pieza</h2>
            <hr />
          </Row>
          <TabsComponent
            defaultVal={selectedTab}
            handleKeyChange={(k) => setSelectedTab(k)}
          >
            <Tab eventKey="piece" title="Detalles">
              <PieceDetail piece={piece} />
            </Tab>
            <Tab eventKey="faults" title="Fallas">
              <FaultsRelatedList faults={piece?.faults} variant="pieces" />
            </Tab>
            <Tab eventKey="tasks" title="Tareas">
              <TasksList
                tasks={piece?.tasks || []}
                title="Tareas de la Pieza"
                emptyTitle="No se han encontrado tareas asociadas a la pieza"
                navigationProps={{
                  pieceId: piece?.id,
                  componentId: piece?.componentId,
                  machineId: piece?.component.machineId,
                }}
              />
            </Tab>
            <Tab eventKey="studies" title="Estudios">
              <StudiesList
                studies={studies}
                variant="pieces"
                resourceId={pieceId}
              />
            </Tab>
            <Tab eventKey="files" title="Archivos">
              <FilesRelatedList files={pieceFiles} variant="pieces" />
            </Tab>
            <Tab eventKey="fieldsHistory" title="Historial">
              <FieldsHistory
                fieldsHistory={piece?.fieldHistories}
                variant="pieces"
              />
            </Tab>
            <Tab eventKey="timeline" title="Línea de tiempo">
              <Timeline
                elements={pieceEvents}
                initialValues={filterInitialValues}
                onSubmit={handleSubmitFilter}
              />
            </Tab>
          </TabsComponent>
        </Container>
      )}
    </div>
  );
};

export default DetailPage;
