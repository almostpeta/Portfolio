import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { doFetchTasksByUser, doFetchTasks } from "redux/task/action";
import { connect } from "react-redux";
import { NavbarComponent } from "components/Navbar";
import useUser from "hooks/useUser";
import { Loading } from "components/Loading";
import { WarningAlert } from "components/UI/Alert";
import Calendar from "./Calendar";
import { doFetchUsers } from "redux/user/action";
import { doFetchComponents } from "redux/component/action";
import { doFetchMachines } from "redux/machine/action";
import { doFetchPieces } from "redux/piece/action";
import { Container } from "react-bootstrap";

const mapDispatch = (dispatch) => ({
  doFetchTasksByUserAction: (id, isAdmin) =>
    isAdmin ? dispatch(doFetchTasks()) : dispatch(doFetchTasksByUser(id)),
  doFetchUsersAction: () => dispatch(doFetchUsers()),
  doFetchMachinesAction: () => dispatch(doFetchMachines()),
  doFetchComponentsAction: () => dispatch(doFetchComponents()),
  doFetchPiecesAction: () => dispatch(doFetchPieces()),
});
const mapStateToProps = (state) => {
  return {
    tasks: state.task.tasks,
    loading:
      state.user.loading ||
      state.component.loading ||
      state.piece.loading ||
      state.task.loading,
    users: state.user.users,
    machines: state.machine.machines,
    components: state.component.components,
    pieces: state.piece.pieces,
  };
};
const connector = connect(mapStateToProps, mapDispatch);

const UserCalendar = (props) => {
  const {
    doFetchTasksByUserAction,
    doFetchUsersAction,
    doFetchMachinesAction,
    doFetchComponentsAction,
    doFetchPiecesAction,
    users,
    machines,
    components,
    pieces,
    loading,
    tasks,
  } = props;
  const history = useHistory();
  const { user, isAdmin } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    doFetchTasksByUserAction(user?.user?.id, isAdmin);
  }, [doFetchTasksByUserAction]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  useEffect(() => {
    doFetchUsersAction();
  }, [doFetchUsersAction]);

  useEffect(() => {
    doFetchMachinesAction();
  }, [doFetchMachinesAction]);

  useEffect(() => {
    doFetchComponentsAction();
  }, [doFetchComponentsAction]);

  useEffect(() => {
    doFetchPiecesAction();
  }, [doFetchPiecesAction]);

  return (
    <div>
      <NavbarComponent />
      <div className="w-100 mt-3 vh-100 p-4">
        {isLoading && <Loading />}
        {!isLoading && (
          <Container>
            <div className="d-block">
              <h2 style={{ color: "#01516a" }}>Calendario de Tareas</h2>
              <hr />
            </div>
            <Calendar
              datalists={{ users, machines, components, pieces }}
              tasks={tasks}
              setIsLoading={(v) => setIsLoading(v)}
              onRefresh={doFetchTasksByUserAction}
            />
          </Container>
        )}
      </div>
    </div>
  );
};

export default connector(UserCalendar);
