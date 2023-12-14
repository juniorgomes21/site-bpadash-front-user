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

function AgeMinMax({ dateBpa }) {

    const { openSnackBarFun } = useContext(SnackBarContext);
    const [ageMaxMin, setAgeMaxMin] = useState({});
    const [ageMaxMins, setAgeMaxMins] = useState([]);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);
    const [msgError, setMsgError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        inAgeMaxMin();
    }, [dateBpa]);

    async function inAgeMaxMin() {
        try {
            const obj = {
              "dateBPA": dateBpa
            }
            const response = await api.post("/bpa/inconsistency/date/procedure", obj);
            setAgeMaxMins(response.data);
        } catch (e) {
            console.log("error", e.response);
        }
    }

    async function update() {
        setLoading(true);
        try {
            const obj = {
                "age": ageMaxMin.age
            }
            await api.post(`/bpai/update/${ageMaxMin.id}`, obj);
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
            update();
        }
    }
    
    function handleClickOpen(id) {
        setAgeMaxMin(ageMaxMins.find(item => item.id === id));
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
                ageMaxMins.length > 0 &&
                    <div className="flex flex-col items-center border-[1px] border-default rounded-md p-2 mt-6">
                        <div className="my-4">
                            <AlertCustom
                            type="error"
                            msg="Idade em BPAI não está dentro do intervalo de idade máxima e mínima do arquivo de procedimentos"
                            />
                        </div>
                        <div className="flex flex-col items-center w-full">
                            {
                                ageMaxMins.map((item, index) => (
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
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center border-[1px] border-red-500 rounded-md p-2 my-2">
                                            <div>
                                                <p>
                                                    IDADE INVÁLIDA: {item.age}
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
                        type="number"
                        variant="standard"
                        error={error}
                        value={ageMaxMin.age}
                        helperText={msgError}
                        onChange={ e => {
                            setError(false);
                            setMsgError('');
                            const inputValue = e.target.value;
                            const numericValue = inputValue.replace(/\D/g, '');
                            if(numericValue.length <= 3) setAgeMaxMin({...ageMaxMin, ["age"]: numericValue})
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

export default AgeMinMax;