import React, { useEffect, useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import useTranslate from "hooks/useTranslate";
import { DataGrid, RowsProp, ColDef } from "@material-ui/data-grid";
import { useHistory } from "react-router-dom";
import { DataGridTable } from "components/DataGrid";
import { WarningAlert } from "components/UI/Alert";
import useUser from "hooks/useUser";
import Box from "components/UI/Box";

const PiecesList = ({ pieces }) => {
  const t = useTranslate();
  const history = useHistory();

  const componentMessages = "components.detail.pieces";

  const selectMessage = (value) => t(componentMessages.concat("." + value));

  const rows = pieces && [...pieces];

  const columns = [
    { field: "id", hide: true },
    {
      field: "identifier",
      width: 300,
      headerName: "Identificador",
      renderCell: (params) => params.row.identifier,
    },
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
    <>
      <Container>
        {pieces?.length > 0 && (
          <Box title={selectMessage("title")}>
            <div style={{ height: 400, width: "100%" }}>
              <div style={{ height: 300, width: "100%" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  onRowClick={(param) =>
                    history.push(`/piece/detail/${param.row.id}`)
                  }
                />
              </div>
            </div>
          </Box>
        )}
        {!pieces ||
          (pieces.length === 0 && (
            <Row>
              <WarningAlert title={selectMessage("error_message")} />
            </Row>
          ))}
      </Container>
    </>
  );
};

export default PiecesList;
