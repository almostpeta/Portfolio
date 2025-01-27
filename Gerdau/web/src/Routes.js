import React, { lazy } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AppErrorBoundary from "./containers/ErrorBoundaries/AppErrorBoundary.react";
import useUser from "hooks/useUser";

const Welcome = lazy(() => import("./containers/onboarding/welcome"));
const Home = lazy(() => import("./containers/home/home"));
const AdminHome = lazy(() => import("./containers/home/adminHome"));
const NewMachine = lazy(() => import("./containers/machines/New/index.js"));
const NewStudy = lazy(() => import("./containers/studies/New/index.js"));
const EditMachine = lazy(() => import("./containers/machines/Edit/index"));
const Detail = lazy(() => import("containers/machines/Detail/index"));
const ComponentDetail = lazy(() =>
  import("containers/components/Detail/index")
);
const PieceDetail = lazy(() => import("containers/pieces/Detail/index.js"));
const ListPieces = lazy(() => import("containers/pieces/List/index.js"));
const StudyDetail = lazy(() => import("containers/studies/Detail/index.js"));
const EditStudy = lazy(() => import("containers/studies/Edit/index.js"));
const ListStudies = lazy(() => import("containers/studies/List/index.js"));
const FaultDetail = lazy(() => import("containers/Faults/Detail/index.js"));
const FaultList = lazy(() => import("containers/Faults/List/index.js"));
const EditFault = lazy(() => import("containers/Faults/Edit/index.js"));
const SearchFault = lazy(() => import("containers/Faults/Search/index.js"));
const CauseNew = lazy(() => import("containers/Cause/New/index.js"));
const CauseDetail = lazy(() => import("containers/Cause/Detail/index.js"));
const CauseEdit = lazy(() => import("containers/Cause/Edit/index.js"));
const CauseList = lazy(() => import("./containers/Cause/List/index.js"));
const Login = lazy(() => import("containers/User/Login/index"));
const ListMachines = lazy(() => import("./containers/machines/List/list"));
const ListComponents = lazy(() => import("./containers/components/List/index"));
const SolutionCreate = lazy(() => import("./containers/Solution/New"));
const MethodCreate = lazy(() => import("containers/Methods/New/index"));
const SolutionDetail = lazy(() => import("./containers/Solution/Detail"));
const MethodDetail = lazy(() => import("./containers/Methods/Detail/index.js"));
const EditMethod = lazy(() => import("./containers/Methods/Edit/index.js"));
const SolutionEdit = lazy(() => import("./containers/Solution/Edit"));
const SolutionList = lazy(() => import("./containers/Solution/List"));
const Register = lazy(() => import("./containers/User/Register"));
const ResetPassword = lazy(() => import("./containers/User/ResetPassword"));
const ForgetPassword = lazy(() => import("./containers/User/ForgetPassword"));
const UserList = lazy(() => import("./containers/User/List"));
const UserEdit = lazy(() => import("./containers/User/Edit"));
const NotFoundPage = lazy(() => import("containers/NotFound/index"));
const NewFault = lazy(() => import("containers/Faults/New/index"));
const NewTask = lazy(() => import("containers/Task/New"));
const TaskDetail = lazy(() => import("containers/Task/Detail"));
const EditTask = lazy(() => import("containers/Task/Edit"));
const ListTask = lazy(() => import("containers/Task/List"));
const TasksCalendar = lazy(() => import("containers/Task/Calendar"));
const Dashboard = lazy(() => import("containers/Dashboard"));

const PrivateRoute = ({
  path,
  component,
  exact,
  forbiddenForOperator,
  forbiddenForMechanic,
  ...props
}) => {
  const { user, isOperator, isMechanic } = useUser();
  const token = user?.token;
  let route;
  if (
    (forbiddenForOperator && isOperator) ||
    (forbiddenForMechanic && isMechanic)
  ) {
    route = <Redirect exact to="/404" />;
  } else if (token) {
    route = <Route path={path} exact={exact} component={component} />;
  } else {
    route = <Redirect exact to="/login" />;
  }
  return route;
};

