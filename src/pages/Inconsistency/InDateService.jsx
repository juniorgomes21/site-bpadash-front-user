import React, { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import AlertCustom from "../../GlobalComponents/AlertCustom";
import { formatDateString, unformatDate } from "../../Validation&Formatation/formatation";
import LoadingButton from "@mui/lab/LoadingButton";
import SnackBarContext from "../../contexts/managerService";

function IndateService({ dateBpa }) {

    const { openSnackBarFun } = useContext(SnackBarContext);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        inDataService();
    }, [dateBpa]);

    async function inDataService() {
        try {
            const obj = {
              "dateBPA": dateBpa
            }
            const response = await api.post("/bpa/inconsistency/service", obj);
            setServices(response.data);
    
        } catch (e) {
            console.log("error", e.response);
        }
    }

    async function update() {
        setLoading(true);
        try {
            const lengthSerives = services.length;
            for(let i = 0; i < lengthSerives; i++) {
                const obj = {
                    "dateBpaInvalid": services[i].dateInvalid + '/' + services[i].dateBpa
                }
                try {
                    await api.post(`/bpai/update/${services[i].id}`, obj);
                } catch(e) {
                    // continue
                }
            }
            await inDataService();
            openSnackBarFun(false, lengthSerives > 1 ? "Datas Alteradas" : "Data Alterada");
        } catch(e) {
            console.log(e.response);
        }
        setLoading(false);
    }

    return (
        services.length > 0 &&
            <div className="flex flex-col items-center border-[1px] border-default rounded-md p-2 mt-6">
                <div className="flex justify-end w-11/12 mt-2">
                    <LoadingButton
                        variant="contained"
                        color="success"
                        loading={loading}
                        onClick={update}
                    >
                        ALTERAR TODAS AS DATAS
                    </LoadingButton>
                </div>
                <div className="my-4">
                    <AlertCustom
                        type="error"
                        msg="Data do atendimento BPAI não compativél com o mês do arquivo"
                    />
                </div>
                <div className="flex justify-between font-bold">
                    <p className="">
                        DATA BPA VÁLIDA: {formatDateString(services[0].dateBpa, false)}
                    </p>
                </div>
                <div className="flex flex-col items-center w-full">
                    {
                        services.map((item, index) => (
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
                </div>
            </div>
    )
}

export default IndateService;