import React, { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import AlertCustom from "../../GlobalComponents/AlertCustom";
import EditIcon from '@mui/icons-material/Edit';
import { maskPointThree, formatDateString } from "../../Validation&Formatation/formatation";
import { Link } from "react-router-dom";
import SnackBarContext from "../../contexts/managerService";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tooltip from "@mui/material/Tooltip";
import LoadingButton from "@mui/lab/LoadingButton";
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import Radio from '@mui/material/Radio';
import SouthIcon from '@mui/icons-material/South';


function InProfessionals({ dateBpa, refresh }) {

    const employee = JSON.parse(localStorage.getItem("@Employee"));

    const { loadingErrorsFiles, openSnackBarFun, setHaveErrors, setLoadingErrorsFun } = useContext(SnackBarContext);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);
    const [msgError, setMsgError] = useState('');
    const [loading, setLoading] = useState(false);
    const [startIndex, setStartIndex] = useState(5);
    const [updateAll, setUpdateAll] = useState('false');
    const [professional, setProfessional] = useState({});
    const [professionals, setProfessionals] = useState([]);
    const [errorsProfessionals, setErrorsProfessionals] = useState([]);

    useEffect(() => {
        if(!loadingErrorsFiles.inRace) {
            inProfessionals();
            setStartIndex(5);
            setErrorsProfessionals([]);
        }
    }, [loadingErrorsFiles.inRace, dateBpa, refresh]);

    async function inProfessionals() {
        try {
            const response = await api.post("/bpa/inconsistency/professionals", { "dateBPA": dateBpa });
            setProfessionals(response.data);
            setErrorsProfessionals(response.data.slice(0, 5));
            setHaveErrors("inProfessionals", response.data.length > 0);
        } catch (e) {
            setHaveErrors("inProfessionals", false);
        }
        setLoadingErrorsFun("inProfessionals", false);
    }

    async function update() {
        setLoading(true);
        try {
            const cnsmedOld = professionals.find(item => item.id === professional.id).cnsmed;
            await api.post(`/bpai/update/${professional.id}/${employee.key}`, { "cnsmed": (professional.cnsmed + "-" + (updateAll === 'false' ? '0' : '1') + "-" + cnsmedOld), "dateBpa": dateBpa, "key": "cnsmedProfessional"});
            setUpdateAll('false');
            await inProfessionals();
            handleClose();
            openSnackBarFun(false, "CNSMED salvo");
        } catch (e) {
            const response = e.response.data;
            
            switch (response) {
                case "FORBIDDEN":
                    openSnackBarFun(true, "Você não tem autorização para continuar com essa ação");
                    break;
                default: {
                    setUpdateAll('false');
                    setMsgError("Ops, algo deu errado");
                }
            }
            setError(true);
        }
        setLoading(false);
    }

    function isValidValue() {
        const cnsmed = professional.cnsmed;

        if(cnsmed.length != 15) {
            setError(true);
            setMsgError("CEP deve conter 8 caracteres");
        } else {
            update();
        }
    }
    
    function handleClickOpen(id) {
        setProfessional(professionals.find(item => item.id === id));
        setOpen(true);
    }

    function handleClose() {
        if(!loading) {
            setOpen(false);
            setUpdateAll('false');
            setError(false);
            setMsgError('');
        }
    }

    function handleChange(event) {
        setUpdateAll(event.target.value);
    }


    return (
        <>
            {
                professionals.length > 0 &&
                    <div className="flex flex-col items-center border-[1px] border-default rounded-md p-2 mt-6">
                        <div className="my-4">
                            <AlertCustom
                                type="error"
                                msg="CNSMED em BPAI não está presente no arquivo de Profissionais"
                            />
                        </div>
                        <div className="text-center font-bold text-sm mb-3">
                            <p>{professionals.length} erros</p>
                        </div>
                        <div className="flex flex-col items-center w-full">
                            {
                                errorsProfessionals.map((item, index) => (
                                    <div key={index} className="w-3/4 mt-4">
                                        <div className="flex justify-between items-end font-bold">
                                            <p className="">
                                                PA: {item.pa}
                                            </p>
                                            <div className="flex flex-col justify-end font-bold">
                                                <p className="mr-2">
                                                    SEQ: {item.seq}
                                                </p>
                                                <p>
                                                    FOLHA: {item.flh}
                                                </p>
                                                <div className="flex items-center">
                                                    <p>
                                                        CONTAGEM: {item.count}
                                                    </p>
                                                    <div className="mx-1 mb-1">
                                                        {
                                                            item.count > 10 &&
                                                                <Tooltip title="Contagem muito alta, pode ser que o CNSMED tenha sido atualizado">
                                                                    <ReportProblemOutlinedIcon sx={{ fontSize: 17, color: "red" }}/>
                                                                </Tooltip>
                                                        }
                                                    </div>
                                                    <Tooltip title="Contagem de ocorrencia desse CNSMED no arquivo BPAI" className="">
                                                        <HelpOutlineIcon sx={{ fontSize: 17 }}/>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </div>
                                        <div key={index} className="flex justify-between items-center border-[1px] border-red-500 rounded-md p-2 my-2">
                                            <div className="">
                                                <p>
                                                    CNSMED INVÁLIDO: {maskPointThree(item.cnsmed)}
                                                </p>
                                            </div>
                                            <div className="cursor-pointer" onClick={() => handleClickOpen(item.id)}>
                                                <EditIcon />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                            {
                                startIndex < professionals.length && (
                                    <div className="flex justify-center w-full my-10">
                                        <Button
                                            variant="contained"
                                            endIcon={<SouthIcon />}
                                            onClick={() => loadMoreErrors()}
                                        >
                                            Mostrar mais
                                        </Button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
            }
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle >Editar CNSMED</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    {
                        updateAll === 'false' ?
                            `Edite o campo CNSMED da folha ${professional.flh} sequência ${professional.seq}`
                        :
                            `Atuliza todas as ocorrências desse CNSMED no arquivo BPAI`
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
                    </div>
                    <div className="flex items-center">
                        <Radio
                            checked={updateAll === 'true'}
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
                        label="CNSMED"
                        type="text"
                        variant="standard"
                        error={error}
                        value={professional.cnsmed}
                        helperText={msgError}
                        onChange={ e => {
                            setError(false);
                            setMsgError('');
                            if(!isNaN(Number(e.target.value)) && e.target.value.length <= 15) setProfessional({...professional, ["cnsmed"]: e.target.value});
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

export default InProfessionals;
