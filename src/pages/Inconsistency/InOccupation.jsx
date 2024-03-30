import React, { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import AlertCustom from "../../GlobalComponents/AlertCustom";
import EditIcon from '@mui/icons-material/Edit';
import { maskPointThree } from "../../Validation&Formatation/formatation";
import SnackBarContext from "../../contexts/managerService";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from "@mui/lab/LoadingButton";
import Button from '@mui/material/Button';
import SouthIcon from '@mui/icons-material/South';
import Radio from '@mui/material/Radio';


function InOccupation({ dateBpa, refresh }) {

    const employee = JSON.parse(localStorage.getItem("@Employee"));

    const { loadingErrorsFiles, reloadErrors, setHaveErrors, openSnackBarFun, setLoadingErrorsFun } = useContext(SnackBarContext);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);
    const [msgError, setMsgError] = useState('');
    const [loading, setLoading] = useState(false);
    const [occupation, setOccupation] = useState({});
    const [occupations, setOccupations] = useState({"errorsOccupationBpacDTOS": [], "errorsOccupationBpaiDTOS": []});
    const [errorsOccupationBpacDTOS, setErrorsOccupationBpacDTOS] = useState([]);
    const [errorsOccupationBpaiDTOS, setErrorsOccupationBpaiDTOS] = useState([]);
    const [startIndexBpac, setStartIndexBpac] = useState(5);
    const [startIndexBpai, setStartIndexBpai] = useState(5);
    const [updateAll, setUpdateAll] = useState(false);


    useEffect(() => {
        if(!loadingErrorsFiles.inProcedure) {
            inOccupation();
            setStartIndexBpac(5);
            setStartIndexBpai(5);
            setErrorsOccupationBpacDTOS([]);
            setErrorsOccupationBpaiDTOS([]);
        }
    }, [loadingErrorsFiles.inProcedure, dateBpa, refresh, reloadErrors]);


    async function inOccupation() {
        try {
            const response = await api.post("/bpa/inconsistency/occupation", { "dateBPA": dateBpa });
            setOccupations(response.data);
            setErrorsOccupationBpacDTOS(response.data["errorsOccupationBpacDTOS"].slice(0, 5));
            setErrorsOccupationBpaiDTOS(response.data["errorsOccupationBpaiDTOS"].slice(0, 5));
            setHaveErrors("inOccupation", response.data.length > 0);
        } catch (e) {
            console.log("error", e.response);
        }
        setLoadingErrorsFun("inOccupation", false);
    }

    async function update() {
        setLoading(true);
        const arqName = occupation.msg.includes("BPAC") ? "bpac" : "bpai";
        try {
            let cboOld = "";
            if(arqName === "bpac") {
                cboOld = occupations["errorsOccupationBpacDTOS"].find(item => item.id === occupation.id).cbo
            } else {
                cboOld = occupations["errorsOccupationBpaiDTOS"].find(item => item.id === occupation.id).cbo
            }
            await api.post(`/${arqName}/update/${occupation.id}/${employee.key}`, { "cbo": (occupation.cbo + "-" + (updateAll ? '1' : '0') + "-" + cboOld), "dateBpa": dateBpa, "key": "cbo" });
            await inOccupation();
            handleClose();
            openSnackBarFun(false, "CBO salvo");
            setUpdateAll(false);

        } catch (e) {
            const response = e.response.data;
            
            switch (response) {
                case "FORBIDDEN":
                    openSnackBarFun(true, "Você não tem autorização para continuar com essa ação");
                    break;
                default: {
                    setMsgError(e.response.data[0] && e.response.data[0].message);
                    setUpdateAll(false);
                    setError(true);
                }
            }
        }
        setLoading(false);
    }

    function isValidValue() {
        const cbo = occupation.cbo;

        if(cbo.length != 6) {
            setError(true);
            setMsgError("CBO deve conter 6 caracteres");
        } else {
            update();
        }
    }

    function handleClickOpen(type, id) {
        setOccupation(occupations[type].find(item => item.id === id));
        setOpen(true);
    }

    function handleClose() {
        if(!loading) {
            setOpen(false);
            setError(false);
            setUpdateAll(false);
            setMsgError('');
        }
    }

    function loadMoreErrors(array) {
        if(array === "errorsOccupationBpacDTOS") {
            const nextErrors = occupations["errorsOccupationBpacDTOS"].slice(startIndexBpac, startIndexBpac + 5);
    
            // Adicionar os próximos erros à lista de erros exibidos
            setErrorsOccupationBpacDTOS( prevErrors => [...prevErrors, ...nextErrors]);
        
            // Atualizar o índice para o próximo conjunto de erros
            setStartIndexBpac(startIndexBpac + 5);

        } else {
            const nextErrors = occupations["errorsOccupationBpaiDTOS"].slice(startIndexBpai, startIndexBpai + 5);
    
            // Adicionar os próximos erros à lista de erros exibidos
            setErrorsOccupationBpaiDTOS( prevErrors => [...prevErrors, ...nextErrors]);
        
            // Atualizar o índice para o próximo conjunto de erros
            setStartIndexBpai(startIndexBpai + 5);
        }
    }

    function handleChange(event) {
        setUpdateAll(event.target.value === 'true');
    }

    return (
        <>
            {
                (occupations["errorsOccupationBpacDTOS"].length > 0 || occupations["errorsOccupationBpaiDTOS"].length > 0) &&
                    <div className="flex flex-col items-center border-[1px] border-default rounded-md p-2 mt-6">
                        <div className="my-4">
                            <AlertCustom
                                type="error"
                                msg="PA e CBO de BPAC e BPAI não encontrados em ocupação"
                            />
                        </div>
                        <div className="flex flex-col items-center w-full">
                            {
                                occupations["errorsOccupationBpacDTOS"].filter(itemx => itemx.msg === "NOT EXIST CBO IN OCCUPATION BPAC").length > 0 &&
                                    <div className="flex flex-col items-center font-bold">
                                        <p>BPAC - CBO</p>
                                        <p className="mt-2">{occupations["errorsOccupationBpacDTOS"].length} erros</p>
                                    </div>
                            }
                            {
                                errorsOccupationBpacDTOS.map((item, index) => (
                                    item.msg.includes("CBO") &&
                                        <div key={index} className="w-3/4 mt-4">
                                            <div className="flex justify-between items-end font-bold">
                                                <p className="mr-2">
                                                    PA: {item.pa}
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
                                                        CBO INVÁLIDO: {maskPointThree(item.cbo)}
                                                    </p>
                                                </div>
                                                <div className="cursor-pointer" onClick={() => handleClickOpen("errorsOccupationBpacDTOS", item.id)}>
                                                    <EditIcon />
                                                </div>
                                            </div>
                                        </div>
                                ))
                            }
                            { startIndexBpac < occupations["errorsOccupationBpacDTOS"].length && (
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
                        <div className="flex flex-col items-center w-full">
                            {
                                occupations["errorsOccupationBpaiDTOS"].filter(itemx => itemx.msg === "NOT EXIST CBO IN OCCUPATION BPAI").length > 0 &&
                                    <div className="flex flex-col items-center font-bold mt-4">
                                        <p>BPAI - CBO</p>
                                        <p className="mt-2">{occupations["errorsOccupationBpaiDTOS"].length} erros</p>
                                    </div>
                            }
                            {
                                errorsOccupationBpaiDTOS.map((item, index) => (
                                    item.msg.includes("CBO") &&
                                        <div key={index} className="w-3/4 mt-4">
                                            <div className="flex justify-between items-end font-bold">
                                                <p className="mr-2">
                                                    PA: {item.pa}
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
                                                        CBO INVÁLIDO: {maskPointThree(item.cbo)}
                                                    </p>
                                                </div>
                                                <div className="cursor-pointer" onClick={() => handleClickOpen("errorsOccupationBpaiDTOS", item.id)}>
                                                    <EditIcon />
                                                </div>
                                            </div>
                                        </div>
                                ))
                            }
                            { startIndexBpai < occupations["errorsOccupationBpaiDTOS"].length && (
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
                    </div>
            }
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>EDITAR CBO</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    {
                        !updateAll ?
                            `Edite o campo CBO da folha ${occupation.flh} sequência ${occupation.seq}`
                        :
                            `Atuliza todas as ocorrências desse CBO no arquivo ${ occupation.msg.includes("BPAC") ? "BPAC" : "BPAI"}`
                    }
                    
                </DialogContentText>
                <div className="flex justify-around w-full my-3">
                    <div className="flex items-center">
                        <Radio
                            checked={!updateAll}
                            value="false"
                            onClick={handleChange}
                            name="radio-buttons"
                        />
                        <p className="mr-2">Atualizar um</p>
                    </div>
                    <div className="flex items-center">
                        <Radio
                            checked={updateAll}
                            value="true"
                            onClick={handleChange}
                            name="radio-buttons"
                        />
                        <p className="mr-2">Atualizar todos</p>
                    </div>
                </div>
                <div className="mt-3">
                    <TextField
                        fullWidth
                        autoFocus
                        label="CBO"
                        type="text"
                        variant="standard"
                        error={error}
                        value={occupation.cbo}
                        helperText={msgError}
                        onChange={ e => {
                            setError(false);
                            setMsgError('');
                            if(!isNaN(Number(e.target.value)) && e.target.value.length <= 6) setOccupation({...occupation, ["cbo"]: e.target.value});
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

export default InOccupation;
