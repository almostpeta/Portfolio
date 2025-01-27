import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { doFetchStudies } from "redux/study/action";
import { connect } from "react-redux";
import { NavbarComponent } from "components/Navbar";
import { Loading } from "components/Loading";
import { WarningAlert } from "components/UI/Alert";
import List from "./List";

const mapDispatch = (dispatch) => ({
  doFetchStudiesAction: () => dispatch(doFetchStudies()),
});
const mapStateToProps = (state) => ({
  studies: state.study.studies,
  loading: state.study.loading,
  error: state.study.error,
});
const connector = connect(mapStateToProps, mapDispatch);

const ListContainer = (props) => {
  const { doFetchStudiesAction, studies, loading, error } = props;

  useEffect(() => {
    doFetchStudiesAction();
  }, [doFetchStudiesAction]);

  return (
    <>
      <NavbarComponent />
      <Container fluid>
        {loading && <Loading />}
        {!loading && <List studies={studies} />}
        {error && <WarningAlert title={error} />}
      </Container>
    </>
  );
};
export default connector(ListContainer);
