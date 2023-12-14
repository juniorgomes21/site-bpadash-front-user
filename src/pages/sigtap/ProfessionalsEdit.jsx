import React, { useContext, useEffect, useState } from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import api from "../../services/api";
import SnackBarContext from "../../contexts/managerService";
import TextField from '@mui/material/TextField';
import { LoadingButton } from "@mui/lab";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { isValidProfessional } from "../../Validation&Formatation/validation";
import SearchIcon from '@mui/icons-material/Search';
import "react-datepicker/dist/react-datepicker.css";
import { formatNameMonth, maskCPF } from "../../Validation&Formatation/formatation";


const field = [
    'profId',
    'name',
    'cpf',
    'codCns',
    'codCbo',
    'logradouro',
    'number',
    'complement',
    'bairrodist',
    'codCep',
    'telephone'
];

const fieldConfig = {
    'profId': {
        label: 'ID',
        maxLength: 50,
        type: 'text',
        validation: /^[0-9]+$/,
        errorMessage: 'Deve conter exatamente 9 dígitos numéricos.',
        mask: 'decimal'
    },
    'name': {
        label: 'Nome',
        maxLength: 50,
        type: 'text',
        validation: /^[0-9]+$/,
        errorMessage: 'Deve conter exatamente 9 dígitos numéricos.',
        mask: 'decimal'
    },
    'cpf': {
        label: 'CPF',
        maxLength: 14,
        type: 'text',
        validation: /.*/,
        errorMessage: 'Descrição inválida.',
        mask: 'default'
    },
    'codCns': {
        label: 'CNSMED',
        maxLength: 15,
        type: 'number',
        validation: /^[0-9]+$/,
        errorMessage: 'Deve conter exatamente 9 dígitos numéricos.',
        mask: 'int'
    },
    'codCbo': {
        label: 'CBO',
        maxLength: 6,
        type: 'number',
        validation: /.*/,
        errorMessage: 'Descrição inválida.',
        mask: 'decimal'
    },
    'logradouro': {
        label: 'LOGRADOURO',
        maxLength: 60,
        type: 'text',
        validation: /.*/,
        errorMessage: 'Logradouro inválido.',
        mask: 'decimal'
    },
    'number': {
        label: 'NÚMERO',
        maxLength: 10,
        type: 'text',
        validation: /.*/,
        errorMessage: 'Número não pode ter caracteres especiais.',
        mask: 'decimal'
    },
    'complement': {
        label: 'COMPLEMENTO',
        maxLength: 50,
        type: 'text',
        validation: /.*/,
        errorMessage: 'Complemento inválido.',
        mask: 'decimal'
    },
    'bairrodist': {
        label: 'BAIRRO',
        maxLength: 30,
        type: 'text',
        validation: /^[0-9]+$/,
        errorMessage: 'Bairro inválido',
        mask: 'decimal'
    },
    'codCep': {
        label: 'CEP',
        maxLength: 8,
        type: 'text',
        validation: /.*/,
        errorMessage: 'Descrição inválida.',
        mask: 'default'
    },
    'telephone': {
        label: 'TELEFONE',
        maxLength: 11,
        type: 'text',
        validation: /.*/,
        errorMessage: 'Descrição inválida.',
        mask: 'default'
    }
};

const initial = {
    "profId": "0000039586740200",
    "cpf": "39586740200",
    "name": "JUAREZ ANTONIO SIMOES QUARESMA",
    "logradouro": "DOM ROMUALDO COELHO",
    "number": "365",
    "complement": "AP 902",
    "bairrodist": "UMARIZAL",
    "codCep": "66055190",
    "codCns": "201562843450000",
    "telephone": "",
    "codCbo": "225325"
  }

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
}));

