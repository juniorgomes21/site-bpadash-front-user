import React, { useState } from "react";
import Switch from "@mui/material/Switch";

const names = [
    "cnes",
    "cmp",
    "cbo",
    "flh",
    "seq",
    "pa",
    "idade",
    "qt",
    "org",
    "fim",
];


function ColumnsVisible() {

    const [tablesVisibleStorage, setTablesVisibleStorage] = useState(JSON.parse(localStorage.getItem("@TablesVisibleBpac")));

    function onchange(name) {
        const newTablesVisibleStorage = tablesVisibleStorage.map((item) => {
            if (Object.keys(item)[0] === name) {
                return { [name]: !item[name] };
            }
            return item;
        });

        // Atualize o estado com o novo valor
        setTablesVisibleStorage(newTablesVisibleStorage);

        localStorage.setItem("@TablesVisibleBpac", JSON.stringify(newTablesVisibleStorage));
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
