import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { doFetchTask } from "redux/task/action";
import { connect } from "react-redux";
import { NavbarComponent } from "components/Navbar";
import { Loading } from "components/Loading";
import { WarningAlert } from "components/UI/Alert";
import { deleteTask, setTaskAsCompleted } from "service/task";
import { Toast } from "components/Toast";

import DetailPage from "./Detail";

const mapDispatch = (dispatch) => ({
  doFetchTaskAction: (id) => dispatch(doFetchTask(id)),
});
const mapStateToProps = (state) => ({
  error: state.task.error,
  loading: state.task.loading,
  task: state.task.currentTask,
});
const connector = connect(mapStateToProps, mapDispatch);

const TaskDetailPage = (props) => {
  const { doFetchTaskAction, loading, error, task, match } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();
  const taskId = match.params.id;

  useEffect(() => {
    taskId && doFetchTaskAction(taskId);
  }, [doFetchTaskAction, taskId]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  useEffect(() => {
    setErrorMessage(error);
  }, [error]);

  const handleEdit = () => {
    history.push(`/task/edit/${taskId}`);
  };

  const handleDelete = async () => {
    try {
      if (!window.confirm("Desea eliminar la tarea?")) {
        return;
      }

      setIsLoading(true);
      await deleteTask(task.id);
      Toast("success", "Tarea eliminada correctamente");
      history.push("/home");
    } catch (e) {
      Toast("error", "Ocurrió un error al eliminar la tarea");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteTask = async () => {
    try {
      setIsLoading(true);
      await setTaskAsCompleted(task.id);
      Toast("success", "La tarea se ha completado correctamente");
      doFetchTaskAction(task.id);
    } catch (e) {
      Toast("error", "No se pudo completar la tarea");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavbarComponent />
      <Container
        style={{
          maxHeight: "100vh",
          height: "100vh",
        }}
      >
        {isLoading && <Loading />}
        {!isLoading && !errorMessage && task && (
          <div>
            <Row className="d-block mt-5 ml-0 mr-0">
              <h2 style={{ color: "#01516a" }}>Resumen de Tarea</h2>
              <hr />
            </Row>
            <DetailPage
              task={task}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              handleCompleteTask={handleCompleteTask}
            />
          </div>
        )}
        {!isLoading && !errorMessage && !task && (
          <Row style={{ margin: "2rem" }}>
            <WarningAlert
              title={
                "No existe la tarea o no tiene los permisos necesarios para visualizarla"
              }
            />
          </Row>
        )}
        {!isLoading && errorMessage && (
          <Row style={{ margin: "2rem" }}>
            <WarningAlert title={errorMessage} />
          </Row>
        )}
      </Container>
    </>
  );
};
export default connector(TaskDetailPage);
