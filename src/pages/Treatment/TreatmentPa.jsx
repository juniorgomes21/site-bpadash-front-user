import PropTypes from "prop-types";
import React, { useEffect, useState, useContext } from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import api from "../../services/api";
import { withTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import LoadingButton from "@mui/lab/LoadingButton";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AlertCust from "../../GlobalComponents/AlertCustom";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SnackBarContext from "../../contexts/managerService";
import { CircularProgress } from "@mui/material";
import DatePickerContext from "../../contexts/DateGlobalBpa";
import Radio from '@mui/material/Radio';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

function TreatmentPa(props) {

    document.title = "Tratamento BPA";

    const url = "/treatment/replacement/pa";
    const { openSnackBarFun } = useContext(SnackBarContext);
    const { getFormattedDate } = useContext(DatePickerContext);
    const [rulePA, setRulePA] = useState({});
    const [loading, setLoading] = useState(true);
    const [msgError, setMsgError] = useState("");
    const [loadingAction, setLoadingAction] = useState(false);
    const [ruleObj, setRuleObj] = useState({ "id": 0, "index": -1 });
    const [paransPa, setParansPa] = useState({ "paCurrent": "", "newPa": "" });
    const [errorsPa, setErrorsPa] = useState({ "paCurrent": false, "newPa": false, "error": false });
    const [open, setOpen] = useState({ "delete": false, "edit": false, "play": false, "create": false, "playAll": false });


    useEffect(() => {
        apiGet();
    }, [])


    async function apiGet() {
        try {
            const response = await api.get(url + "/get");
            setRulePA(response.data);
        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    }

    async function apiHandleChange(event, rule, type) {
        try {
            let obj = {}

            if (type === "bpac") {
                obj = {
                    "executeBpac": !rule.executeBpac,
                    "executeBpai": rule.executeBpai
                }
            } else {
                obj = {
                    "executeBpac": rule.executeBpac,
                    "executeBpai": !rule.executeBpai
                }
            }
            await api.post(url + `/update/execute/file/${rule.id}`, obj);
            await apiGet();
        } catch (e) {
            console.log(e);
        }
    }

    async function apiCreate() {
        try {
            const obj = {
                "paCurrent": paransPa.paCurrent,
                "newPa": paransPa.newPa
            }
            await api.post(url + "/create", obj);
            await apiGet();
            handleClose();
            openSnackBarFun(false, "Regra PA salva");

        } catch (e) {
            setErrorsPa({ ...errorsPa, ["error"]: true });
            switch (e.response.data) {
                case "PARANS IQUALS":
                    setMsgError("Os PAs não pode ser iguais");
                    break;
                case "REACHED MAX LENGTH":
                    setMsgError("Você alcançou o número máximo de regras");
                    break;
                case "EXIST RULE PA":
                    setMsgError("Uma regra para esse PA já existe ");
                    break;
                default:
                    setMsgError("Ops, algo deu errado");
                    openSnackBarFun(true, "Ops, algo deu errado");
            }
        }
    }

    async function apiEdit() {
        try {
            const obj = {
                "paCurrent": paransPa.paCurrent,
                "newPa": paransPa.newPa
            }
            await api.post(url + `/edit/${ruleObj.id}`, obj);
            await apiGet();
            handleClose();
            openSnackBarFun(false, "Regra PA salva");
        } catch (e) {
            setErrorsPa({ ...errorsPa, ["error"]: true });
            switch (e.response.data) {
                case "PARANS IQUALS":
                    setMsgError("Os PAs não pode ser iguais");
                    break;
                case "REACHED MAX LENGTH":
                    setMsgError("Você alcançou o número máximo de regras");
                    break;
                case "EXIST RULE PA":
                    setMsgError("Uma regra para esse PA já existe ");
                    break;
                default:
                    setMsgError("Ops, algo deu errado");
                    openSnackBarFun(true, "Ops, algo deu errado");
            }
        }
    }

    async function apiDelete() {
        setLoadingAction(true);
        try {
            await api.post(url + `/delete/${ruleObj.id}`);
            await apiGet();
            handleClose();
            openSnackBarFun(false, "Regra apagada");
        } catch (e) {
            console.log(e);
            openSnackBarFun();
        }
        setLoadingAction(false);
    }

    async function apiPlayRule() {
        setLoadingAction(true);
        handleClose();
        try {
            const response = await api.post(url + `/execute/${ruleObj.id}`, { "dateBpa": getFormattedDate() });
            handleClose();
            openSnackBarFun(false, `Regra executada, ${response.data} linhas alteradas`);
        } catch (e) {
            console.log(e);
            openSnackBarFun();
        }
        setLoadingAction(false);
    }

    async function apiPlayAll() {
        setLoading(true);
        handleClose();
        try {
            const response = await api.post(url + "/execute/0", { "dateBpa": getFormattedDate() });
            openSnackBarFun(false, `Todas regras executadas, ${response.data} linhas alteradas`);

        } catch (e) {
            console.log(e);
            openSnackBarFun();
        }
        setLoading(false);
    }

    function actionDialog(actionDi) {
        if (actionDi === "delete") {
            apiDelete();
        } else {
            apiPlayRule();
        }
    }

    function isValid() {
        const haveErrorPaNew = paransPa.newPa.length != 10;
        const haveErrorPaCurrent = paransPa.paCurrent.length != 10;
        const haveErrorEquals = paransPa.newPa === paransPa.paCurrent;

        if (haveErrorPaCurrent || haveErrorPaNew || haveErrorEquals) {
            setMsgError(haveErrorEquals && "Os PAs não podem ser iguais")
            setErrorsPa({ "paCurrent": haveErrorPaCurrent, "newPa": haveErrorPaNew, "error": haveErrorEquals });
        } else {
            if (open.create) {
                apiCreate();
            } else {
                apiEdit();
            }
        }
    }

    function handleClickOpen(dialog, id, index) {
        setRuleObj({ "id": id, "index": index });

        if (dialog === "edit") {
            const rule = rulePA.ruleTreatmentPaList.find(item => item.id === id);
            setParansPa({ "paCurrent": rule.paCurrent, "newPa": rule.paNew });
        }

        setOpen({ ...open, [dialog]: true });
    }

    function handleClose() {
        setParansPa({ "paCurrent": "", "newPa": "" });
        setErrorsPa({ ...errorsPa, ["error"]: false });
        setOpen({ "delete": false, "edit": false, "play": false, "create": false, "playAll": false });
    }

    return (
        <>
            <div className="page-content">
                <Container fluid>
                    {/* Render Breadcrumb */}
                    <Breadcrumbs
                        title={props.t("Substituição de PA")}
                        breadcrumbItem={props.t("Substituição de PA")}
                    />
                    <AlertCust
                        type="warning"
                        msg="AS REGRAS SERÃO EXECUTADAS NO ARQUIVO BPA SELECIONADO"
                    />
                    <p className="flex justify-center mt-8">
                        Adicione regras de substituição para o campo PA. Ao executar uma regra, todos os campos PA informados serão substituídos pelo novo valor de PA informado.
                    </p>
                    {
                        loading ?
                            <div className="flex justify-center mt-10">
                                <CircularProgress size={25} />
                            </div>
                            :
                            rulePA.ruleTreatmentPaList.length > 0 ?
                                <div className="flex flex-col items-center w-full mt-10">
                                    <p className="font-bold">
                                        - MINHAS REGRAS -
                                    </p>
                                    <div className="w-full my-4">
                                        {
                                            rulePA.ruleTreatmentPaList.map((rule, index) => (
                                                <div key={index} className="my-4">
                                                    <div className="flex justify-end w-full mb-1">
                                                        <div className="flex items-center">
                                                            <Radio
                                                                checked={rule.executeBpac}
                                                                onClick={(e) => apiHandleChange(e, rule, "bpac")}
                                                                name="radio-buttons"
                                                            />
                                                            <p className="mr-2">BPAC</p>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Radio
                                                                checked={rule.executeBpai} //fileConfigs[indexState].auto == true
                                                                onClick={(e) => apiHandleChange(e, rule, "bpai")}
                                                                name="radio-buttons"
                                                            />
                                                            <p className="mr-2">BPAI</p>
                                                            <Tooltip title="Selecione o arquivo que a regra será executada">
                                                                <HelpOutlineIcon sx={{ fontSize: 20 }} />
                                                            </Tooltip>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center font-bold border-default border-[1px] rounded-lg p-2">
                                                        <div className="flex flex-col">
                                                            <div className="flex">
                                                                <p>PA ATUAL: </p>
                                                                <p className="ml-2">{rule.paCurrent}</p>
                                                            </div>
                                                            <div className="flex mt-2">
                                                                <p> NOVO PA: </p>
                                                                <p className="ml-2">{rule.paNew}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex">
                                                            {
                                                                loadingAction && index == ruleObj.index ?
                                                                    <div className="mr-4 mt-2">
                                                                        <CircularProgress size={20} />
                                                                    </div>
                                                                    :
                                                                    <>
                                                                        <Tooltip title="Excluir">
                                                                            <LoadingButton
                                                                                color="error"
                                                                                variant="contained"
                                                                                size="small"
                                                                                onClick={() => handleClickOpen("delete", rule.id, index)}
                                                                            >
                                                                                <DeleteForeverIcon />
                                                                            </LoadingButton>
                                                                        </Tooltip>
                                                                        <div className="mx-2">
                                                                            <Tooltip title="Editar">
                                                                                <LoadingButton
                                                                                    variant="contained"
                                                                                    size="small"
                                                                                    onClick={() => handleClickOpen("edit", rule.id, index)}
                                                                                >
                                                                                    <ModeEditIcon />
                                                                                </LoadingButton>
                                                                            </Tooltip>
                                                                        </div>
                                                                        <Tooltip title="Executar">
                                                                            <LoadingButton
                                                                                disabled={rule.executeBpac == false && rule.executeBpai == false}
                                                                                color="success"
                                                                                variant="contained"
                                                                                size="small"
                                                                                onClick={() => handleClickOpen("play", rule.id, index)}
                                                                            >
                                                                                <PlayArrowIcon />
                                                                            </LoadingButton>
                                                                        </Tooltip>
                                                                    </>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                :
                                <div className="mt-10">
                                    <AlertCust
                                        type="info"
                                        msg="Você ainda não possui nenhuma regra"
                                    />
                                </div>
                    }
                    <div className="fixed bottom-16 right-4">
                        <Button
                            variant="contained"
                            sx={{
                                mr: 2
                            }}
                            onClick={() => handleClickOpen("create")}
                        >
                            NOVA REGRA
                        </Button>
                        <Button
                            color="success"
                            variant="contained"
                            onClick={() => handleClickOpen("playAll")}
                        >
                            EXECUTAR TODAS AS REGRAS
                        </Button>
                    </div>
                    <Dialog open={open["create"] || open["edit"]} onClose={() => handleClose()}>
                        <DialogTitle>{open.create ? "Adicione uma nova regra PA" : "Editar regra PA"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText className="mb-3">
                                {open.create && `Você pode adicionar ${rulePA.count} regras`}
                            </DialogContentText>
                            {
                                errorsPa.error &&
                                <div className="my-3 text-red-500">
                                    <p>{msgError}</p>
                                </div>
                            }
                            <TextField
                                fullWidth
                                id="name"
                                label="PA a ser substituído"
                                type="text"
                                error={errorsPa.paCurrent || errorsPa.error}
                                value={paransPa["paCurrent"]}
                                variant="standard"
                                onChange={e => {
                                    if (errorsPa["paCurrent"] || errorsPa["error"]) setErrorsPa({ ...errorsPa, ["paCurrent"]: false, ["error"]: false });
                                    if (!isNaN(Number(e.target.value)) && e.target.value.length <= 10) setParansPa({ ...paransPa, ["paCurrent"]: e.target.value });;
                                }}
                                helperText={errorsPa.paCurrent && "O campo deve ter 10 dígitos"}
                            />
                            <TextField
                                fullWidth
                                id="name"
                                label="Novo PA"
                                error={errorsPa.newPa || errorsPa.error}
                                value={paransPa["newPa"]}
                                type="text"
                                variant="standard"
                                onChange={e => {
                                    if (errorsPa["newPa"] || errorsPa["error"]) setErrorsPa({ ...errorsPa, ["newPa"]: false, ["error"]: false });
                                    if (!isNaN(Number(e.target.value)) && e.target.value.length <= 10) setParansPa({ ...paransPa, ["newPa"]: e.target.value });
                                }}
                                helperText={errorsPa.newPa && "O campo deve ter 10 dígitos"}
                            />
                        </DialogContent>
                        <DialogActions>
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
                                onClick={isValid}
                            >
                                SALVAR
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={open["delete"] || open["play"]} onClose={() => handleClose()}>
                        <DialogTitle>
                            {open.delete ? "Deseja realmente apagar essa regras?" : "Deseja realmente executar essa regras?"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText className="mb-3">
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="contained"
                                color={open.delete ? "primary" : "error"}
                                onClick={() => handleClose()}
                            >
                                FECHAR
                            </Button>
                            <Button
                                variant="contained"
                                color={open.delete ? "error" : "success"}
                                onClick={() => actionDialog(open.delete ? "delete" : "playRule")}
                            >
                                {open.delete ? "APAGAR" : "EXECUTAR"}
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={open["playAll"]} onClose={() => handleClose()}>
                        <DialogTitle>
                            Deseja realmente executar todas as regras?
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText className="mb-3">
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
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
                                onClick={() => apiPlayAll()}
                            >
                                EXECUTAR TODAS
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </div>
        </>
    );
};

TreatmentPa.propTypes = {
    t: PropTypes.any,
    chartsData: PropTypes.any,
    onGetChartsData: PropTypes.func,
};

export default withTranslation()(TreatmentPa);
