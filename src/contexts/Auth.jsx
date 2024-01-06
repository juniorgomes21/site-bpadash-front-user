import React, { createContext, useState, useEffect, useRef } from "react";
import api from "../services/api";
// import isValidToken from "../isValidToken/isValidToken";
// import { PlayerType } from "../types/types";
// import api from "../service/apiss";
// import { getLoggedAsyncStorage, getTokenAsyncStorage, getUserAsyncStorage, removeTokenAsyncSotorage, removeUserAsyncSotorage, setLoggedAsyncStorage, setCardsBitSorteAsyncStorage, setTokenAsyncStorage, setUserAsyncStorage } from "../asyncStorageFunc/asyncStorageFUnc";

const AuthContext = createContext({});

const initialPlayer = {
    id: 0,
    name: '',
    cpf: '',
    email: '',
    cell: '',
    telephone: '',
    emailVerify: true,
    bitSorte: 0,
    listBets: [],
    couponDTOS: [],
    couponDrawnsDTOS: [],
    codeCollaborator: '',
    notificationDTOS: []
}

export function AuthProvider({ children }) {

    const [token, setToken] = useState('');
    const [user, setUser] = useState(initialPlayer);
    const [logged, setLogged] = useState(false);
    const [loadingLogin, setLoadingLogin] = useState(false);
    const [errorLogin, setErrorLogin] = useState(false);
    const [dates, setDates] = useState([]);

    useEffect(() => {
    }, [logged]);
    
    useEffect(() => {
        getDates(); //mudar para quando o usuário fazer login
    }, []);

    async function getDates() {
        try {
            const response = await api.get("/bpa/dates");
            setDates(response.data.dates);
        } catch(e) {
            console.log(e);
        }
    }

    // async function getValues() {
    //     const isValid = await isValidToken();

    //     if(isValid) {
    //         const tokenA = await getTokenAsyncStorage();
    //         setToken(tokenA!);
    
    //         const loggedA = await getLoggedAsyncStorage();
    //         setLogged(loggedA);

    //         const playerA = await getUserAsyncStorage();
    //         setPlayer(playerA);

    //         apiGetPlayer(tokenA!);

    //     } else {
    //         efetuarLogout();
    //     }
    // }

    // async function login(email: string, password: string) {
    //     try {
    //         setErrorLogin(false);
    //         setLoadingLogin(true);
    //         const response = await api.post('/auth', {'email': email , 'senha': password});
    //         await apiGetPlayer(response.data.token);
    //         setTokenAsyncStorage(response.data.token);
    //         setLoggedAsyncStorage(true);
    //         window.location.href = "/room/current";

    //     } catch(e: any) {
    //         setLoadingLogin(false);
    //         setErrorLogin(true);
    //     };
    // }

    // async function updateInfoUser(email: string, password: string) {
    //     try {
    //         const response = await api.post('/auth', {'email': email , 'senha': password});
    //         await apiGetPlayer(response.data.token);
    //         await setTokenAsyncStorage(response.data.token);

    //     } catch(e) {
    //         window.location.href = "/login";
    //     }
    // }

    // async function apiGetPlayer(token: string) {
    //     try {
    //         const response = await api.get('/player', { headers: { 'Authorization': `Bearer ${token}`}});
    //         setPlayer(response.data);
    //         setUserAsyncStorage(response.data);
            
    //         return response.data;
    //     } catch(e) {
            
    //     }
    // }
    
    // async function efetuarLogout() {

    //     await removeTokenAsyncSotorage();
    //     await removeUserAsyncSotorage();
    //     await setLoggedAsyncStorage(false);

    //     setLogged(false);
    //     setPlayer(initialPlayer);
    // }

    return (
        <AuthContext.Provider value={{ user, dates, getDates }}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthContext;
