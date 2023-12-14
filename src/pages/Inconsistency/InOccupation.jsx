import React, { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import AlertCustom from "../../GlobalComponents/AlertCustom";
import EditIcon from '@mui/icons-material/Edit';
import { formatCode3 } from "../../Validation&Formatation/formatation";
import SnackBarContext from "../../contexts/managerService";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from "@mui/lab/LoadingButton";
import Button from '@mui/material/Button';

function InOccupation({ dateBpa }) {

    const { reloadErrors, openSnackBarFun } = useContext(SnackBarContext);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);
    const [msgError, setMsgError] = useState('');
    const [loading, setLoading] = useState(false);
    const [occupation, setOccupation] = useState({});
    const [occupations, setOccupations] = useState({"errorsOccupationBpacDTOS": [], "errorsOccupationBpaiDTOS": []});


    useEffect(() => {
        inOccupation();
    }, [dateBpa, reloadErrors]);


    async function inOccupation() {
        try {
            const obj = {
              "dateBPA": dateBpa
            }
            const response = await api.post("/bpa/inconsistency/occupation", obj);
            setOccupations(response.data);
        } catch (e) {
            console.log("error", e.response);
        }
    }

    async function update() {
        setLoading(true);
        const arqName = occupation.msg.includes("BPAC") ? "bpac" : "bpai";

        try {
            const obj = {
                "cbo": occupation.cbo
            }
            await api.post(`/${arqName}/update/${occupation.id}`, obj);
            await inOccupation();
            handleClose();
            openSnackBarFun(false, "CBO salvo");
        } catch (e) {
            console.log(e);
            setMsgError(e.response.data[0] && e.response.data[0].message);
            setError(true);
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
                                    <div className="font-bold">
                                        <p>BPAC - CBO</p>
                                    </div>
                            }
                            {
                                occupations["errorsOccupationBpacDTOS"].map((item, index) => (
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
                                                        CBO INVÁLIDO: {formatCode3(item.cbo)}
                                                    </p>
                                                </div>
                                                <div className="cursor-pointer" onClick={() => handleClickOpen("errorsOccupationBpacDTOS", item.id)}>
                                                    <EditIcon />
                                                </div>
                                            </div>
                                        </div>
                                ))
                            }
                        </div>
                        <div className="flex flex-col items-center w-full">
                            {
                                occupations["errorsOccupationBpaiDTOS"].filter(itemx => itemx.msg === "NOT EXIST CBO IN OCCUPATION BPAI").length > 0 &&
                                    <div className="font-bold mt-4">
                                        <p>BPAI - CBO</p>
                                    </div>
                            }
                            {
                                occupations["errorsOccupationBpaiDTOS"].map((item, index) => (
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
                                                        CBO INVÁLIDO: {formatCode3(item.cbo)}
                                                    </p>
                                                </div>
                                                <div className="cursor-pointer" onClick={() => handleClickOpen("errorsOccupationBpaiDTOS", item.id)}>
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
                <DialogTitle>EDITAR CBO</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Edite o campo CBO da folha {occupation.flh} sequência {occupation.seq}
                </DialogContentText>
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
                        onChange={e => {
                            setError(false);
                            setMsgError('');
                            const inputValue = e.target.value;
                            if(inputValue.length <= 6) setOccupation({...occupation, ["cbo"]: e.target.value});
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