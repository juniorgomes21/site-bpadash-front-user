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
import SouthIcon from '@mui/icons-material/South';
import Radio from '@mui/material/Radio';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tooltip from "@mui/material/Tooltip";


function InFpo({ dateBpa }) {

    const { reloadErrors, reloadErrorsFun, setHaveErrors, openSnackBarFun, setLoadingErrorsFun } = useContext(SnackBarContext);
    const [open, setOpen] = useState(false);
    const [fpo, setFpo] = useState({});
    const [error, setError] = useState(false);
    const [msgError, setMsgError] = useState('');
    const [loading, setLoading] = useState(false);
    const [fpoList, setFpoList] = useState({"errorsPaBpacDTOS": [], "errorsPaBpaiDTOS": []});
    const [errorsPaBpacDTOS, setErrorsPaBpacDTOS] = useState([]);
    const [errorsPaBpaiDTOS, setErrorsPaBpaiDTOS] = useState([]);
    const [startIndexBpac, setStartIndexBpac] = useState(5);
    const [startIndexBpai, setStartIndexBpai] = useState(5);
    const [occurrencePa, setOccurrencePa] = useState(0);
    const [updateAll, setUpdateAll] = useState('false');

    useEffect(() => {
        inFpo();
        setStartIndexBpac(5);
        setStartIndexBpai(5);
    }, [dateBpa, reloadErrors]);


    async function inFpo() {
        try {
            const obj = {
              "dateBPA": dateBpa
            }
            const response = await api.post("/bpa/inconsistency/fpo", obj);
            setFpoList(response.data);
            setErrorsPaBpacDTOS(response.data["errorsPaBpacDTOS"].slice(0, 5));
            setErrorsPaBpaiDTOS(response.data["errorsPaBpaiDTOS"].slice(0, 5));
            setHaveErrors("inFpo", (response.data["errorsPaBpacDTOS"].length > 0 || response.data["errorsPaBpaiDTOS"].length > 0));
        } catch (e) {
            console.log("error", e.response);
        }
        setLoadingErrorsFun("inFpo", false);
    }

    async function updatePA() {
        setLoading(true);
        let pa = "";
        if(fpo.type === "bpac") {
            pa = fpoList["errorsPaBpacDTOS"].find(item => item.id === fpo.id).pa;
        } else {
            pa = fpoList["errorsPaBpaiDTOS"].find(item => item.id === fpo.id).pa;
        }
        try {
            const obj = {
                "dateBpa": dateBpa,
                "pa": fpo.pa + "-" + (updateAll === 'false' ? '0' : '1') + "-" + pa,
                "key": "pa"
            };
            await api.post(`/${fpo.type}/update/${fpo.id}`, obj);
            reloadErrorsFun();
            handleClose();
            openSnackBarFun(false, "PA salvo");
        } catch (e) {
            console.log(e.response);
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
    
    function handleClickOpen(key, id) {
        const fpox = fpoList[key].find(item => item.id === id);
        setOccurrencePa(fpoList[key].filter(item => item.pa === fpox.pa).length);
        setFpo(fpox);
        setOpen(true);
    }

    function handleClose() {
        if(!loading) {
            setOpen(false);
            setError(false);
            setMsgError('');
        }
    }

    function loadMoreErrors(array) {
        if(array === "errorsPaBpacDTOS") {
            const nextErrors = fpoList["errorsPaBpacDTOS"].slice(startIndexBpac, startIndexBpac + 5);
    
            // Adicionar os próximos erros à lista de erros exibidos
            setErrorsPaBpacDTOS( prevErrors => [...prevErrors, ...nextErrors]);
        
            // Atualizar o índice para o próximo conjunto de erros
            setStartIndexBpac(startIndexBpac + 5);

        } else {
            const nextErrors = fpoList["errorsPaBpaiDTOS"].slice(startIndexBpai, startIndexBpai + 5);
    
            // Adicionar os próximos erros à lista de erros exibidos
            setErrorsPaBpaiDTOS( prevErrors => [...prevErrors, ...nextErrors]);
        
            // Atualizar o índice para o próximo conjunto de erros
            setStartIndexBpai(startIndexBpai + 5);
        }
    }

    function handleChange(event) {
        setUpdateAll(event.target.value);
    }

    return (
        <>
            {
                (fpoList["errorsPaBpacDTOS"].length > 0 || fpoList["errorsPaBpaiDTOS"].length > 0) &&
                    <div className="flex flex-col items-center border-[1px] border-default rounded-md p-2 my-6">
                        <div className="my-4">
                            <AlertCustom
                                type="error"
                                msg="PA de BPAC e BPAI não encontrados em um ou mais arquivos FPO, Ocupação e Procedimentos"
                            />
                        </div>
                        <div className="flex flex-col items-center w-full">
                            {
                                fpoList["errorsPaBpacDTOS"].length > 0 &&
                                    <div className="text-center font-bold">
                                        <p>BPAC</p>
                                        <p>{fpoList["errorsPaBpacDTOS"].length} erros</p>
                                    </div>
                            }
                            {
                                errorsPaBpacDTOS.map((item, index) => (
                                    <div key={index} className="w-3/4 mt-4">
                                        <div className="flex justify-between items-end font-bold">
                                            <p className="mr-2">
                                                ARQ: {item.msg.replace(/\s+/g, "/")}
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
                            { startIndexBpac < fpoList["errorsPaBpacDTOS"].length && (
                                <div className="flex justify-center w-full my-10">
                                    <Button
                                        variant="contained"
                                        endIcon={<SouthIcon />}
                                        onClick={() => loadMoreErrors("errorsPaBpacDTOS")}
                                    >
                                        Mostrar mais
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col items-center w-full mt-6">
                            {
                                fpoList["errorsPaBpaiDTOS"].length > 0 &&
                                    <div className="text-center font-bold">
                                        <p>BPAI</p>
                                        <p>{fpoList["errorsPaBpaiDTOS"].length} erros</p>
                                    </div>
                            }
                            {
                                errorsPaBpaiDTOS.map((item, index) => (
                                    <div key={index} className="w-3/4 mt-4">
                                        <div className="flex justify-between items-end font-bold">
                                            <p className="mr-2">
                                                ARQ: {item.msg.replace(/\s+/g, "/")}
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
                            { startIndexBpai < fpoList["errorsPaBpaiDTOS"].length && (
                                <div className="flex justify-center w-full my-10">
                                    <Button
                                        variant="contained"
                                        endIcon={<SouthIcon />}
                                        onClick={() => loadMoreErrors("errorsPaBpaiDTOS")}
                                    >
                                        Mostrar mais
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
            }
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>EDITAR PA</DialogTitle>
                <DialogContent>
                <DialogContentText className="mb-2">
                    Número de ocorrência desse PA na lista de erros ({occurrencePa})
                </DialogContentText>
                <DialogContentText>
                    {
                        updateAll === 'false' ?
                            `Edite o campo PA da folha ${fpo.flh} sequência ${fpo.seq}, ${occurrencePa}`
                        :
                            `Editar todos os campos PA`
                    }
                </DialogContentText>
                <div className="flex justify-around w-full my-3">
                    <div className="flex items-center">
                    <Radio
                        checked={updateAll === 'false'}
                        value="false"
                        onClick={handleChange}
                        name="radio-buttons"
                    />
                    <p className="mr-2">Atualizar um</p>
                    <Tooltip title={`Atualiza apenas esse PA da folha ${fpo.flh} sequência ${fpo.seq}`}>
                        <HelpOutlineIcon sx={{ fontSize: 20 }}/>
                    </Tooltip>
                    </div>
                    <div className="flex items-center">
                    <Radio
                        checked={updateAll === 'true'}
                        value="true"
                        onClick={handleChange}
                        name="radio-buttons"
                    />
                    <p className="mr-2">Atualizar todos</p>
                    <Tooltip title={`Atuliza todas as ocorrências do PA ${fpo.pa}`}>
                        <HelpOutlineIcon sx={{ fontSize: 20 }}/>
                    </Tooltip>
                    </div>
                </div>
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
                            if(!isNaN(Number(e.target.value))  && e.target.value.length <= 10) setFpo({...fpo, ["pa"]: e.target.value});
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