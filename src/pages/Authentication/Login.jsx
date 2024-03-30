import PropTypes from "prop-types";
import React, { useContext, useState } from "react";
import {
    Row,
    Col,
    Container,
    Form,
    Input,
    FormFeedback,
    Label,
} from "reactstrap";
import { withRouter, Link } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import logo from "../../assets/images/logo_bpadash_dark_full.png";
import LoadingButton from "@mui/lab/LoadingButton";
import AuthContext from "../../contexts/Auth";
import AlertCustom from "../../GlobalComponents/AlertCustom";
import CarouselPage from "./CarouselPage";


function Login(props) {

    document.title = "Login";

    const { loadingLogin, errorLogin, msgError, handleLogin } = useContext(AuthContext);

    const [passwordShow, setPasswordShow] = useState(false);

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required("Por favor informe seu Email")
                .min(10, "O email deve ter no mínimo 10 caracteres")
                .max(50, "O email deve ter no máximo 50 caracteres"),
            password: Yup.string()
                .required("Por favor informe sua senha")
                .min(8, "Sua senha deve ter no mínimo 8 caracteres")
                .max(50, "Sua senha deve ter no máximo 50 caracteres"),
        }),
        onSubmit: (values) => {
            handleLogin(values.email, values.password);
        },
    });

    return (
        <React.Fragment>
            <div>
                <Container fluid className="p-0">
                    <Row className="justify-content-center">
                        <CarouselPage />

                        <Col xl={3}>
                            <div className="auth-full-page-content p-md-5 p-4">
                                <div className="w-100">
                                    <div className="d-flex flex-column h-100">
                                        <div className="flex justify-center items-center rounded-3xl mb-3">
                                            <img
                                                src={logo}
                                                alt=""
                                                width={200}
                                                height="10"
                                                className="auth-logo-dark"
                                            />
                                        </div>
                                        <div className="my-auto">
                                            <div>
                                                <h5 className="text-primary">
                                                    Bem Vindo ao BPADASH!
                                                </h5>
                                                <p className="text-muted">
                                                    faça login para continuar
                                                </p>
                                            </div>

                                            <div className="mt-4">
                                                {errorLogin && (
                                                    <div className="my-3">
                                                        <AlertCustom
                                                            msg={msgError}
                                                            type="error"
                                                        />
                                                    </div>
                                                )}
                                                <Form
                                                    className="form-horizontal"
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        validation.handleSubmit();
                                                        return false;
                                                    }}
                                                >

                                                    <div className="mb-3">
                                                        <Label className="form-label">
                                                            Email
                                                        </Label>
                                                        <Input
                                                            name="email"
                                                            className="form-control"
                                                            placeholder="Seu email"
                                                            type="email"
                                                            onChange={
                                                                validation.handleChange
                                                            }
                                                            onBlur={
                                                                validation.handleBlur
                                                            }
                                                            value={
                                                                validation
                                                                    .values
                                                                    .email || ""
                                                            }
                                                            invalid={
                                                                validation
                                                                    .touched
                                                                    .email &&
                                                                validation
                                                                    .errors
                                                                    .email
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                        {validation.touched
                                                            .email &&
                                                            validation.errors
                                                                .email && (
                                                                <FormFeedback type="invalid">
                                                                    {
                                                                        validation
                                                                            .errors
                                                                            .email
                                                                    }
                                                                </FormFeedback>
                                                            )}
                                                    </div>

                                                    <Label className="form-label">
                                                        Senha
                                                    </Label>
                                                    <div className="input-group auth-pass-inputgroup">
                                                        <Input
                                                            name="password"
                                                            value={
                                                                validation
                                                                    .values
                                                                    .password ||
                                                                ""
                                                            }
                                                            type={
                                                                passwordShow
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                            placeholder="Sua senha"
                                                            onChange={
                                                                validation.handleChange
                                                            }
                                                            onBlur={
                                                                validation.handleBlur
                                                            }
                                                            invalid={
                                                                validation
                                                                    .touched
                                                                    .password &&
                                                                validation
                                                                    .errors
                                                                    .password
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                        <button
                                                            onClick={() =>
                                                                setPasswordShow(
                                                                    !passwordShow
                                                                )
                                                            }
                                                            className="btn btn-light "
                                                            type="button"
                                                            id="password-addon"
                                                        >
                                                            <i className="mdi mdi-eye-outline"></i>
                                                        </button>
                                                        {validation.touched
                                                            .password &&
                                                            validation.errors
                                                                .password && (
                                                                <FormFeedback type="invalid">
                                                                    {
                                                                        validation
                                                                            .errors
                                                                            .password
                                                                    }
                                                                </FormFeedback>
                                                            )}
                                                    </div>
                                                    <div className="mt-3 d-grid">
                                                        <LoadingButton
                                                            variant="contained"
                                                            loading={
                                                                loadingLogin
                                                            }
                                                            type="submit"
                                                        >
                                                            Entrar
                                                        </LoadingButton>
                                                    </div>
                                                    <div className="mt-4 text-center">
                                                        <Link
                                                            to="/forgot-password"
                                                            className="text-muted"
                                                        >
                                                            <i className="mdi mdi-lock me-1" />
                                                            Esqueceu a senha?
                                                        </Link>
                                                    </div>
                                                </Form>
                                            </div>
                                        </div>

                                        <div className="mt-5 text-center">
                                            <p>
                                                © {new Date().getFullYear()}{" "}
                                                Agência Ontech. Criado com amor{" "}
                                                <i className="mdi mdi-heart text-danger" />{" "}
                                                por Agência Ontech.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default withRouter(Login);

Login.propTypes = {
    history: PropTypes.object,
};


