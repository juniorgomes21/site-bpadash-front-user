import React, { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import AlertCustom from "../../GlobalComponents/AlertCustom";
import EditIcon from '@mui/icons-material/Edit';
import SnackBarContext from "../../contexts/managerService";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import LoadingButton from "@mui/lab/LoadingButton";

function InQtService({ dateBpa }) {

    const { reloadErrors, reloadErrorsFun, openSnackBarFun} = useContext(SnackBarContext);
    const [service, setService] = useState({});
    const [qtService, setQtService] = useState([]);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);
    const [msgError, setMsgError] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        inQtService();
    }, [dateBpa, reloadErrors]);

    async function inQtService() {
        try {
            const obj = {
                "dateBPA": dateBpa
            }
            const response = await api.post("/bpa/inconsistency/qtServices", obj);
            setQtService(response.data);

        } catch (e) {
            console.log("error", e.response);
        }
    }

    async function update() {
        setLoading(true);
        try {
            const obj = {
                "qtService": [service.qt, service.qtMax]
            }
            await api.post(`/bpai/update/${service.id}`, obj);
            await inQtService();
            handleClose();
            openSnackBarFun(false, "Quntidade alterada");
        } catch (e) {
            console.log(e);
            setMsgError("Ops, algo deu errado");
            setError(true);
        }
        setLoading(false);
    }

    function isValidValue() {
        if(service.qt > service.qtMax || service.qt < 0 || service.qt.length == 0) {
            setError(true);
            setMsgError("A quantidade de serviço não pode ser maior que a quantidade máxima");
        } else {
            update();
        }
    }

    function handleClickOpen(id) {
        setService(qtService.find(item => item.id === id));
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
                qtService.length > 0 &&
                    <div className="flex flex-col items-center border-[1px] border-default rounded-md p-2 mt-6">
                        <div className="my-4">
                            <AlertCustom
                                type="error"
                                msg="Procedimentos de BPAI que excedem a quantidade máxima de procedimentos"
                            />
                        </div>
                        <div className="flex flex-col items-center w-full">
                            {
                                qtService.map((item, index) => (
                                    !item.msg.includes("NOT EXIST PA") &&
                                        <div key={index} className="w-3/4 mt-4">
                                            <div className="flex justify-between items-end font-bold">
                                                <p className="">
                                                    NOME: {item.name}
                                                </p>
                                                <div>
                                                    <p>
                                                        SEQ: {item.seq}
                                                    </p>
                                                    <p className="mr-2">
                                                        FOLHA: {item.flh}
                                                    </p>
                                                    <p>
                                                        QT MAX: {item.qtMax}
                                                    </p>
                                                </div>
                                            </div>
                                            <div key={index} className="flex justify-between items-center border-[1px] border-red-500 rounded-md p-2 my-2">
                                                <div className="">
                                                    <p>
                                                        QT INVÁLIDA: {item.qt}
                                                    </p>
                                                </div>
                                                <div className="cursor-pointer" onClick={() => handleClickOpen(item.id)}>
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
                <DialogTitle>EDITAR QUANTIDADE DE SERVIÇOS</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Edite o campo QT SERVIÇOS da folha {service.flh} sequência {service.seq}
                </DialogContentText>
                <div className="mt-3">
                    <TextField
                        fullWidth
                        autoFocus
                        label="QT SERVIÇOS"
                        type="number"
                        variant="standard"
                        error={error}
                        value={service.qt}
                        helperText={msgError}
                        onChange={ e => {
                            setError(false);
                            setMsgError('');
                            const inputValue = e.target.value;
                            const numericValue = inputValue.replace(/\D/g, '');
                            if(numericValue.length <= 3) setService({...service, ["qt"]: numericValue})
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

export default InQtService;