import React, { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import AlertCustom from "../../GlobalComponents/AlertCustom";
import EditIcon from '@mui/icons-material/Edit';
import { maskCEP } from "../../Validation&Formatation/formatation";
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

function InCep({ dateBpa, refresh }) {

    const employee = JSON.parse(localStorage.getItem("@Employee"));

    const { openSnackBarFun, setHaveErrors, setLoadingErrorsFun, loadingErrorsFiles } = useContext(SnackBarContext);
    const [open, setOpen] = useState({ "single": false, "all": false });
    const [cep, setCep] = useState({});
    const [ceps, setCeps] = useState([]);
    const [errorsDates, setErrorsDates] = useState([]);
    const [error, setError] = useState(false);
    const [msgError, setMsgError] = useState('');
    const [loading, setLoading] = useState(false);
    const [startIndex, setStartIndex] = useState(5);
    const [errors, setErrors] = useState({ "haveBlank": false, "haveInvalid": false });

    useEffect(() => {
        if(!loadingErrorsFiles.ageDate) {
            inCep();
            setStartIndex(5);
            setErrorsDates([]);
        }
    }, [loadingErrorsFiles.ageDate, dateBpa, refresh]);


    async function inCep() {
        try {
            const response = await api.post("/bpa/inconsistency/cep", { "dateBPA": dateBpa });
            setCeps(response.data);
            let haveBlank = false;
            let haveInvalid = false;
            for (let i = 0; i < response.data.length; i++) {
                const msg = response.data[i].msg;
            
                if (msg.includes("BLANK")) {
                    haveBlank = true;
                }
            
                if (msg.includes("INVALID")) {
                    haveInvalid = true;
                }
            
                if (haveBlank && haveInvalid) {
                    break;
                }
            }
            setErrors({ ...errors, haveBlank, haveInvalid });            
            setErrorsDates(response.data.slice(0, 5));
            setHaveErrors("inCep", response.data.length > 0);
        } catch (e) {
            console.log("error", e.response);
        }
        setLoadingErrorsFun("inCep", false);
    }

    async function update(upAll) {
        setLoading(true);
        try {
            if(upAll) {
                const ids = [];

                ceps.forEach( cep => {
                    ids.push(cep.id);
                });

                await api.post(`/bpai/update/0/${employee.key}`, { "key": errors.haveInvalid ? "cep" : "cepBlank", "ids": ids });
                
            } else {
                await api.post(`/bpai/update/${cep.id}/${employee.key}`, { "key": "cep", "cep": cep.cepInvalid });
            }
            setErrors({ "haveBlank": false, "haveInvalid": false });
            await inCep();
            handleClose();
            openSnackBarFun(false, ( upAll ? "Todos CEPs atualizados" : "CEP salvo"));
        } catch (e) {
            const response = e.response.data;
            
            switch (response) {
                case "FORBIDDEN":
                    openSnackBarFun(true, "Você não tem autorização para continuar com essa ação");
                    break;
                default: {
                    openSnackBarFun();
                }
            }
            setError(true);
        }
        setLoading(false);
    }

    function isValidValue() {
        const cepx = cep.cepInvalid;

        if(cepx.length != 8) {
            setError(true);
            setMsgError("CEP deve conter 8 caracteres");
        } else {
            update(false);
        }
    }
    
    function handleClickOpen(id, dialogAll) {
        if(dialogAll) {
            setOpen({ ...open, "all": true });
        } else {
            setCep(ceps.find(item => item.id === id));
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
        const nextErrors = ceps.slice(startIndex, startIndex + 5);

        // Adicionar os próximos erros à lista de erros exibidos
        setErrorsDates( prevErrors => [...prevErrors, ...nextErrors]);
    
        // Atualizar o índice para o próximo conjunto de erros
        setStartIndex(startIndex + 5);
    }


    return (
        <>
            {
                ceps.length > 0 &&
                    <div className="flex flex-col items-center border-[1px] border-default rounded-md p-2 mt-6">
                        <div className="my-4">
                            <AlertCustom
                                type="error"
                                msg="CEP de BPAI não encontrados no arquico de CEPs"
                            />
                        </div>
                        <div className="text-center font-bold text-sm mb-3">
                            <p>{ceps.length} erros</p>
                        </div>
                        {
                            errors.haveInvalid &&
                                <div className="flex justify-center w-full">
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => handleClickOpen(0, true)}
                                    >
                                        Atualizar todos
                                    </Button>
                                </div>
                        }
                        {
                            (!errors.haveInvalid && errors.haveBlank) &&
                                <div className="flex justify-center w-full">
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => handleClickOpen(0, true)}
                                    >
                                        Atualizar CEPs em branco
                                    </Button>
                                </div>
                        }
                        <div className="flex flex-col items-center w-full">
                            {
                                errorsDates.map((item, index) => (
                                    <div key={index} className="w-3/4 mt-4">
                                        <div className="flex justify-end font-bold">
                                            <p className="mr-2">
                                                SEQ: {item.seq}
                                            </p>
                                            <p>
                                                FOLHA: {item.flh}
                                            </p>
                                        </div>
                                        <div key={index} className="flex justify-between items-center border-[1px] border-red-500 rounded-md p-2 my-2">
                                            <div>
                                                <p>
                                                    CEP INVÁLIDO: {maskCEP(item.cepInvalid)}
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
                                startIndex < ceps.length && (
                                    <div className="flex justify-center w-full my-10">
                                        <Button
                                            variant="contained"
                                            endIcon={<SouthIcon />}
                                            onClick={() => loadMoreErrors("errorsPaBpacDTOS")}
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
                <DialogTitle>EDITAR CEP</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Edite o campo CEP da folha {cep.flh} sequência {cep.seq}
                </DialogContentText>
                <div className="mt-3">
                    <TextField
                        fullWidth
                        autoFocus
                        label="CEP"
                        type="text"
                        variant="standard"
                        error={error}
                        value={cep.cepInvalid}
                        helperText={msgError}
                        onChange={ e => {
                            setError(false);
                            setMsgError('');
                            if(!isNaN(Number(e.target.value)) && e.target.value.length <= 8) setCep({...cep, ["cepInvalid"]: e.target.value});
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
                    msg={`Todos os ${ceps.length} erros serão atualizados`}
                />
                <div className="border-[1px] border-orange-400 rounded-md mt-4 p-4">
                    {
                        errors.haveInvalid ?
                            <p className="text-center">
                                ATENÇÃO, os CEPs serão atualizados pelo CEP mais próximo com exceção de CEPs em branco.
                            </p>
                        :
                            <p className="text-center">
                                ATENÇÃO, os CEPs serão atualizados pelo CEP da sua unidade.
                            </p>
                    }
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

export default InCep;
