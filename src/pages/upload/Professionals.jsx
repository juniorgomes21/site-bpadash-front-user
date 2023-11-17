import React, { useContext, useEffect, useState } from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import api from "../../services/api";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SnackBarContext from "../../contexts/managerService";
import TextField from '@mui/material/TextField';
import "react-datepicker/dist/react-datepicker.css";
import { LoadingButton } from "@mui/lab";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Typography from '@mui/material/Typography';
import { isValidProfessional } from "../../Validation&Formatation/validation";
import { maskCPF } from "../../Validation&Formatation/formatation";


const field = [
    'name',
    'cpf',
    'cns',
    'cbo',
    'description',
    'company',
    'dateSCNES'
];

const fieldConfig = {
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
    'cns': {
        label: 'CNS',
        maxLength: 14,
        type: 'number',
        validation: /^[0-9]+$/,
        errorMessage: 'Deve conter exatamente 9 dígitos numéricos.',
        mask: 'int'
    },
    'cbo': {
        label: 'CBO',
        maxLength: 6,
        type: 'number',
        validation: /.*/,
        errorMessage: 'Descrição inválida.',
        mask: 'decimal'
    },
    'description': {
        label: 'Descrição',
        maxLength: 59,
        type: 'text',
        validation: /.*/,
        errorMessage: 'Descrição inválida.',
        mask: 'int'
    },
    'company': {
        label: 'Empresa',
        maxLength: 15,
        type: 'text',
        validation: /^[0-9]*[.,]?[0-9]{0,2}$/, // Números não inteiros, como 123.45
        errorMessage: 'Formato de número inválido.',
        mask: 'decimal'
    },
    'dateSCNES': {
        label: 'Data SCNES',
        maxLength: 59,
        validation: /.*/,
        errorMessage: 'Descrição inválida.',
        mask: 'int'
    }
};

const professionalInitial = {
    id: -1,
    name: '',
    cpf: '',
    cns: '',
    cbo: '',
    description: '',
    company: '',
    dateSCNES: ''
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
}));

