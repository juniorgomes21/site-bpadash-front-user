import React, { createContext, useEffect, useState } from "react";
import 'regenerator-runtime/runtime'


const DateGlobalBpaContext = createContext(DateGlobalBpaProvider);

export function DateGlobalBpaProvider({ children }) {
    const date = new Date();
    const [month, setMonth] = useState(localStorage.getItem("@Month") == null ? date.getMonth() + 1 : localStorage.getItem("@Month"));
    const [year, setYear] = useState(localStorage.getItem("@Year") == null ? date.getFullYear() : localStorage.getItem("@Year"));

    useEffect(() => {
        checkDateLocal();
    }, [])

    function startDateChange(date) {
        const month = date[0];
        const year = date[1];
        setMonth(month);
        localStorage.setItem("@Month", month);
        setYear(year);
        localStorage.setItem("@Year", year);
    }

    function checkDateLocal() {
        if(localStorage.getItem("@Month") == null) localStorage.setItem("@Month", date.getMonth() + 1);
        if(localStorage.getItem("@Year") == null)  localStorage.setItem("@Year", date.getFullYear());
    }


    return (
        <DateGlobalBpaContext.Provider value={{ month, year, startDateChange }}>
            {children}
        </DateGlobalBpaContext.Provider>
    )
}

export default DateGlobalBpaContext;