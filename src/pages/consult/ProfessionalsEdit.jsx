import React, { useContext, useEffect, useState } from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import api from "../../services/api";
import SnackBarContext from "../../contexts/managerService";
import TextField from '@mui/material/TextField';
import { LoadingButton } from "@mui/lab";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SearchIcon from '@mui/icons-material/Search';
import "react-datepicker/dist/react-datepicker.css";
import { formatNameMonth, maskCPF } from "../../Validation&Formatation/formatation";
import AlertCustom from "../../GlobalComponents/AlertCustom";


const field = [
    {
        key: 'profId',
        name: 'Profissional ID'
    },
    {
        key: 'name',
        name: 'Nome'
    },
    {
        key: 'cpf',
        name: 'CPF'
    },
    {
        key: 'codCns',
        name: 'Código CNS'
    },
    {
        key: 'codCbo',
        name: 'Código CBO'
    },
    {
        key: 'logradouro',
        name: 'Logradouro'
    },
    {
        key: 'number',
        name: 'Número'
    },
    {
        key: 'complement',
        name: 'Complemento'
    },
    {
        key: 'bairrodist',
        name: 'Bairro'
    },
    {
        key: 'codCep',
        name: 'CEP'
    },
    {
        key: 'telephone',
        name: 'Telefone'
    }
]

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
}

function ProfessionalEdit() {

    document.title="Consultar Profissional";
    
    const { openSnackBarFun } = useContext(SnackBarContext);
    const [professional, setProfessional] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);
    const [idProfessional, setIdProfessional] = useState('');
    const [errorMessages, setErrorMessages] = useState([]);


    async function apiGetProfessional() {
        setLoading(true);
        try {
            const response = await api.get(`/prof/get/${idProfessional}`);
            setProfessional(response.data);
        } catch (e) {
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


    return (
        <>
            <div className="page-content relative">
                <Container fluid className="mb-10">
                    {/* Render Breadcrumbs */}
                    <Breadcrumbs title="Profissional" breadcrumbItem="Consultar profissional" />
                    <AlertCustom
                        msg="A consulta do profissional é feita no arquivo configurado em (Arquivos de validações)"
                        type="info"
                    />
                    <div className="flex justify-center items-end w-full mt-5">
                        <TextField
                            type="text"
                            label="ID do profissional"
                            variant="outlined"
                            value={idProfessional}
                            size="small"
                            onChange={ e => {
                                const inputValue = e.target.value;
                                if (!isNaN(Number(e.target.value)) && inputValue.length <= 50) setIdProfessional(inputValue);
                            }}
                            className="w-1/2 mt-4 mr-3"
                        />
                        <LoadingButton
                            loading={loading}
                            variant="contained"
                            disabled={idProfessional === '' || idProfessional.length < 5}
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
                                    <div className="w-full my-8 border-[1px] border-default rounded-md p-2">
                                        {
                                            field.map((fieldName, index) => (
                                                <div className="mt-3" key={index}>
                                                    <div className="text-sm font-bold">
                                                        <p>{fieldName.name}:</p>
                                                    </div>
                                                    <div className="ml-6 mt-1">
                                                        <p>
                                                            {professional[fieldName.key]}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </>
                    }
                </Container>
            </div>
        </>
    );
};

export default ProfessionalEdit;
