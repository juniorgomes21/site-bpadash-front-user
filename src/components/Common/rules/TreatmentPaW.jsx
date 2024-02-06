
import React, { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import LoadingButton from "@mui/lab/LoadingButton";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AlertCust from "../../GlobalComponents/AlertCustom";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SnackBarContext from "../../../contexts/managerService";
import { CircularProgress } from "@mui/material";
import DatePickerContext from "../../../contexts/DateGlobalBpa";
import Radio from '@mui/material/Radio';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

function TreatmentPaW() {

    const url = "/treatment/replacement/pa";

    const { openSnackBarFun } = useContext(SnackBarContext);
    const { getFormattedDate } = useContext(DatePickerContext);

    const [rulePA, setRulePA] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadingAction, setLoadingAction] = useState(false);
    const [open, setOpen] = useState({ "delete": false, "play": false });


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
    
    async function apiPlay() {
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
    
    function actionDialog(actionDi) {
        if (actionDi === "delete") {
            apiDelete();
        } else {
            apiPlay();
        }
    }

    function handleClickOpen(dialog, id, index) {
        setRuleObj({ "id": id, "index": index });
        setOpen({ ...open, [dialog]: true });
    }

    function handleClose() {
        setOpen({ "delete": false, "play": false });
    }


    return (
        <>
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
        </>
    )
}

export default TreatmentPaW;
