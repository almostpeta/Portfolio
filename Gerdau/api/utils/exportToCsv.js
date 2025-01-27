const { parse } = require("json2csv");

export function exportAsCSV(response, data, filename) {
  // set the response header to tell the browser to expect a csv
  response.setHeader("Content-Type", "text/csv");
  response.setHeader(
    "Content-Disposition",
    `attachment; filename=cust-${filename}-csv`
  );
  response.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
  // list the fields of the orders that you want to display as columns of the csv
  let fields = [];
  if (data && data[0]) fields = Object.getOwnPropertyNames(data[0]);
  else fields = [];
  // convert the array of records into a csv
  try {
    const csv = parse(data, { fields });
    return response.send(csv);
  } catch (err) {
    return response.status(500).json({ err });
  }
}
