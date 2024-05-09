import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";
import isValidToken from "../isValidToken/isValidToken";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const AuthContext = createContext({});

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function AuthProvider({ children }) {

    const datesL = JSON.parse(localStorage.getItem("@Dates")) || [];

    const [loadingLogin, setLoadingLogin] = useState(false);
    const [dates, setDates] = useState(datesL);
    const [openDialog, setOpenDialog] = useState(false);
    const [errorLogin, setErrorLogin] = useState(false);
    const [msgError, setMsgError] = useState("Ops, algo deu errado!");
    const [diffInMinutes, setDiffInMinutes] = useState(0);
    const [state, setState] = useState({ openSnackBar: false, vertical: 'top', horizontal: 'center' });
    const { vertical, horizontal, openSnackBar } = state;

    useEffect(() => {
        isInvalid();
    }, []);

    useEffect(() => {
        verifyExpirationTokenAlert();
        const intervalId = setInterval(verifyExpirationTokenAlert, 5 * 60 * 1000); // 10 minutos em milissegundos
        return () => clearInterval(intervalId);
    }, []);
    

    function verifyExpirationTokenAlert() {
        if(localStorage.getItem("@TokenAuthentication")) {
            const currentTimeInMillis = Number(localStorage.getItem('@CurrentTime'));
        
            const diffInMillis = currentTimeInMillis - new Date().getTime();
            const diffInMinutes = Math.floor(diffInMillis / (1000 * 60));
        
            if (diffInMinutes <= 30 && diffInMinutes >= 1) {
                setDiffInMinutes(diffInMinutes);
                setState({ openSnackBar: true, vertical: 'top', horizontal: 'center' });
                
            } else if (diffInMinutes < 1) {
                setOpenDialog(true);
            }
        }
    }

    async function isInvalid() {
        const response =  await isValidToken();
        if (response) {
            setDates(datesL);
        } else {
            if(localStorage.getItem("@TokenAuthentication")) {
                handleLogout();
            }
        }
    }

    async function handleLogin(email, password) {
        setLoadingLogin(true);
        try {
            const response = await api.post('/auth/login', { "email": email, "password": password });
            
            setDateForLocalStorage();

            localStorage.setItem("@TokenAuthentication", response.data.token);
            localStorage.setItem("@User", JSON.stringify(response.data.userDTO));
            localStorage.setItem("@Dates", JSON.stringify(response.data.datesDTO.dates));
            localStorage.setItem("@CurrentTime", new Date().getTime() + (2 * 60 * 60 * 1000));

            window.location.href = "/login/employee";

        } catch (e) {
            const response = e.response.data;
            
            switch (response) {
                case "BAD CREDENTIALS": {
                    setMsgError("Email ou senha inválida!");
                    break;
                }
            }
            
            setErrorLogin(true);
        }
        setLoadingLogin(false);
    }

    async function getDates() {
        try {
            const response = await api.get("/bpa/dates");
            setDates(response.data.dates);
            localStorage.setItem("@Dates", JSON.stringify(response.data.dates));

        } catch(e) {
            console.log(e);
        }
    }

    async function handleLogout() {
        try {
            const employee = JSON.parse(localStorage.getItem("@Employee"));

            await api.post(`/auth/logout/${employee.key}`);
    
            localStorage.removeItem("@Employee");
            localStorage.removeItem("@TokenAuthentication");
    
            if(!window.location.href.includes("login")) window.location.href = "/login";

        } catch(e) {
            console.log(e);
            localStorage.removeItem("@Employee");
            localStorage.removeItem("@TokenAuthentication");

            window.location.href = "/login";
        }
    }

    function closeSnackBarFun() {
        setState({ ...state, openSnackBar: false });
    }

    function setDateForLocalStorage() {
        const tableBpac = JSON.parse(localStorage.getItem("@TablesVisibleBpac"));
        const tableFilterBpac = JSON.parse(localStorage.getItem("@FilterTableBpac"));
        const tableBpai = JSON.parse(localStorage.getItem("@TablesVisible"));
        const tableFilterBpai = JSON.parse(localStorage.getItem("@FilterTable"));

        if(!tableBpac) {
            localStorage.setItem("@TablesVisibleBpac", JSON.stringify([{"cnes":true},{"cmp":true},{"cbo":true},{"flh":true},{"seq":true},{"pa":true},{"idade":true},{"qt":true},{"org":true},{"fim":true}]));
        }
        if(!tableFilterBpac) {
            localStorage.setItem("@FilterTableBpac", JSON.stringify({"pa":"","cnes":"","cbo":""}));
        }
        if(!tableBpai) {
            localStorage.setItem("@TablesVisible", JSON.stringify([{"cnes":true},{"cmp":true},{"cnsmed":true},{"cbo":true},{"dtaten":true},{"flh":true},{"seq":true},{"pa":true},{"cnspac":true},{"sexo":true},{"ibge":true},{"cid":true},{"idade":true},{"qt":true},{"caten":true},{"naut":true},{"org":true},{"nmpac":true},{"dtnasc":true},{"raca":true},{"etnia":true},{"nac":true},{"srv":true},{"clf":true},{"equipe_Seq":true},{"equipe_Area":true},{"cnpj":true},{"cep_Pcnte":true},{"lograd_Pcnte":true},{"end_Pcnte":true},{"compl_Pcnte":true},{"num_Pcnte":true},{"bairro_Pcnte":true},{"ddtel_Pcnte":true},{"email_Pcnte":true},{"ine":true},{"fim":true}]));
        }
        if(!tableFilterBpai) {
            localStorage.setItem("@FilterTable", JSON.stringify({"pa":"","cnes":"","cnsmed":"","cbo":"","ibge":"","sex":"","race":"00"}));
        }
    }

    return (
        <AuthContext.Provider value={{ dates, loadingLogin, errorLogin, msgError, getDates, handleLogin, handleLogout }}>
            {children}
            <Snackbar
                open={openSnackBar}
                autoHideDuration={9000}
                onClose={closeSnackBarFun}
                anchorOrigin={{ vertical, horizontal }}
                key={vertical + horizontal}
            >
                <Alert onClose={closeSnackBarFun} severity="warning" sx={{ width: '100%' }}>
                    {`Faltam ${diffInMinutes} minutos para o encerramento da sua sessão.`}
                </Alert>
            </Snackbar>
            <Dialog open={openDialog} onClose={null}>
                <DialogTitle>SESSÃO DE LOGIN EXPIRADA!</DialogTitle>
                <DialogContent>
                    <div className="border-[1px] border-orange-400 rounded-md mt-4 p-4">
                        <p className="text-center">
                            Faça login novamente para continuar utilizando a plataforma.
                        </p>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleLogout}
                    >
                        Sair
                    </Button>
                </DialogActions>
            </Dialog>
        </AuthContext.Provider>
    )
};

export default AuthContext;
