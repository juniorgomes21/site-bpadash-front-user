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
import { formatDateStringFull } from "../../Validation&Formatation/formatation";
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import Tooltip from "@mui/material/Tooltip";

function AgeMinMax({ dateBpa, refresh }) {

    const dateNow = new Date();
    const { openSnackBarFun, setHaveErrors, setLoadingErrorsFun, loadingErrorsFiles } = useContext(SnackBarContext);
    const [ageMaxMin, setAgeMaxMin] = useState({});
    const [ageMaxMins, setAgeMaxMins] = useState([]);
    const [errorsDates, setErrorsDates] = useState([]);
    const [open, setOpen] = useState({ "single": false, "all": false });
    const [error, setError] = useState(false);
    const [msgError, setMsgError] = useState('');
    const [loading, setLoading] = useState(false);
    const [startIndex, setStartIndex] = useState(5);

    useEffect(() => {
        if(!loadingErrorsFiles.inFpo) {
            inAgeMaxMin();
            setStartIndex(5);
            setErrorsDates([]);
        }
    }, [loadingErrorsFiles.inFpo, dateBpa, refresh]);


    async function inAgeMaxMin() {
        try {
            const obj = {
              "dateBPA": dateBpa
            }
            const response = await api.post("/bpa/inconsistency/date/procedure", obj);
            setAgeMaxMins(response.data);
            setErrorsDates(response.data.slice(0, 5));
            setHaveErrors("ageMinMax", response.data.length > 0);
        } catch (e) {
            console.log("error", e.response);
        }
        setLoadingErrorsFun("ageMinMax", false);
    }

    async function update(upAll) {
        setLoading(true);
        try {
            if(upAll) {
                const ids = [];
                ageMaxMins.forEach( age => {
                    ids.push(age.id);
                });

                await api.post(`/bpai/update/${0}`, { "ids": ids, "key": "ageMaxMin" });

            } else {
                await api.post(`/bpai/update/${ageMaxMin.id}`, { "age": ageMaxMin.age, "key": "ageMaxMin" });
            }
            await inAgeMaxMin();
            handleClose();
            openSnackBarFun(false, "IDADE salva");
        } catch (e) {
            console.log(e);
            setMsgError("Ops, algo deu errado");
            setError(true);
        }
        setLoading(false);
    }

    function isValidValue() {
        const age = ageMaxMin.age;

        if(age > ageMaxMin.ageMax || age < ageMaxMin.ageMin || age === "") {
            setError(true);
            setMsgError("Idade deve estar entre 0 à 130 anos");
        } else {
            update(false);
        }
    }
    
    function handleClickOpen(id, type) {
        if(type === "single") {
            setAgeMaxMin(ageMaxMins.find(item => item.id === id));
            setOpen({ ...open, "single": true });
        } else {
            setOpen({ ...open, "all": true });
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
        const nextErrors = ageMaxMins.slice(startIndex, startIndex + 5);

        // Adicionar os próximos erros à lista de erros exibidos
        setErrorsDates( prevErrors => [...prevErrors, ...nextErrors]);
    
        // Atualizar o índice para o próximo conjunto de erros
        setStartIndex(startIndex + 5);
    }

    return (
        <>
            {
                ageMaxMins.length > 0 &&
                    <div className="flex flex-col items-center border-[1px] border-default rounded-md p-2 my-6">
                        <div className="my-4">
                            <AlertCustom
                                type="error"
                                msg="Idade em BPAI não está dentro do intervalo de idade máxima e mínima do arquivo de procedimentos"
                            />
                        </div>
                        <div className="text-center font-bold text-sm mb-3">
                            <p>{ageMaxMins.length} erros</p>
                        </div>
                        <div className="flex justify-center w-full">
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleClickOpen(-1, "all")}
                            >
                                Atualizar todas as Idades
                            </Button>
                        </div>
                        <div className="flex flex-col items-center w-full">
                            {
                                errorsDates.map((item, index) => (
                                    !item.msg.includes("NOT EXIST PA") &&
                                    <div key={index} className="w-3/4 mt-4">
                                        <div className="flex justify-between items-end w-full font-bold">
                                            <p className="">
                                                NOME: {item.name}
                                            </p>
                                            <div>
                                                <p>
                                                    SEQ: {item.seq}
                                                </p>
                                                <p>
                                                    FOLHA: {item.flh}
                                                </p>
                                                <p>
                                                    IDADE MIN: {item.ageMin}
                                                </p>
                                                <p>
                                                    IDADE MAX: {item.ageMax}
                                                </p>
                                                <div className="flex items-center">
                                                    <p>
                                                        DATA NASC: {formatDateStringFull(item.dateNasc)}
                                                    </p>
                                                    <div className="mx-1 mb-1">
                                                        {
                                                            (item.dateNasc.substring(0, 4) < 1900 || item.dateNasc.substring(0, 4) >  dateNow.getFullYear()) &&
                                                                <Tooltip title="Data inválida, Atualize manualmente">
                                                                    <ReportProblemOutlinedIcon sx={{ fontSize: 17, color: "red" }}/>
                                                                </Tooltip>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center border-[1px] border-red-500 rounded-md p-2 my-2">
                                            <div>
                                                <p>
                                                    IDADE INVÁLIDA: {item.age}
                                                </p>
                                            </div>
                                            <div className="cursor-pointer" onClick={() => handleClickOpen(item.id, "single")}>
                                                <EditIcon />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        {
                            startIndex < ageMaxMins.length && (
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
            }
            <Dialog open={open.single} onClose={handleClose}>
                <DialogTitle>EDITAR IDADE</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Edite o campo IDADE da folha {ageMaxMin.flh} sequência {ageMaxMin.seq}
                </DialogContentText>
                <div className="mt-3">
                    <TextField
                        fullWidth
                        autoFocus
                        label="IDADE"
                        type="text"
                        variant="standard"
                        error={error}
                        value={ageMaxMin.age}
                        helperText={msgError}
                        onChange={ e => {
                            setError(false);
                            setMsgError('');
                            if(!isNaN(Number(e.target.value)) && e.target.value.length <= 3) setAgeMaxMin({...ageMaxMin, ["age"]: e.target.value});
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
                    msg={`Todos os ${ageMaxMins.length} erros serão atualizados`}
                />
                <div className="border-[1px] border-orange-400 rounded-md mt-4 p-4">
                    <p className="text-center">
                        ATENÇÃO, a atualização da idade é baseada na data de nascimento do paciênte já salva no banco de dados
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

export default AgeMinMax;