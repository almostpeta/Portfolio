import React, { useEffect, useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import useTranslate from "hooks/useTranslate";
import { DataGrid, RowsProp, ColDef } from "@material-ui/data-grid";
import { useHistory } from "react-router-dom";
import { WarningAlert } from "components/UI/Alert";
import { RelateCauseBtn } from "components/UI/ActionBtn";
import Box from "components/UI/Box";
import useUser from "hooks/useUser";

const SolutionsRelatedList = ({ causeId, solutions }) => {
  const t = useTranslate();
  const history = useHistory();
  const { isOperator } = useUser();

  const componentMessages = "causes.detail.solutions";

  const selectMessage = (value) => t(componentMessages.concat("." + value));

  const rows = solutions && [...solutions];

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
      <Box title="Soluciones asociadas a la Causa">
        {!isOperator && (
          <div className="mr-2">
            <RelateCauseBtn
              handleClick={() =>
                history.push("/solution/new/", { causeId: causeId })
              }
              title={selectMessage("add_solution_btn")}
            />
          </div>
        )}
        {solutions.length > 0 && (
          <div style={{ height: 400, width: "100%" }}>
            <div style={{ height: 300, width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                onRowClick={(param) =>
                  history.push(`/solution/detail/${param.row.id}`)
                }
              />
            </div>
          </div>
        )}
        {!solutions ||
          (solutions.length === 0 && (
            <div>
              <WarningAlert title={selectMessage("error_message")} />
            </div>
          ))}
      </Box>
    </Container>
  );
};

export default SolutionsRelatedList;
