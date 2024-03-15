import React from "react";
import Button from "@mui/material/Button";
import SouthIcon from '@mui/icons-material/South';
import AlertCustom from "../../GlobalComponents/AlertCustom";
import { Link } from "react-router-dom";

function DivErrors({ errorsFile, startIndex, displayedErrors, loadMoreErrors}) {

    return (
        <div className="my-3">
            <div className="mt-4">
                <AlertCustom
                    type="error"
                    msg={`${errorsFile.length} erros encontrados no arquivo`}
                />
                <ul className="mt-3">
                    {displayedErrors.map((error, index) => (
                    <li key={index} className="mt-3 border-[1px] border-default rounded-lg p-2">
                        <h2 className="text-sm">Linha {error.line}:</h2>
                        <ul className="ml-4">
                            {error.messages.map((message, i) => (
                                <li key={i} className="text-red-500">
                                    Campo: {message.field} - {message.message}
                                </li>
                            ))}
                        </ul>
                    </li>
                    ))}
                </ul>
                {startIndex < errorsFile.length && (
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
    )
}

export default DivErrors;
