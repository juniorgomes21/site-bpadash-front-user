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
import SouthIcon from '@mui/icons-material/South';


function InRace({ dateBpa }) {

    const { openSnackBarFun, setHaveErrors, setLoadingErrorsFun } = useContext(SnackBarContext);
    const [age, setAge] = useState('');
    const [open, setOpen] = useState({ "single": false, "all": false });
    const [race, setRace] = useState({});
    const [races, setRaces] = useState([]);
    const [errorsRaces, setErrorsRaces] = useState([]);
    const [error, setError] = useState(false);
    const [msgError, setMsgError] = useState('');
    const [loading, setLoading] = useState(false);
    const [startIndex, setStartIndex] = useState(5);


    useEffect(() => {
        inRace();
        setStartIndex(5);
    }, [dateBpa]);

    async function inRace() {
        try {
            const obj = {
              "dateBPA": dateBpa
            }
            const response = await api.post("/bpa/inconsistency/race", obj);
            setRaces(response.data);
            setErrorsRaces(response.data.slice(0, 5));
            setHaveErrors("inRace", response.data.length > 0);
        } catch (e) {
            console.log("error", e.response);
        }
        setLoadingErrorsFun("inRace", false);
    }

    async function update() {
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
            update();
        }
    }
    
    function handleClickOpen(id, dialogAll) {
        if(dialogAll) {
            setOpen({ ...open, "all": true });
        } else {
            setRace(races.find(item => item.id === id));
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

    function handleChange(event) {
        const raceSelect = event.target.value;
        setAge(raceSelect);
        setRace({ ...race, ["raceInvalid"]: raceSelect});
    }

    function loadMoreErrors() {
        const nextErrors = races.slice(startIndex, startIndex + 5);

        // Adicionar os próximos erros à lista de erros exibidos
        setErrorsRaces( prevErrors => [...prevErrors, ...nextErrors]);
    
        // Atualizar o índice para o próximo conjunto de erros
        setStartIndex(startIndex + 5);
    }


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
                        <div className="text-center font-bold text-sm mb-3">
                            <p>{races.length} erros</p>
                        </div>
                        {/* <div className="flex justify-center w-full">
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleClickOpen(0, true)}
                            >
                                Atualizar todos
                            </Button>
                        </div> */}
                        <div className="flex flex-col items-center w-full">
                            {
                                errorsRaces.map((item, index) => (
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
                                            <div className="cursor-pointer" onClick={() => handleClickOpen(item.id, false)}>
                                                <EditIcon />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                            {
                                startIndex < races.length && (
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
            <Dialog open={open.single} onClose={handleClose}>
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
            <Dialog open={open.all} onClose={handleClose}>
                <DialogTitle>EDITAR TODOS</DialogTitle>
                <DialogContent>
                <AlertCustom
                    type="warning"
                    msg={`Todos os ${races.length} erros serão atualizados`}
                />
                <div className="border-[1px] border-orange-400 rounded-md mt-4 p-4">
                    <p className="text-center">
                        ATENÇÃO, a raça dos paciêntes será atualizada de acordo com procedimentos antigos.
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

export default InRace;