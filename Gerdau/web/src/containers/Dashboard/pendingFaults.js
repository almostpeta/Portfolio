import React from "react";
import useTranslate from "hooks/useTranslate";
import { DataGrid } from "@material-ui/data-grid";
import moment from "moment";
import { useHistory } from "react-router-dom";

const PendingFaults = ({ elements }) => {
  const t = useTranslate();
  const history = useHistory();

  const rows = [...elements];

  const columns = [
    { field: "id", hide: true },
    {
      field: "title",
      width: 300,
      headerName: "Título",
      renderCell: (params) => params.row.name,
    },
    {
      field: "date",
      width: 250,
      headerName: "Fecha de Inicio",
      renderCell: (params) => moment(params.row.date).format("MM/DD/YYYY"),
    },
    {
      field: "type",
      width: 120,
      headerName: "Tipo",
      renderCell: (params) => params.row.type,
    },
    {
      field: "state",
      width: 200,
      headerName: "Estado",
      renderCell: (params) => params.row.state,
    },
    {
      field: "description",
      width: 500,
      headerName: "Descripción",
      renderCell: (params) => params.row.description,
    },
  ];
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      onRowClick={(param) => history.push(`/fault/detail/${param.row.id}`)}
    />
  );
};

export default PendingFaults;
