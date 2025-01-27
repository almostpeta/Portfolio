import * as Yup from "yup";

const message = (field, multipicklist = false) =>
  multipicklist ? "Ingrese uno o mas valores" : "Ingrese un valor";

const Schema = Yup.object().shape({
  name: Yup.string().required(message("name")),
  state: Yup.string().required(message("state")),
  clasification: Yup.array().required(message("clasification")),
  description: Yup.string().nullable(),
  start_date_time: Yup.date(message("start_date_time")).required(
    message("start_date_time")
  ),
  end_date_time: Yup.date().nullable(),
  consequences: Yup.string().nullable(),
  stageId: Yup.string().nullable(),
  relevant_data: Yup.string().nullable(),
  priority: Yup.string().required(message("priority")),
  analyzed_measures: Yup.string(),
  fault_number: Yup.string().nullable(),
  machine: Yup.string().required(message("machine")),
  componentId: Yup.string().required(message("componentId")),
  pieceId: Yup.string().nullable(),
  reporters: Yup.array().required(message("reporters")),
  responsibleId: Yup.string().required(message("responsibleId")),
  are_measures: Yup.boolean(),
  files: Yup.array(),
});

export default Schema;