function Professionals() {

    document.title="Profissionais";
    
    const { openSnackBarFun } = useContext(SnackBarContext);
    const [professional, setProfessional] = useState(professionalInitial);
    const [viewPofessional, setViewProfessional] = useState(professionalInitial);
    const [professionalList, setProfessionalList] = useState([]);
    const [errorMessages, setErrorMessages] = useState([]);
    const [countProfessionalFree, setCountProfessionalFree] = useState(0);
    const [loadingAddProfessional, setLoadingAddProfessional] = useState(false);
    const [dates, setDates] = useState([]);
    const [loadingDates, setLoadingDates] = useState(true);
    const [professionalVisible, setProfessionalVisible] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);

    useEffect(() => {
        apiGetCountProfessional();
    }, []);

    async function apiGetCountProfessional() {
        try {
            const response = await api.get("/user/count/professional");
            setCountProfessionalFree(response.data.profissionalNumberFree);
        } catch(e) {
            console.log('Erro ao buscar contagem de profissionais', e.response);
        }
    }

    async function apiAddProfessional() {
        setLoadingAddProfessional(true);
        try {
            let obj = [];
            if(professionalList.length == 0) {
                obj.push(professional);
            } else {
                obj = professionalList;
            }
            console.log(obj);
            // await api.post("/prof/create", obj);
            setProfessionalList([]);
            setErrorMessages([]);
            setProfessional(professionalInitial);
            await apiGetCountProfessional();
            openSnackBarFun(false, "Profissionais salvo");
        } catch(e) {
            openSnackBarFun();
        }
        setLoadingAddProfessional(false);
    }

    async function addListProfessional() {
        const response = isValidProfessional(professional);
        if(response.length == 0) {
            const modifiedProfessional = { ...professional, id: generateUniqueId()};
            setProfessionalList(prof => [...prof, modifiedProfessional]);
            setProfessional(professionalInitial);
            setErrorMessages([]);

            return true;
        } else {
            setErrorMessages(response);
            return false;
        }
    }

    async function isValid() {
        if(professional.name != '' || professional.cns != '' || professional.cbo != '') {
            const response = isValidProfessional(professional);
            if(response.length == 0) {
                professionalList.push(professional);
                apiAddProfessional();
            } else {
                setErrorMessages(response);
            }
        } else {
            if(professionalList.length > 0) {
                apiAddProfessional();
            } else {
                openSnackBarFun(true, "Você não adicionou nenhum profissional!");
            }
        }
    }

    function handleChangeInput(e) {
        const { name, value } = e.target;
        setProfessional({...professional, [name]: value});
    }

    function openViewProfessional(index) {
        setViewProfessional(professionalList[index]);
        setOpenDetails(true);
    }

    //TODO está rodando em um lup infinito +++++++++++++++
    function generateUniqueId() {
        let randomNumber;

        do {
            // Gera um número aleatório com 6 dígitos
            randomNumber = Math.floor(100000 + Math.random() * 900000).toString();
            
            if(professionalList.length == 0) break;

            const exists = professionalList.find(item => item.id === randomNumber);
            console.log("exists", exists);
            // Se o ID não existir na lista, saia do loop
            if (exists != undefined) break;
        } while (true);
    
        return randomNumber.toString();
    }

    return (
        <>
            <div className="page-content relative">
                <Container fluid className="mb-10">
                {/* Render Breadcrumbs */}
                    <Breadcrumbs title="Profissionais" breadcrumbItem="Adicione novos profissionais" />
                        <div className="mb-3 text-sm">
                            Você pode salvar até ( {countProfessionalFree} ) profissionais.
                        </div>
                        <div className="flex flex-col items-center w-full border-[1px] border-default p-2 rounded-md">
                            <div className="mb-3 text-sm">
                                Total de profissionais na Lista = {professionalList.length}
                            </div>
                            <div className={`flex flex-wrap justify-around w-full ` }>
                                {
                                    professionalVisible && professionalList.map((item, index) => ((
                                        <div
                                            key={index}
                                            onClick={() => openViewProfessional(index)}
                                            className="flex items-center border-[1px] border-default hover:border-green-400 rounded-2xl cursor-pointer px-3 py-1 my-3"
                                        >
                                            <p className="mr-2">
                                                {item.name}
                                            </p>
                                            <div
                                                onClick={ e => {
                                                    e.stopPropagation();
                                                }}
                                                className="hover:text-red-500"
                                            >
                                                <HighlightOffIcon sx={{ fontSize: 19 }}/>
                                            </div>
                                        </div>
                                    )))
                                }
                            </div>
                            <div className="flex justify-center w-full mt-3">
                                <Button
                                    variant="contained"
                                    size="small"
                                    endIcon={professionalVisible ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                                    onClick={
                                        () => setProfessionalVisible(!professionalVisible)
                                    }
                                >
                                    { professionalVisible ? "Ocultar Profissionais" : "Mostrar Profissionais"}
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-base">
                            <p>Coloque as informações necessária</p>
                        </div>
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
                                                    multiline={fieldName === 'description'}
                                                    rows={3}
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
                        <div className="fixed bottom-16 right-12 z-20">
                            {
                                !loadingAddProfessional &&
                                    <Button
                                        variant="contained"
                                        onClick={addListProfessional}
                                        sx={{ mr: 3 }}
                                    >
                                        Adicionar na lista
                                    </Button>
                            }
                            <LoadingButton
                                variant="contained"
                                color="success"
                                loading={loadingAddProfessional}
                                onClick={isValid}
                            >
                                {professionalList.length == 0 ? "Salvar" : "Salvar Todos"}
                            </LoadingButton>
                        </div>
                </Container>
            </div>
            <BootstrapDialog
                onClose={() => setOpenDetails(false)}
                aria-labelledby="customized-dialog-title"
                open={openDetails}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    {viewPofessional.name} (Profissional ainda não salvo)
                </DialogTitle>
                <DialogContent dividers>
                    <div>
                        <div className="flex mt-2">
                            <p className="mr-1">ID: </p>
                            <p>{viewPofessional.id}</p>
                        </div>
                        <div className="flex mt-2">
                            <p className="mr-1">CPF: </p>
                            <p>{viewPofessional.cpf === '' ? 'CPF não informado.' : viewPofessional.cpf}</p>
                        </div>
                        <div className="flex mt-2">
                            <p className="mr-1">CNS: </p>
                            <p>{viewPofessional.cns}</p>
                        </div>
                        <div className="flex mt-2">
                            <p className="mr-1">CBO: </p>
                            <p>{viewPofessional.cbo}</p>
                        </div>
                        <div className="flex mt-2">
                            <p className="mr-1">Descrição: </p>
                            <p>{viewPofessional.description === '' ? 'Sem descrição' : viewPofessional.description}</p>
                        </div>
                        <div className="flex mt-2">
                            <p className="mr-1">Empresa: </p>
                            <p>{viewPofessional.company === '' ? 'Empresa não informada' : viewPofessional.company}</p>
                        </div>
                        <div className="flex mt-2">
                            <p className="mr-1">Data SNCES: </p>
                            <p>{viewPofessional.dateSCNES === '' ? 'Data não informada' : viewPofessional.dateSCNES}</p>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        variant="contained"
                        color="error"
                        onClick={() => 
                            setOpenDetails(false)
                        }
                    >
                        Fechar
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </>
    );
};

export default Professionals;
