import React, { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import AlertCustom from "../../GlobalComponents/AlertCustom";
import EditIcon from '@mui/icons-material/Edit';
import SnackBarContext from "../../contexts/managerService";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import LoadingButton from "@mui/lab/LoadingButton";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function InRace({ dateBpa }) {

    const { openSnackBarFun } = useContext(SnackBarContext);
    const [age, setAge] = useState('');
    const [open, setOpen] = useState(false);
    const [race, setRace] = useState({});
    const [races, setRaces] = useState([]);
    const [error, setError] = useState(false);
    const [msgError, setMsgError] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        inRace();
    }, [dateBpa]);

    async function inRace() {
        try {
            const obj = {
              "dateBPA": dateBpa
            }
            const response = await api.post("/bpa/inconsistency/race", obj);
            setRaces(response.data);
    
        } catch (e) {
            console.log("error", e.response);
        }
    }

    async function updatePA() {
        setLoading(true);
        try {
            const obj = {
                "race": race.raceInvalid
            }
            await api.post(`/bpai/update/${race.id}`, obj);
            await inRace();
            handleClose();
            openSnackBarFun(false, "Raça alterada");
        } catch (e) {
            console.log(e.response);
            setMsgError("Ops, algo deu errado");
            setError(true);
        }
        setLoading(false);
    }

    function isValidValue() {
        const racesValids = ["01", "02", "03", "04", "05"];

        if(!racesValids.includes(race.raceInvalid)) {
            setError(true);
            setMsgError("Valores válidos para raça 01, 02, 03, 04, 05");
        } else {
            updatePA();
        }
    }
    
    function handleClickOpen(id) {
        setRace(races.find(item => item.id === id));
        setOpen(true);
    };

    function handleClose() {
        if(!loading) {
            setOpen(false);
            setError(false);
            setMsgError('');
        }
    };

    function handleChange(event) {
        const raceSelect = event.target.value;
        setAge(raceSelect);
        setRace({ ...race, ["raceInvalid"]: raceSelect});
    };

    return (
        <>
            {
                races.length > 0 &&
                    <div className="flex flex-col items-center border-[1px] border-default rounded-md p-2 mt-6">
                        <div className="my-4">
                            <AlertCustom
                                type="error"
                                msg="A raça em BPAI é diferente de 01, 02, 03, 04, 05"
                            />
                        </div>
                        <div className="flex flex-col items-center w-full">
                            {
                                races.map((item, index) => (
                                    <div key={index} className="w-3/4 mt-4">
                                        <div className="flex justify-between font-bold">
                                            <p className="">
                                                NOME: {item.name}
                                            </p>
                                            <div className="flex justify-end font-bold">
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
                                                    RAÇA INVÁLIDA: {item.raceInvalid}
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
                <DialogTitle>EDITAR RAÇA</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Edite o campo raça da folha {race.flh} sequência {race.seq}
                    </DialogContentText>
                    <div className="mt-3">
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Raça</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={race.raceInvalid}
                                error={error}
                                label="Raça"
                                onChange={handleChange}
                            >
                                <MenuItem value={"01"}>01</MenuItem>
                                <MenuItem value={"02"}>02</MenuItem>
                                <MenuItem value={"03"}>03</MenuItem>
                                <MenuItem value={"04"}>04</MenuItem>
                                <MenuItem value={"05"}>05</MenuItem>
                            </Select>
                        </FormControl>
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

export default InRace;