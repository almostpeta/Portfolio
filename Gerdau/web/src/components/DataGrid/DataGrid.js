import * as React from "react";
import { DataGrid } from "@material-ui/data-grid";

export const DataGridTable = (columns, rows, components) => {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        checkboxSelection
        components={components}
      />
    </div>
  );
};
