import React, { useContext, useState } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import api from "../../services/api";
import SnackBarContext from "../../contexts/managerService";
import TextField from '@mui/material/TextField';
import { LoadingButton } from "@mui/lab";
import { Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import SearchIcon from '@mui/icons-material/Search';
import "react-datepicker/dist/react-datepicker.css";
import { maskCEP, maskCPF, maskCell, maskMoney, maskPointThree } from "../../Validation&Formatation/formatation";
import AlertCustom from "../../GlobalComponents/AlertCustom";


const field = [
    {
        key: 'pa',
        name: 'PA'
    },
    {
        key: 'description',
        name: 'DESCRIÇÃO'
    },
    {
        key: 'quantOrcada',
        name: 'QUANT. ORÇADA'
    },
    {
        key: 'quantProd',
        name: 'QUANT. PRODUZIDO'
    },
    {
        key: 'quantApro',
        name: 'QUANT. APROVADO'
    },
    {
        key: 'valueUnit',
        name: 'VALOR UNITÁRIO'
    },
    {
        key: 'valueOrcado',
        name: 'VALOR ORÇADO'
    },
    {
        key: 'valueProd',
        name: 'VALOR PRODUZIDO'
    },
    {
        key: 'valueApro',
        name: 'VALOR APROVADO'
    }
]


function FpoEdit() {

    document.title="Consultar FPO";
    
    const { openSnackBarFun } = useContext(SnackBarContext);
    const [pa, setPa] = useState('');
    const [fpo, setFpo] = useState({});
    const [loading, setLoading] = useState(false);


    async function apiGet() {
        setLoading(true);
        try {
            const response = await api.get(`/fpo/get/${pa}`);
            setFpo(response.data);
        } catch (e) {
            const response = e.response.data;
            if(response && response === "NOT EXIST DATE FPO") {
                openSnackBarFun(true, "Nenhum arquivo encontrado data informada, por favor faço o upload do arquivo!");
            } else {
                openSnackBarFun(true, "Nenhum FPO encontrado no arquivo!");
            }
        }
        setLoading(false);
    }

    function auxMask(field, value) {
        switch(field) {
            case 'pa': return maskPointThree(value);
            case 'quantOrcada': return maskPointThree(value);
            case 'quantProd': return maskPointThree(value);
            case 'quantApro': return maskPointThree(value);
            case 'valueUnit': return maskMoney(Number(value));
            case 'valueOrcado': return maskMoney(Number(value));
            case 'valueProd': return maskMoney(Number(value));
            case 'valueApro': return maskMoney(Number(value));
            default: return value;
        }
    }


    return (
        <div className="page-content relative">
            <Container fluid className="mb-10">
                {/* Render Breadcrumbs */}
                <Breadcrumbs title="FPO" breadcrumbItem="Consultar FPO" />
                <AlertCustom
                    msg="A consulta do arquivo FPO é realizada no arquivo configurado em (Arquivos de validações)"
                    type="info"
                />
                <div className="flex justify-center items-end w-full mt-5">
                    <TextField
                        type="text"
                        label="PA"
                        variant="outlined"
                        value={pa}
                        size="small"
                        onChange={ e => {
                            const inputValue = e.target.value;
                            if (!isNaN(Number(e.target.value)) && inputValue.length <= 9) setPa(inputValue);
                        }}
                        className="w-1/2 mt-4 mr-3"
                    />
                    <LoadingButton
                        loading={loading}
                        variant="contained"
                        disabled={pa === '' || pa.length < 9}
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
                    Object.keys(fpo).length > 0 &&
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
                                                                            value={auxMask(fieldName.key, fpo[fieldName.key])}
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

export default FpoEdit;
