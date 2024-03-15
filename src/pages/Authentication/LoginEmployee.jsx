import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    CardBody,
    Card,
    Container,
    Form,
    Input,
    Label,
    FormFeedback,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo_bpadash_dark.png";
import LoadingButton from "@mui/lab/LoadingButton";
import api from "../../services/api";
import AlertCustom from "../../GlobalComponents/AlertCustom";

function LoginEmployee() {

    document.title = "Login Funcionário";

    const [show, setShow] = useState(false);
    const [loadingLogin, setLoadingLogin] = useState(false);
    const [msgError, setMsgError] = useState("Ops, algo deu errado!");
    const [errorLogin, setErrorLogin] = useState(false);

    async function handleLogin(userName, password) {
        setLoadingLogin(true);
        try {
            const response = await api.post('/auth/login/employee', { "userName": userName, "password": password });

            localStorage.setItem("@Employee", JSON.stringify(response.data));

            window.location.href = "/welcome/user/bpadash";

        } catch (e) {
            const response = e.response.data;
            
            switch (response) {
                case "BAD CREDENTIALS": {
                    setMsgError("Usuário ou senha incorreto!");
                    break;
                } case "USER IS LOGGED": {
                    setMsgError("Usuário já logado!");
                    break;
                } case "MAX SESSION": {
                    setMsgError("Número máximo de usuário logado!");
                    break;
                } case "NOT FOUND SESSION": {
                    setMsgError("Sessão não encontrada!");
                    break;
                } 
            }
            
            setErrorLogin(true);
        }
        setLoadingLogin(false);
    }

    const validation = useFormik({
        enableReinitialize: true,

        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .required("Por favor informe seu nome de usuário")
                .min(3, "O email deve ter no mínimo 3 caracteres")
                .max(15, "O email deve ter no máximo 15 caracteres"),
            password: Yup.string()
                .required("Por favor informe sua senha")
                .min(8, "Sua senha deve ter no mínimo 8 caracteres")
                .max(50, "Sua senha deve ter no máximo 50 caracteres"),
        }),
        onSubmit: (values) => {
            handleLogin(values.username, values.password);
        },
    });

    return (
        <>
            <div className="account-pages my-5 pt-sm-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <Card className="overflow-hidden">
                                <div className="bg-primary bg-soft">
                                    <Row>
                                        <Col className="col-7">
                                            <div className="text-primary p-4">
                                                <h5 className="text-primary">
                                                    Olá funcionário!
                                                </h5>
                                                <p>
                                                    Informe Seus dados.
                                                </p>
                                            </div>
                                        </Col>
                                        <Col className="col-5 align-self-end">
                                            <img
                                                src={profile}
                                                alt=""
                                                className="img-fluid"
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                <CardBody className="pt-0">
                                    <div className="auth-logo">
                                        <Link to="/" className="auth-logo-dark">
                                            <div className="avatar-md profile-user-wid mb-4">
                                                <span className="avatar-title rounded-circle bg-white">
                                                    <img
                                                        src={logo}
                                                        alt=""
                                                        className="rounded-circle"
                                                        height="34"
                                                    />
                                                </span>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="p-2">
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
                                                    Nome de usuário
                                                </Label>
                                                <Input
                                                    name="username"
                                                    className="form-control"
                                                    placeholder="Nome de usuário"
                                                    type="text"
                                                    onChange={
                                                        validation.handleChange
                                                    }
                                                    onBlur={
                                                        validation.handleBlur
                                                    }
                                                    value={
                                                        validation.values
                                                            .username || ""
                                                    }
                                                    invalid={
                                                        validation.touched
                                                            .username &&
                                                        validation.errors
                                                            .username
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                {validation.touched.username &&
                                                    validation.errors.username && (
                                                        <FormFeedback type="invalid">
                                                            { validation.errors.username }
                                                        </FormFeedback>
                                                )}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">
                                                    Senha
                                                </Label>
                                                <div className="input-group auth-pass-inputgroup">
                                                    <Input
                                                        name="password"
                                                        value={
                                                            validation.values
                                                                .password || ""
                                                        }
                                                        type={
                                                            show
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
                                                            validation.touched
                                                                .password &&
                                                            validation.errors
                                                                .password
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            setShow(!show)
                                                        }
                                                        className="btn btn-light "
                                                        type="button"
                                                        id="password-addon"
                                                    >
                                                        <i className="mdi mdi-eye-outline"></i>
                                                    </button>
                                                </div>
                                                {validation.touched.password &&
                                                    validation.errors.password && (
                                                        <FormFeedback type="invalid">
                                                            { validation.errors.password }
                                                        </FormFeedback>
                                                    )
                                                }
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
                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>
                            <div className="mt-5 text-center">
                                <p>
                                    Caso tenha esquecido seu login fale com o administrador
                                    {" "}<i className="mdi mdi-heart text-danger" />
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}

export default LoginEmployee;
