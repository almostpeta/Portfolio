import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "components/Button";
import { doFetchFaults } from "redux/fault/action";
import { deleteFault } from "service/fault";
import { connect } from "react-redux";
import { NavbarComponent } from "components/Navbar";
import { Loading } from "components/Loading";
import { Table } from "components/Table";
import { AiFillEye } from "react-icons/ai";
import { BsPencil } from "react-icons/bs";
import { Toast } from "components/Toast";
import { FAULT_STATES } from "utils/constants";
import moment from "moment";
import {
  FcHighPriority,
  FcLowPriority,
  FcMediumPriority,
} from "react-icons/fc";

const mapDispatch = (dispatch) => ({
  doFetchFaultsAction: () => dispatch(doFetchFaults()),
});
const mapStateToProps = (state) => {
  return {
    allFaults: state.fault.faults,
    faultsLoading: state.fault.loading,
  };
};
const connector = connect(mapStateToProps, mapDispatch);

const FaultList = (props) => {
  const { doFetchFaultsAction, allFaults, faultsLoading } = props;
  const history = useHistory();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doFetchFaultsAction();
  }, [doFetchFaultsAction]);

  useEffect(() => {
    allFaults && addActionToFaults(allFaults);
    allFaults && console.log(allFaults);
  }, [allFaults]);

  useEffect(() => {
    setLoading(faultsLoading);
  }, [faultsLoading]);

  const handleEdit = (id) => {
    history.push(`/fault/edit/${id}`);
  };

  const handleDetail = (id) => {
    history.push(`/fault/detail/${id}`);
  };

  const columns = [
    {
      Header: "List de Fallas",
      columns: [
        {
          Header: "Título",
          accessor: "name",
        },
        {
          Header: "Componente",
          accessor: "component.internal_name",
        },
        {
          Header: "Pieza",
          accessor: "piece.internal_name",
        },
        {
          Header: "Estado",
          accessor: "state",
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
          Header: "Prioridad",
          accessor: "priority",
          Cell: (rowInfo) => {
            return (
              <div className="text-center">
                {rowInfo.value} {""}
                {selectPriorityicon(rowInfo.value)}
              </div>
            );
          },
        },
        {
          Header: "Clasificación",
          accessor: "clasification",
        },
        {
          Header: "Responsable",
          accessor: "responsible.name",
        },
        {
          Header: "Número",
          accessor: "fault_number",
        },
        {
          Header: "Fecha de Reporte",
          accessor: "start_date_time",
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
      case FAULT_STATES.RESOLVED:
        color = "#136401";
        background = "#EAFAF1";
        break;
      case FAULT_STATES.IN_PROGRESS:
        background = "#FDF2E9";
        color = "#DC7633";
        break;
      case FAULT_STATES.PENDING:
        background = "#F9EBEA";
        color = "#A2331A";
        break;
    }
    return { background, color };
  };

  const selectPriorityicon = (priority) => {
    let icon;
    switch (priority) {
      case "Alta":
        icon = <FcHighPriority size={22} />;
        break;
      case "Baja":
        icon = <FcLowPriority size={22} />;
        break;
      case "Media":
        icon = <FcMediumPriority size={22} />;
        break;
    }
    return icon;
  };

  const addActionToFaults = (faults) => {
    const formatted = faults.map((fault) => ({
      ...fault,
      start_date_time: moment(fault.start_date_time).format("L"),
      action: (
        <div className="d-flex justify-content-between w-100">
          <button
            className="btn btn-outline-info m-0 p-0 w-100 h-100"
            onClick={() => handleDetail(fault.id)}
          >
            <AiFillEye size={17} />
          </button>
          <button
            className="btn btn-outline-info ml-2 p-0 w-100 h-100"
            onClick={() => handleEdit(fault.id)}
          >
            <BsPencil size={17} />
          </button>
        </div>
      ),
      state: fault.state,
      priority: fault.priority,
    }));
    setData(formatted);
  };

  return (
    <div>
      <NavbarComponent />
      <div className="w-100 mt-3 vh-100 p-4">
        <div className="d-block ml-3 mr-3">
          <h2 style={{ color: "#01516a" }}>Fallas</h2>
          <hr />
        </div>
        <div className="d-flex justify-content-end pr-3">
          <Button onClick={() => history.push("/fault/new")}>
            Reportar Falla
          </Button>
        </div>
        {loading ? <Loading /> : <Table columns={columns} data={data} />}
      </div>
    </div>
  );
};

export default connector(FaultList);
