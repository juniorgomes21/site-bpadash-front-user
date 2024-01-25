import PropTypes from "prop-types";
import React, { useState } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { Card, CardBody, CardTitle, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { maskCell, maskCEP } from "../../Validation&Formatation/formatation";
import LoadingButton from "@mui/lab/LoadingButton";

function Profile(props) {

    document.title="Cadastro";

    const [user, setUser] = useState(JSON.parse(localStorage.getItem("@User")));


    return (
        <>
            <div className="page-content">
            <Container fluid>
                {/* Render Breadcrumb */}
                <Breadcrumbs
                title={props.t("Cadastro")}
                breadcrumbItem={props.t("Cadastro")}
                />
                <Row>
                    <Col lg="12">
                        <Card>
                            <CardBody>
                                <CardTitle className="mb-4">Minhas Informações</CardTitle>
                                <Form>
                                    <FormGroup className="mb-4" row>
                                    <Label
                                        htmlFor="projectname"
                                        className="col-form-label col-lg-2"
                                    >
                                        EMPRESA
                                    </Label>
                                    <Col lg="10">
                                        <Input
                                            id="projectname"
                                            name="projectname"
                                            type="text"
                                            disabled
                                            value={user.name}
                                            className="form-control"
                                            placeholder="Nome do arquivo"
                                            onChange={ e => {
                                                if(!isNaN(Number(e.target.value)) && e.target.value.length <= 20) setUser({...user, ["name"]: e.target.value });
                                            }}
                                        />
                                    </Col>
                                    </FormGroup>
                                    <FormGroup className="mb-4" row>
                                        <Label
                                            htmlFor="projectname"
                                            className="col-form-label col-lg-2"
                                        >
                                            EMAIL
                                        </Label>
                                        <Col lg="10">
                                            <Input
                                                id="projectname"
                                                name="projectname"
                                                type="text"
                                                disabled
                                                value={user.email}
                                                className="form-control"
                                                placeholder="Nome do arquivo"
                                                onChange={ e => {
                                                    if(!isNaN(Number(e.target.value)) && e.target.value.length <= 50) setUser({ ...user, ["email"]: e.target.value });
                                                }}
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup className="mb-4" row>
                                        <Label
                                            htmlFor="projectname"
                                            className="col-form-label col-lg-2"
                                        >
                                            CELULAR
                                        </Label>
                                        <Col lg="10">
                                            <Input
                                                id="projectname"
                                                name="projectname"
                                                type="text"
                                                disabled
                                                value={maskCell(user.cell)}
                                                className="form-control"
                                                placeholder="Nome do arquivo"
                                                onChange={ e => {
                                                    if(!isNaN(Number(e.target.value)) && e.target.value.length <= 14) setUser({ ...user, ["cell"]: e.target.value });
                                                }}
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup className="mb-4" row>
                                        <Label
                                            htmlFor="projectname"
                                            className="col-form-label col-lg-2"
                                        >
                                            ARMAZENAMENTO
                                        </Label>
                                        <Col lg="10">
                                            <Input
                                                id="projectname"
                                                name="projectname"
                                                type="text"
                                                disabled
                                                value={user.storageTotal}
                                                className="form-control"
                                                placeholder="Nome do arquivo"
                                            />
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                            <CardBody>
                                <CardTitle className="mb-4">Endereço</CardTitle>
                                <Form>
                                    <FormGroup className="mb-4" row>
                                    <Label
                                        htmlFor="projectname"
                                        className="col-form-label col-lg-2"
                                    >
                                        CEP
                                    </Label>
                                    <Col lg="10">
                                        <Input
                                            id="projectname"
                                            name="projectname"
                                            type="text"
                                            disabled
                                            value={maskCEP(user.address.cep)}
                                            className="form-control"
                                            placeholder="Nome do arquivo"
                                            // onChange={ e => {
                                            //     if(!isNaN(Number(e.target.value)) && e.target.value.length <= 20) setUser({...user, ["name"]: e.target.value });
                                            // }}
                                        />
                                    </Col>
                                    </FormGroup>
                                    <FormGroup className="mb-4" row>
                                        <Label
                                            htmlFor="projectname"
                                            className="col-form-label col-lg-2"
                                        >
                                            LOCALIDADE
                                        </Label>
                                        <Col lg="10">
                                            <Input
                                                id="projectname"
                                                name="projectname"
                                                type="text"
                                                disabled
                                                value={user.address.localidade}
                                                className="form-control"
                                                placeholder="Nome do arquivo"
                                                onChange={ e => {
                                                    if(!isNaN(Number(e.target.value)) && e.target.value.length <= 50) setUser({ ...user, ["email"]: e.target.value });
                                                }}
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup className="mb-4" row>
                                        <Label
                                            htmlFor="projectname"
                                            className="col-form-label col-lg-2"
                                        >
                                            UF
                                        </Label>
                                        <Col lg="10">
                                            <Input
                                                id="projectname"
                                                name="projectname"
                                                type="text"
                                                disabled
                                                value={user.address.uf}
                                                className="form-control"
                                                placeholder="Nome do arquivo"
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup className="mb-4" row>
                                        <Label
                                            htmlFor="projectname"
                                            className="col-form-label col-lg-2"
                                        >
                                            BAIRRO
                                        </Label>
                                        <Col lg="10">
                                            <Input
                                                id="projectname"
                                                name="projectname"
                                                type="text"
                                                disabled
                                                value={user.address.bairro}
                                                className="form-control"
                                                placeholder="Nome do arquivo"
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup className="mb-4" row>
                                        <Label
                                            htmlFor="projectname"
                                            className="col-form-label col-lg-2"
                                        >
                                            RUA
                                        </Label>
                                        <Col lg="10">
                                            <Input
                                                id="projectname"
                                                name="projectname"
                                                type="text"
                                                disabled
                                                value={user.address.logradouro}
                                                className="form-control"
                                                placeholder="Nome do arquivo"
                                            />
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                {/* <div>
                    <LoadingButton
                        variant="contained"
                        color="success"
                        loading={loading}
                    >
                        SALVAR
                    </LoadingButton>
                </div> */}
            </Container>
            </div>
        </>
    )
};

Profile.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(Profile);
