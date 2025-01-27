import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Row } from "react-bootstrap";
import { Button } from "components/Button";
import { doFetchTasks } from "redux/task/action";
import { connect } from "react-redux";
import { NavbarComponent } from "components/Navbar";
import { Loading } from "components/Loading";
import { WarningAlert } from "components/UI/Alert";
import useUser from "hooks/useUser";
import List from "./List";

const mapDispatch = (dispatch) => ({
  doFetchTasksAction: () => dispatch(doFetchTasks()),
});
const mapStateToProps = (state) => {
  return {
    tasks: state.task.tasks,
    loading: state.task.loading,
  };
};
const connector = connect(mapStateToProps, mapDispatch);

const TaskList = (props) => {
  const { doFetchTasksAction, tasks, loading } = props;
  const history = useHistory();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAdmin } = useUser();

  useEffect(() => {
    doFetchTasksAction();
  }, [doFetchTasksAction]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  return (
    <div>
      <NavbarComponent />
      <div className="w-100 mt-3 vh-100 p-4">
        <div className="d-block ml-3 mr-3">
          <h2 style={{ color: "#01516a" }}>Tareas</h2>
          <hr />
        </div>
        {isAdmin && (
          <div className="d-flex justify-content-end pr-3">
            <Button onClick={() => history.push("/task/new")}>
              Crear Tarea
            </Button>
          </div>
        )}
        {isLoading && <Loading />}
        {!isLoading && tasks?.length > 0 && (
          <List tasks={tasks} setIsLoading={(v) => setIsLoading(v)} />
        )}
        {!isLoading && (!tasks || tasks.length === 0) && (
          <Row style={{ margin: "2rem" }}>
            <WarningAlert title="No se encontraron tareas para visualizar" />
          </Row>
        )}
      </div>
    </div>
  );
};

export default connector(TaskList);
