import React from "react";
import { Row, Button, Container, Col } from "react-bootstrap";
import useTranslate from "hooks/useTranslate";
import { DataGrid, RowsProp, ColDef } from "@material-ui/data-grid";
import { useHistory } from "react-router-dom";
import { DataGridTable } from "components/DataGrid";
import { WarningAlert } from "components/UI/Alert";
import { AddBtn } from "components/UI/ActionBtn";
import Box from "components/UI/Box";
import useUser from "hooks/useUser";

export const StudiesList = ({ variant, studies, resourceId }) => {
  const t = useTranslate();
  const history = useHistory();
  const { isOperator } = useUser();

  const studyMessages = `${variant}.detail.studies`;

  const selectMessage = (value) => t(studyMessages.concat("." + value));

  const rows = [...studies];

  const columns = [
    { field: "id", hide: true },
    {
      field: "internal_name",
      width: 300,
      headerName: `${selectMessage("internal_name")}`,
      renderCell: (params) => params.row.internal_name,
    },
    variant === "components"
      ? {
          field: "piece",
          width: 300,
          headerName: `${selectMessage("piece")}`,
          renderCell: (params) => params.row.piece?.internal_name || "N/A",
        }
      : {
          field: "component",
          width: 300,
          headerName: `${selectMessage("component")}`,
          renderCell: (params) => params.row.component?.internal_name || "N/A",
        },
    {
      field: "reason",
      width: 300,
      headerName: `${selectMessage("reason")}`,
      renderCell: (params) => params.row.reason,
    },
  ];

  const handleAdd = () => {
    history.push(
      `/study/new`,
      variant === "components"
        ? { componentId: resourceId }
        : { pieceId: resourceId }
    );
  };

  return (
    <Container>
      <Box title={selectMessage("title")}>
        <>
          {!isOperator && (
            <div className="mr-2">
              <AddBtn
                handleClick={() => handleAdd()}
                title={selectMessage("add_btn")}
              />
            </div>
          )}
          {studies.length > 0 && (
            <div style={{ height: 400, width: "100%" }}>
              <div style={{ height: 300, width: "100%" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  onRowClick={(param) =>
                    history.push(`/study/detail/${param.row.id}`)
                  }
                />
              </div>
            </div>
          )}

          {!studies ||
            (studies.length === 0 && (
              <Row style={{ display: "flex", justifyItems: "end" }}>
                <WarningAlert
                  style={{ width: "100%" }}
                  title={selectMessage("error_message")}
                />
              </Row>
            ))}
        </>
      </Box>
    </Container>
  );
};
