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
import SouthIcon from '@mui/icons-material/South';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tooltip from "@mui/material/Tooltip";


function InQtService({ dateBpa, refresh }) {

    const employee = JSON.parse(localStorage.getItem("@Employee"));

    const { reloadErrors, setHaveErrors, openSnackBarFun, setLoadingErrorsFun, loadingErrorsFiles} = useContext(SnackBarContext);
    const [service, setService] = useState({});
    const [qtService, setQtService] = useState([]);
    const [errorsQtService, setErrorsQtService] = useState([]);
    const [open, setOpen] = useState({ "single": false, "all": false });
    const [error, setError] = useState(false);
    const [msgError, setMsgError] = useState('');
    const [loading, setLoading] = useState(false);
    const [startIndex, setStartIndex] = useState(5);


    useEffect(() => {
        if(!loadingErrorsFiles.inCep) {
            inQtService();
            setStartIndex(5);
            setErrorsQtService([]);
        }
    }, [loadingErrorsFiles.inCep, dateBpa, refresh, reloadErrors]);

    async function inQtService() {
        try {
            const response = await api.post("/bpa/inconsistency/qtServices", { "dateBPA": dateBpa });
            setQtService(response.data);
            setErrorsQtService(response.data.slice(0, 5));
            setHaveErrors("inQtService", response.data.length > 0);
        } catch (e) {
            console.log("error", e.response);
        }
        setLoadingErrorsFun("inQtService", false);
    }

    async function update(upAll) {
        setLoading(true);
        try {
            if(upAll) {
                const ids = [];

                qtService.forEach( qt => {
                    ids.push(qt.id);
                });

                await api.post(`/bpai/update/${0}/${employee.key}`, { "key": "qtService", "ids": ids });

            } else {
                await api.post(`/bpai/update/${service.id}/${employee.key}`, { "key": "qtService", "qtService": [ service.qt, service.qtMax ]});
            }
            await inQtService();
            handleClose();
            openSnackBarFun(false, "Quntidade alterada");
        } catch (e) {
            const response = e.response.data;
            
            switch (response) {
                case "FORBIDDEN":
                    openSnackBarFun(true, "Você não tem autorização para continuar com essa ação");
                    break;
                default: {
                    setMsgError("Ops, algo deu errado");
                }
            }

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

    function handleClickOpen(id, dialogAll) {
        if(dialogAll) {
            setOpen({ ...open, "all": true });
        } else {
            setService(qtService.find(item => item.id === id));
            setOpen({ ...open, "single": true });
        }
    }

    function handleClose() {
        if(!loading) {
            setOpen({ "single": false, "all": false });
            setError(false);
            setMsgError('');
        }
    }

    function loadMoreErrors() {
        const nextErrors = qtService.slice(startIndex, startIndex + 5);

        // Adicionar os próximos erros à lista de erros exibidos
        setErrorsQtService( prevErrors => [...prevErrors, ...nextErrors]);
    
        // Atualizar o índice para o próximo conjunto de erros
        setStartIndex(startIndex + 5);
    }

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
                        <div className="text-center font-bold text-sm mb-3">
                            <p>{qtService.length} erros</p>
                        </div>
                        <div className="flex justify-center w-full">
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleClickOpen(0, true)}
                            >
                                Atualizar todos
                            </Button>
                        </div>
                        <div className="flex flex-col items-center w-full">
                            {
                                errorsQtService.map((item, index) => (
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
                                                    <div className="flex items-center">
                                                        <p>
                                                            QT MAX: {item.qtMax}
                                                        </p>
                                                        <div className="mx-1 mb-[2px]">
                                                            <Tooltip title={`Quantidade máxima do procedimento ${item.pa}`}>
                                                                <HelpOutlineIcon sx={{ fontSize: 17 }}/>
                                                            </Tooltip>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div key={index} className="flex justify-between items-center border-[1px] border-red-500 rounded-md p-2 my-2">
                                                <div className="">
                                                    <p>
                                                        QT INVÁLIDA: {item.qt}
                                                    </p>
                                                </div>
                                                <div className="cursor-pointer" onClick={() => handleClickOpen(item.id, false)}>
                                                    <EditIcon />
                                                </div>
                                            </div>
                                        </div>
                                ))
                            }
                            {
                                startIndex < qtService.length && (
                                    <div className="flex justify-center w-full my-10">
                                        <Button
                                            variant="contained"
                                            endIcon={<SouthIcon />}
                                            onClick={loadMoreErrors}
                                        >
                                            Mostrar mais
                                        </Button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
            }
            <Dialog open={open.single} onClose={handleClose}>
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
                            if(!isNaN(Number(e.target.value))  && e.target.value.length <= 3) setService({...service, ["qt"]: e.target.value});
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
            <Dialog open={open.all} onClose={handleClose}>
                <DialogTitle>EDITAR TODOS</DialogTitle>
                <DialogContent>
                <AlertCustom
                    type="warning"
                    msg={`Todos os ${qtService.length} erros serão atualizados`}
                />
                <div className="border-[1px] border-orange-400 rounded-md mt-4 p-4">
                    <p className="text-center">
                        ATENÇÃO, a quantidade de serviços será alterada pela quantidade máxima de seus respectivos procedimentos.
                    </p>
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
                        onClick={() => update(true)}
                    >
                        Atualizar
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default InQtService;
