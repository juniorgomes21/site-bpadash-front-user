import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import Storage from "../Dashboard/Storage";
import { Card, CardBody, CardTitle, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Dropzone from "react-dropzone";
import SnackBarContext from "../../contexts/managerService";
import api from "../../services/api";
import LoadingButton from "@mui/lab/LoadingButton";
import DescriptionIcon from '@mui/icons-material/Description';


function UploadBpai(props) {

    document.title="Upload BPA-I";

    const { openSnackBarFun } = useContext(SnackBarContext);
    const [bytes, setBytes] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [month, setMonth] = useState(localStorage.getItem("@Month"));
    const [year, setYear] = useState(localStorage.getItem("@Year"));
    const [displayedErrors, setDisplayedErrors] = useState([]);
    const [startIndex, setStartIndex] = useState(5);
    const [errorsFile, setErrorsFile] = useState([]);
    
    async function apiCreateBpa() {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFiles[0]);
            await api.post(`/bpai/create/${month}/${year}`, formData, { headers: { 'Content-Type': 'multipart/form-data'}});
            openSnackBarFun(false, "BPA-I salvo!");
        } catch(e) {
            openSnackBarFun(true, "Não existe nenhum BPA salvo na data escolhida!");
            console.log(e.response);
        }
        setLoading(false);
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

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }

    function handleChangeMonth(event) {
        setMonth(event.target.value);
    }

    function handleChangeYear(event) {
        setYear(event.target.value);
    }

    return (
        <>
        <div className="page-content">
            <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumbs title={props.t("Upload BPA-I")} breadcrumbItem={props.t("Upload BPA-I")} />
                <div className="flex w-full justify-center">
                    <Storage dataColors='' />
                </div>
                <div className="flex justify-center w-full mb-10">
                    <h2 className="text-lg text-center">Selecione a data do arquivo BPA onde será adicionado o arquivo BPA-I</h2>
                </div>
                <div className="flex justify-center">
                <div className="mr-10">
                    <div className="mb-2">
                    <p className="text-base">Selecione o mês desejado</p>
                    </div>
                    <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">{'mês ' + month}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={month}
                        label={'mês ' + month}
                        onChange={handleChangeMonth}
                    >
                        <MenuItem value={"01"}>Janeiro</MenuItem>
                        <MenuItem value={"02"}>Fevereiro</MenuItem>
                        <MenuItem value={"03"}>Março</MenuItem>
                        <MenuItem value={"04"}>Abril</MenuItem>
                        <MenuItem value={"05"}>Maio</MenuItem>
                        <MenuItem value={"06"}>junho</MenuItem>
                        <MenuItem value={"07"}>Julho</MenuItem>
                        <MenuItem value={"08"}>Agosto</MenuItem>
                        <MenuItem value={"09"}>Setembro</MenuItem>
                        <MenuItem value={10}>Outubro</MenuItem>
                        <MenuItem value={11}>Novembro</MenuItem>
                        <MenuItem value={12}>Dezembro</MenuItem>
                    </Select>
                    </FormControl>
                </div>
                <div>
                    <div className="mb-2">
                    <p className="text-base">Selecione o ano desejado</p>
                    </div>
                    <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">{year}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={year}
                        label={year}
                        onChange={handleChangeYear}
                    >
                        {
                        Array.from({ length: 20 }, (_, index) => (
                            <MenuItem key={index} value={2023 - index}>{2023 - index}</MenuItem>
                        ))
                        }
                    </Select>
                    </FormControl>
                </div>

                </div>
                <Row className="mt-5 border-[1px] border-default rounded-xl">
                    <Col lg="12">
                        <Card>
                            <CardBody>
                            <CardTitle className="mb-4">Novo Documento</CardTitle>
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
                <div className="flex justify-end mt-4">
                    <LoadingButton
                        color="success"
                        variant="contained"
                        loading={loading}
                        onClick={apiCreateBpa}
                    >
                        Salvar Arquivo
                    </LoadingButton>
                </div>
            </Container>
        </div>

        </>
    );
};

UploadBpai.propTypes = {
    t: PropTypes.any,
    chartsData: PropTypes.any,
    onGetChartsData: PropTypes.func,
};

export default withTranslation()(UploadBpai);
