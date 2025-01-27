import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { doFetchPieces } from "redux/piece/action";
import { connect } from "react-redux";
import { NavbarComponent } from "components/Navbar";
import { Loading } from "components/Loading";
import { WarningAlert } from "components/UI/Alert";
import List from "./List";

const mapDispatch = (dispatch) => ({
  doFetchPiecesAction: () => dispatch(doFetchPieces()),
});
const mapStateToProps = (state) => ({
  pieces: state.piece.pieces,
  loading: state.piece.loading,
  error: state.piece.error,
});
const connector = connect(mapStateToProps, mapDispatch);

const ListContainer = (props) => {
  const { doFetchPiecesAction, pieces, loading, error } = props;

  useEffect(() => {
    doFetchPiecesAction();
  }, [doFetchPiecesAction]);

  return (
    <>
      <NavbarComponent />
      <Container fluid>
        {loading && <Loading />}
        {!loading && <List pieces={pieces} />}
        {error && <WarningAlert title={error} />}
      </Container>
    </>
  );
};
export default connector(ListContainer);
