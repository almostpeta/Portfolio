import React from "react";
import { Row, Container } from "react-bootstrap";
import useTranslate from "hooks/useTranslate";
import { DataGrid } from "@material-ui/data-grid";
import { useHistory } from "react-router-dom";
import { WarningAlert } from "components/UI/Alert";
import moment from "moment";
import Box from "components/UI/Box";
import "moment/locale/es";

const getDate = (value) => {
  try {
    const cleanValue = Number(value);
    if (!isNaN(cleanValue)) {
      return new Date(cleanValue);
    } else {
      return Date.parse(value);
    }
  } catch (ex) {
    return null;
  }
};

const isDate = (value) => {
  try {
    const dateValue = getDate(value);
    return !isNaN(dateValue.getMonth());
  } catch (error) {
    return false;
  }
};

export const FieldsHistory = ({ variant, fieldsHistory }) => {
  const t = useTranslate();
  const history = useHistory();

  const historyMessages = `${variant}.detail.fieldsHistory`;
  const detailMessages = `${variant}.detail`;

  const selectMessage = (value) => t(historyMessages.concat("." + value));
  const selectFieldMessage = (value) => t(detailMessages.concat("." + value));

  const rows =
    fieldsHistory &&
    fieldsHistory.map((fh) => {
      console.log("\n old", fh.old_value);
      console.log("\n old", isDate(fh.old_value));
      if (isDate(fh.old_value)) {
        fh.old_value = moment(getDate(fh.old_value)).format("LLLL");
      }
      if (isDate(fh.new_value)) {
        fh.new_value = moment(getDate(fh.new_value)).format("LLLL");
      }
      return fh;
    });

  const columns = [
    { field: "id", hide: true },
    {
      field: "field",
      width: 150,
      headerName: `${selectMessage("field")}`,
      renderCell: (params) => `${selectFieldMessage(params.row.field)}`,
    },
    {
      field: "old_value",
      width: 300,
      headerName: `${selectMessage("old_value")}`,
      renderCell: (params) => params.row.old_value,
    },
    {
      field: "new_value",
      width: 300,
      headerName: `${selectMessage("new_value")}`,
      renderCell: (params) => params.row.new_value,
    },
    {
      field: "createdAt",
      width: 300,
      headerName: `${selectMessage("date")}`,
      renderCell: (params) => moment(params.row.createdAt).format("LLLL"),
    },
    {
      field: "user",
      width: 300,
      headerName: `${selectMessage("modified_by")}`,
      renderCell: (params) => params.row.user.name,
    },
  ];

  return (
    <Container>
      {fieldsHistory?.length > 0 && (
        <Box title={selectMessage("title")}>
          <div style={{ height: 400, width: "100%" }}>
            <div style={{ height: 300, width: "100%" }}>
              <DataGrid rows={rows} columns={columns} />
            </div>
          </div>
        </Box>
      )}
      {(!fieldsHistory || fieldsHistory.length === 0) && (
        <Row style={{ display: "flex", justifyItems: "end" }}>
          <WarningAlert
            style={{ width: "100%" }}
            title={selectMessage("error_message")}
          />
        </Row>
      )}
    </Container>
  );
};
