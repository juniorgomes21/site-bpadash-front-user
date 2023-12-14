import 'regenerator-runtime/runtime'
import React, { createContext, useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SnackBarContext = createContext(StackBarProvider);

export function StackBarProvider({ children }) {
    const [msg, setMsg] = useState("");
    const [errorsFile, setErrorsfiles] = useState({
        "inFpo": false,
        "ageDate": false,
        "ageMinMax": false,
        "inCep": false,
        "inQtService":false,
        "indateService": false,
        "inRace": false,
        "inProfessionals": false,
        "inProcedure": false,
        "inOccupation": false
    }) 
    const [reloadErrors, setReloadErrors] = useState(false);
    const [error, setError] = useState(false);
    const [state, setState] = useState({ openSnackBar: false, vertical: 'top', horizontal: 'center' });
    const { vertical, horizontal, openSnackBar } = state;

    function openSnackBarFun(error = true, msg = "Ops, algo deu errado") {
        setMsg(msg);
        setError(error);
        setState({ openSnackBar: true, vertical: 'top', horizontal: 'center' });
    };

    function closeSnackBarFun() {
        setState({ ...state, openSnackBar: false });
    };
    
    function reloadErrorsFun() {
        setReloadErrors(!reloadErrors);
    };

    function setHaveErrors(key, value) {
        console.log("setHaveErrors", errorsFile);
        console.log("value", value);
        setErrorsfiles({ ...errorsFile, [key]: value});
    }

    function haveErrors() {
        console.log("haveErrors", errorsFile);
        return errorsFile.inFpo || errorsFile.ageDate || errorsFile.ageMinMax || errorsFile.inCep || errorsFile.inQtService || errorsFile.indateService || errorsFile.inRace || errorsFile.inProfessionals || errorsFile.inProcedure || errorsFile.inOccupation;
    }

    return (
        <SnackBarContext.Provider value={{ openSnackBarFun, closeSnackBarFun, reloadErrors, reloadErrorsFun, errorsFile, setHaveErrors, haveErrors }}>
            {children}
            <Snackbar
                open={openSnackBar}
                autoHideDuration={9000}
                onClose={closeSnackBarFun}
                anchorOrigin={{ vertical, horizontal }}
                key={vertical + horizontal}
            >
                <Alert onClose={closeSnackBarFun} severity={error ? "error" : "success"} sx={{ width: '100%' }}>
                    {msg}
                </Alert>
            </Snackbar>
        </SnackBarContext.Provider>
    )
}

export default SnackBarContext;