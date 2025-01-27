import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { doFetchCauses } from "redux/cause/action";
import { SelectFaultCauses } from "templates/Causes/index";
import { relateCausesToFault } from "service/fault";
import { Toast } from "components/Toast";

const mapDispatch = (dispatch) => ({
  doFetchCausesAction: () => dispatch(doFetchCauses()),
});
const mapStateToProps = (state) => {
  return {
    causes: state.cause.causes,
    loading: state.loading,
  };
};

const connector = connect(mapStateToProps, mapDispatch);

const RelateNewCauses = (props) => {
  const {
    doFetchCausesAction,
    causes,
    onCancel,
    onConfirm,
    faultId,
    setLoading,
    loading,
    initialCauses,
  } = props;

  const [allCauses, setAllCauses] = useState([]);

  useEffect(() => {
    // console.log(causes);
    doFetchCausesAction && doFetchCausesAction();
  }, [doFetchCausesAction]);

  useEffect(() => {
    causes && setAllCauses(causes);
    console.log(";causes", initialCauses);
  }, [causes]);

  useEffect(() => {
    setLoading(loading);
  }, [loading]);

  const handleConfirm = (causesObj) => {
    setLoading(true);
    relateCausesToFault(faultId, causesObj)
      .then(() => {
        Toast("success", "Se han relacionado las causas a la falla");
        onConfirm(causesObj);
      })
      .catch((error) => {
        console.error(error);
        Toast("error", "Ocurrió un error al relacionar las causas a la falla");
      })
      .finally(() => setLoading(false));
  };

  return (
    <SelectFaultCauses
      causes={allCauses}
      onCancel={() => onCancel()}
      onConfirm={(causesObj) => handleConfirm(causesObj)}
      initialCauses={initialCauses}
    />
  );
};

export default connector(RelateNewCauses);
