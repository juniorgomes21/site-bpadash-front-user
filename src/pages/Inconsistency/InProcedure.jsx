import React, { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import AlertCustom from "../../GlobalComponents/AlertCustom";
import EditIcon from '@mui/icons-material/Edit';
import SnackBarContext from "../../contexts/managerService";
import LoadingButton from "@mui/lab/LoadingButton";

// 0202010023
function InProcedure({ dateBpa }) {
    const { reloadErrors, openSnackBarFun } = useContext(SnackBarContext);

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [procedures, setProcedures] = useState({"errorsPaBpac": [], "errorsSexBpai": []});


    useEffect(() => {
        inProcedure();
    }, [dateBpa, reloadErrors]);


    async function inProcedure() {
        try {
            const obj = {
              "dateBPA": dateBpa,
            }
            const response = await api.post("/bpa/inconsistency/procedure", obj);
            setProcedures(response.data);
        } catch (e) {
            console.log("error", e.response);
        }
    }

    async function update() {
        setLoading(true);
        try {
            const error = false;
            const lengthSerives = procedures["errorsSexBpai"].length;
            for(let i = 0; i < lengthSerives; i++) {
                const obj = {
                    "sexCurrent": procedures["errorsSexBpai"][i].sexCurrent
                }

                try {
                    await api.post(`/bpai/update/${procedures["errorsSexBpai"][i].id}`, obj);
                } catch(e) {
                    openSnackBarFun();
                    error = true;
                }
            }
            await inProcedure();
            if(!error) {
                openSnackBarFun(false, lengthSerives > 1 ? "Sexos Alterados" : "Sexo Alterado");
            }
        } catch(e) {
            console.log(e.response);
        }
        setLoading(false);
    }

    return (
        <>
            {
                procedures["errorsSexBpai"].length > 0 &&
                    <div className="flex flex-col items-center border-[1px] border-default rounded-md p-2 mt-6">
                        <div className="flex justify-end w-11/12 mt-2">
                            <LoadingButton
                                variant="contained"
                                color="success"
                                loading={loading}
                                onClick={update}
                            >
                                CORRIGIR TODOS OS SEXOS
                            </LoadingButton>
                        </div>
                        <div className="my-4">
                            <AlertCustom
                                type="error"
                                msg="Campo SEXO de BPAI não compativel em procedimentos"
                            />
                        </div>
                        <div className="flex flex-col items-center w-full">
                            {
                                procedures["errorsSexBpai"].length == 0 &&
                                    <div className="font-bold mt-8">
                                        <p>BPAI</p>
                                    </div>
                            }
                            {
                                procedures["errorsSexBpai"].map((item, index) => (
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
                        </div>
                    </div>
            }
        </>
    )
}

export default InProcedure;