const Routes = () => {
  const { isAdminView } = useUser();

  const getAdminRoutes = () => {
    if (!isAdminView) {
      return (
        <Switch>
          <PrivateRoute path="/" exact component={Welcome} />
          <PrivateRoute path="/home" exact component={Home} />
          <PrivateRoute path="/machines" exact component={ListMachines} />
          <PrivateRoute path="/machine/detail/:id" exact component={Detail} />
          <PrivateRoute
            path="/component/detail/:id"
            exact
            component={ComponentDetail}
          />
          <PrivateRoute path="/pieces/list" exact component={ListPieces} />
          <PrivateRoute
            path="/components/list"
            exact
            component={ListComponents}
          />
          <PrivateRoute
            path="/piece/detail/:id"
            exact
            component={PieceDetail}
          />
          <PrivateRoute
            path="/study/detail/:id"
            exact
            component={StudyDetail}
          />
          <PrivateRoute path="/fault/new" exact component={NewFault} />
          <PrivateRoute
            path="/study/new"
            forbiddenForOperator
            exact
            component={NewStudy}
          />
          <PrivateRoute
            path="/study/edit/:id"
            forbiddenForOperator
            exact
            component={EditStudy}
          />
          <PrivateRoute path="/study/list" exact component={ListStudies} />
          <PrivateRoute
            path="/fault/detail/:id"
            exact
            component={FaultDetail}
          />
          <PrivateRoute path="/fault/list" exact component={FaultList} />
          <PrivateRoute path="/fault/edit/:id" exact component={EditFault} />
          <PrivateRoute path="/fault/search" exact component={SearchFault} />
          <PrivateRoute
            path="/cause/new"
            forbiddenForOperator
            exact
            component={CauseNew}
          />
          <PrivateRoute path="/cause/list" exact component={CauseList} />
          <PrivateRoute
            path="/cause/detail/:id"
            exact
            component={CauseDetail}
          />
          <PrivateRoute
            path="/cause/edit/:id"
            forbiddenForOperator
            exact
            component={CauseEdit}
          />
          <PrivateRoute
            path="/solution/new"
            forbiddenForOperator
            exact
            component={SolutionCreate}
          />
          <PrivateRoute
            path="/solution/detail/:id"
            exact
            component={SolutionDetail}
          />
          <PrivateRoute
            path="/solution/edit/:id"
            forbiddenForOperator
            exact
            component={SolutionEdit}
          />
          <PrivateRoute path="/solution/list" exact component={SolutionList} />

          <PrivateRoute
            path="/method/new"
            forbiddenForOperator
            exact
            component={MethodCreate}
          />
          <PrivateRoute
            path="/method/detail/:id"
            exact
            component={MethodDetail}
          />
          <PrivateRoute
            path="/method/edit/:id"
            exact
            forbiddenForOperator
            component={EditMethod}
          />
          <PrivateRoute
            path="/task/new"
            forbiddenForOperator
            forbiddenForMechanic
            exact
            component={NewTask}
          />
          <PrivateRoute path="/task/detail/:id" exact component={TaskDetail} />
          <PrivateRoute
            path="/task/edit/:id"
            forbiddenForOperator
            forbiddenForMechanic
            exact
            component={EditTask}
          />
          <PrivateRoute path="/task/list" exact component={ListTask} />
          <PrivateRoute path="/task/calendar" exact component={TasksCalendar} />
          <Route exact path="/reset" component={ResetPassword} />
          <Route exact path="/forget" component={ForgetPassword} />
          <Route exact path="/login" exact component={Login} />
          <Route exact path="/404" component={NotFoundPage} />
          <Redirect to="/404" />
        </Switch>
      );
    } else {
      return (
        <Switch>
          <PrivateRoute path="/admin/home" exact component={AdminHome} />
          <PrivateRoute
            path="/admin/machine/new"
            exact
            component={NewMachine}
          />
          <PrivateRoute
            path="/admin/machine/edit/:id"
            exact
            component={EditMachine}
          />
          <PrivateRoute path="/pieces/list" exact component={ListPieces} />
          <PrivateRoute path="/admin/user/list" exact component={UserList} />
          <PrivateRoute path="/admin/user/new" exact component={Register} />
          <PrivateRoute
            path="/admin/user/edit/:id"
            exact
            component={UserEdit}
          />
          <PrivateRoute
            path="/admin/report/dashboard"
            exact
            component={Dashboard}
          />
          <PrivateRoute path="/machines" exact component={ListMachines} />
          <PrivateRoute path="/machine/detail/:id" exact component={Detail} />
          <PrivateRoute
            path="/component/detail/:id"
            exact
            component={ComponentDetail}
          />
          <PrivateRoute
            path="/components/list"
            exact
            component={ListComponents}
          />
          <PrivateRoute
            path="/piece/detail/:id"
            exact
            component={PieceDetail}
          />
          <PrivateRoute
            path="/study/detail/:id"
            exact
            component={StudyDetail}
          />
          <PrivateRoute path="/study/list" exact component={ListStudies} />
          <PrivateRoute path="/fault/new" exact component={NewFault} />
          <PrivateRoute path="/fault/search" exact component={SearchFault} />
          <PrivateRoute path="/study/new" exact component={NewStudy} />
          <PrivateRoute path="/study/edit/:id" exact component={EditStudy} />
          <PrivateRoute
            path="/fault/detail/:id"
            exact
            component={FaultDetail}
          />
          <PrivateRoute path="/fault/list" exact component={FaultList} />
          <PrivateRoute path="/fault/edit/:id" exact component={EditFault} />
          <PrivateRoute path="/cause/new" exact component={CauseNew} />
          <PrivateRoute path="/cause/list" exact component={CauseList} />
          <PrivateRoute
            path="/cause/detail/:id"
            exact
            component={CauseDetail}
          />
          <PrivateRoute path="/cause/edit/:id" exact component={CauseEdit} />
          <PrivateRoute path="/solution/new" exact component={SolutionCreate} />
          <PrivateRoute
            path="/solution/detail/:id"
            exact
            component={SolutionDetail}
          />
          <PrivateRoute
            path="/solution/edit/:id"
            exact
            component={SolutionEdit}
          />
          <PrivateRoute path="/solution/list" exact component={SolutionList} />

          <PrivateRoute path="/method/new" exact component={MethodCreate} />
          <PrivateRoute
            path="/method/detail/:id"
            exact
            component={MethodDetail}
          />
          <PrivateRoute path="/method/edit/:id" exact component={EditMethod} />
          <PrivateRoute path="/admin/task/new" exact component={NewTask} />
          <PrivateRoute path="/task/new" exact component={NewTask} />
          <PrivateRoute path="/task/detail/:id" exact component={TaskDetail} />
          <PrivateRoute path="/task/edit/:id" exact component={EditTask} />
          <PrivateRoute path="/task/list" exact component={ListTask} />
          <PrivateRoute path="/task/calendar" exact component={TasksCalendar} />
          <Route exact path="/reset" component={ResetPassword} />
          <Route exact path="/forget" component={ForgetPassword} />
          <Route exact path="/login" exact component={Login} />
          <Route exact path="/404" component={NotFoundPage} />
          <Redirect to="/404" />
        </Switch>
      );
    }
  };
  return (
    <BrowserRouter>
      <AppErrorBoundary isAdminView={isAdminView}>
        {getAdminRoutes()}
        <ToastContainer hideProgressBar={true} />
      </AppErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
