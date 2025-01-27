import * as Yup from "yup";

const message = (field) => "Ingrese un valor";

const Schema = Yup.object().shape({
  name: Yup.string().required(message("name")),
  description: Yup.string().required(message("descrption")),
  relevant_data: Yup.string().nullable(),
  status: Yup.string().required(),
  rejected_reason: Yup.string().nullable(),
  files: Yup.array(),
  cause: Yup.number(),
});

export default Schema;
