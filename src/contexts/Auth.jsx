import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";
import isValidToken from "../isValidToken/isValidToken";


const AuthContext = createContext({});

export function AuthProvider({ children }) {

    const datesL = JSON.parse(localStorage.getItem("@Dates")) || [];

    const [loadingLogin, setLoadingLogin] = useState(false);
    const [dates, setDates] = useState(datesL);
    const [errorLogin, setErrorLogin] = useState(false);
    const [msgError, setMsgError] = useState("Ops, algo deu errado!");

    useEffect(() => {
        isInvalid();
    }, []);


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

            localStorage.setItem("@TokenAuthentication", response.data.token);
            localStorage.setItem("@User", JSON.stringify(response.data.userDTO));
            localStorage.setItem("@Dates", JSON.stringify(response.data.datesDTO.dates));

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
            console.log("foi");
        } catch(e) {
            console.log(e);
            localStorage.removeItem("@Employee");
            localStorage.removeItem("@TokenAuthentication");

            window.location.href = "/login";
        }
    }


    return (
        <AuthContext.Provider value={{ dates, loadingLogin, errorLogin, msgError, getDates, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthContext;
