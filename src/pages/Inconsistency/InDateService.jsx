import React, { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import AlertCustom from "../../GlobalComponents/AlertCustom";
import { formatDateString, unformatDate } from "../../Validation&Formatation/formatation";
import LoadingButton from "@mui/lab/LoadingButton";
import SnackBarContext from "../../contexts/managerService";
import SouthIcon from '@mui/icons-material/South';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


function InDateService({ dateBpa, refresh }) {

    const employee = JSON.parse(localStorage.getItem("@Employee"));

    const { loadingErrorsFiles, openSnackBarFun, setHaveErrors, setLoadingErrorsFun } = useContext(SnackBarContext);
    const [open, setOpen] = useState(false);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorsDates, setErrorsDates] = useState([]);
    const [startIndex, setStartIndex] = useState(5);


    useEffect(() => {
        if(!loadingErrorsFiles.inQtService) {
            inDataService();
            setStartIndex(5);
            setErrorsDates([]);
        }
    }, [loadingErrorsFiles.inQtService, dateBpa, refresh]);

    async function inDataService() {
        try {
            const response = await api.post("/bpa/inconsistency/service", { "dateBPA": dateBpa, "key": "dateBpaInvalid" });
            setServices(response.data);
            setErrorsDates(response.data.slice(0, 5));
            setHaveErrors("inDateService", response.data.length > 0);
        } catch (e) {
            console.log("error", e.response);
        }
        setLoadingErrorsFun("inDateService", false);
    }

    async function update() {
        setLoading(true);
        try {
            const ids = [];
            services.forEach(service => {
                ids.push(service.id);
            });
            await api.post(`/bpai/update/${0}/${employee.key}`, { "dateBpaInvalid": services[0].dateBpa, "ids": ids, "key": "dateBpaInvalid" });
            await inDataService();
            openSnackBarFun(false, ids.length > 1 ? "Datas Alteradas" : "Data Alterada");
            
        } catch(e) {
            const response = e.response.data;
            
            switch (response) {
                case "FORBIDDEN":
                    openSnackBarFun(true, "Você não tem autorização para continuar com essa ação");
                    break;
                default: {
                    openSnackBarFun();
                }
            }
        }
        setLoading(false);
    }

    function loadMoreErrors() {
        const nextErrors = services.slice(startIndex, startIndex + 5);

        // Adicionar os próximos erros à lista de erros exibidos
        setErrorsDates( prevErrors => [...prevErrors, ...nextErrors]);
    
        // Atualizar o índice para o próximo conjunto de erros
        setStartIndex(startIndex + 5);
    }

    return (
        services.length > 0 &&
            <>
                <div className="flex flex-col items-center border-[1px] border-default rounded-md p-2 mt-6">
                    <div className="my-4">
                        <AlertCustom
                            type="error"
                            msg="Data do atendimento BPAI não compatível com o mês do arquivo"
                        />
                    </div>
                    <div className="flex justify-between font-bold">
                        <p className="">
                            DATA BPA VÁLIDA: {formatDateString(services[0].dateBpa, false)}
                        </p>
                    </div>
                    <div className="text-center font-bold text-sm my-3">
                        <p>{services.length} erros</p>
                    </div>
                    <div className="flex justify-center w-full">
                        <LoadingButton
                            variant="contained"
                            color="success"
                            loading={loading}
                            onClick={() => setOpen(true)}
                        >
                            ALTERAR TODAS AS DATAS
                        </LoadingButton>
                    </div>
                    <div className="flex flex-col items-center w-full">
                        {
                            errorsDates.map((item, index) => (
                                <div key={index} className="w-3/4 mt-4">
                                    <div className="flex justify-end font-bold">
                                        <p className="mr-2">
                                            SEQ: {item.seq}
                                        </p>
                                        <p>
                                            FOLHA: {item.flh}
                                        </p>
                                    </div>
                                    <div key={index} className="flex justify-start items-center border-[1px] border-red-500 rounded-md p-2 my-2">
                                        <div className="">
                                            <p>
                                                DATA INVÁLIDA: {formatDateString(item.dateInvalid)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                        {
                            startIndex < services.length && (
                                <div className="flex justify-center w-full my-10">
                                    <Button
                                        variant="contained"
                                        endIcon={<SouthIcon />}
                                        onClick={() => loadMoreErrors("errorsPaBpacDTOS")}
                                    >
                                        Mostrar mais
                                    </Button>
                                </div>
                            )
                        }
                    </div>
                </div>
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Tem certeza?
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Essa ação irá igualar as datas de atendimento com a competência do arquivo BPA.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            color='error'
                            onClick={() => setOpen(false)}
                        >
                            FECHAR
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={update}
                        >
                            EXECUTAR
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
    )
}

export default InDateService;
