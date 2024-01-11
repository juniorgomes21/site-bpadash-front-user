import React, { useContext, useEffect, useState } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import api from "../../services/api";
import SnackBarContext from "../../contexts/managerService";
import TextField from '@mui/material/TextField';
import { LoadingButton } from "@mui/lab";
import { Card, CardBody, CardTitle, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
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


function ProfessionalEdit() {

    document.title="Consultar Profissional";
    
    const { openSnackBarFun } = useContext(SnackBarContext);
    const [professional, setProfessional] = useState({});
    const [loading, setLoading] = useState(false);
    const [idProfessional, setIdProfessional] = useState('');


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
                                                                                value={professional[fieldName.key]}
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
        </>
    );
};

export default ProfessionalEdit;
