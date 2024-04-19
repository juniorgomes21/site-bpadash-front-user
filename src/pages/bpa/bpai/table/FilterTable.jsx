import React, { useContext, useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import { useForm, Controller } from "react-hook-form";
import { Button } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import SnackBarContext from "../../../../contexts/managerService";


function FilterTable() {

    const valuesFilter = JSON.parse(localStorage.getItem("@FilterTable"));

    const { openSnackBarFun } = useContext(SnackBarContext);
    const {
        control,
        setValue,
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [raceIn, setRaceIn] = useState(Number(valuesFilter["race"]) + 1);
    const [sexIn, setSexIn] = useState(valuesFilter["sex"] === "M" ? 2 : valuesFilter["sex"] === "F" ? 3 : 1);

    useEffect(() => {
        setValuesFilter();
    }, [])

    function setValuesFilter() {
        setValue("pa", valuesFilter["pa"]);
        setValue("cnes", valuesFilter["cnes"]);
        setValue("cnsmed", valuesFilter["cnsmed"]);
        setValue("cbo", valuesFilter["cbo"]);
        setValue("ibge", valuesFilter["ibge"]);
        setValue("sex", valuesFilter["sex"]);
        setValue("race", valuesFilter["race"]);
    }

    function handleChangeRace(event) { 
        const value = Number(event.target.value);
        setRaceIn(value);
        setValue("race", getRace(value));
    }

    function handleChangeSex(event) { 
        const value = Number(event.target.value);
        setSexIn(value);
        setValue("sex", getSex(value));
    }

    function getRace(value) {
        switch (value) {
            case 0 : return "00";
            case 2 : return "01";
            case 3 : return "02";
            case 4 : return "03";
            case 5 : return "04";
            case 6 : return "05";
            default: return "99";
        }
    }

    function getSex(value) {
        switch (value) {
            case 1 : return "";
            case 2 : return "M";
            case 3 : return "F";
        }
    }

    function saveForm(data) {
        localStorage.setItem("@FilterTable", JSON.stringify(data));
        openSnackBarFun(false, "Filtro salvo!");
    }

    return (
        <div className="flex flex-col items-center w-full">
            <p className="mt-3 font-bold">
                Preencha um ou mais inputs e salve para filtrar a tabela. Você também pode pesquisar por um único paciente <a href="/file/consult/customers" className="text-blue-400">aqui</a>
            </p>
            <div className="my-10 border-[1px] border-default rounded-lg p-4">
                <form  onSubmit={handleSubmit(saveForm)}>
                    <div className="flex justify-center w-60">
                        <TextField
                            fullWidth
                            label="PA"
                            variant="outlined"
                            size="small"
                            inputProps={{ maxLength: 10 }}
                            error={errors.pa && true}
                            {...register("pa", {
                                minLength: {
                                    value: 10,
                                    message: "O PA deve conter 10 caracteres"
                                },
                                maxLength: {
                                    value: 10,
                                    message: "O PA deve conter 10 caracteres"
                                }
                            })}
                            helperText={ errors.pa && errors.pa.message }
                        />
                    </div>
                    <div className="flex justify-center w-60 mt-3">
                        <TextField
                            fullWidth
                            label="CNES"
                            variant="outlined"
                            size="small"
                            inputProps={{ maxLength: 7 }}
                            error={errors.cnes && true}
                            {...register("cnes", {
                                minLength: {
                                    value: 7,
                                    message: "O CNES deve conter 7 caracteres"
                                },
                                maxLength: {
                                    value: 7,
                                    message: "O CNES deve conter 7 caracteres"
                                }
                            })}
                            helperText={ errors.cnes && errors.cnes.message }
                        />
                    </div>
                    <div className="flex justify-center w-60 mt-3">
                        <TextField
                            fullWidth
                            label="CNSMED"
                            variant="outlined"
                            size="small"
                            inputProps={{ maxLength: 15 }}
                            error={errors.cnsmed && true}
                            {...register("cnsmed", {
                                minLength: {
                                    value: 15,
                                    message: "O CNSMED deve conter 15 caracteres"
                                },
                                maxLength: {
                                    value: 15,
                                    message: "O CNSMED deve conter 15 caracteres"
                                }
                            })}
                            helperText={ errors.cnsmed && errors.cnsmed.message }
                        />
                    </div>
                    <div className="flex justify-center w-60 mt-3">
                        <TextField
                            fullWidth
                            label="CBO"
                            variant="outlined"
                            size="small"
                            inputProps={{ maxLength: 6 }}
                            error={errors.cbo && true}
                            {...register("cbo", {
                                minLength: {
                                    value: 6,
                                    message: "O CBO deve conter 6 caracteres"
                                },
                                maxLength: {
                                    value: 6,
                                    message: "O CBO deve conter 6 caracteres"
                                }
                            })}
                            helperText={ errors.cbo && errors.cbo.message }
                        />
                    </div>
                    <div className="flex justify-center w-60 mt-3">
                        <FormControl
                            fullWidth
                            size="small"
                        >
                            <InputLabel id="demo-select-label">SEXO</InputLabel>
                            <Controller
                                name="sex"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="demo-select-label"
                                        label="SEXO"
                                        value={String(sexIn)}
                                        onChange={handleChangeSex}
                                    >
                                        <MenuItem value={1}>SEM FILTRO</MenuItem>
                                        <MenuItem value={2}>M</MenuItem>
                                        <MenuItem value={3}>F</MenuItem>
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </div>
                    <div className="flex justify-center w-60 mt-3">
                        <TextField
                            fullWidth
                            label="IBGE"
                            variant="outlined"
                            size="small"
                            error={errors.ibge && true}
                            {...register("ibge", {
                                minLength: {
                                    value: 6,
                                    message: "O IBGE deve conter 6 caracteres"
                                },
                                maxLength: {
                                    value: 6,
                                    message: "O IBGE deve conter 6 caracteres"
                                }
                            })}
                            helperText={ errors.ibge && errors.ibge.message }
                        />
                    </div>
                    <div className="flex justify-center w-60 mt-3">
                        <FormControl
                            fullWidth
                            size="small"
                        >
                            <InputLabel id="demo-select-label">Raça</InputLabel>
                            <Controller
                                name="race"
                                control={control}
                                defaultValue="00"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="demo-select-label"
                                        label="Raça"
                                        value={String(raceIn)}
                                        onChange={handleChangeRace}
                                    >
                                        <MenuItem value={1}>SEM FILTRO</MenuItem>
                                        <MenuItem value={2}>BRANCA</MenuItem>
                                        <MenuItem value={3}>PRETA</MenuItem>
                                        <MenuItem value={4}>PARDA</MenuItem>
                                        <MenuItem value={5}>AMARELA</MenuItem>
                                        <MenuItem value={6}>INDÍGENA</MenuItem>
                                        <MenuItem value={99}>SEM INFORMAÇÃO</MenuItem>
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </div>
                    <div className="mt-4">
                        <Button
                            fullWidth
                            type="submit"
                            color="success"
                            variant="contained"
                        >
                            Salvar Filtro
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FilterTable;
