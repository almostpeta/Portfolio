import * as Yup from "yup";

const Schema = Yup.object().shape({
  startDate: Yup.date(),
  endDate: Yup.date().when(
    "startDate",
    (startDate, schema) => startDate && schema.min(startDate)
  ),
  type: Yup.string().oneOf(["fault", "task", "all"]),
  order: Yup.string().oneOf(["asc", "desc"]),
});

export default Schema;
