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
import DateGlobalBpaContext from "../../contexts/DateGlobalBpa";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const field = [
    {
        key: 'nmpac',
        name: 'Nome'
    },
    {
        key: 'cnes',
        name: 'CNES'
    },
    {
        key: 'cmp',
        name: 'CMP'
    },
    {
        key: 'cnsmed',
        name: 'CNSMED'
    },
    {
        key: 'cnspac',
        name: 'CNSPAC'
    },
    {
        key: 'sexo',
        name: 'Sexo'
    },
    {
        key: 'idade',
        name: 'Idade'
    },
    {
        key: 'qt',
        name: 'QT'
    },
    {
        key: 'dtnasc',
        name: 'Data De Nasc.'
    },
    {
        key: 'raca',
        name: 'Raça'
    },
    {
        key: 'etnia',
        name: 'Etnia'
    },
    {
        key: 'logradPcnte',
        name: 'Logradouro'
    },
    {
        key: 'numPcnte',
        name: 'Número'
    },
    {
        key: 'endPcnte',
        name: 'Endereço'
    },
    {
        key: 'bairroPcnte',
        name: 'Bairro'
    },
    {
        key: 'cepPcnte',
        name: 'CEP'
    },
    {
        key: 'ddtelPcnte',
        name: 'Telefone'
    }
]


function Client() {

    document.title="Consultar Profissional";
    
    const { openSnackBarFun } = useContext(SnackBarContext);
    const { getFormatedDate } = useContext(DateGlobalBpaContext);
    const [cnsPac, setCnsPac] = useState('');
    const [client, setClient] = useState({});
    const [loading, setLoading] = useState(false);


    async function apiGet() {
        setLoading(true);
        setClient({});
        try {
            const response = await api.get(`/user/get/${getFormatedDate()}/${cnsPac}`);
            setClient(response.data);
        } catch (e) {
            const response = e.response.data;
            if(response && response === "NOT FOUND") {
                openSnackBarFun(true, "Nenhum paciênte encontrado!");
            } else {
                openSnackBarFun();
            }
        }
        setLoading(false);
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
    

    return (
        <div className="page-content relative">
            <Container fluid className="mb-10">
                {/* Render Breadcrumbs */}
                <Breadcrumbs title="Profissional" breadcrumbItem="Consultar profissional" />
                <AlertCustom
                    msg="A consulta do paciênte é feita no arquivo BPA selecionado"
                    type="info"
                />
                <div className="flex justify-center items-end w-full mt-5">
                    <TextField
                        type="text"
                        label="CNSPAC"
                        variant="outlined"
                        value={cnsPac}
                        size="small"
                        onChange={ e => {
                            const inputValue = e.target.value;
                            if (!isNaN(Number(e.target.value)) && inputValue.length <= 15) setCnsPac(inputValue);
                        }}
                        className="w-1/2 mt-4 mr-3"
                    />
                    <LoadingButton
                        loading={loading}
                        variant="contained"
                        disabled={cnsPac === '' || cnsPac.length < 15}
                        endIcon={<SearchIcon />}
                        sx={{
                            ml: 3, mb: 0.3
                        }}
                        onClick={apiGet}
                    >
                        Pesquisar
                    </LoadingButton>
                </div>
                {
                    Object.keys(client).length > 0 &&
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
                                                                            value={auxMask(fieldName.key, client[fieldName.key])}
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
                                </div>
                            </div>
                        </>
                }
            </Container>
        </div>
    )
}

export default Client;
