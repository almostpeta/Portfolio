import React, { useEffect, useState, useCallback } from "react";
import { Container, Row } from "react-bootstrap";
import SolutionForm from "./New";
import { NavbarComponent } from "components/Navbar";
import { connect } from "react-redux";
import { doFetchCauses } from "redux/cause/action";
import { doFetchUsers } from "redux/user/action";
import { Loading } from "components/Loading";
import useTranslate from "hooks/useTranslate";
import lodash from "lodash";

const mapDispatch = (dispatch) => ({
  doFetchCausesAction: () => dispatch(doFetchCauses()),
  doFetchUsersAction: () => dispatch(doFetchUsers()),
});
const mapStateToProps = (state) => {
  return {
    allCauses: state.cause.causes,
    allUsers: state.user.users,
    loading: state.cause.loading || state.user.loading,
  };
};

const connector = connect(mapStateToProps, mapDispatch);

const SolutionContainer = (props) => {
  const {
    allCauses,
    doFetchCausesAction,
    allUsers,
    doFetchUsersAction,
    loading,
  } = props;
  const t = useTranslate();
  const [isLoading, setIsLoading] = useState(false);
  const [causes, setCauses] = useState([]);
  const [users, setUsers] = useState([]);

  const { causeId, fallback } = lodash.pick(props.location?.state, [
    "causeId",
    "fallback",
  ]);

  const message = (field) => t(`containers.solutions.new.${field}`);
  useCallback(() => {
    setIsLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  useEffect(() => {
    doFetchCausesAction();
  }, [doFetchCausesAction]);

  useEffect(() => {
    doFetchUsersAction();
  }, [doFetchUsersAction]);

  useEffect(() => {
    allCauses && setCauses(allCauses);
  }, [allCauses]);

  useEffect(() => {
    allUsers && setUsers(allUsers);
  }, [allUsers]);

  return (
    <>
      {isLoading && <Loading />}
      <NavbarComponent />
      <Container>
        <Row className="d-block mt-5 ml-0 mr-0">
          <h2 style={{ color: "#01516a" }}>{message("title")}</h2>
          <hr />
        </Row>
        <SolutionForm
          setIsLoading={(v) => setIsLoading(v)}
          users={users || []}
          causeId={causeId}
          fallback={fallback}
          causes={causes || []}
        />
      </Container>
    </>
  );
};

export default connector(SolutionContainer);
