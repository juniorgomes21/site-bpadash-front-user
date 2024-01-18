import PropTypes from "prop-types";
import React, { useContext } from "react";
import { Row, Col, CardBody, Card, Container, Form, Input, FormFeedback, Label } from "reactstrap";
import { withRouter, Link } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo_bpa.png";
import LoadingButton from "@mui/lab/LoadingButton";
import AuthContext from "../../contexts/Auth";
import AlertCustom from "../../GlobalComponents/AlertCustom";

function Login(props) {
  document.title = "Login";

  const { loadingLogin, errorLogin, handleLogin } = useContext(AuthContext);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Por favor informe seu Email"),
      password: Yup.string().required("Por favor informe sua senha"),
    }),
    onSubmit: (values) => {
      handleLogin(values.email, values.password);
    }
  });


  return (
    <div className="account-pages my-5 pt-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="overflow-hidden">
              <div className="bg-primary bg-soft">
                <Row>
                  <Col xs={7}>
                    <div className="text-primary p-4">
                      <h5 className="text-primary">Bem Vindo ao BPADASH!</h5>
                      <p>faça login para continuar</p>
                    </div>
                  </Col>
                  <Col className="col-5 align-self-end">
                    <img src={profile} alt="" className="img-fluid" />
                  </Col>
                </Row>
              </div>
              <CardBody className="pt-0">
                <div>
                  <Link to="/" className="auth-logo-light">
                    <div className="avatar-md profile-user-wid mb-4">
                      <span className="avatar-title rounded-circle bg-light">
                        <img
                          src={logo}
                          alt=""
                          width="120"
                          height="65"
                        />
                      </span>
                    </div>
                  </Link>
                </div>
                <div className="p-2">
                  <Form
                    className="form-horizontal"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    {
                      errorLogin &&
                        <div className="my-3">
                          <AlertCustom msg="Email ou senha inválida!" type="error" />
                        </div>
                    }

                    <div className="mb-3">
                      <Label className="form-label">Email</Label>
                      <Input
                        name="email"
                        className="form-control"
                        placeholder="Seu email"
                        type="email"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.email || ""}
                        invalid={
                          validation.touched.email && validation.errors.email ? true : false
                        }
                      />
                      {(validation.touched.email && validation.errors.email) &&
                        <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                      }
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">Senha</Label>
                      <Input
                        name="password"
                        value={validation.values.password || ""}
                        type="password"
                        placeholder="Sua senha"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched.password && validation.errors.password ? true : false
                        }
                      />
                      {(validation.touched.password && validation.errors.password) &&
                        <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                      }
                    </div>
                    <div className="mt-3 d-grid">
                      <LoadingButton
                        variant="contained"
                        loading={loadingLogin}
                        type="submit"
                      >
                        Entrar
                      </LoadingButton>
                    </div>
                    <div className="mt-4 text-center">
                      <Link to="/forgot-password" className="text-muted">
                        <i className="mdi mdi-lock me-1" />
                        Esqueceu a senha?
                      </Link>
                    </div>
                  </Form>
                </div>
              </CardBody>
            </Card>
            <div className="mt-5 text-center">
              <p>
                © {new Date().getFullYear()} Agência Ontech. Criado com amor{" "}
                <i className="mdi mdi-heart text-danger" /> por Agência Ontech.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default withRouter(Login);

Login.propTypes = {
  history: PropTypes.object,
};
