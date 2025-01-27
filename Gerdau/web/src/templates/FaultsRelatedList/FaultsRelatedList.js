import React from "react";
import { useHistory } from "react-router-dom";
import useTranslate from "hooks/useTranslate";
import moment from "moment";
import "moment/locale/es";
import { Row, Col, Container } from "react-bootstrap";
import { DataGrid } from "@material-ui/data-grid";
import { AddBtn } from "components/UI/ActionBtn";
import { WarningAlert } from "components/UI/Alert";
import Box from "components/UI/Box";

export const FaultsRelatedList = ({ variant, faults }) => {
  moment.locale("es");
  const t = useTranslate();
  const history = useHistory();

  const faultMessages = `${variant}.detail.faults`;

  const selectMessage = (value) => t(faultMessages.concat("." + value));

  const rows = faults && [...faults];

  const columns = [
    { field: "id", hide: true },
    {
      field: "name",
      width: 200,
      headerName: `${selectMessage("name")}`,
      renderCell: (params) => params.row.name,
    },
    {
      field: "state",
      width: 150,
      headerName: `${selectMessage("state")}`,
      renderCell: (params) => params.row.state,
    },
    {
      field: "date",
      width: 250,
      headerName: `${selectMessage("date")}`,
      renderCell: (params) => moment(params.row.date).format("LLLL"),
    },
    {
      field: "description",
      width: 500,
      headerName: `${selectMessage("description")}`,
      renderCell: (params) => params.row.description,
    },
  ];

  const handleAdd = () =>
    history.push(
      "/fault/new",
      variant === "components"
        ? { componentId: faults[0]?.componentId }
        : { pieceId: faults[0]?.pieceId }
    );

  return (
    <Container fluid>
      <Box title={selectMessage("title")}>
        <div className="mr-2">
          <AddBtn
            handleClick={() => handleAdd()}
            title={selectMessage("add_fault_btn")}
          />
        </div>
        {faults?.length > 0 && (
          <div style={{ height: 400, width: "100%" }}>
            <div style={{ height: 300, width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                onRowClick={(param) =>
                  history.push(`/fault/detail/${param.row.id}`)
                }
              />
            </div>
          </div>
        )}
        {!faults ||
          (faults.length === 0 && (
            <Row style={{ display: "flex", justifyItems: "end" }}>
              <WarningAlert
                style={{ width: "100%" }}
                title={selectMessage("error_message")}
              />
            </Row>
          ))}
      </Box>
    </Container>
  );
};
