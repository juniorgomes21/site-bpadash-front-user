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
    const [loadingErrorsFiles, setLoadingErrorsfiles] = useState({
        "inFpo": true, // ok
        "ageMinMax": true, // ok
        "ageDate": true, // ok
        "inCep": true, // ok
        "inQtService":true,//ok
        "inDateService": true,
        "inRace": true,
        "inProfessionals": true,
        "inProcedure": true,
        "inOccupation": true
    });
    const [errorsFile, setErrorsfiles] = useState({
        "inFpo": true,
        "ageDate": true,
        "ageMinMax": true,
        "inCep": true,
        "inQtService":true,
        "inDateService": true,
        "inRace": true,
        "inProfessionals": true,
        "inProcedure": true,
        "inOccupation": true
    });
    const [reloadErrors, setReloadErrors] = useState(false);
    const [error, setError] = useState(false);
    const [state, setState] = useState({ openSnackBar: false, vertical: 'top', horizontal: 'center' });
    const { vertical, horizontal, openSnackBar } = state;

    function openSnackBarFun(error = true, msg = "Ops, algo deu errado") {
        setMsg(msg);
        setError(error);
        setState({ openSnackBar: true, vertical: 'top', horizontal: 'center' });
    }

    function closeSnackBarFun() {
        setState({ ...state, openSnackBar: false });
    }
    
    function reloadErrorsFun() {
        setReloadErrors(!reloadErrors);
    }

    function setHaveErrors(key, value) {
        setErrorsfiles( errorsOld => ({ ...errorsOld,  [key]: value }));
    }

    function setLoadingErrorsFun(key, value) {
        setLoadingErrorsfiles( loadingOld => ({ ...loadingOld,  [key]: value }));
    }

    function haveLoading() {
        return Object.values(loadingErrorsFiles).some((temErro) => temErro);
    }

    function haveErrors() {
        return Object.values(errorsFile).some((temErro) => temErro);
    }

    return (
        <SnackBarContext.Provider value={{ openSnackBarFun, closeSnackBarFun, reloadErrors, haveLoading, setLoadingErrorsFun, reloadErrorsFun, setErrorsfiles,loadingErrorsFiles,setLoadingErrorsfiles, errorsFile, setHaveErrors, haveErrors }}>
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