import React, { useEffect, useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import useTranslate from "hooks/useTranslate";
import { DataGrid, RowsProp, ColDef } from "@material-ui/data-grid";
import { useHistory } from "react-router-dom";
import { DataGridTable } from "components/DataGrid";
import { WarningAlert } from "components/UI/Alert";
import { RelateCauseBtn } from "components/UI/ActionBtn";
import Box from "components/UI/Box";
import useUser from "hooks/useUser";

const MethodsRelatedList = ({ solutionId, methods, handleLoading }) => {
  const t = useTranslate();
  const history = useHistory();
  const { isOperator } = useUser();

  const methodMessages = "containers.solutions.detail.methods";

  const selectMessage = (value) => t(methodMessages.concat("." + value));

  const rows = methods && [...methods];

  const columns = [
    { field: "id", hide: true },
    {
      field: "name",
      width: 300,
      headerName: "Nombre",
      renderCell: (params) => params.row.name,
    },
    {
      field: "status",
      width: 300,
      headerName: "Estado",
      renderCell: (params) => params.row.status,
    },
    {
      field: "createdAt ",
      width: 300,
      headerName: "Fecha de Creación",
      renderCell: (params) => params.row.createdAt,
    },
  ];

  return (
    <Container>
      <Box title={selectMessage("title")}>
        {!isOperator && (
          <Row className="d-flex justify-content-end">
            <RelateCauseBtn
              handleClick={() =>
                history.push("/method/new/", { solutionId: solutionId })
              }
              title={selectMessage("add_method_btn")}
            />
          </Row>
        )}
        {methods?.length > 0 && (
          <div style={{ height: 400, width: "100%" }}>
            <div style={{ height: 300, width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                onRowClick={(param) =>
                  history.push(`/method/detail/${param.row.id}`)
                }
              />
            </div>
          </div>
        )}

        {!methods ||
          (methods.length === 0 && (
            <Row>
              <WarningAlert title={selectMessage("error_message")} />
            </Row>
          ))}
      </Box>
    </Container>
  );
};

export default MethodsRelatedList;
