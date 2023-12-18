import PropTypes from "prop-types";
import React, { useEffect, useState, useContext } from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import api from "../../services/api";
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
import DatePickerContext from "../../contexts/DatePicker";
import Radio from '@mui/material/Radio';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';


function TreatmentPaCbo(props) {
  
  document.title="Substituição de CBO";

  const { openSnackBarFun } = useContext(SnackBarContext);
  const { month, year } = useContext(DatePickerContext);
  const [rulePaCbo, setRulePaCbo] = useState({});
  const [loading, setLoading] = useState(true);
  const [msgError, setMsgError] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);
  const [ruleObj, setRuleObj] = useState({"id": 0, "index": -1});
  const [paransCbo, setParansCbo] = useState({ "pa": "", "cboCurrent": "", "cboNew": "" });
  const [errorsCbo, setErrorsCbo] = useState({ "pa": false, "cboCurrent": false, "cboNew": false, "error": false, "equals": false });
  const [open, setOpen] = useState({"delete": false, "edit": false, "play": false, "create": false, "playAll": false});


  useEffect(() => {
    apiGetRulesPaCbo();
  }, [])


  async function apiGetRulesPaCbo() {
    try {
      const response = await api.get("/treatment/get/pa/cbo");
      setRulePaCbo(response.data);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }

  async function apiCreateRulePaCbo() {
    try {
      const obj = {
        "pa": paransCbo.pa,
        "cboCurrent": paransCbo.cboCurrent,
        "cboNew": paransCbo.cboNew
      }
      await api.post("/treatment/create/pa/cbo", obj);
      await apiGetRulesPaCbo();
      handleClose();
      openSnackBarFun(false, "Regra PA salva");

    } catch(e) {
      setErrorsCbo({ ...errorsCbo, ["error"]: true});
      switch (e.response.data) {
        case "PARANS IQUALS" :
          setMsgError("Os CBOs não pode ser iguais");
          break;
        case "REACHED MAX LENGTH" :
          setMsgError("Você alcançou o número máximo de regras");
          break;
        case "EXIST RULE" :
          setMsgError("Uma regra para esse CBO já existe ");
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
      await api.post(`/treatment/update/execute/pa/cbo/file/${rule.id}`, obj);
      await apiGetRulesPaCbo();
    } catch (e) {
      console.log(e);
    }
  }

  async function apiDeleteRule() {
    setLoadingAction(true);
    try {
      await api.post(`/treatment/delete/pa/cbo/${ruleObj.id}`);
      await apiGetRulesPaCbo();
      handleClose();
      openSnackBarFun(false, "Regra apagada");
    } catch (e) {
      console.log(e);
      openSnackBarFun();
    }
    setLoadingAction(false);
  }

  async function apiEditRulePaCbo() {
    try {
      const obj = {
        "pa": paransCbo.pa,
        "cboCurrent": paransCbo.cboCurrent,
        "cboNew": paransCbo.cboNew
      }
      await api.post(`/treatment/edit/pa/cbo/${ruleObj.id}`, obj);
      await apiGetRulesPaCbo();
      handleClose();
      openSnackBarFun(false, "Regra CBO salva");
    } catch(e) {
      setErrorsCbo({ ...errorsCbo, ["error"]: true });
      switch (e.response.data) {
        case "PARANS IQUALS" :
          setMsgError("Os CBOs não pode ser iguais");
          break;
        case "REACHED MAX LENGTH" :
          setMsgError("Você alcançou o número máximo de regras");
          break;
        case "EXIST RULE" :
          setMsgError("Uma regra para esse CBO já existe ");
          break;
        default:
          setMsgError("Ops, algo deu errado");
          openSnackBarFun(true, "Ops, algo deu errado");
      }
    }
  }

  async function apiPlayRule() {
    setLoadingAction(true);
    handleClose();
    try {
      const obj = {
        "dateBpa": year + "-" + month + "-" + "01"
      };
      const response = await api.post(`/treatment/play/pa/cbo/${ruleObj.id}`, obj);
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
      let count = 0;
      const obj = {
        "dateBpa": year + "-" + month + "-" + "01"
      };

      for(let i = 0; i < rulePaCbo.ruleTreatmentPaCboList.length; i++) {
        const rule = rulePaCbo.ruleTreatmentPaCboList[i];
        const response = await api.post(`/treatment/play/pa/${rule.id}`, obj);
        count = count + response.data;
      }

      openSnackBarFun(false, `Todas regras executadas ${count} linhas alteradas`);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
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
      const rule = rulePaCbo.ruleTreatmentPaCboList.find(item => item.id === id);
      setParansCbo({ "pa": rule.pa, "cboCurrent": rule.cboCurrent, "cboNew": rule.cboNew });
    }

    setOpen({ ...open, [dialog]: true });
  }

  function handleClose() {
    setParansCbo({ "pa": "", "cboCurrent": "", "cboNew": "" });
    setErrorsCbo({ "pa": false, "cboCurrent": false, "cboNew": false, "error": false });
    setOpen({"delete": false, "edit": false, "play": false, "create": false, "playAll": false});
  }

  function isValid() {
    const haveErrorPa = paransCbo.pa.length != 10;
    const haveErrorCboCurrent = paransCbo.cboCurrent.length != 6;
    const haveErrorCboNew = paransCbo.cboNew.length != 6;
    const haveErrorEquals = paransCbo.cboNew === paransCbo.cboCurrent;

    if (haveErrorPa || haveErrorCboNew || haveErrorCboCurrent || haveErrorEquals) {
      setMsgError(haveErrorEquals && "Os CBOs não podem ser iguais");
      setErrorsCbo({ "pa": haveErrorPa, "cboCurrent": haveErrorCboCurrent, "cboNew": haveErrorCboNew, "error": haveErrorEquals, "equals": haveErrorEquals });
    } else {
      if(open.create) {
        apiCreateRulePaCbo();
      } else {
        apiEditRulePaCbo();
      }
    }
  }
  

  return (
    <>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Substituição de CBO")}
            breadcrumbItem={props.t("Substituição de CBO")}
          />
          <AlertCust
            type="warning"
            msg="AS REGRAS SERAM EXECUTADAS NO ARQUIVO BPA SELECIONADO"
          />
          <p className="flex justify-center mt-8">
            Adicione regras de substituição CBO. Ao executar uma regra todos os campos CBO informados seram substituidos pelo novo CBO informado.
          </p>
          {
            loading ?
              <div className="flex justify-center mt-10">
                <CircularProgress size={25}/>
              </div>
            :
              rulePaCbo.ruleTreatmentPaCboList.length > 0 ?
                  <div className="flex flex-col items-center w-full mt-10">
                    <p className="font-bold">
                      - MINHAS REGRAS -
                    </p>
                    <div className="w-full my-4">
                      {
                        rulePaCbo.ruleTreatmentPaCboList.map((rule, index) => (
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
                                  <p>PA: </p> <p className="ml-2">{rule.pa}</p> <p className="mx-1">/</p> <p> CBO: </p><p className="ml-2">{rule.cboCurrent}</p>
                                </div>
                                <div className="flex mt-2">
                                  <p> NOVO CBO: </p>
                                  <p className="ml-2">{rule.cboNew}</p>
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
            <DialogTitle>{open.create ? "Adicione uma nova regra CBO" : "Editar regra CBO"}</DialogTitle>
            <DialogContent>
              <DialogContentText className="mb-3">
                {open.create && `Você pode adicionar ${rulePaCbo.count} regras`}
              </DialogContentText>
              {
                errorsCbo.error &&
                  <div className="my-3 text-red-500">
                    <p>{msgError}</p>
                  </div>
              }
              <TextField
                fullWidth
                id="pa"
                label="PA"
                type="text"
                error={errorsCbo.pa}
                value={paransCbo.pa}
                variant="standard"
                onChange={ e => {
                  if(errorsCbo.pa) setErrorsCbo({...errorsCbo, ["pa"]: false});
                  if(!isNaN(Number(e.target.value)) && e.target.value.length <= 10) setParansCbo({...paransCbo, ["pa"]: e.target.value});;
                }}
                helperText={errorsCbo.pa && "O campo deve ter 10 dígitos"}
              />
                <TextField
                  fullWidth
                  id="oldCbo"
                  label="CBO a ser substituído"
                  error={errorsCbo.cboCurrent || errorsCbo.error || errorsCbo.equals}
                  value={paransCbo.cboCurrent}
                  type="text"
                  variant="standard"
                  onChange={ e => {
                    if(errorsCbo.cboCurrent || errorsCbo.error || errorsCbo.equals) setErrorsCbo({...errorsCbo, ["cboCurrent"]: false, ["error"]: false, ["equals"]: false});
                    if(!isNaN(Number(e.target.value))  && e.target.value.length <= 6) setParansCbo({...paransCbo, ["cboCurrent"]: e.target.value});
                  }}
                  helperText={errorsCbo.cboCurrent && "O campo deve ter 6 dígitos"}
                  sx={{
                    my: 2
                  }}
                />
              <TextField
                fullWidth
                id="newCbo"
                label="Novo CBO"
                error={errorsCbo.cboNew || errorsCbo.equals}
                value={paransCbo.cboNew}
                type="text"
                variant="standard"
                onChange={ e => {
                  if(errorsCbo.cboNew || errorsCbo.error || errorsCbo.equals) setErrorsCbo({...errorsCbo, ["cboNew"]: false, ["error"]: false, ["equals"]: false});
                  if(!isNaN(Number(e.target.value))  && e.target.value.length <= 6) setParansCbo({...paransCbo, ["cboNew"]: e.target.value});
                }}
                helperText={errorsCbo.cboNew && "O campo deve ter 6 dígitos"}
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

TreatmentPaCbo.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(TreatmentPaCbo);
