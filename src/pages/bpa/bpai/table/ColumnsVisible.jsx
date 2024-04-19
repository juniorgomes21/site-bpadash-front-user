import React, { useState } from "react";
import Switch from "@mui/material/Switch";

const names = [
    "cnes",
    "cmp",
    "cnsmed",
    "cbo",
    "dtaten",
    "flh",
    "seq",
    "pa",
    "cnspac",
    "sexo",
    "ibge",
    "cid",
    "idade",
    "qt",
    "caten",
    "naut",
    "org",
    "nmpac",
    "dtnasc",
    "raca",
    "etnia",
    "nac",
    "srv",
    "clf",
    "equipe_Seq",
    "equipe_Area",
    "cnpj",
    "cep_Pcnte",
    "lograd_Pcnte",
    "end_Pcnte",
    "compl_Pcnte",
    "num_Pcnte",
    "bairro_Pcnte",
    "ddtel_Pcnte",
    "email_Pcnte",
    "ine",
    "fim",
];

let tablesVisible = [
    { cnes: true },
    { cmp: true },
    { cnsmed: true },
    { cbo: true },
    { dtaten: true },
    { flh: true },
    { seq: true },
    { pa: true },
    { cnspac: true },
    { sexo: true },
    { ibge: true },
    { cid: true },
    { idade: true },
    { qt: true },
    { caten: true },
    { naut: true },
    { org: true },
    { nmpac: true },
    { dtnasc: true },
    { raca: true },
    { etnia: true },
    { nac: true },
    { srv: true },
    { clf: true },
    { equipe_Seq: true },
    { equipe_Area: true },
    { cnpj: true },
    { cep_Pcnte: true },
    { lograd_Pcnte: true },
    { end_Pcnte: true },
    { compl_Pcnte: true },
    { num_Pcnte: true },
    { bairro_Pcnte: true },
    { ddtel_Pcnte: true },
    { email_Pcnte: true },
    { ine: true },
    { fim: true },
];

function ColumnsVisible() {

    const [tablesVisibleStorage, setTablesVisibleStorage] = useState(JSON.parse(localStorage.getItem("@TablesVisible")));

    console.log(tablesVisibleStorage);

    function onchange(name) {
        const newTablesVisibleStorage = tablesVisibleStorage.map((item) => {
            if (Object.keys(item)[0] === name) {
                return { [name]: !item[name] };
            }
            return item;
        });

        // Atualize o estado com o novo valor
        setTablesVisibleStorage(newTablesVisibleStorage);

        localStorage.setItem("@TablesVisible", JSON.stringify(newTablesVisibleStorage));
    }

    return (
        <div className="flex flex-col items-center w-full">
            <p className="mt-3 font-bold">
                A colunas desmarcadas ficarão ocultas na tabela
            </p>
            <div className="my-10 border-[1px] border-default rounded-lg p-4">
                {names.map((name, index) => (
                    <div key={index}>
                        <div className="flex justify-between w-60">
                            <p>{name}</p>
                            <Switch
                                checked={tablesVisibleStorage[index][name]}
                                onClick={() => onchange(name)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ColumnsVisible;
