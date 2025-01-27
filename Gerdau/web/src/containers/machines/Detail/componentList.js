import React from "react";
import { Container } from "react-bootstrap";
import useTranslate from "hooks/useTranslate";
import { DataGrid } from "@material-ui/data-grid";
import { useHistory } from "react-router-dom";
import Box from "components/UI/Box";
import useUser from "hooks/useUser";

const ComponentsDetail = ({ components }) => {
  const t = useTranslate();
  const history = useHistory();

  const componentMessages = "machine.detail.components";

  const selectMessage = (value) => t(componentMessages.concat("." + value));

  const rows = [...components];

  const columns = [
    { field: "id", hide: true },
    {
      field: "internal_name",
      width: 300,
      headerName: "Internal Name",
      renderCell: (params) => params.row.internal_name,
    },
    {
      field: "type",
      width: 300,
      headerName: "Tipo",
      renderCell: (params) => params.row.type,
    },
  ];
  return (
    <Container>
      <Box title={"Componentes de la Máquina"}>
        <div style={{ height: 400, width: "100%" }}>
          <div style={{ height: 300, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              onRowClick={(param) =>
                history.push(`/component/detail/${param.row.id}`)
              }
            />
          </div>
        </div>
      </Box>
    </Container>
  );
};

export default ComponentsDetail;
