import PropTypes from "prop-types";
import React, { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import api from "../../services/api";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import loadingSvg from "../../assets/images/svg/loading.svg";
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import SnackBarContext from "../../contexts/managerService";
import PersonIcon from '@mui/icons-material/Person';
import Tooltip from "@mui/material/Tooltip";
import LockIcon from '@mui/icons-material/Lock';
import { CircularProgress } from "@mui/material";


const cells = [
    "",
    "Seu Nome",
    "Email",
    "Editar",
];

const initialEmployee = {
    "id": "",
    "name": "",
    "email": "",
    "lastLogin": "",
    "permissionsEmployeeDTO": {
      "id": 1,
      "addBpa": true,
      "editBpa": true,
      "deleteBpa": true,
      "downloadBpa": true,
      "addFpo": true,
      "deleteFpo": true,
      "addProf": true,
      "editProf": true,
      "deleteProf": true
    },
    "master": false
}

function DataEmployee(props) {

    document.title="Meus dados";

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        getValues: getValuesPassword,
        formState: { errors: errorsPassword }
    } = useForm();

    const employeeLocal = JSON.parse(localStorage.getItem("@Employee"));

    const { openSnackBarFun } = useContext(SnackBarContext);
    const [employee, setEmployee] = useState(initialEmployee);
    const [loading, setLoading] = useState(true);
    const [msgError, setMsgError] = useState("");
    const [loadingAction, setLoadingAction] = useState(false);
    const [open, setOpen] = useState({ "edit": false, "editPassword": false });


    useEffect(() => {
        apiGetEmployeeList();
    }, [employee])


    async function apiGetEmployeeList() {
        try {
            const response = await api.get(`/employees/get/${employeeLocal.key}`);
            setEmployee(response.data);
        } catch (e) {
            const response = e.response.data;

            switch (response) {
                case "FORBIDDEN" :
                    window.location.href = "/welcome/user/bpadash";
                    break;
            }
        }
        setLoading(false);
    }

    async function apiEditEmployee(data) {
        setLoadingAction(true);
        try {
            const obj = {
                name: data.name === "" ?  employee.name : data.name,
                email: data.email === "" ? employee.email : data.email,
                password: data.password
            }

            await api.post(`/employees/edit/${employeeLocal.key}`, obj);

            await apiGetEmployeeList();
            handleClose();
            openSnackBarFun(false, "Dados alterados");

        } catch(e) {
            console.log(e.response);
            setEmployee({ ...employee, ["error"]: true });

            switch (e.response.data) {
                case "EXIST NAME" :
                    setMsgError("Já existe um usuário como esse nome");
                    break;
                case "EXIST EMAIL" :
                    setMsgError("Já existe um usuário como esse email");
                    break;
                case "FORBIDDEN" :
                    handleClose();
                    openSnackBarFun(true, "Você não tem autorização para continuar com essa ação");
                    break;
                case "NOT FOUND SESSION":
                    handleClose();
                    openSnackBarFun(true, "Sessão de usuário não encontrada");
                    break;
            }
        }
        setLoadingAction(false);
    }

    
    async function apiEditPasswordEmployee(data) {
        setLoadingAction(true);
        try {
            await api.post(`/employees/edit/password/${employeeLocal.key}`, data);

            handleClose();
            openSnackBarFun(false, "Senha alterada");

        } catch(e) {
            console.log(e.response);

            setEmployee({ ...employee, ["error"]: true });

            switch (e.response.data) {
                case "INCORRECT PASSWORD":
                    setMsgError("Senha Incorreta");
                    break;
                case "FORBIDDEN":
                    handleClose();
                    openSnackBarFun(true, "Você não tem autorização para continuar com essa ação");
                    break;
                case "NOT FOUND SESSION":
                    handleClose();
                    openSnackBarFun(true, "Sessão de usuário não encontrada");
                    break;
            }
        }
        setLoadingAction(false);
    }

    function handleClickOpen(dialog) {
        setOpen({ ...open, [dialog]: true });
    }

    function handleClose() {
        setEmployee({ ...employee, ["error"]: false });
        setOpen({ "edit": false, "editPassword": false });
    }


    return (
        <>
            <div className="page-content">
                <Container fluid>
                    {/* Render Breadcrumb */}
                    <Breadcrumbs
                        title={props.t("Meus dados")}
                        breadcrumbItem={props.t("Meus dados")}
                    />
                    <div>
                        <TableContainer component={Paper}>
                            <Table
                                sx={{ minWidth: 650 }}
                                size="small"
                                aria-label="a dense table"
                            >
                                <TableHead>
                                    <TableRow>
                                        {cells.map((cell, index) => (
                                            <TableCell key={index} align="center" className="uppercase !font-bold text-white bg-default">
                                                {cell}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                { border: 0 },
                                        }}
                                    >
                                        <TableCell
                                            align="center"
                                        >
                                            <PersonIcon color="primary"/>
                                        </TableCell>
                                        <TableCell align="center">
                                            {employee.name}
                                        </TableCell>
                                        <TableCell align="center">
                                            {employee.email}
                                        </TableCell>
                                        <TableCell align="center">
                                            {
                                                (loadingAction) ?
                                                    <div>
                                                        <CircularProgress size={24} />
                                                    </div>
                                                :
                                                    <>
                                                        <Tooltip title="Editar" placement="top">
                                                            <Button variant="text" onClick={() => handleClickOpen("edit")}>
                                                                <EditIcon color="primary"/>
                                                            </Button>
                                                        </Tooltip>
                                                        <Tooltip title="Mudar senha" placement="top">
                                                            <Button variant="text" onClick={() => handleClickOpen("editPassword")}>
                                                                <LockIcon color="primary"/>
                                                            </Button>
                                                        </Tooltip>
                                                    </>
                                            }
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            {
                                loading && 
                                    <div className="flex justify-center my-2">
                                        <img
                                            src={loadingSvg}
                                            alt="loading..."
                                            width={50}
                                        />
                                    </div>
                            }
                        </TableContainer>
                    </div>
                </Container>
            </div>
            <Dialog open={open["edit"]} onClose={() => handleClose()}>
                <DialogTitle>{"Editar suas informações"}</DialogTitle>
                <form onSubmit={handleSubmit(apiEditEmployee)}>
                    <DialogContent>
                        {
                            employee.error &&
                                <div className="my-3 text-red-500">
                                    <p>{msgError}</p>
                                </div>
                        }
                            <TextField
                                fullWidth
                                id="newName"
                                type="text"
                                label="Usuário"
                                variant="standard"
                                error={errors.name && true}
                                {...register("name",
                                    {
                                        minLength: {
                                            value: 3,
                                            message: "Nome deve conter pelo menos 3 caracteres"
                                        },
                                        maxLength: {
                                            value: 15,
                                            message: "Nome deve conter no máximo 50 caracteres"
                                        }
                                    }
                                )}
                                helperText={errors.name && errors.name.message}
                            />
                            <TextField
                                fullWidth
                                id="newEmail"
                                label="Email"
                                type="email"
                                error={errors.email && true}
                                variant="standard"
                                {...register("email",
                                    {
                                        minLength: {
                                            value: 10,
                                            message: "Email deve conter pelo menos 10 caracteres"
                                        },
                                        maxLength: {
                                            value: 50,
                                            message: "Email deve conter no máximo 50 caracteres"
                                        }
                                    }
                                )}
                                helperText={errors.email && errors.email.message}
                            />
                            <TextField
                                fullWidth
                                id="password"
                                label="Sua Senha"
                                type="password"
                                error={errors.password && true}
                                variant="standard"
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
                                className="mt-3"
                            />
                    </DialogContent>
                    <DialogActions className="flex justify-end w-full">
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleClose()}
                            >
                            FECHAR
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            >
                            SALVAR
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog open={open["editPassword"]} onClose={() => handleClose()}>
                <DialogTitle>{"Editar sua senha"}</DialogTitle>
                <form onSubmit={handleSubmitPassword(apiEditPasswordEmployee)}>
                    <DialogContent>
                        {
                            msgError != "" &&
                                <div className="my-3 text-red-500">
                                    <p>{msgError}</p>
                                </div>
                        }
                            <TextField
                                fullWidth
                                id="password"
                                label="Senha"
                                type="password"
                                error={errorsPassword.password && true}
                                variant="standard"
                                {...registerPassword("password",
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
                                helperText={errorsPassword.password && errorsPassword.password.message}
                                className="mt-3"
                            />
                            <TextField
                                fullWidth
                                id="confirmPassword"
                                label="Nova senha"
                                type="password"
                                error={errorsPassword.newPassword && true}
                                variant="standard"
                                {...registerPassword("newPassword",
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
                                helperText={errorsPassword.newPassword && errorsPassword.newPassword.message}
                                className="mt-3"
                            />
                            <TextField
                                fullWidth
                                id="confPassword"
                                label="Confirme a senha"
                                type="password"
                                error={errorsPassword.confPassword && true}
                                variant="standard"
                                {...registerPassword("confPassword",
                                    {
                                        required: "A senha é obrigatória",
                                        minLength: {
                                            value: 8,
                                            message: "A senha deve conter pelo menos 8 caracteres"
                                        },
                                        maxLength: {
                                            value: 50,
                                            message: "A senha deve conter no máximo 50 caracteres"
                                        },
                                        validate: value => value == getValuesPassword("newPassword") || "As senhas não são iguais"
                                    }
                                )}
                                helperText={errorsPassword.confPassword && errorsPassword.confPassword.message}
                                className="mt-3"
                            />
                    </DialogContent>
                    <DialogActions className="flex justify-end w-full">
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleClose()}
                            >
                            FECHAR
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="success"
                        >
                            SALVAR
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

DataEmployee.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(DataEmployee);
