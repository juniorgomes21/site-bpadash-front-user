import React, { useEffect, useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import api from "../../services/api";


function DateBpa({ api, month, year, setMonth, setYear }) {

    useEffect(() => {
        api();
    }, [])

    function handleChangeMonth(event) {
        setMonth(event.target.value);
    };
    
    function handleChangeYear(event) {
        setYear(event.target.value);
    };

    return (
        <div className="flex">
            <div className="mr-4">
            <div className="mb-2">
                <p className="text-base">Selecione o mês</p>
            </div>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{'mês ' + month}</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={month}
                label={'mês ' + month}
                onChange={handleChangeMonth}
                >
                <MenuItem value={1}>Janeiro</MenuItem>
                <MenuItem value={2}>Fevereiro</MenuItem>
                <MenuItem value={3}>Março</MenuItem>
                <MenuItem value={4}>Abril</MenuItem>
                <MenuItem value={5}>Maio</MenuItem>
                <MenuItem value={6}>junho</MenuItem>
                <MenuItem value={7}>Julho</MenuItem>
                <MenuItem value={8}>Agosto</MenuItem>
                <MenuItem value={9}>Setembro</MenuItem>
                <MenuItem value={10}>Outubro</MenuItem>
                <MenuItem value={11}>Novembro</MenuItem>
                <MenuItem value={12}>Dezembro</MenuItem>
                </Select>
            </FormControl>
            </div>
            <div>
            <div className="mb-2">
                <p className="text-base">Selecione o ano</p>
            </div>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{year}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={year}
                    label={year}
                    onChange={handleChangeYear}
                >
                    {
                        Array.from({ length: 20 }, (_, index) => (
                            <MenuItem key={index} value={2023 - index}>{2023 - index}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            </div>
        </div>
    )
}

export default DateBpa;