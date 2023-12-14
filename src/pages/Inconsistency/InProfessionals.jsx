import React, { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import AlertCustom from "../../GlobalComponents/AlertCustom";
import EditIcon from '@mui/icons-material/Edit';
import { formatCode3, formatDateString } from "../../Validation&Formatation/formatation";
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


function InProfessionals({ dateBpa }) {

    const { openSnackBarFun } = useContext(SnackBarContext);
    const [professional, setProfessional] = useState({});
    const [professionals, setProfessionals] = useState([]);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);
    const [msgError, setMsgError] = useState('');
    const [loading, setLoading] = useState(false);
    const [updateAll, setUpdateAll] = useState('false');

    useEffect(() => {
        inProfessionals();
    }, [dateBpa]);

    async function inProfessionals() {
        try {
            const obj = {
              "dateBPA": dateBpa,
            }
            const response = await api.post("/bpa/inconsistency/professionals", obj);
            setProfessionals(response.data);
    
        } catch (e) {
            console.log("error", e.response);
        }
    }

    async function updatePA() {
        setLoading(true);
        try {
            const cnsmedA = professionals.find(item => item.id === professional.id).cnsmed;
            const obj = {
                "cnsmed": professional.cnsmed + "-" + (updateAll === 'false' ? '0' : '1') + "-" + cnsmedA
            }
            await api.post(`/bpai/update/${professional.id}`, obj);
            setUpdateAll('false');
            await inProfessionals();
            handleClose();
            openSnackBarFun(false, "CNSMED salvo");
        } catch (e) {
            console.log(e.response);
            setUpdateAll('false');
            setMsgError("Ops, algo deu errado");
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
            updatePA();
        }
    }
    
    function handleClickOpen(id) {
        setProfessional(professionals.find(item => item.id === id));
        setOpen(true);
    };

    function handleClose() {
        if(!loading) {
            setOpen(false);
            setUpdateAll('false');
            setError(false);
            setMsgError('');
        }
    };

    function handleChange(event) {
        setUpdateAll(event.target.value);
    };


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
                        <div className="flex flex-col items-center w-full">
                            {
                                professionals.map((item, index) => (
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
                                                    <Tooltip title="Contagem de ocorrencia desse CNSMED no arquivo BPAI" className="mx-1">
                                                        <HelpOutlineIcon sx={{ fontSize: 17 }}/>
                                                    </Tooltip>
                                                    <div className="cursor-pointer">
                                                        {
                                                            item.count > 5 &&
                                                            <Link to="/file/edit/professionals">
                                                                <Tooltip title="Contagem muito alta recomendamos que atualize o CNSMED no arquivo PROFISSIONAIS, clique para atualizar">
                                                                    <ReportProblemOutlinedIcon sx={{ fontSize: 17, color: "red" }}/>
                                                                </Tooltip>
                                                            </Link>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div key={index} className="flex justify-between items-center border-[1px] border-red-500 rounded-md p-2 my-2">
                                            <div className="">
                                                <p>
                                                    CNSMED INVÁLIDO: {formatCode3(item.cnsmed)}
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
                <DialogTitle >EDITAR CNSMED</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Edite o campo CNSMED { updateAll === 'false' && `da folha ${professional.flh} sequência ${professional.seq}`}
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
                    <Tooltip title="Atualiza apenas esse CNSMED">
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
                    <Tooltip title="Atuliza todas as ocorrências desse CNSMED">
                        <HelpOutlineIcon sx={{ fontSize: 20 }}/>
                    </Tooltip>
                    </div>
                </div>
                <div className="mt-3">
                    <TextField
                        fullWidth
                        autoFocus
                        label="CNSMED"
                        type="number"
                        variant="standard"
                        error={error}
                        value={professional.cnsmed}
                        helperText={msgError}
                        onChange={ e => {
                            setError(false);
                            setMsgError('');
                            const inputValue = e.target.value;
                            const numericValue = inputValue.replace(/\D/g, '');
                            if(numericValue.length <= 15) setProfessional({...professional, ["cnsmed"]: numericValue})
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