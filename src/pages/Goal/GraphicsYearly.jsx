import PropTypes from "prop-types";
import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import api from "../../services/api";
import loadingGif from "../../assets/images/loading/Iphone-spinner-2.gif";
import LineChartYearly from "./LineChartYearly";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AlertCustom from "../../GlobalComponents/AlertCustom";


function GraphicsYearly(props) {
    document.title = "Meta Anual FPO ";

    const [year, setYear] = useState('');
    const [loading, setLoading] = useState(true);
    const [datesYears, setDatesYears] = useState([]);

    useEffect(() => {
        getDates();
    }, []);

    async function getDates() {
        setLoading(true);
        try {
            const response = await api.get("/fpo/dates");
            setDatesYears(getUniqueYears(response.data.dates));
        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    }

    function getUniqueYears(arrayDates) {
        let yearSingle = {};
    
        arrayDates.forEach(data => {
            let ano = data[1];
    
            if (!yearSingle[ano]) {
                yearSingle[ano] = true;
            }
        });
    
        let result = Object.keys(yearSingle).map(Number);
    
        result.sort((a, b) => b - a);

        setYear(result[0]);

        return result;
    }

    function handleChange(event) {
        setYear(event.target.value);
    }

      
    return (
        <>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs
                        title={props.t("Gráficos FPO meta")}
                        breadcrumbItem={props.t("Meta FPO")}
                    />
                    {!loading ? (
                        datesYears.length == 0 ? (
                            <div>
                                <AlertCustom
                                    type="info"
                                    msg="NÃO EXISTE NENHUM ARQUIVO FPO"
                                />
                            </div>
                        ) : (
                            <Row>
                                <div className="flex justify-end w-full my-5">
                                    <FormControl
                                        className="w-56"
                                    >
                                        <InputLabel id="demo-simple-select-label">SELECIONE O ANO</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={year}
                                            label="SELECIONE O ANO"
                                            onChange={handleChange}
                                        >
                                            {
                                                datesYears.map((item, index) => (
                                                    <MenuItem key={index} value={item}>{item}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl> 
                                </div>
                                <Col lg={12}>
                                    <LineChartYearly
                                        year={year}
                                    />
                                </Col>
                            </Row>
                        )
                    ) : (
                        <div className="flex justify-center items-center w-full h-full">
                            <img src={loadingGif} alt="loading..." />
                        </div>
                    )}
                </Container>
            </div>
        </>
    );
}

GraphicsYearly.propTypes = {
    t: PropTypes.any,
    chartsData: PropTypes.any,
    onGetChartsData: PropTypes.func,
};

export default withTranslation()(GraphicsYearly);
