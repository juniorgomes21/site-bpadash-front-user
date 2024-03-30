import PropTypes, { func } from "prop-types";
import React, { useEffect, useState, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import Switch from '@mui/material/Switch';
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
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SnackBarContext from "../../contexts/managerService";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import { formatDateAndHours, formatMonth } from "../../Validation&Formatation/formatation";
import Tooltip from "@mui/material/Tooltip";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ContactsIcon from '@mui/icons-material/Contacts';
import { CircularProgress } from "@mui/material";


const cells = [
    "",
    "Funcionário",
    "Email",
    "Ultimo Login",
    "Logado",
    "Ações",
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

function RegisterEmployee(props) {

    document.title="Usuários registrados";

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const {
        register: registerCreate,
        handleSubmit: handleSubmitCreate,
        getValues: getValuesCreate,
        formState: { errors: errorsCreate }
    } = useForm();

    const employeeLocal = JSON.parse(localStorage.getItem("@Employee"));

    const { openSnackBarFun } = useContext(SnackBarContext);
    const [employee, setEmployee] = useState(initialEmployee);
    const [employeeList, setEmployeeList] = useState([]);
    const [employeeLoggedList, setEmployeeLoggedList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msgError, setMsgError] = useState("");
    const [maxEmployee, setMaxEmployee] = useState(0);
    const [loadingAction, setLoadingAction] = useState(false);
    const [indexItem, setIndexItem] = useState({ "index": -1 });
    const [open, setOpen] = useState({ "delete": false, "edit": false, "permissions": false, "create": false });


    useEffect(() => {
        if(employeeLocal.master) {
            apiGetEmployeeList();
        } else {
            window.location.href = "/welcome/user/bpadash";
        }
    }, [])


    async function apiGetEmployeeList() {
        try {
            const response = await api.get(`/employees/master/get/${employeeLocal.key}`);
            console.log(response.data);
            setMaxEmployee(response.data.maxEmployee);
            setEmployeeList(response.data.employees);
            setEmployeeLoggedList(response.data.sessionUserDTO);

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

    async function apiSavePermissions() {
        try {
            await api.post(`/employees/edit/permissions/${employee.id}/${employeeLocal.key}`, employee.permissionsEmployeeDTO);
            handleClose();
            apiGetEmployeeList();
            openSnackBarFun(false, "Permissões salvas");

        } catch (e) {
            const response = e.response.data;

            switch (response) {
                case "NOT FOUND EMPLOYEE":
                    openSnackBarFun(true, "Funcionário não encontrado");
                    break; 
                case "FORBIDDEN" :
                    window.location.href = "/welcome/user/bpadash"
                    break;
                default:
                    openSnackBarFun();
            }
        }
    }

    async function apiCreateEmployee(data) {
        try {
            await api.post(`/employees/create/${employeeLocal.key}`, data);
            await apiGetEmployeeList();
            handleClose();
            openSnackBarFun(false, "Funcionário Registrado");   

        } catch(e) {
            console.log(e);

            setEmployee({ ...employee, ["error"]: true });

            switch (e.response.data) {
                case "MAX EMPLOYEE REGISTERED" :
                    setMsgError("Você alcançou o número máximo de funcionários registrados");
                    break;
                case "EXIST NAME" :
                    setMsgError("Já existe um usuário como esse nome");
                    break;
                case "EXIST EMAIL" :
                    setMsgError("Já existe um usuário como esse email");
                    break;
                case "DIFFERENT PASSWORDS" :
                    setMsgError("As senhas não são iguais");
                    break;
                case "FORBIDDEN" :
                    handleClose();
                    openSnackBarFun(true, "Você não tem autorização para continuar com essa ação");
                    break;
                default:
                    setMsgError("Ops, algo deu errado");
                    openSnackBarFun(true, "Ops, algo deu errado");
            }
        }
    }

    async function apiEditEmployee(data) {
        try {
            const obj = {
                name: data.name === "" ?  employee.name : data.name,
                email: data.email === "" ? employee.email : data.email
            }

            await api.post(`/employees/edit/master/${employee.id}/${employeeLocal.key}`, obj);

            await apiGetEmployeeList();
            handleClose();
            openSnackBarFun(false, "Funcionário alterado");

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
    }

    async function apiDeleteEmployee() {
        setLoadingAction(true);
        try {
            handleClose();
            await api.post(`/employees/delete/${employee.id}/${employeeLocal.key}`);
            await apiGetEmployeeList();
            openSnackBarFun(false, "Funcionário apagado");
        } catch (e) {
            console.log(e);

            const response = e.response.data;

            switch (response) {
                case "NOT FOUND EMPLOYEE":
                    openSnackBarFun(true, "Funcionário não encontrado");
                    break; 
                case "FORBIDDEN" :
                    window.location.href = "/welcome/user/bpadash"
                    break;
                default:
                    openSnackBarFun();
            }
        }
        setLoadingAction(false);
    }


    function handleClickOpen(dialog, employee, index) {

        setIndexItem({"index": index });

        if(dialog !== "create" ) {
            setEmployee(employee);
        }
    
        setOpen({ ...open, [dialog]: true });
    }

    function handleClose() {
        setEmployee({ ...employee, ["error"]: false });
        setOpen({ "delete": false, "edit": false, "permissions": false, "create": false });
    }

    function handleChangePermissions(event, permissionName) {

        const updatedEmployee = { ...employee };
        
        updatedEmployee.permissionsEmployeeDTO = {
            ...updatedEmployee.permissionsEmployeeDTO,
            [permissionName]: !updatedEmployee.permissionsEmployeeDTO[permissionName]
        };

        setEmployee(updatedEmployee);
    }

    function isLogged(employee) {
        return employeeLoggedList.find(emplo => emplo.name === employee.name);
    }

    return (
        <>
            <div className="page-content">
                <Container fluid>
                    {/* Render Breadcrumb */}
                    <Breadcrumbs
                        title={props.t("registrados")}
                        breadcrumbItem={props.t("Usuários Registrados")}
                    />
                    <p className="flex justify-center mt-8">
                        Adicione usuários que poderão fazer login com sua conta.
                    </p>
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
                                    {   employeeList.map((employee, index) => (
                                            <TableRow
                                                key={index}
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
                                                    {employee.lastLogin ? formatDateAndHours(employee.lastLogin) : "-"}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {
                                                        isLogged(employee) ?
                                                            <CheckIcon color="success"/>
                                                        :
                                                            <CloseIcon color="error"/>
                                                    }
                                                </TableCell>
                                                <TableCell align="center">
                                                    {
                                                        (loadingAction && indexItem === index) ?
                                                            <div>
                                                                <CircularProgress size={24} />
                                                            </div>
                                                        :
                                                            <>
                                                                <Tooltip title="Editar" placement="top">
                                                                    <Button variant="text" onClick={() => handleClickOpen("edit", employee, index)}>
                                                                        <EditIcon color="primary"/>
                                                                    </Button>
                                                                </Tooltip>
                                                                {
                                                                    !employee.master &&
                                                                        <>
                                                                            <Tooltip title="Permissões" placement="top">
                                                                                <Button variant="text" onClick={() => handleClickOpen("permissions", employee, index)}>
                                                                                    <ContactsIcon />
                                                                                </Button>
                                                                            </Tooltip>
                                                                            <Tooltip title="Excluir" placement="top">
                                                                                <Button variant="text" onClick={() => handleClickOpen("delete", employee, index)}>
                                                                                    <DeleteForeverIcon color="error"/>
                                                                                </Button>
                                                                            </Tooltip>
                                                                        </>
                                                                }
                                                            </>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                    ))}
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
                    <div className="fixed bottom-16 right-4">
                        <Button
                            variant="contained"
                            sx={{
                                mr: 2
                            }}
                            onClick={() => handleClickOpen("create")}
                        >
                            NOVO FUNCIONÁRIO
                        </Button>
                    </div>
                </Container>
            </div>
            <Dialog open={open["create"]} onClose={() => handleClose()}>
                <DialogTitle>{"Criar um novo funcionário"}</DialogTitle>
                <form onSubmit={handleSubmitCreate(apiCreateEmployee)}>
                    <DialogContent>
                        <DialogContentText className="mb-3">
                            {open.create && `Você pode adicionar até ${maxEmployee} funcionários`}
                        </DialogContentText>
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
                                label="Funcionário"
                                variant="standard"
                                error={errorsCreate.name && true}
                                {...registerCreate("name",
                                    {
                                        required: "O Nome é obrigatório",
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
                                helperText={errorsCreate.name && errorsCreate.name.message}
                            />
                            <TextField
                                fullWidth
                                id="newEmail"
                                label="Email"
                                type="email"
                                error={errorsCreate.email && true}
                                variant="standard"
                                {...registerCreate("email",
                                    {
                                        required: "O Email é obrigatório",
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
                                helperText={errorsCreate.email && errorsCreate.email.message}
                            />
                            <TextField
                                fullWidth
                                id="newEmail"
                                label="Senha"
                                type="password"
                                error={errorsCreate.password && true}
                                variant="standard"
                                {...registerCreate("password",
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
                                helperText={errorsCreate.password && errorsCreate.password.message}
                                className="mt-3"
                            />
                            <TextField
                                fullWidth
                                id="newEmail"
                                label="Confirme a senha"
                                type="password"
                                error={errorsCreate.passwordConfirm && true}
                                variant="standard"
                                {...registerCreate("passwordConfirm",
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
                                        validate: value => value == getValuesCreate("password") || "As senhas não são iguais"
                                    }
                                )}
                                helperText={errorsCreate.passwordConfirm && errorsCreate.passwordConfirm.message}
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
            <Dialog open={open["permissions"]} onClose={() => handleClose()}>
                <DialogTitle>{"Edite as permissões do seu Funcionário"}</DialogTitle>
                <DialogContent>
                    {
                        employee.error &&
                            <div className="my-3 text-red-500">
                                <p>{msgError}</p>
                            </div>
                    }
                    <div className="flex justify-center w-full">
                        <p className="font-bold">
                            - BPA -
                        </p>
                    </div>
                    <div className="flex w-full justify-between items-center">
                        <p className="font-bold">Upload BPA</p>
                        <Switch
                            checked={employee.permissionsEmployeeDTO.addBpa}
                            onClick={ e => handleChangePermissions(e, "addBpa")}
                        />
                    </div>
                    <div className="flex w-full justify-between items-center">
                        <p className="font-bold">Editar BPA</p>
                        <Switch
                            checked={employee.permissionsEmployeeDTO.editBpa}
                            onClick={ e => handleChangePermissions(e, "editBpa")}
                        />
                    </div>
                    <div className="flex w-full justify-between items-center">
                        <p className="font-bold">Apagar BPA</p>
                        <Switch
                            checked={employee.permissionsEmployeeDTO.deleteBpa}
                            onClick={ e => handleChangePermissions(e, "deleteBpa")}
                        />
                    </div>
                    <div className="flex w-full justify-between items-center">
                        <p className="font-bold">Download BPA</p>
                        <Switch
                            checked={employee.permissionsEmployeeDTO.downloadBpa}
                            onClick={ e => handleChangePermissions(e, "downloadBpa")}
                        />
                    </div>
                    <div className="flex justify-center w-full">
                        <p className="font-bold">
                            - FPO -
                        </p>
                    </div>
                    <div className="flex w-full justify-between items-center">
                        <p className="font-bold">Upload FPO</p>
                        <Switch
                            checked={employee.permissionsEmployeeDTO.addFpo}
                            onClick={ e => handleChangePermissions(e, "addFpo")}
                        />
                    </div>
                    <div className="flex w-full justify-between items-center">
                        <p className="font-bold">Apagar FPO</p>
                        <Switch
                            checked={employee.permissionsEmployeeDTO.deleteFpo}
                            onClick={ e => handleChangePermissions(e, "deleteFpo")}
                        />
                    </div>
                    <div className="flex justify-center w-full">
                        <p className="font-bold">
                            - PROFISSIONAIS -
                        </p>
                    </div>
                    <div className="flex w-full justify-between items-center">
                        <p className="font-bold">Upload PROF</p>
                        <Switch
                            checked={employee.permissionsEmployeeDTO.addProf}
                            onClick={ e => handleChangePermissions(e, "addProf")}
                        />
                    </div>
                    <div className="flex w-full justify-between items-center">
                        <p className="font-bold">Editar PROF</p>
                        <Switch
                            checked={employee.permissionsEmployeeDTO.editProf}
                            onClick={ e => handleChangePermissions(e, "editProf")}
                        />
                    </div>
                    <div className="flex w-full justify-between items-center">
                        <p className="font-bold">Apagar BPA</p>
                        <Switch
                            checked={employee.permissionsEmployeeDTO.deleteProf}
                            onClick={ e => handleChangePermissions(e, "deleteProf")}
                        />
                    </div>
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
                        variant="contained"
                        color="success"
                        onClick={() => apiSavePermissions()}
                    >
                        SALVAR
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={open["edit"]} onClose={() => handleClose()}>
                <DialogTitle>{"Editar funcionário"}</DialogTitle>
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
            <Dialog open={open["delete"]} onClose={() => handleClose()}>
                <DialogTitle>
                    {"Deseja realmente apagar esse Funcionário(a)?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText className="mb-3">
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleClose()}
                    >
                        FECHAR
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => apiDeleteEmployee("delete")}
                    >
                        APAGAR
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

RegisterEmployee.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(RegisterEmployee);
