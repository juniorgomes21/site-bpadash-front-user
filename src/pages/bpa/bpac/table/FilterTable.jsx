import React, { useContext, useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import { useForm } from "react-hook-form";
import { Button } from "@mui/material";
import SnackBarContext from "../../../../contexts/managerService";


function FilterTable() {

    const valuesFilter = JSON.parse(localStorage.getItem("@FilterTableBpac"));

    const { openSnackBarFun } = useContext(SnackBarContext);
    const {
        setValue,
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        setValuesFilter();
    }, [])

    function setValuesFilter() {
        setValue("pa", valuesFilter["pa"]);
        setValue("cnes", valuesFilter["cnes"]);
        setValue("cbo", valuesFilter["cbo"]);
    }

    function saveForm(data) {
        localStorage.setItem("@FilterTableBpac", JSON.stringify(data));
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
