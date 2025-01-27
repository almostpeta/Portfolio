import { useState, useCallback } from "react";

const useForm = (schema, initialValues, onSubmit) => {
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(() => {
    return Object.keys(initialValues).reduce(
      (touched, name) => ({
        ...touched,
        [name]: false,
      }),
      {}
    );
  });

  const yupToFormErrors = (yupError) => {
    if (yupError.inner.length === 0) {
      const errors = {};
      const { path, message } = yupError;
      errors[path] = message;
      return errors;
    }

    return yupError.inner.reduce((errors, err) => {
      const { path, message } = err;
      if (!errors[path]) {
        return {
          ...errors,
          [path]: message,
        };
      }

      return errors;
    }, {});
  };

  const handleSubmit = async (event, ...args) => {
    if (event) {
      event.preventDefault();
    }
    try {
      touchAll();
      await schema.validate(inputs, { abortEarly: false });
      onSubmit(inputs, ...args);
      setErrors({});
    } catch (err) {
      handleErrors(err);
    }
  };

  const handleErrors = (err) => {
    try {
      const errors = yupToFormErrors(err);
      setErrors(errors);
      const firstElemWithError = Object.keys(errors)[0];
      const element = document.querySelector(`#${firstElemWithError}`);
      element.scrollIntoView({ behavior: "smooth" });
    } catch (e) {}
  };

  const setFieldTouched = useCallback((name, touched = true) => {
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: touched,
    }));
  }, []);

  const handleBlur = useCallback(
    (event) => {
      event.persist();

      const {
        target: { name },
      } = event;

      setFieldTouched(name);
    },
    [setFieldTouched]
  );

  const touchAll = () => {
    setTouched((prevTouched) =>
      Object.keys(prevTouched).reduce(
        (touched, name) => ({
          ...touched,
          [name]: true,
        }),
        {}
      )
    );
  };

  const resetForm = () => {
    setInputs(initialValues);
  };

  const handleInputChange = (event) => {
    event.persist && event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]:
        typeof event.target.value !== "undefined"
          ? event.target.value
          : event.target.checked,
    }));
  };

  const handleInputChangeWithCallback = (event, callback) => {
    event.persist && event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]:
        typeof event.target.value !== "undefined"
          ? event.target.value
          : event.target.checked,
    }));

    callback(event.target.name, event.target.value);
  };

  return {
    handleSubmit,
    handleInputChange,
    handleInputChangeWithCallback,
    handleBlur,
    errors,
    inputs,
    touched,
    resetForm,
  };
};

export default useForm;
