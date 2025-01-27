import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "components/Button";
import { doFetchCauses } from "redux/cause/action";
import { connect } from "react-redux";
import { Loading } from "components/Loading";
import { Table } from "components/Table";
import { AiFillEye } from "react-icons/ai";
import { BsPencil } from "react-icons/bs";
import { NavbarComponent } from "components/Navbar";
import useUser from "hooks/useUser";
import { CAUSE_STATUSES } from "utils/constants";

const mapDispatch = (dispatch) => ({
  doFetchCausesAction: () => dispatch(doFetchCauses()),
});
const mapStateToProps = (state) => {
  return {
    allCauses: state.cause.causes,
    causesLoading: state.cause.loading,
  };
};
const connector = connect(mapStateToProps, mapDispatch);

const CauseList = (props) => {
  const { doFetchCausesAction, allCauses, causesLoading } = props;
  const history = useHistory();
  const { isAdmin, isOperator } = useUser();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doFetchCausesAction();
  }, [doFetchCausesAction]);

  useEffect(() => {
    allCauses && addActionToCauses(allCauses);
  }, [allCauses]);

  useEffect(() => {
    setLoading(causesLoading);
  }, [causesLoading]);

  const handleEdit = (id) => {
    history.push(`/cause/edit/${id}`);
  };

  const handleDetail = (id) => {
    history.push(`/cause/detail/${id}`);
  };

  const columns = [
    {
      Header: "Lista de Causas",
      columns: [
        {
          Header: "Nombre",
          accessor: "name",
        },
        {
          Header: "Estado",
          accessor: "status",
          Cell: (rowInfo) => {
            return (
              <div
                style={{
                  backgroundColor: selectState(rowInfo.value).background,
                  fontSize: "15px",
                  color: selectState(rowInfo.value).color,
                  textAlign: "center",
                  borderRadius: "5px",
                }}
              >
                {rowInfo.value}
              </div>
            );
          },
        },
        {
          Header: "Solicitada por",
          accessor: "requested.name",
        },
        {
          Header: "Acción",
          accessor: "action",
          disableSortBy: true,
          disableFilters: true,
        },
      ],
    },
  ];

  const selectState = (state) => {
    let color = "";
    let background = "";
    switch (state) {
      case "Aprobada":
        color = "#136401";
        background = "#EAFAF1";
        break;
      case "Solicitada":
        background = "#FDF2E9";
        color = "#DC7633";
        break;
      case "Rechazada":
        background = "#F9EBEA";
        color = "#A2331A";
        break;
    }
    return { background, color };
  };

  const addActionToCauses = (causes) => {
    const formatted = causes.map((cause) => ({
      ...cause,
      action: (
        <div className="d-flex justify-content-between w-100">
          <button
            className="btn btn-outline-info m-0 p-0 w-100 h-100"
            onClick={() => handleDetail(cause.id)}
          >
            <AiFillEye size={17} />
          </button>
          {(isAdmin ||
            cause.status?.toLowerCase() !==
              CAUSE_STATUSES.APPROVED.toLowerCase()) &&
            !isOperator && (
              <button
                className="btn btn-outline-info ml-2 p-0 w-100 h-100"
                onClick={() => handleEdit(cause.id)}
              >
                <BsPencil size={17} />
              </button>
            )}
        </div>
      ),
    }));
    setData(formatted);
  };

  return (
    <div>
      <NavbarComponent />
      <div className="w-100 mt-3 vh-100 p-4">
        <div className="d-block ml-3 mr-3">
          <h2 style={{ color: "#01516a" }}>Causas</h2>
          <hr />
        </div>
        {!isOperator && (
          <div className="d-flex justify-content-end pr-3">
            <Button onClick={() => history.push("/cause/new")}>
              Ingresar Causa
            </Button>
          </div>
        )}
        {loading ? <Loading /> : <Table columns={columns} data={data} />}
      </div>
    </div>
  );
};

export default connector(CauseList);
