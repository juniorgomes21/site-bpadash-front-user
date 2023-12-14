import React, { useContext, useEffect, useState } from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import api from "../../../services/api";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SnackBarContext from "../../../contexts/managerService";
import TextField from '@mui/material/TextField';
import "react-datepicker/dist/react-datepicker.css";
import { LoadingButton } from "@mui/lab";
import { CircularProgress } from "@mui/material";

const field = [
    'pa',
    'description',
    'quantOrcada',
    'valueUnit',
    'valueOrcado',
    'quantProd',
    'valueProd',
    'quantApro',
    'valueApro'
];

const fieldConfig = {
    'pa': {
        label: 'PA',
        maxLength: 9,
        type: 'text',
        validation: /^[0-9]+$/,
        errorMessage: 'Deve conter exatamente 9 dígitos numéricos.',
        mask: 'default'
    },
    'description': {
        label: 'Descrição',
        maxLength: 59,
        type: 'text',
        validation: /.*/,
        errorMessage: 'Descrição inválida.',
        mask: 'default'
    },
    'quantOrcada': {
        label: 'Quantidade Orçada',
        maxLength: 15,
        type: 'number',
        validation: /^[0-9]+$/,
        errorMessage: 'Deve conter exatamente 9 dígitos numéricos.',
        mask: 'int'
    },
    'valueUnit': {
        label: 'Valor Unitário',
        maxLength: 15,
        type: 'number',
        validation: /^[0-9]+$/,
        errorMessage: 'Deve conter exatamente 9 dígitos numéricos.',
        mask: 'decimal'
    },
    'valueOrcado': {
        label: 'Valor Orçado',
        maxLength: 59,
        type: 'number',
        validation: /.*/,
        errorMessage: 'Descrição inválida.',
        mask: 'decimal'
    },
    'quantProd': {
        label: 'Quantidade Produzida',
        maxLength: 59,
        type: 'number',
        validation: /.*/,
        errorMessage: 'Descrição inválida.',
        mask: 'int'
    },
    'valueProd': {
        label: 'Valor Produzido',
        maxLength: 15,
        type: 'number',
        validation: /^[0-9]*[.,]?[0-9]{0,2}$/, // Números não inteiros, como 123.45
        errorMessage: 'Formato de número inválido.',
        mask: 'decimal'
    },
    'quantApro': {
        label: 'Quantidade Aprovado',
        maxLength: 59,
        type: 'number',
        validation: /.*/,
        errorMessage: 'Descrição inválida.',
        mask: 'int'
    },
    'valueApro': {
        label: 'Valor Aprovado',
        maxLength: 59,
        type: 'number',
        validation: /.*/,
        errorMessage: 'Descrição inválida.',
        mask: 'decimal'
    }
};

