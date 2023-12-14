import React, { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import AlertCustom from "../../GlobalComponents/AlertCustom";
import EditIcon from '@mui/icons-material/Edit';
import { formatDateString, formatDate } from "../../Validation&Formatation/formatation";
import { Col, FormGroup, Label, Row } from "reactstrap";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from "@mui/lab/LoadingButton";
import DatePicker from "react-datepicker";
import SnackBarContext from "../../contexts/managerService";

function AgeDate({ dateBpa }) {

    const { openSnackBarFun } = useContext(SnackBarContext);
    const [person, setPerson] = useState({});
    const [ageDate, setAgeDate] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [msgError, setMsgError] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        inAgeDate();
    }, [dateBpa]);

    async function inAgeDate() {
        try {
            const obj = {
                "dateBPA": dateBpa
            }
            const response = await api.post("/bpa/inconsistency/date/age", obj);
            setAgeDate(response.data);

        } catch (e) {
            console.log("error", e.response);
        }
    }

    async function updatePA() {
        setLoading(true);
        try {
            const obj = {
                "date": startDate.toLocaleDateString().split("/")[2] + startDate.toLocaleDateString().split("/")[1] + startDate.toLocaleDateString().split("/")[0]
            }
            console.log(person.id);
            await api.post(`/bpai/update/${person.id}`, obj);
            await inAgeDate();
            handleClose();
            openSnackBarFun(false, "Nova data salva");
        } catch (e) {
            console.log(e);
            setMsgError("Ops, algo deu errado");
            setError(true);
        }
        setLoading(false);
    }

    function isValidValue() {
        if(startDate.toLocaleDateString().length == 10 && Number.parseInt(startDate.toLocaleDateString().split("/")[2]) > 1900) {
            updatePA();
        } else {
            setError(true);
            setMsgError("Data inválida");
        }
    }

    function handleClickOpen(id, date) {
        setStartDate(date);
        setPerson(ageDate.find(person => person.id === id));
        setOpen(true);
    }

    function handleClose() {
        if(!loading) {
            setOpen(false);
            setError(false);
            setMsgError('');
        }
    }

    function startDateChange(date) {
        setStartDate(date);
    }

    function calculateDateBirth(age, dateInvalid) {
        const dataCurrent = new Date();
        const yearCurrent = dataCurrent.getFullYear();
        const yearNasc = yearCurrent - age;
      
        // Formatar a data de nascimento
        const birthDate = new Date(yearNasc, dateInvalid.split("-")[1], dateInvalid.split("-")[2]);

        return birthDate;
    }

    return (
        <>
            {
                ageDate.length > 0 &&
                    <div className="flex flex-col items-center border-[1px] border-default rounded-md p-2">
                        <div className="my-4">
                            <AlertCustom
                                type="error"
                                msg="A data de nascimento em BPAI não pode ser inferior a 1900 ou superior a data atual"
                            />
                        </div>
                        <div className="flex flex-col items-center w-full">
                            {
                                ageDate.map((item, index) => (
                                        item.msg.includes("FORMATION DATE") ?
                                        <div key={index} className="w-3/4 mt-4">
                                            <div className="flex justify-between items-end font-bold">
                                                <p className="">
                                                    NOME: {item.name}
                                                </p>
                                                <div>
                                                    <p>
                                                        SEQ: {item.seq}
                                                    </p>
                                                    <p className="mr-2">
                                                        FOLHA: {item.flh}
                                                    </p>
                                                    <p>
                                                        IDADE: {item.age}
                                                    </p>
                                                    <p>
                                                        DATA NASC: {calculateDateBirth(item.age, item.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div key={index} className="flex justify-between items-center border-[1px] border-red-500 rounded-md p-2 my-2">
                                                <div>
                                                    <p>
                                                        DATA INVÁLIDA: {formatDateString(item.date, true)}
                                                    </p>
                                                </div>
                                                <div className="cursor-pointer" onClick={() => handleClickOpen(item.id, calculateDateBirth(item.age, item.date))}>
                                                    <EditIcon />
                                                </div>
                                            </div>
                                        </div>
                                    :
                                        <div key={index} className="w-3/4 mt-4">
                                            <div className="flex justify-between items-end font-bold">
                                                <p className="">
                                                    NOME: {item.name}
                                                </p>
                                                <div>
                                                    <p>
                                                        SEQ: {item.seq}
                                                    </p>
                                                    <p className="mr-2">
                                                        FOLHA: {item.flh}
                                                    </p>
                                                    <p>
                                                        IDADE: {item.age}
                                                    </p>
                                                    <p>
                                                        DATA NASC: {calculateDateBirth(item.age, item.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div key={index} className="flex justify-between items-center border-[1px] border-red-500 rounded-md p-2 my-2">
                                                <div className="">
                                                    <p>
                                                        DATA INVÁLIDA: {formatDateString(item.date, true)}
                                                    </p>
                                                </div>
                                                <div className="cursor-pointer" onClick={() => handleClickOpen(item.id, calculateDateBirth(item.age, item.date))}>
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
                <DialogTitle>EDITAR DATA</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Edite a data de nascimento do BPAI da folha {person.flh} sequência {person.seq}
                </DialogContentText>
                <div className="mt-3 h-64">
                    <FormGroup className="mb-4" row>
                        <Label className="col-form-label col-lg-2">
                            Data
                        </Label>
                        <Col lg="10">
                            <Row>
                                <Col className="flex justify-end">
                                    <DatePicker
                                        className="form-control"
                                        selected={startDate}
                                        onChange={startDateChange}
                                        dateFormat="dd/MM/yyyy"
                                        showYearDropdown
                                        scrollableYearDropdown
                                        yearDropdownItemNumber={15}
                                        maxDate={new Date()}
                                        isClearable
                                    />
                                </Col>
                            </Row>
                            {
                                error &&
                                    <div className="text-red-500">
                                        <p>Data inválida!</p>
                                    </div>
                            }
                        </Col>
                    </FormGroup>
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

export default AgeDate;