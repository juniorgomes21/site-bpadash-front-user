import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Dropzone from "react-dropzone";
import { Card, CardBody, CardTitle, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import LoadingButton from '@mui/lab/LoadingButton';
import DescriptionIcon from '@mui/icons-material/Description';
import DatePicker from "react-datepicker";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import Storage from "../../Dashboard/Storage";
import api from "../../../services/api";
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SnackBarContext from "../../../contexts/managerService";
import DivErrors from "../DivErrors";
import { formatDate } from "../../../Validation&Formatation/formatation";
import DivLoadingSvg from "../DivLoadingSvg";
import "react-datepicker/dist/react-datepicker.css";


function Upload() {

    document.title="Upload BPA";
    
    const { openSnackBarFun } = useContext(SnackBarContext);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [bytes, setBytes] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [displayedErrors, setDisplayedErrors] = useState([]);
    const [startIndex, setStartIndex] = useState(5);
    const [errorsFile, setErrorsFile] = useState([]);

    async function apiCreateBpa() {
        setLoading(true);
        if (selectedFiles[0].size < 10485760) {
            if(selectedFiles.length > 0) {
                try {
                    const paramNewBpa = {
                        name: name.trim() === '' ? 'Arquivo BPA' : name, // até 20 caracteres
                        description: description.trim() === '' ? 'Sem descrição' : description, // até 100 caracteres
                        date: formatDate(startDate),
                        bytes: bytes
                    };
                    const formData = new FormData();
                    formData.append('file', selectedFiles[0]);
                    formData.append('paramNewBpa', JSON.stringify(paramNewBpa));
                    await api.post('/bpa/create', formData, { headers: { 'Content-Type': 'multipart/form-data'}});
                    reset();
                    openSnackBarFun(false, "Arquivo salvo!");
                } catch(e) {
                    switch (e.response.data[0].errorType) {
                        case "NOT STORAGE":
                            openSnackBarFun(true, "Espaço de armazenamento insuficiente!");
                            break;
                        case "NOT EXIST DATE":
                            openSnackBarFun(true, "Já existe um arquivo com a data informada!");
                            break;
                        case "FILE INVALID":
                            openSnackBarFun(true, "Arquivo não contem linhas BPA-I");
                            break;    
                        default:
                            setErrorsFile(e.response.data);
                            const nextErrors = e.response.data.slice(0, 5);
                            setDisplayedErrors(nextErrors);
                            openSnackBarFun(true, "Arquivo inválido!");
                    }
                }
            }
        } else {
            openSnackBarFun(true, "Arquivo maior que 10MB!");
        }
        setLoading(false);
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
    
        // Adicionar os próximos erros à lista de erros exibidos
        setDisplayedErrors((prevErrors) => [...prevErrors, ...nextErrors]);
    
        // Atualizar o índice para o próximo conjunto de erros
        setStartIndex(startIndex + 5);
    }

    function reset() {
        setName('');
        setStartDate(new Date());
        setErrorsFile([]);
        setDisplayedErrors([]);
        setSelectedFiles([]);
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }

    function getFileSizeFormatted(fileSizeInBytes) {
        const fileSizeKB = fileSizeInBytes * 1.9 / 1024; // Convertendo para KB
        if (fileSizeKB < 1024) {
            return fileSizeKB.toFixed(2) + " KB";
        } else {
            const fileSizeMB = fileSizeKB / 1024; // Convertendo para MB
            if (fileSizeMB < 1024) {
                return fileSizeMB.toFixed(2) + " MB";
            } else {
                const fileSizeGB = fileSizeMB / 1024; // Convertendo para GB
                return fileSizeGB.toFixed(2) + " GB";
            }
        }
    }

    return (
        <React.Fragment>
        <div className="page-content">
            <Container fluid className="mb-10">
            {/* Render Breadcrumbs */}
                <Breadcrumbs title="Projects" breadcrumbItem="Create New" />
                {
                    loading ?
                        <DivLoadingSvg
                            name="BPA"
                        />
                    :
                        <>
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
                                                    value={name}
                                                    className="form-control"
                                                    placeholder="Enter Project Name..."
                                                    onChange={ e => {
                                                        if(e.target.value.length <= 20) setName(e.target.value);
                                                    }}
                                                />
                                            </Col>
                                            </FormGroup>
                                            <FormGroup className="mb-4" row>
                                                <Label
                                                    htmlFor="projectdesc"
                                                    className="col-form-label col-lg-2"
                                                >
                                                    Descrição (Opcional)
                                                </Label>
                                                <Col lg="10">
                                                    <textarea
                                                        className="form-control"
                                                        maxLength={100}
                                                        value={description}
                                                        id="projectdesc"
                                                        rows="3"
                                                        placeholder="Enter Project Description..."
                                                        onChange={e => {
                                                            if(e.target.value.length < 100) setDescription(e.target.value);
                                                        }}
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
                                                        <CardTitle className="mb-4">Novo Documento</CardTitle>
                                                        <Row className="mb-4">
                                                            <Form>
                                                                {
                                                                    selectedFiles.length == 0 &&
                                                                        <Dropzone
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
                                                                                                <strong>{f.formattedSize} / ~ {getFileSizeFormatted(f.size)}</strong>
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
                                <Button
                                    variant="contained"
                                    color="success"
                                    disabled={selectedFiles.length == 0}
                                    startIcon={
                                        <CloudUploadIcon />
                                    }
                                    onClick={() => {
                                        apiCreateBpa()
                                    }}
                                >
                                    Subir arquivo
                                </Button>
                            </div>
                        </>
                }
            </Container>
        </div>
        </React.Fragment>
    );
};

export default Upload;
