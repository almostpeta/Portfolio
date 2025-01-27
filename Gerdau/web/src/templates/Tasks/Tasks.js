import React from "react";
import { Container, Row } from "react-bootstrap";
import { DataGrid } from "@material-ui/data-grid";
import { useHistory } from "react-router-dom";
import { WarningAlert } from "components/UI/Alert";
import { AddBtn } from "components/UI/ActionBtn";
import useUser from "hooks/useUser";
import moment from "moment";
import Box from "components/UI/Box";

const TaskList = ({ tasks, title, emptyTitle, navigationProps }) => {
  const history = useHistory();
  const { isAdmin } = useUser();

  const rows = [...tasks];

  const columns = [
    { field: "id", hide: true },
    {
      field: "name",
      width: 300,
      headerName: "Nombre",
      renderCell: (params) => params.row.name,
    },
    {
      field: "description",
      width: 300,
      headerName: "Descripción",
      renderCell: (params) => params.row.description,
    },
    {
      field: "start_date",
      width: 150,
      headerName: "Fecha Inicio",
      renderCell: (params) =>
        params.row.start_date
          ? moment(params.row.start_date).format("DD/MM/YYYY")
          : "-",
    },
    {
      field: "end_date",
      width: 150,
      headerName: "Fecha Fin",
      renderCell: (params) =>
        params.row.end_date
          ? moment(params.row.end_date).format("DD/MM/YYYY")
          : "-",
    },
    {
      field: "complete_date",
      width: 200,
      headerName: "Fecha Completado",
      renderCell: (params) =>
        params.row.complete_date
          ? moment(params.row.complete_date).format("DD/MM/YYYY")
          : "-",
    },
  ];

  const handleAdd = () => {
    history.push("/task/new", navigationProps);
  };

  return (
    <Container>
      <Box title={title}>
        {isAdmin && (
          <div className="mr-2">
            <AddBtn handleClick={() => handleAdd()} title="Nueva Tarea" />
          </div>
        )}
        {tasks.length > 0 && (
          <div style={{ height: 400, width: "100%" }}>
            <div style={{ height: 300, width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                onRowClick={(param) =>
                  history.push(`/task/detail/${param.row.id}`)
                }
              />
            </div>
          </div>
        )}
        {tasks.length === 0 && (
          <Row>
            <WarningAlert title={emptyTitle} />
          </Row>
        )}
      </Box>
    </Container>
  );
};

export default TaskList;
