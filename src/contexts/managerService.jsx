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
    
    return (
        <SnackBarContext.Provider value={{ openSnackBarFun, closeSnackBarFun }}>
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