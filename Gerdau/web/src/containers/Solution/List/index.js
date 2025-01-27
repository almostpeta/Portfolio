import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { doFetchSolutions } from "redux/solution/action";
import { connect } from "react-redux";
import { NavbarComponent } from "components/Navbar";
import { Loading } from "components/Loading";
import List from "./List";

const mapDispatch = (dispatch) => ({
  doFetchSolutionsAction: () => dispatch(doFetchSolutions()),
});
const mapStateToProps = (state) => ({
  solutions: state.solution.solutions,
  loading: state.solution.loading,
});
const connector = connect(mapStateToProps, mapDispatch);

const ListContainer = (props) => {
  const { doFetchSolutionsAction, solutions, loading } = props;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    doFetchSolutionsAction();
  }, [doFetchSolutionsAction]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  return (
    <>
      <NavbarComponent />
      <Container fluid>
        {isLoading && <Loading />}
        {!isLoading && <List solutions={solutions} />}
      </Container>
    </>
  );
};
export default connector(ListContainer);
