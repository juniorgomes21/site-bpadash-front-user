import React, { useContext, useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { Card, CardBody, CardTitle, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import LoadingButton from '@mui/lab/LoadingButton';
import DescriptionIcon from '@mui/icons-material/Description';
import DatePicker from "react-datepicker";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Storage from "../Dashboard/Storage";
import api from "../../services/api";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SnackBarContext from "../../contexts/managerService";
import "react-datepicker/dist/react-datepicker.css";
import DivErrors from "./DivErrors";

function Fpo() {

    document.title="Novo Documento FPO";
    
    const { openSnackBarFun } = useContext(SnackBarContext);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [bytes, setBytes] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [displayedErrors, setDisplayedErrors] = useState([]);
    const [startIndex, setStartIndex] = useState(5);
    const [errorsFile, setErrorsFile] = useState([]);

    async function apiCreateFPO() {
        setLoading(true);
        try {
            const paramNewFpo = {
                name: name === '' ? "Arquivo FPO" : name,
                date: formatDate(startDate),
                bytes: bytes
            };
            const formData = new FormData();
            formData.append('file', selectedFiles[0]);
            formData.append('paramNewFpo', JSON.stringify(paramNewFpo));
            console.log(paramNewFpo);
            await api.post('/fpo/create', formData, { headers: { 'Content-Type': 'multipart/form-data'}});
            reset();
            openSnackBarFun(false, "Arquivo salvo!");
        } catch(e) {
            console.log(e.response.data);
            switch (e.response.data[0].errorType) {
                case "NOT STORAGE":
                    openSnackBarFun(true, "Espaço de armazenamento insuficiente!");
                    break;
                case "EXIST DATE":
                    openSnackBarFun(true, "Já existe um arquivo com a data informada!");
                    break;
                default:
                    setErrorsFile(e.response.data);
                    const nextErrors = e.response.data.slice(0, 5);
                    setDisplayedErrors(nextErrors);
                    openSnackBarFun(true, "Arquivo inválido!");
            }
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
        console.log(date);
        console.log(formatDate(date));
    };

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
    
        // Adicionar os próximos erros à lista de erros exibidos
        setDisplayedErrors((prevErrors) => [...prevErrors, ...nextErrors]);
    
        // Atualizar o índice para o próximo conjunto de erros
        setStartIndex(startIndex + 5);
    };

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
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
                    <Breadcrumbs title="FPO" breadcrumbItem="Upload FPO" />
                    <div className="flex w-full justify-center">
                        <Storage dataColors='' />
                    </div>
                    <DivErrors
                        errorsFile={errorsFile}
                        startIndex={startIndex}
                        displayedErrors={displayedErrors}
                        loadMoreErrors={loadMoreErrors}
                    />
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
                                            Data (Opcional)
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
                                                <CardTitle className="mb-4">Novo Documento FPO</CardTitle>
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
                        <LoadingButton
                            variant="contained"
                            startIcon={
                                <CloudUploadIcon />
                            }
                            loading={loading}
                            onClick={() => {
                                apiCreateFPO()
                            }}
                        >
                            Subir arquivo
                        </LoadingButton>
                    </div>
                </Container>
            </div>
        </>
    );
};

export default Fpo;