function ProfessionalEdit() {

    document.title="Editar Profissional";
    
    const { openSnackBarFun } = useContext(SnackBarContext);
    const [professional, setProfessional] = useState({});
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [dates, setDates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);
    const [idProfessional, setIdProfessional] = useState('');
    const [errorMonth, setErrorMonth] = useState(false);
    const [errorYear, setErrorYear] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const uniqueYears = Array.from(new Set(dates.map(item => item[1])));
    const monthsForSelectedYear = dates.filter(item => item[1] === parseInt(year, 10)).map(item => item[0]);

    useEffect(() => {
        apiGetDates();
    }, []);

    async function apiGetDates() {
        try {
            const response = await api.get("/prof/dates");
            setDates(response.data.dates);
        } catch(e) {
            console.log(e.response);
        }
    }

    async function apiGetProfessional() {
        setLoading(true);
        try {
            const response = await api.get(`/prof/get/${month}/${year}/${idProfessional}`);
            setProfessional(response.data);
        } catch (e) {
            console.log(e.response);
            openSnackBarFun(true, "Nenhum profissional encontrado com essa ID na data informada!")
        }
        setLoading(false);
    }

    async function apiSaveProfessional() {
        setLoadingSave(true);
        try {
            await api.post(`/prof/update`, professional);
            openSnackBarFun(false, "Profissional atualizado!");
        } catch (e) {
            console.log(e.response);
        }
        setLoadingSave(false);
    }

    function handleChangeInput(e) {
        const { name, value } = e.target;
        setProfessional({...professional, [name]: value});
    }

    function handleChangeMonth(event) {
        setMonth(event.target.value);
    }

    function handleChangeYear(event) {
        setYear(event.target.value);
    }

    return (
        <>
            <div className="page-content relative">
                <Container fluid className="mb-10">
                    {/* Render Breadcrumbs */}
                    <Breadcrumbs title="Profissional" breadcrumbItem="Editar profissional" />
                    <div className="flex justify-center w-full mb-6">
                        <h2 className="text-lg text-center">Selecione a data do arquivo de profissionais</h2>
                    </div>
                    <div className="flex justify-center">
                        <div className="mr-10">
                            <div className="mb-2">
                                <p className="text-base">Selecione o mês desejado</p>
                            </div>
                            <FormControl
                                fullWidth
                                error={errorMonth}
                            >
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
                                            {formatNameMonth(item)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                            <div className="mb-2">
                            <p className="text-base">Selecione o ano desejado</p>
                            </div>
                            <FormControl
                                fullWidth
                                error={errorYear}
                            >
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
                    <div className="flex justify-center items-end w-full">
                        <TextField
                            type="text"
                            label="ID do profissional"
                            variant="outlined"
                            value={idProfessional}
                            // helperText={message}
                            size="small"
                            onChange={ e => {
                                const inputValue = e.target.value;
                                if (inputValue.length <= 50) setIdProfessional(inputValue);
                            }}
                            className="w-1/2 mt-4 mr-3"
                        />
                        <LoadingButton
                            loading={loading}
                            variant="contained"
                            disabled={year === '' || month === '' || idProfessional === '' || idProfessional.length < 5}
                            endIcon={<SearchIcon />}
                            sx={{
                                ml: 3, mb: 0.3
                            }}
                            onClick={apiGetProfessional}
                        >
                            Pesquisar
                        </LoadingButton>
                    </div>
                    {
                        Object.keys(professional).length > 0 &&
                            <>
                                <div className="flex justify-center">
                                    <div className="w-full mb-16">
                                        {
                                            field.map((fieldName, index) => {
                                                const regex = /^[0-9]+$/;
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
                                                            value={fieldName === 'cpf' ? maskCPF(professional[fieldName]) : professional[fieldName]}
                                                            helperText={message}
                                                            size="small"
                                                            onChange={(e) => {
                                                                const inputValue = e.target.value;
                                                                if (inputValue.length <= config.maxLength) {
                                                                    if(config.type === 'number' && inputValue === '' || regex.test(inputValue)) {
                                                                        handleChangeInput({ target: { name: fieldName, value: inputValue } });
                                                                    } else if (config.type === 'text') {
                                                                        handleChangeInput({ target: { name: fieldName, value: inputValue } });
                                                                    }
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
                                <div className="fixed bottom-16 right-10">
                                    <LoadingButton
                                        variant="contained"
                                        color="success"
                                        loading={loadingSave}
                                        onClick={apiSaveProfessional}
                                    >
                                        SALVAR
                                    </LoadingButton>
                                </div>
                            </>
                    }
                </Container>
            </div>
        </>
    );
};

export default ProfessionalEdit;