function LineFpo() {

    document.title="Nova Linha FPO";
    
    const { openSnackBarFun } = useContext(SnackBarContext);
    const [fpo, setFpo] = useState({
        pa: '',
        description: '',
        quantOrcada: '',
        valueUnit: '',
        valueOrcado: '',
        quantProd: '',
        valueProd: '',
        quantApro: '',
        valueApro: '',
    });
    const [errorMessages, setErrorMessages] = useState([]);
    const [dates, setDates] = useState([]);
    const [loadingDates, setLoadingDates] = useState(true);
    const uniqueYears = Array.from(new Set(dates.map(item => item[1])));
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const monthsForSelectedYear = dates.filter(item => item[1] === parseInt(year, 10)).map(item => item[0]);

    useEffect(() => {
        getDates();
    }, [])

    useEffect(() => {
        // Filtrar os meses disponíveis com base no ano selecionado
        const availableMonths = dates.filter(item => item[1] === parseInt(year, 10)).map(item => item[0]);
    
        // Atualizar os meses disponíveis no estado do mês
        setMonth(availableMonths.length > 0 ? availableMonths[0] : '');
    }, [year]);

    async function getDates() {
        try {
            const response = await api.get("/fpo/dates");
            setDates(response.data.dates);
        } catch(e) {
            console.log(e.response);
        }
        setLoadingDates(false);
    }

    async function apiSetLineFpo() {
        try {
            console.log(fpo);
            const obj = {
                pa: fpo['pa'],
                description: fpo['description'],
                quantOrcada: fpo['quantOrcada'].trim() === '' ? 0 : fpo['quantOrcada'].replace(/\./g, ""),
                quantProd: fpo['quantProd'].trim() === '' ? 0 : fpo['quantProd'].replace(/\./g, ""),
                quantApro: fpo['quantApro'].trim() === '' ? 0 : fpo['quantApro'].replace(/\./g, ""),
                valueUnit: fpo['valueUnit'].trim() === '' ? 0 : fpo['valueUnit'].replace(/\./g, "").replace(",", "."),
                valueOrcado: fpo['valueOrcado'].trim() === '' ? 0 : fpo['valueOrcado'].replace(/\./g, "").replace(",", "."),
                valueProd: fpo['valueProd'].trim() === '' ? 0 : fpo['valueProd'].replace(/\./g, "").replace(",", "."),
                valueApro: fpo['valueApro'].trim() === '' ? 0 : fpo['valueApro'].replace(/\./g, "").replace(",", ".")
            }
            console.log("obj", obj);
            await api.post("/fpo/create/line", obj);
        } catch(e) {
            console.log(e.response);
            setErrorMessages(e.response.data);
        }
    }

    function handleChangeInput(e) {
        const { name, value } = e.target;
        setFpo({...fpo, [name]: value});
      }

    function handleChangeMonth(event) {
        setMonth(event.target.value);
    };

    function handleChangeYear(event) {
        setYear(event.target.value);
    };

    function getMonthName(monthNumber) {
        const monthNames = [
          'Janeiro', 'Fevereiro', 'Março', 'Abril',
          'Maio', 'Junho', 'Julho', 'Agosto',
          'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        return monthNames[monthNumber - 1];
    };

    function applyMask(value, mask, validationRegex) {
        if (!value) return ''; // Evita erro quando o valor é nulo ou indefinido
    
        // if (!validationRegex.test(value)) {
        //     // Se não atender, retorna o valor sem a máscara
        //     return value;
        // }

        switch (mask) {
            case 'int':
                return value.replace(".", "").replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            case 'decimal':
                return value.replace(".", "").replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            default:
                return value;
        }
    }

    return (
        <>
            <div className="page-content relative">
                <Container fluid className="mb-10">
                {/* Render Breadcrumbs */}
                    <Breadcrumbs title="Linha FPO" breadcrumbItem="Upload Linha FPO" />
                    {
                        loadingDates ?
                            <div className="flex justify-center w-full">
                                <CircularProgress size={25}/>
                            </div>
                        :
                            dates.length == 0 ?
                                <div className="flex justify-center mt-4 text-base">
                                    <p>
                                        Você não tem Arquivos FPO!
                                    </p>
                                </div>
                            :
                                <>
                                    <div className="mt-4 text-base">
                                        <p>Selecione a Data do arquivo FPO que você desejá adicionar essa linha (Selecione primeiro o ANO)</p>
                                    </div>
                                    <div className="flex w-full justify-end mb-4">
                                        <div className="mr-10">
                                            <div className="mb-2">
                                            <p className="text-base">Selecione o mês desejado</p>
                                            </div>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">{'Mês'}</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    disabled={year === ''}
                                                    value={month}
                                                    label={'Mês'}
                                                    onChange={handleChangeMonth}
                                                    >
                                                    {monthsForSelectedYear.map((item, index) => (
                                                        <MenuItem key={index} value={item}>
                                                            {getMonthName(item)}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div>
                                            <div className="mb-2">
                                                <p className="text-base">Selecione o ano desejado</p>
                                            </div>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">{'Ano'}</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={year}
                                                    label={'Ano'}
                                                    onChange={handleChangeYear}
                                                >
                                                {uniqueYears.map((item, index) => (
                                                    <MenuItem key={index} value={item}>
                                                        {item}
                                                    </MenuItem>
                                                ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="w-full mb-16">
                                            {
                                                field.map((fieldName, index) => {
                                                    const config = fieldConfig[fieldName];
                                                    const error = errorMessages.find(error => error.field === fieldName);
                                                    const message = error ? error.message : '';

                                                    return (
                                                        <div key={fieldName}>
                                                            <TextField
                                                                fullWidth
                                                                error={error ? true : false}
                                                                id={fieldName}
                                                                name={fieldName}
                                                                type="text"
                                                                label={config.label}
                                                                variant="outlined"
                                                                value={applyMask(fpo[fieldName], config.mask, config.validation)}
                                                                helperText={message}
                                                                size="small"
                                                                onChange={(e) => {
                                                                    const inputValue = e.target.value;
                                                                    if (inputValue.length <= config.maxLength) {
                                                                        handleChangeInput({ target: { name: fieldName, value: inputValue } });
                                                                    }
                                                                }}
                                                                className="mt-4"
                                                            />
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className="fixed bottom-16 right-12 z-20">
                                        <LoadingButton
                                            variant="contained"
                                            color="success"
                                            onClick={apiSetLineFpo}
                                        >
                                            Salvar
                                        </LoadingButton>
                                    </div>
                                </>
                    }
                </Container>
            </div>
        </>
    );
};

export default LineFpo;


// const regex = /^-?\d+(\.\d+)?$/;
// onChange={(e) => {
//     const inputValue = e.target.value;
//     if (inputValue.length <= config.maxLength) {
//         if(config.type === "number" && inputValue === '' || regex.test(inputValue.replace(/\./g, "").replace(",", ""))) {
//             console.log("entrou number");
//             handleChangeInput({ target: { name: fieldName, value: inputValue } });
//         } else if(config.type === "text") {
//             console.log("entrou text");
//             handleChangeInput({ target: { name: fieldName, value: inputValue } });
//         }
//     }
// }}