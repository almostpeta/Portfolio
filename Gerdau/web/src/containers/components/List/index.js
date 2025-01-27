import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { doFetchComponents } from "redux/component/action";
import { connect } from "react-redux";
import { NavbarComponent } from "components/Navbar";
import { Loading } from "components/Loading";
import { WarningAlert } from "components/UI/Alert";
import List from "./List";

const mapDispatch = (dispatch) => ({
  doFetchComponentsAction: () => dispatch(doFetchComponents()),
});
const mapStateToProps = (state) => ({
  components: state.component.components,
  loading: state.component.loading,
  error: state.component.error,
});
const connector = connect(mapStateToProps, mapDispatch);

const ListContainer = (props) => {
  const { doFetchComponentsAction, components, loading, error } = props;

  useEffect(() => {
    doFetchComponentsAction();
  }, [doFetchComponentsAction]);

  return (
    <>
      <NavbarComponent />
      <Container fluid>
        {loading && <Loading />}
        {!loading && <List components={components} />}
        {error && <WarningAlert title={error} />}
      </Container>
    </>
  );
};
export default connector(ListContainer);
