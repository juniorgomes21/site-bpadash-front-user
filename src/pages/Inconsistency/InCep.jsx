import React, { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import AlertCustom from "../../GlobalComponents/AlertCustom";
import EditIcon from '@mui/icons-material/Edit';
import { formatarCEP } from "../../Validation&Formatation/formatation";
import SnackBarContext from "../../contexts/managerService";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import LoadingButton from "@mui/lab/LoadingButton";

function InCep({ dateBpa }) {

    const { openSnackBarFun } = useContext(SnackBarContext);
    const [open, setOpen] = useState(false);
    const [cep, setCep] = useState({});
    const [ceps, setCeps] = useState([]);
    const [error, setError] = useState(false);
    const [msgError, setMsgError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        inCep();
    }, [dateBpa]);

    async function inCep() {
        try {
            const obj = {
                "dateBPA": dateBpa
            }
            const response = await api.post("/bpa/inconsistency/cep", obj);
            setCeps(response.data);

        } catch (e) {
            console.log("error", e.response);
        }
    }

    async function update() {
        setLoading(true);
        try {
            const obj = {
                "cep": cep.cepInvalid
            }
            await api.post(`/bpai/update/${cep.id}`, obj);
            await inCep();
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
        const cepx = cep.cepInvalid;

        if(cepx.length != 8) {
            setError(true);
            setMsgError("CEP deve conter 8 caracteres");
        } else {
            update();
        }
    }
    
    function handleClickOpen(id) {
        setCep(ceps.find(item => item.id === id));
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
                ceps.length > 0 &&
                    <div className="flex flex-col items-center border-[1px] border-default rounded-md p-2 mt-6">
                        <div className="my-4">
                            <AlertCustom
                                type="error"
                                msg="CEP de BPAI não encontrados no arquico de CEPs"
                            />
                        </div>
                        <div className="flex flex-col items-center w-full">
                            {
                                ceps.map((item, index) => (
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
                                                    CEP INVÁLIDO: {formatarCEP(item.cepInvalid)}
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
                        type="number"
                        variant="standard"
                        error={error}
                        value={cep.cepInvalid}
                        helperText={msgError}
                        onChange={ e => {
                            setError(false);
                            setMsgError('');
                            const inputValue = e.target.value;
                            const numericValue = inputValue.replace(/\D/g, '');
                            if(numericValue.length <= 8) setCep({...cep, ["cepInvalid"]: numericValue})
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

export default InCep;