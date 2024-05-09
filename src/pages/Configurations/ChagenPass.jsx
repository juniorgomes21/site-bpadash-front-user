import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import api from "../../services/api";
import SnackBarContext from "../../contexts/managerService";
import IconButton from "@mui/material/IconButton";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Visibility from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";

function ChangePass(props) {
    document.title = "Editar Senha";

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors }
    } = useForm();

    const employee = JSON.parse(localStorage.getItem("@Employee"));

    const { openSnackBarFun } = useContext(SnackBarContext);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!employee.master) {
            window.location.href = "/welcome/user/bpadash";
        }
    }, [])

    async function apiChangePassword(data) {
        setLoading(true);
        try {
            await api.post(`/user/edit/password/${employee.key}`, data);
            openSnackBarFun(false, "Senha Alterada");
            
        } catch (e) {
            console.log(e);

            switch (e.response.data) {
                case "INCORRECT PASSWORD":
                    setErrorMsg("Senha Incorreta");
                    break;
                case "FORBIDDEN":
                    openSnackBarFun(true, "Você não tem autorização para continuar com essa ação");
                    break;
                case "NOT FOUND SESSION":
                    openSnackBarFun(true, "Sessão de usuário não encontrada");
                    break;
            }
        }
        setLoading(false);
    }


    return (
        <>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs
                        title={props.t("Editar Senha")}
                        breadcrumbItem={props.t("Editar Senha")}
                    />
                    {errorMsg != "" && (
                        <div className="flex justify-center w-full text-red-500 text-base">
                            <p>{errorMsg}</p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit(apiChangePassword)}>
                        <div className="flex flex-col justify-center w-full items-center">
                            <TextField
                                id="password"
                                label="Senha Atual"
                                variant="outlined"
                                type={showPassword ? "text" : "password"}
                                error={errors.password && true}
                                inputProps={{ maxLength: 50 }}

                                {...register("password",
                                    {
                                        required: "A senha é obrigatória",
                                        minLength: {
                                            value: 8,
                                            message: "A senha deve conter pelo menos 8 caracteres"
                                        },
                                        maxLength: {
                                            value: 50,
                                            message: "A senha deve conter no máximo 50 caracteres"
                                        }
                                    }
                                )}
                                helperText={errors.password && errors.password.message}
                                className="w-1/2 mt-3"
                            />
                            <TextField
                                id="newPassword"
                                label="Nova Senha"
                                variant="outlined"
                                type={showPassword ? "text" : "password"}
                                inputProps={{ maxLength: 50 }}
                                error={errors.newPassword && true}
                                {...register("newPassword",
                                    {
                                        required: "A nova senha é obrigatória",
                                        minLength: {
                                            value: 8,
                                            message: "A senha deve conter pelo menos 8 caracteres"
                                        },
                                        maxLength: {
                                            value: 50,
                                            message: "A senha deve conter no máximo 50 caracteres"
                                        }
                                    }
                                )}
                                helperText={errors.newPassword && errors.newPassword.message}
                                className="w-1/2 mt-3"
                            />
                            <TextField
                                id="confPassword"
                                label="Repita a nova senha"
                                variant="outlined"
                                type={showPassword ? "text" : "password"}
                                inputProps={{ maxLength: 50 }}
                                error={errors.confPassword && true}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword((show) => !show)}
                                                edge="end"
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOffIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                {...register("confPassword",
                                    {
                                        required: "confirme a senha",
                                        minLength: {
                                            value: 8,
                                            message: "A senha deve conter pelo menos 8 caracteres"
                                        },
                                        maxLength: {
                                            value: 50,
                                            message: "A senha deve conter no máximo 50 caracteres"
                                        },
                                        validate: value => value == getValues("newPassword") || "As senhas não são iguais"
                                    }
                                )}
                                helperText={errors.confPassword && errors.confPassword.message}
                                className="w-1/2 mt-3"
                            />
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                loading={loading}
                                className="w-1/4 mt-5"
                            >
                                Alterar
                            </LoadingButton>
                        </div>
                    </form>
                </Container>
            </div>
        </>
    );
}

ChangePass.propTypes = {
    t: PropTypes.any,
    chartsData: PropTypes.any,
    onGetChartsData: PropTypes.func,
};

export default withTranslation()(ChangePass);
