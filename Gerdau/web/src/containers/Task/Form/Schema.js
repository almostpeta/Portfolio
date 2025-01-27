import * as Yup from "yup";

const message = (field) => "Ingrese un valor";

const Schema = Yup.object().shape({
  name: Yup.string().required(message("name")),
  description: Yup.string().required(message("description")),
  reason: Yup.string().required(message("reason")),
  deadline: Yup.date().required(message("deadline")),
  start_date: Yup.date().required(message("start_date")),
  responsibleId: Yup.string().required(message("responsibleId")),
  requestedId: Yup.string().required(message("requestedId")),
  complete_date: Yup.date().nullable().default(undefined),
  status: Yup.string().required(message("status")),
  machineId: Yup.string().nullable(),
  componentId: Yup.string().nullable(),
  pieceId: Yup.string().nullable(),
});

export default Schema;
