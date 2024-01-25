import React, { useContext, useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { Card, CardBody, CardTitle, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import DescriptionIcon from '@mui/icons-material/Description';
import DatePicker from "react-datepicker";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import Storage from "../../Dashboard/Storage";
import api from "../../../services/api";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SnackBarContext from "../../../contexts/managerService";
import DivErrors from "../DivErrors";
import DivLoadingSvg from "../DivLoadingSvg";
import { formatBytes } from "../../../Validation&Formatation/formatation";
import "react-datepicker/dist/react-datepicker.css";

function UploadProfessional() {

    document.title="Novo Documento de Profissionais";
    
    const { openSnackBarFun } = useContext(SnackBarContext);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [bytes, setBytes] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [displayedErrors, setDisplayedErrors] = useState([]);
    const [startIndex, setStartIndex] = useState(5);
    const [errorsFile, setErrorsFile] = useState([]);

    async function apiCreate() {
        setLoading(true);
        if (selectedFiles[0].size < 10485760) {
            if(selectedFiles.length > 0) {
                try {
                    const paramNewProfessionals = {
                        name: name === '' ? "Arquivo Profissionais" : name,
                        date: formatDate(startDate),
                        bytes: bytes
                    };
                    const formData = new FormData();
                    formData.append('file', selectedFiles[0]);
                    formData.append('paramNewProfessionals', JSON.stringify(paramNewProfessionals));
                    await api.post('/prof/create', formData, { headers: { 'Content-Type': 'multipart/form-data'}});
                    reset();
                    openSnackBarFun(false, "Arquivo salvo!");
                } catch(e) {
                    switch (e.response.data[0] && e.response.data[0].errorType) {
                        case "EXIST DATE":
                            openSnackBarFun(true, "Já existe um arquivo de profissionais na data informada!");
                            break;
                        case "NOT STORAGE":
                            openSnackBarFun(true, "Espaço de armazenamento insuficiente!");
                            break;
                        case "FILE INVALID":
                            openSnackBarFun(true, "Espaço de armazenamento insuficiente!");
                            break;
                        default:
                            openSnackBarFun();
                    }
                }
            }
        } else {
            openSnackBarFun(true, "Arquivo maior que 10MB!");
        }
        setLoading(false);
    }

    function formatDate(date) {

        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return year + "-" + (month < 10 ? "0" + month : month) + "-01";
    }

    function startDateChange(date) {
        setStartDate(date);
    }

    function handleAcceptedFiles(files) {
        files.map(file =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
                formattedSize: formatBytes(file.size)
            })
        );

        setSelectedFiles(files);
        setBytes(files[0].size);
    }

    function loadMoreErrors() {
        const nextErrors = errorsFile.slice(startIndex, startIndex + 5);
        setDisplayedErrors((prevErrors) => [...prevErrors, ...nextErrors]);
        setStartIndex(startIndex + 5);
    }

    function reset() {
        setName('');
        setStartDate(new Date());
        setErrorsFile([]);
        setDisplayedErrors([]);
        setSelectedFiles([]);
    }

    return (
        <>
            <div className="page-content">
                <Container fluid className="mb-10">
                {/* Render Breadcrumbs */}
                {
                    loading ?
                        <DivLoadingSvg
                            name="de PROFISSIONAIS"
                        />
                    :
                        <>
                            <Breadcrumbs title="Profissionais" breadcrumbItem="Upload Profissionais" />
                            <div className="flex w-full justify-center">
                                <Storage dataColors='' />
                            </div>
                            {
                                errorsFile.length > 0 &&
                                    <DivErrors
                                        errorsFile={errorsFile}
                                        startIndex={startIndex}
                                        displayedErrors={displayedErrors}
                                        loadMoreErrors={loadMoreErrors}
                                    />
                            }
                            <Row>
                                <Col lg="12">
                                    <Card>
                                        <CardBody>
                                        <CardTitle className="mb-4">Novo Documento</CardTitle>
                                        <Form>
                                            <FormGroup className="mb-4" row>
                                            <Label
                                                htmlFor="projectname"
                                                className="col-form-label col-lg-2"
                                            >
                                                Nome (Optinal)
                                            </Label>
                                            <Col lg="10">
                                                <Input
                                                    id="projectname"
                                                    name="projectname"
                                                    type="text"
                                                    maxLength={20}
                                                    className="form-control"
                                                    value={name}
                                                    onChange={ e => {
                                                        setName(e.target.value);
                                                    }}
                                                    placeholder="Nome do arquivo"
                                                />
                                            </Col>
                                            </FormGroup>
                                            <FormGroup className="mb-4" row>
                                                <Label className="col-form-label col-lg-2">
                                                    Data
                                                </Label>
                                                <Col lg="10">
                                                    <Row>
                                                        <Col className="flex justify-end">
                                                            <DatePicker
                                                                className="form-control"
                                                                selected={startDate}
                                                                onChange={startDateChange}
                                                                dateFormat="MM/yyyy"
                                                                showMonthYearPicker
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </FormGroup>
                                        </Form>
                                        <Row className="mt-5 border-[1px] border-default rounded-xl">
                                            <Col lg="12">
                                                <Card>
                                                    <CardBody>
                                                        <CardTitle className="mb-4">Novo Documento de Profissionais</CardTitle>
                                                        <Row className="mb-4">
                                                            <Form>
                                                                { selectedFiles.length == 0 && <Dropzone
                                                                onDrop={acceptedFiles => {
                                                                    handleAcceptedFiles(acceptedFiles);
                                                                }}
                                                                >
                                                                {({ getRootProps, getInputProps }) => (
                                                                    <div className="dropzone">
                                                                    <div
                                                                        className="dz-message needsclick"
                                                                        {...getRootProps()}
                                                                    >
                                                                        <input {...getInputProps()} />
                                                                        <div className="dz-message needsclick">
                                                                            <div className="mb-3">
                                                                                <i className="display-4 text-muted bx bxs-cloud-upload" />
                                                                            </div>
                                                                            <h4>Solte os arquivos aqui ou clique para fazer upload.</h4>
                                                                        </div>
                                                                    </div>
                                                                    </div>
                                                                )}
                                                                </Dropzone>
                                                                }
                                                                <div
                                                                    className="flex justify-center dropzone-previews mt-3"
                                                                    id="file-previews"
                                                                >
                                                                {selectedFiles.map((f, i) => {
                                                                    return (
                                                                        <Card
                                                                            className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                                                            key={i + "-file"}
                                                                        >
                                                                            <div className="p-2">
                                                                                <Row className="align-items-center">
                                                                                    <Col className="col-auto">
                                                                                        <DescriptionIcon style={{ fontSize: 45, color: "green" }}/>
                                                                                    </Col>
                                                                                    <Col>
                                                                                        <p className="text-muted font-weight-bold text-base">
                                                                                            {f.name}
                                                                                        </p>
                                                                                        <p className="mb-0 text-base">
                                                                                            <strong>{f.formattedSize}</strong>
                                                                                        </p>
                                                                                    </Col>
                                                                                </Row>
                                                                            </div>
                                                                        </Card>
                                                                    );
                                                                })}
                                                                </div>
                                                            </Form>
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                            <div className="flex justify-end">
                                {
                                    selectedFiles.length > 0 && !loading &&
                                        <Button
                                            variant="contained"
                                            onClick={() => {
                                                setSelectedFiles([]);
                                            }}
                                            sx={{
                                                mr: 2
                                            }}
                                        >
                                            Limpar
                                        </Button>
                                }
                                <LoadingButton
                                    variant="contained"
                                    color="success"
                                    startIcon={
                                        <CloudUploadIcon />
                                    }
                                    loading={loading}
                                    onClick={() => {
                                        apiCreate()
                                    }}
                                >
                                    Subir arquivo
                                </LoadingButton>
                            </div>
                        </>
                    }
                </Container>
            </div>
        </>
    );
};

export default UploadProfessional;
