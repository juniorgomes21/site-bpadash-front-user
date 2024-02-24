import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import Storage from "../../Dashboard/Storage";
import { Card, CardBody, CardTitle, Col, Container, Form, Row } from "reactstrap";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Dropzone from "react-dropzone";
import SnackBarContext from "../../../contexts/managerService";
import api from "../../../services/api";
import LoadingButton from "@mui/lab/LoadingButton";
import DescriptionIcon from '@mui/icons-material/Description';
import DivLoadingSvg from '../DivLoadingSvg';
import DivErrors from "../DivErrors";
import Button from '@mui/material/Button';

function UploadBpai(props) {

    document.title="Upload BPA-I";

    const { openSnackBarFun } = useContext(SnackBarContext);
    const [bytes, setBytes] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [loadingDates, setLoadingDates] = useState(true);
    const [displayedErrors, setDisplayedErrors] = useState([]);
    const [startIndex, setStartIndex] = useState(5);
    const [errorsFile, setErrorsFile] = useState([]);
    const [errorMonth, setErrorMonth] = useState(false);
    const [errorYear, setErrorYear] = useState(false);
    const [dates, setDates] = useState([]);
    const uniqueYears = Array.from(new Set(dates.map(item => item[1])));
    const monthsForSelectedYear = dates.filter(item => item[1] === parseInt(year, 10)).map(item => item[0]);
    
    useEffect(() => {
        getDates();
    }, [])

    useEffect(() => {
        const availableMonths = dates.filter(item => item[1] === parseInt(year, 10)).map(item => item[0]);
        setMonth(availableMonths.length > 0 ? availableMonths[0] : '');
    }, [year]);

    async function getDates() {
        try {
            const response = await api.get("/bpa/dates");
            setDates(response.data.dates);
        } catch(e) {
            console.log(e.response);
        }
        setLoadingDates(false);
    }

    async function apiCreateBpai() {
        setLoading(true);
        if (selectedFiles[0].size < 10485760) {
            if(isValid()) {
                try {
                    const formData = new FormData();
                    formData.append('file', selectedFiles[0]);
                    await api.post(`/bpai/create/${month}/${year}`, formData, { headers: { 'Content-Type': 'multipart/form-data'}});
                    reset();
                    openSnackBarFun(false, "BPA-I salvo!");
                } catch(e) {
                    const response = e.response.data[0];

                    switch (response && response.errorType) {
                        case "NOT STORAGE":
                            openSnackBarFun(true, "Espaço de armazenamento insuficiente!");
                            break;
                        case "NOT EXIST DATE":
                            openSnackBarFun(true, "Não existe um arquivo com a data informada!");
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

    function getMonthName(monthNumber) {
        const monthNames = [
          'Janeiro', 'Fevereiro', 'Março', 'Abril',
          'Maio', 'Junho', 'Julho', 'Agosto',
          'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        return monthNames[monthNumber - 1];
    }

    function reset() {
        setErrorMonth(false);
        setErrorYear(false);
        setSelectedFiles([]);
        setErrorsFile([]);
        setDisplayedErrors([]);
    }

    function isValid() {
        if(selectedFiles.length > 0 && month != '' && year != '') {
            return true;
        } else {
            setErrorMonth(!(month != ''));
            setErrorYear(!(year != ''));

            return false;
        }
    }

    function loadMoreErrors() {
        const nextErrors = errorsFile.slice(startIndex, startIndex + 5);
    
        // Adicionar os próximos erros à lista de erros exibidos
        setDisplayedErrors((prevErrors) => [...prevErrors, ...nextErrors]);
    
        // Atualizar o índice para o próximo conjunto de erros
        setStartIndex(startIndex + 5);
    }

    return (
        <>
        <div className="page-content">
            <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumbs title={props.t("Upload BPA-I")} breadcrumbItem={props.t("Upload BPA-I")} />
                {
                    loading ?
                        <DivLoadingSvg
                            name="BPA-I"
                        />
                    : 
                        dates.length == 0 ?
                            <div className="flex justify-center text-base mt-6 w-full">
                                <p>Você não tem nenhum arquivo BPA faça upload <Link to="/upload/bpa" className="text-blue-500">agora</Link>!</p>
                            </div>
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
                                <div className="flex justify-center w-full mb-10">
                                    <h2 className="text-lg text-center">Selecione a data do arquivo BPA onde será adicionado o arquivo BPA-I (Selecione primeiro o ANO)</h2>
                                </div>
                                <div className="flex justify-center">
                                    <div className="mr-10">
                                        <div className="mb-2">
                                            <p className="text-base">Selecione o mês desejado</p>
                                        </div>
                                        <FormControl
                                            fullWidth
                                            error={errorMonth}
                                        >
                                            <InputLabel id="demo-simple-select-label">{'Mês'}</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                disabled={year === ''}
                                                value={month}
                                                label={'Mês'}
                                                onChange={handleChangeMonth}
                                                >
                                                {monthsForSelectedYear.map((item, index) => (
                                                    <MenuItem key={index} value={item}>
                                                        {getMonthName(item)}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div>
                                        <div className="mb-2">
                                        <p className="text-base">Selecione o ano desejado</p>
                                        </div>
                                        <FormControl
                                            fullWidth
                                            error={errorYear}
                                        >
                                            <InputLabel id="demo-simple-select-label">{'Ano'}</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={year}
                                                label={'Ano'}
                                                onChange={handleChangeYear}
                                            >
                                            {uniqueYears.map((item, index) => (
                                                <MenuItem key={index} value={item}>
                                                    {item}
                                                </MenuItem>
                                            ))}
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
                                        color="success"
                                        variant="contained"
                                        loading={loading}
                                        disabled={selectedFiles.length == 0}
                                        onClick={apiCreateBpai}
                                    >
                                        Salvar Arquivo
                                    </LoadingButton>
                                </div>
                            </>
                }
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
