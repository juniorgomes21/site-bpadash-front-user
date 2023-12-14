import React, { useContext, useEffect, useState } from "react";
import api from "../../services/api";
import Button from '@mui/material/Button';
import AlertCustom from "../../GlobalComponents/AlertCustom";
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { formatCode3 } from "../../Validation&Formatation/formatation";
import LoadingButton from "@mui/lab/LoadingButton";
import SnackBarContext from "../../contexts/managerService";

function InFpo({ dateBpa }) {

    const { reloadErrors, reloadErrorsFun, setHaveErrors, openSnackBarFun } = useContext(SnackBarContext);
    const [open, setOpen] = useState(false);
    const [fpo, setFpo] = useState({});
    const [error, setError] = useState(false);
    const [msgError, setMsgError] = useState('');
    const [loading, setLoading] = useState(false);
    const [fpoList, setFpoList] = useState({"errorsPaBpacDTOS": [], "errorsPaBpaiDTOS": []});

    useEffect(() => {
        inFpo();
    }, [dateBpa, reloadErrors]);

    async function inFpo() {
        try {
            const obj = {
              "dateBPA": dateBpa,
              "dateLinkFpo": "2023-11-1"
            }
            const response = await api.post("/bpa/inconsistency/fpo", obj);
            setFpoList(response.data);
            setHaveErrors("inFpo", (response.data["errorsPaBpacDTOS"].length > 0 || response.data["errorsPaBpaiDTOS"].length > 0));
        } catch (e) {
            console.log("error", e.response);
        }
    }

    async function updatePA() {
        setLoading(true);
        const arqName = fpo.msg.includes("BPAC") ? "bpac" : "bpai";

        try {
            const obj = {
                "pa": fpo.pa
            }
            await api.post(`/${arqName}/update/${fpo.id}`, obj);
            reloadErrorsFun();
            handleClose();
            openSnackBarFun(false, "PA salvo");
        } catch (e) {
            console.log(e);
            setMsgError("Ops, algo deu errado");
            setError(true);
        }
        setLoading(false);
    }

    function isValidValue() {
        const pa = fpo.pa;

        if(pa.length != 10) {
            setError(true);
            setMsgError("PA deve conter 10 caracteres");
        } else {
            updatePA();
        }
    }
    
    function handleClickOpen(type, id) {
        setFpo(fpoList[type].find(item => item.id === id));
        setOpen(true);
    };

    function handleClose() {
        if(!loading) {
            setOpen(false);
            setError(false);
            setMsgError('');
        }
    };

    return (
        <>
            {
                (fpoList["errorsPaBpacDTOS"].length > 0 || fpoList["errorsPaBpaiDTOS"].length > 0) &&
                    <div className="flex flex-col items-center border-[1px] border-default rounded-md p-2 my-6">
                        <div className="my-4">
                            <AlertCustom
                                type="error"
                                msg="PA de BPAC e BPAI não encontrados em FPO, ocupação e procedimentos"
                            />
                        </div>
                        <div className="flex flex-col items-center w-full">
                            {
                                fpoList["errorsPaBpacDTOS"].length > 0 &&
                                    <div className="font-bold">
                                        <p>BPAC</p>
                                    </div>
                            }
                            {
                                fpoList["errorsPaBpacDTOS"].map((item, index) => (
                                    <div key={index} className="w-3/4 mt-4">
                                        <div className="flex justify-between items-end font-bold">
                                            <p className="mr-2">
                                                ARQ: {item.type}
                                            </p>
                                            <div>
                                                <p className="mr-2">
                                                    SEQ: {item.seq}
                                                </p>
                                                <p>
                                                    FOLHA: {item.flh}
                                                </p>
                                            </div>
                                        </div>
                                        <div key={index} className="flex justify-between items-center border-[1px] border-red-500 rounded-md p-2 my-2">
                                            <div className="">
                                                <p>
                                                    PA INVÁLIDO: {formatCode3(item.pa)}
                                                </p>
                                            </div>
                                            <div className="cursor-pointer" onClick={() => handleClickOpen("errorsPaBpacDTOS", item.id)}>
                                                <EditIcon />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="flex flex-col items-center w-full mt-6">
                            {
                                fpoList["errorsPaBpaiDTOS"].length > 0 &&
                                    <div className="font-bold">
                                        <p>BPAI</p>
                                    </div>
                            }
                            {
                                fpoList["errorsPaBpaiDTOS"].map((item, index) => (
                                    <div key={index} className="w-3/4 mt-4">
                                        <div className="flex justify-between items-end font-bold">
                                            <p className="mr-2">
                                                ARQ: {item.type}
                                            </p>
                                            <div>
                                                <p className="mr-2">
                                                    SEQ: {item.seq}
                                                </p>
                                                <p>
                                                    FOLHA: {item.flh}
                                                </p>
                                            </div>
                                        </div>
                                        <div key={index} className="flex justify-between items-center border-[1px] border-red-500 rounded-md p-2 my-2">
                                            <div className="">
                                                <p>
                                                    PA INVÁLIDO: {formatCode3(item.pa)}
                                                </p>
                                            </div>
                                            <div className="cursor-pointer" onClick={() => handleClickOpen("errorsPaBpaiDTOS", item.id)}>
                                                <EditIcon />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
            }
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>EDITAR PA</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Edite o campo PA da folha {fpo.flh} sequência {fpo.seq}
                </DialogContentText>
                <div className="mt-3">
                    <TextField
                        fullWidth
                        autoFocus
                        label="PA"
                        type="text"
                        variant="standard"
                        error={error}
                        value={fpo.pa}
                        helperText={msgError}
                        onChange={e => {
                            setError(false);
                            setMsgError('');
                            const inputValue = e.target.value;
                            if(inputValue.length <= 10) setFpo({...fpo, ["pa"]: e.target.value})
                        }}
                    />
                </div>
                </DialogContent>
                <DialogActions>
                {
                    !loading &&
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleClose}
                        >
                            Fechar
                        </Button>
                }
                <LoadingButton
                    color="success"
                    loading={loading}
                    variant="contained"
                    onClick={isValidValue}
                >
                    SalVar
                </LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default InFpo;