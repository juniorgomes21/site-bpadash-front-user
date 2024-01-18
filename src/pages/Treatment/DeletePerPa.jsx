import PropTypes from "prop-types";
import React, { useEffect, useState, useContext } from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import AlertCust from "../../GlobalComponents/AlertCustom";
import api from "../../services/api";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import LoadingButton from "@mui/lab/LoadingButton";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
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
import { formatMonth } from "../../Validation&Formatation/formatation";

function DeletePerPa(props) {

    //meta title
    document.title="Apagar por PA";

    const url = "/treatment/deleteperpa";
    const { openSnackBarFun } = useContext(SnackBarContext);
    const { month, year, getFormatedDate } = useContext(DatePickerContext);
    const [rulePaDelete, setRulePaDelete] = useState({});
    const [loading, setLoading] = useState(true);
    const [msgError, setMsgError] = useState("");
    const [loadingAction, setLoadingAction] = useState(false);
    const [ruleObj, setRuleObj] = useState({ "id": 0, "index": -1 });
    const [paransPaDelete, setParansPaDelete] = useState({ "pa": "" });
    const [errorsPa, setErrorsPa] = useState({ "pa": false, "error": false });
    const [open, setOpen] = useState({ "delete": false, "edit": false, "play": false, "create": false, "playAll": false});


    useEffect(() => {
        apiGetRulesDeletePA();
    }, [])


    async function apiGetRulesDeletePA() {
        try {
            const response = await api.get( url +"/get");
            setRulePaDelete(response.data);
        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    }

    async function apiCreateRulePaDelete() {
        try {
          await api.post( url + "/create", { "pa": paransPaDelete.pa });
          await apiGetRulesDeletePA();
          handleClose();
          openSnackBarFun(false, "Regra PA salva");          
        } catch(e) {
          setErrorsPa({ ...errorsPa, ["error"]: true });
          switch (e.response.data) {
            case "REACHED MAX LENGTH" :
              setMsgError("Você alcançou o número máximo de regras");
              break;
            case "EXIST RULE" :
              setMsgError("Uma regra para esse PA já existe ");
              break;
            default:
              setMsgError("Ops, algo deu errado");
              openSnackBarFun(true, "Ops, algo deu errado");
          }
        }
    }

    async function apiEditRulePa() {
        try {
          await api.post( url +`/edit/${ruleObj.id}`, { "pa": paransPaDelete.pa });
          await apiGetRulesDeletePA();
          handleClose();
          openSnackBarFun(false, "Regra PA salva");
        } catch(e) {
          setErrorsPa({ ...errorsPa, ["error"]: true });
          switch (e.response.data) {
            case "REACHED MAX LENGTH" :
              setMsgError("Você alcançou o número máximo de regras");
              break;
            case "EXIST RULE" :
              setMsgError("Uma regra para esse PA já existe ");
              break;
            default:
              setMsgError("Ops, algo deu errado");
              openSnackBarFun(true, "Ops, algo deu errado");
          }
        }
    }

    async function apiHandleChange(event, rule, type) {
        try {
            let obj = {}
        
            if(type === "bpac") {
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
            await api.post( url + `/update/execute/file/${rule.id}`, obj);
            await apiGetRulesDeletePA();
        } catch (e) {
            console.log(e);
        }
    }

    async function apiPlayRule() {
        setLoadingAction(true);
        handleClose();
        try {
          const response = await api.post( url + `/execute/${ruleObj.id}`, { "dateBpa": getFormatedDate() });
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
            const response = await api.post( url + "/execute/0", { "dateBpa": getFormatedDate() });
            openSnackBarFun(false, `Todas regras executadas, ${response.data} linhas alteradas`);
        } catch (e) {
            openSnackBarFun();
        }
        setLoading(false);
    }

    async function apiDeleteRule() {
        setLoadingAction(true);
        try {
            await api.post( url + `/delete/${ruleObj.id}`);
            await apiGetRulesDeletePA();
            handleClose();
            openSnackBarFun(false, "Regra apagada");
        } catch (e) {
            console.log(e);
            openSnackBarFun();
        }
        setLoadingAction(false);
    }

    function isValid() {
        const haveErrorPa = paransPaDelete.pa.length != 10;
    
        if (haveErrorPa) {
            setErrorsPa({ "pa": haveErrorPa });
        } else {
            if(open.create) {
                apiCreateRulePaDelete();
            } else {
                apiEditRulePa();
            }
        }
    }

    function actionDialog(actionDi) {
        if(actionDi === "delete") {
          apiDeleteRule();
        } else {
          apiPlayRule();
        }
    }

    function handleClickOpen(dialog, id, index) {
        setRuleObj({ "id": id, "index": index });
    
        if(dialog === "edit") {
          const rule = rulePaDelete.ruleTreatmentPaDeleteList.find(item => item.id === id);
          setParansPaDelete({ "pa": rule.pa });
        }
    
        setOpen({ ...open, [dialog]: true });
    }

    function handleClose() {
        setParansPaDelete({ "pa": "" });
        setErrorsPa({ ...errorsPa, ["error"]: false });
        setOpen({ "delete": false, "edit": false, "play": false, "create": false, "playAll": false });
    }


    return (
        <>
            <div className="page-content">
                <Container fluid>
                    {/* Render Breadcrumb */}
                    <Breadcrumbs
                        title={props.t("Apagar PA")}
                        breadcrumbItem={props.t("Apagar PA")}
                    />
                    <AlertCust
                        type="warning"
                        msg="AS REGRAS SERAM EXECUTADAS NO ARQUIVO BPA SELECIONADO"
                    />
                    <p className="flex justify-center mt-8">
                        Adicione regras de exclusão para o campo PA. Ao executar uma regra todos os campos PA informados seram excluidos com suas respectivas linhas do arquivo BPA.
                    </p>
                    {
                        loading ?
                            <div className="flex justify-center mt-10">
                                <CircularProgress size={25}/>
                            </div>
                        :
                            rulePaDelete.ruleTreatmentPaDeleteList.length > 0 ?
                                <div className="flex flex-col items-center w-full mt-10">
                                    <p className="font-bold">
                                    - MINHAS REGRAS -
                                    </p>
                                    <div className="w-full my-4">
                                    {
                                        rulePaDelete.ruleTreatmentPaDeleteList.map((rule, index) => (
                                            <div key={index}  className="my-4">
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
                                                        checked={rule.executeBpai}
                                                        onClick={(e) => apiHandleChange(e, rule, "bpai")}
                                                        name="radio-buttons"
                                                        />
                                                        <p className="mr-2">BPAI</p>
                                                        <Tooltip title="Selecione o arquivo que a regra será executada">
                                                        <HelpOutlineIcon sx={{ fontSize: 20 }}/>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center font-bold border-default border-[1px] rounded-lg p-2">
                                                    <div className="flex flex-col">
                                                        <div className="flex">
                                                            <p>PA: </p>
                                                            <p className="ml-2">{rule.pa}</p>
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
                </Container>
            </div>
            <Dialog open={open["create"] || open["edit"]} onClose={() => handleClose()}>
                <DialogTitle>{open.create ? "Adicione uma nova regra de exclusão por PA" : "Editar regra PA"}</DialogTitle>
                <DialogContent>
                    <DialogContentText className="mb-3">
                        {open.create && `Você pode adicionar ${rulePaDelete.count} regras`}
                    </DialogContentText>
                    {
                        errorsPa.error &&
                        <div className="my-3 text-red-500">
                            <p>{msgError}</p>
                        </div>
                    }
                    <TextField
                        fullWidth
                        id="pa"
                        label="PA"
                        type="text"
                        error={errorsPa.pa || errorsPa.error}
                        value={paransPaDelete["pa"]}
                        variant="standard"
                        onChange={ e => {
                            if(errorsPa["pa"] || errorsPa["error"]) setErrorsPa({...errorsPa, ["pa"]: false, ["error"]: false});
                            if(!isNaN(Number(e.target.value)) && e.target.value.length <= 10) setParansPaDelete({...paransPaDelete, ["pa"]: e.target.value});;
                        }}
                        helperText={errorsPa.pa && "O campo deve ter 10 dígitos"}
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
                    {open.delete ? "Deseja realmente apagar essa regras?" : `A regra será executada no arquivo de (${formatMonth(month)} de ${year}). Executar?`}</DialogTitle>
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
                    As regras seram executadas no arquivo de ({formatMonth(month)} de {year}). Executar regras?
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
        </>
    );
};

DeletePerPa.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(DeletePerPa);
