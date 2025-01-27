import React, { Dispatch, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { Form, Container, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { Loading } from "components/Loading/index";
import "./styles.css";
import { Toast } from "components/Toast";
import useTranslate from "hooks/useTranslate";
import { Button } from "components/Button";
import Errors from "lib/errorMessages";
import { validations } from "./validations";
import { getCurrentUser } from "lib/auth";
import { Link } from "react-router-dom";
import { doLogin } from "redux/user/action";
import useUser from "hooks/useUser";

const mapState = (state: any) => ({
  loading: state.user.loading,
  loginSuccess: state.user.loginSuccess,
  error: state.user.error,
});

const mapDispatch = (dispatch: Dispatch<any>) => ({
  doLoginAction: (email: string, password: string) =>
    dispatch(doLogin(email, password)),
});

const connector = connect(mapState, mapDispatch);

const Login = (props: any) => {
  const { doLoginAction, loginSuccess, loading, error } = props;
  const [isCurrentLogin, setIsCurrentLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(loading);
  const history = useHistory();
  const { setIsAdminView, setUser }: any = useUser();

  const initialState = {
    email: "",
    password: "",
  };
  const { errors, control, trigger, getValues } = useForm({
    mode: "onBlur",
    defaultValues: initialState,
  });
  const data = getValues();

  useEffect(() => {
    if (isCurrentLogin) {
      if (loginSuccess) {
        const currentUser = getCurrentUser() || {};
        setUser(currentUser);
        setIsAdminView(false);
        history.push("/home");
      } else if (error) {
        Toast("error", error);
      }
    }
  }, [loginSuccess, error]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  const handleLogin = async (e: any) => {
    setIsCurrentLogin(true);
    e.preventDefault();
    const data = getValues();
    const isValid = await trigger();
    if (isValid) {
      doLoginAction(data.email, data.password);
    } else {
      Toast("error", Errors.GENERIC_ERROR);
    }
    return false;
  };
  return (
    <div>
      {loading && <Loading />}
      <Container className="loginContainer">
        <div className="card p-5">
          <div>
            <h2 style={{ color: "#01516a" }}>Iniciar Sesión</h2>
            <hr />
          </div>
          <Form onSubmit={handleLogin}>
            <Row className="flex space-around text-left">
              <Col lg="12">
                <Controller
                  as={
                    <div>
                      <Form.Group controlId="email" className="mt-4">
                        <Form.Label>Correo electrónico</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Ingresar correo"
                          isInvalid={!!errors.email}
                        />
                        {/* <Form.Control.Feedback type="invalid">
                        {errors.email && errors.email.message}
                      </Form.Control.Feedback> */}
                      </Form.Group>
                      {/* <label className="d-block text-danger">
                        {errors?.email?.message}
                      </label> */}
                    </div>
                  }
                  control={control}
                  name="email"
                  rules={validations({ type: "email" })}
                />
                <Controller
                  as={
                    <div>
                      <Form.Group controlId="password" className="mt-4">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Ingresar contraseña"
                          isInvalid={!!errors.password}
                        />
                        {/* <Form.Control.Feedback type="invalid">
                        {errors.password && errors.password.message}
                      </Form.Control.Feedback> */}

                        {/* <label className="d-block text-danger">
                    //   {errors?.password?.message}
                    // </label> */}
                      </Form.Group>
                      {/* <label className="d-block text-danger">
                        {errors?.password?.message}
                      </label> */}
                    </div>
                  }
                  control={control}
                  name="password"
                  value={data.password}
                  defaultValue={data.password}
                  rules={validations({ type: "password" })}
                />
              </Col>
            </Row>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Link
                to={{
                  pathname: "/forget",
                  state: { email: data.email },
                }}
              >
                Olvide mi contraseña
              </Link>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit">Entrar</Button>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default (connector(Login) as any) as any;
