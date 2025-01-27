const PDFDocument = require("pdfkit");
const fs = require("fs");
const moment = require("moment");

export function createPdf(data, type) {
  // Create a document
  const doc = new PDFDocument();
  generateHeader(doc);
  // Pipe its output somewhere, like to a file or HTTP response
  // See below for browser usage
  doc.moveDown(1);
  const path = `${data["Título de la falla"]}.pdf`;

  doc.pipe(fs.createWriteStream(`./public/uploads/${path}`));

  // Titulo
  doc.fontSize(25).text(`Detalle de ${type}`, 50, 170);

  doc.moveTo(50, 190);

  doc.lineTo(350, 190).stroke();

  // subtitulos con valores de la falla
  for (const property in data) {
    doc.moveDown(1);
    doc.fontSize(20).text(`${property}`);

    doc.moveTo(doc.x, doc.y).lineTo(200, doc.y).stroke();
    doc.moveDown(0.5);
    if (typeof data[property] !== "object") {
      doc.fontSize(14).text(`${data[property]}`);
    } else if (data[property] !== null) {
      doc
        .fontSize(14)
        .text(
          `${
            data[property].internal_name ||
            data[property].name ||
            moment(data[property]).format("DD/MM/YYYY hh:mm a")
          }`
        );
    }
  }

  // Finalize PDF file
  doc.end();
  return path;
}

const date = new Date().toLocaleString("es-UY");

function generateHeader(doc) {
  doc
    .image("./utils/images/gerdauLogo.png", 50, 45, { width: 200 })
    .fillColor("#444444")
    .fontSize(20)
    .text("Historial Clínico de Máquinas", 280, 75, { align: "right" })
    .fontSize(10)
    .text(`${date}`, 280, 95, { align: "right" })
    .moveDown()
    .moveTo(50, 130)
    .lineTo(500, 130)
    .stroke();
}
