import Button from "@mui/material/Button";
import SouthIcon from '@mui/icons-material/South';


function DivErrors({ errorsFile, startIndex, displayedErrors, loadMoreErrors}) {

    return (
        <div className="my-3">
            {
                errorsFile.length > 0 ?
                    displayedErrors[0].messages[0].field === "ARMAZENAMENTO" ?
                        <div className="mt-3 border-[1px] border-default rounded-lg p-2 text-red-500">
                            <p>ARMAZENAMENTO:</p>
                            <p className="ml-4">
                                Espaço de armazenamento insuficiente. Consulte um administrador para obter mais espaço!
                            </p>
                        </div>
                    :
                        <div className="mt-4">
                            <h2 className="text-base">{errorsFile.length} erros encontrados no arquivo: </h2>
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
                : null
            }
        </div>
    )
}

export default DivErrors;