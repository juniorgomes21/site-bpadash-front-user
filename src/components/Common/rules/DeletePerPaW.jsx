import { useEffect, useState, useContext } from "react";
import api from "../../../services/api";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import LoadingButton from "@mui/lab/LoadingButton";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { CircularProgress } from "@mui/material";
import DatePickerContext from "../../../contexts/DateGlobalBpa";
import { formatMonth } from "../../../Validation&Formatation/formatation";
import SnackBarContext from "../../../contexts/managerService";
import Hourglass from "../../../assets/images/loading/Hourglass.gif";


function DeletePerPaW() {

    const url = "/treatment/deleteperpa";

    const { openSnackBarFun } = useContext(SnackBarContext);
    const { month, year, getFormattedDate } = useContext(DatePickerContext);

    const [loading, setLoading] = useState(true);
    const [rulePaDelete, setRulePaDelete] = useState({});
    const [loadingAction, setLoadingAction] = useState(false);
    const [ruleObj, setRuleObj] = useState({ "id": 0, "index": -1 });
    const [open, setOpen] = useState({ "delete": false, "play": false });

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

    async function apiPlayRule() {
        setLoadingAction(true);
        handleClose();
        try {
          const response = await api.post( url + `/execute/${ruleObj.id}`, { "dateBpa": getFormattedDate() });
          handleClose();
          openSnackBarFun(false, `Regra executada, ${response.data} linhas alteradas`);
        } catch (e) {
          console.log(e);
          openSnackBarFun();
        }
        setLoadingAction(false);
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

    function actionDialog(actionDi) {
        if(actionDi === "delete") {
          apiDeleteRule();
        } else {
          apiPlayRule();
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
            <div className="flex flex-col items-center w-full mt-10">
                <p className="font-bold">
                    - APAGAR POR PA -
                </p>
                <div className="w-full my-4">
                    {
                        loading ?
                            <div className="flex justify-center mt-10">
                                <img src={Hourglass} alt="loading..."/>
                            </div>
                        :
                            rulePaDelete.ruleTreatmentPaDeleteList.map((rule, index) => (
                                <div key={index} className="my-4">
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
                                                        <div className="ml-3">
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
                                                        </div>
                                                    </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))
                    }
                </div>
            </div>
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
        </>
    )
}

export default DeletePerPaW;
