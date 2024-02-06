import React, { useContext, useEffect, useState } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import api from "../../services/api";
import SnackBarContext from "../../contexts/managerService";
import TextField from '@mui/material/TextField';
import { LoadingButton } from "@mui/lab";
import { Card, CardBody, CardTitle, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import SearchIcon from '@mui/icons-material/Search';
import "react-datepicker/dist/react-datepicker.css";
import { maskCEP, maskCPF, maskCell, maskPointThree } from "../../Validation&Formatation/formatation";
import AlertCustom from "../../GlobalComponents/AlertCustom";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { CircularProgress } from "@mui/material";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

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
        name: 'Código CNS',
        length: 15
    },
    {
        key: 'codCbo',
        name: 'Código CBO',
        length: 6
    },
    {
        key: 'logradouro',
        name: 'Logradouro',
        length: 30
    },
    {
        key: 'number',
        name: 'Número',
        length: 6
    },
    {
        key: 'complement',
        name: 'Complemento',
        length: 30
    },
    {
        key: 'bairrodist',
        name: 'Bairro',
        length: 30
    },
    {
        key: 'codCep',
        name: 'CEP',
        length: 8
    },
    {
        key: 'telephone',
        name: 'Telefone',
        length: 11
    }
]


function ProfessionalEdit() {

    document.title="Consultar Profissional";
    
    const { openSnackBarFun } = useContext(SnackBarContext);
    const [open, setOpen] = useState(false);
    const [professional, setProfessional] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [idProfessional, setIdProfessional] = useState('');


    async function apiGetProfessional() {
        setLoading(true);
        try {
            const response = await api.get(`/prof/get/${idProfessional}`);
            setProfessional(response.data);
        } catch (e) {
            const response = e.response.data;
            
            switch(response && response) {
                case "NOT FOUND":
                    openSnackBarFun(true, "Nenhum profissional encontrado!");
                    break;
                case "NOT EXIST DATE":
                    openSnackBarFun(true, "Nenhum arquivo encontrado data informada, por favor faço o upload do arquivo!");
                    break;
                default:
                    openSnackBarFun();
            }
        }
        setLoading(false);
    }

    async function apiEdit() {
        setLoadingEdit(true);
        try {
            await api.post(`/prof/edit/${professional.id}`, professional);
            handleClose();
            openSnackBarFun(false, "Profissional atualizado");
        } catch(e) {
            openSnackBarFun();
        }
        setLoadingEdit(false);
    }

    function auxMask(field, value) {
        switch(field) {
            case 'cpf': return maskCPF(value);
            case 'codCns': return maskPointThree(value);
            case 'profId': return maskPointThree(value);
            case 'codCep': return maskCEP(value);
            case 'telephone': return maskCell(value);
            default: return value;
        }
    }

    function handleClickOpen(id) {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }
    

    return (
        <>
            <div className="page-content relative">
                <Container fluid className="mb-10">
                    {/* Render Breadcrumbs */}
                    <Breadcrumbs title="Profissional" breadcrumbItem="Consultar profissional" />
                    <AlertCustom
                        msg="Consulte e edite os profissionais. A consulta do profissional é realizada no arquivo configurado em (Arquivos de validações)."
                        type="info"
                    />
                    <div className="flex justify-center items-end w-full mt-5">
                        <TextField
                            type="text"
                            label="CNS ou Nome do profissional"
                            variant="outlined"
                            value={idProfessional}
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
                            disabled={idProfessional === '' || idProfessional.length < 10}
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
                                        <Row>
                                            <Col lg="12">
                                                <Card>
                                                    <CardBody>
                                                        {/* <CardTitle className="mb-4">Informações</CardTitle> */}
                                                        <Form>
                                                            {
                                                                field.map((fieldName, index) => (
                                                                    <FormGroup key={index} className="" row>
                                                                        <Label
                                                                            htmlFor="projectname"
                                                                            className="col-form-label col-lg-2"
                                                                        >
                                                                            {fieldName.name}
                                                                        </Label>
                                                                        <Col lg="10">
                                                                            <Input
                                                                                id="projectname"
                                                                                name="projectname"
                                                                                type="text"
                                                                                disabled
                                                                                value={auxMask(fieldName.key, professional[fieldName.key])}
                                                                                className="form-control"
                                                                            />
                                                                        </Col>
                                                                    </FormGroup>
                                                                ))
                                                            }
                                                        </Form>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <div className="flex justify-end w-full">
                                            <Button
                                                variant="contained"
                                                onClick={() => handleClickOpen()}
                                            >
                                                Editar
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </>
                    }
                </Container>
            </div>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar className="!relative !bg-default">
                    <Toolbar>
                        {
                            loadingEdit ?
                                <div className="flex justify-end w-full">
                                    <CircularProgress size={28} color="warning"/>
                                </div>
                            :
                                <>
                                    <Button
                                        autoFocus
                                        variant="contained"
                                        color="error"
                                        onClick={handleClose}
                                    >
                                        fechar
                                    </Button>
                                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        autoFocus
                                        color="success"
                                        onClick={apiEdit}
                                    >
                                        salvar
                                    </Button>
                                </>
                        }
                    </Toolbar>
                </AppBar>
                <div className="flex justify-center">
                    <div className="w-full p-2">
                        <Row>
                            <Col lg="12">
                                <Card>
                                    <CardBody>
                                        {/* <CardTitle className="mb-4">Informações</CardTitle> */}
                                        <Form>
                                            {
                                                field.map((fieldName, index) => {
                                                    const show = (["profId", "name", "cpf"].includes(fieldName.key));
                                                    
                                                    return !show && (
                                                                <FormGroup key={index} className="" row>
                                                                    <Label
                                                                        htmlFor="projectname"
                                                                        className="col-form-label col-lg-2"
                                                                    >
                                                                        {fieldName.name}
                                                                    </Label>
                                                                    <Col lg="10">
                                                                        <Input
                                                                            id="projectname"
                                                                            name="projectname"
                                                                            type="text"
                                                                            value={professional[fieldName.key]}
                                                                            className="form-control"
                                                                            onChange={ e => {
                                                                                if( e.target.value.length <= fieldName.length ) setProfessional( prof => ({ ...prof, [fieldName.key]: e.target.value }))
                                                                            }}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                            )
                                                })
                                            }
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default ProfessionalEdit;
