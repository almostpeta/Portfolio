import * as Yup from "yup";

function equalTo(ref, msg) {
  return this.test({
    name: "equalTo",
    exclusive: false,
    message: msg || "${path} must be the same as ${reference}",
    params: {
      reference: ref.path,
    },
    test: function (value) {
      return value === this.resolve(ref);
    },
  });
}

Yup.addMethod(Yup.string, "equalTo", equalTo);

const message = (field) => "Ingrese un valor";

const Schema = Yup.object().shape({
  password: Yup.string()
    .required(message("password"))
    .matches(/^.{8,}$/, "La contraseña debe tener al menos 8 caracteres"),
  repeated_password: Yup.string().equalTo(
    Yup.ref("password"),
    "Las contraseñas deben ser iguales"
  ),
});

export default Schema;
