import * as Yup from "yup";

const message = (field) => "Ingrese un valor";

const Schema = Yup.object().shape({
  firstName: Yup.string().required(message("firstName")),
  lastName: Yup.string().required(message("lastName")),
  email: Yup.string()
    .email("El formato debe ser un email válido")
    .required(message("email")),
  role: Yup.string().required(message("role")),
});

export default Schema;
