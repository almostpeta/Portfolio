import * as Yup from "yup";

const message = (field) => "Ingrese un valor";

const Schema = Yup.object().shape({
  email: Yup.string().email().required(message("email")),
});

export default Schema;
