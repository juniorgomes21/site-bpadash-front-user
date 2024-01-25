import React, { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import AlertCustom from "../../GlobalComponents/AlertCustom";
import SnackBarContext from "../../contexts/managerService";
import LoadingButton from "@mui/lab/LoadingButton";
import SouthIcon from '@mui/icons-material/South';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

function InProcedure({ dateBpa, refresh }) {

    const { loadingErrorsFiles, reloadErrors, setHaveErrors, openSnackBarFun, setLoadingErrorsFun } = useContext(SnackBarContext);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [procedures, setProcedures] = useState({"errorsPaBpac": [], "errorsSexBpai": []});
    const [errorsProcedures, setErrorsProcedures] = useState([]);
    const [startIndex, setStartIndex] = useState(5);

    useEffect(() => {
        if(!loadingErrorsFiles.inProfessionals) {
            inProcedure();
            setStartIndex(5);
            setErrorsProcedures([]);
        }
    }, [loadingErrorsFiles.inProfessionals, dateBpa, refresh, reloadErrors]);


    async function inProcedure() {
        try {
            const response = await api.post("/bpa/inconsistency/procedure", { "dateBPA": dateBpa });
            setProcedures(response.data);
            setErrorsProcedures(response.data["errorsSexBpai"].slice(0, 5));
            setHaveErrors("inProcedure", response.data.length > 0);
        } catch (e) {
            console.log("error", e.response);
        }
        setLoadingErrorsFun("inProcedure", false);
    }

    async function update() {
        setLoading(true);
        try {
            const lengthSerives = procedures["errorsSexBpai"].length;
            const ids = [];
            procedures.errorsSexBpai.forEach( procedure => {
                ids.push(procedure.id);
            });
            await api.post(`/bpai/update/${0}`, { "ids": ids, "key": "sexProcedure" });
            await inProcedure();
            openSnackBarFun(false, lengthSerives > 1 ? "Sexos Alterados" : "Sexo Alterado");
        } catch(e) {
            console.log(e);
            openSnackBarFun();
        }
        setLoading(false);
    }

    function loadMoreErrors() {
        const nextErrors = procedures["errorsSexBpai"].slice(startIndex, startIndex + 5);

        // Adicionar os próximos erros à lista de erros exibidos
        setErrorsProcedures( prevErrors => [...prevErrors, ...nextErrors]);
    
        // Atualizar o índice para o próximo conjunto de erros
        setErrorsProcedures(startIndex + 5);
    }

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        if(!loading) {
            setOpen(false);
        }
    }

    return (
        <>
            {
                procedures["errorsSexBpai"].length > 0 &&
                    <div className="flex flex-col items-center border-[1px] border-default rounded-md p-2 mt-6">
                        <div className="my-4">
                            <AlertCustom
                                type="error"
                                msg="Campo SEXO de BPAI não compativel em procedimentos"
                            />
                            <div className="text-center font-bold text-sm my-3">
                                <p>{procedures["errorsSexBpai"].length} erros</p>
                            </div>
                            <div className="flex justify-center w-full">
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleClickOpen}
                                >
                                    CORRIGIR TODOS OS SEXOS
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col items-center w-full">
                            {
                                procedures["errorsSexBpai"].length == 0 &&
                                    <div className="font-bold mt-8">
                                        <p>BPAI</p>
                                    </div>
                            }
                            {
                                errorsProcedures.map((item, index) => (
                                    item.msg.includes("ERROR SEX") &&
                                        <div key={index} className="w-3/4 mt-2">
                                            <div className="flex justify-between items-end font-bold">
                                                <p className="">
                                                    SEXO ESPERADO: "{item.sexCurrent}"
                                                </p>
                                                <div className="flex">
                                                    <p className="mr-2">
                                                        SEQ: {item.seq}
                                                    </p>
                                                    <p>
                                                        FOLHA: {item.flh}
                                                    </p>
                                                </div>
                                            </div>
                                            <div key={index} className="flex justify-start items-center border-[1px] border-red-500 rounded-md p-2 my-2">
                                                <div className="">
                                                    <p>
                                                        SEXO INVÁLIDO: "{item.sexInvalid}"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                ))
                            }
                            { startIndex < procedures["errorsSexBpai"].length && (
                                <div className="flex justify-center w-full my-10">
                                    <Button
                                        variant="contained"
                                        endIcon={<SouthIcon />}
                                        onClick={loadMoreErrors}
                                    >
                                        Mostrar mais
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
            }
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>EDITAR TODOS</DialogTitle>
                <DialogContent>
                <AlertCustom
                    type="warning"
                    msg={`Todos os ${procedures.errorsSexBpai.length} erros serão atualizados`}
                />
                <div className="border-[1px] border-orange-400 rounded-md mt-4 p-4">
                    <p className="text-center">
                        ATENÇÃO, a atualização do sexo é baseada no sexo esperado no procedimento.
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
                    onClick={update}
                >
                    Atualizar
                </LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default InProcedure;