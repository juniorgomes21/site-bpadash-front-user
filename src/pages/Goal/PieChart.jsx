import React, { useContext, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import PropTypes from "prop-types";
import { Row, Col, Card, CardTitle } from "reactstrap";
import DatePickerContext from "../../contexts/DateGlobalBpa";
import api from "../../services/api";
import loadingGif from "../../assets/images/loading/Iphone-spinner-2.gif";
import { maskPointThree } from "../../Validation&Formatation/formatation";

const options = {
    chart: {
        height: 320,
        type: "pie",
    },
    dataLabels: {
        enabled: true,
        formatter: function (val) {
            return val + "%";
        },
    },
    series: [0, 0],
    labels: ["QUANT. PRODUZIDA", "QUANT. ORÇADA"],
    colors: ["#259efa", "#bde411"],
    legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
        verticalAlign: "middle",
        floating: false,
        fontSize: "14px",
        offsetX: 0,
    },
    responsive: [
        {
            breakpoint: 600,
            options: {
                chart: {
                    height: 240,
                },
                legend: {
                    show: false,
                },
            },
        },
    ],
};

function PieChart({ fpo }) {
    const quantProd = fpo.quantProd;
    const quantOrcada = fpo.quantOrcada;
    const percent = Math.round((quantProd / quantOrcada) * 100);

    const [series, setSeries] = useState([percent, 100 - percent]);
    const [total, setTotal] = useState(0);

    useEffect(() => {}, []);

    return (
        <Card className="border-[1px] border-gray-400 rounded-lg h-full">
            <div className="p-3 mb-6">
                <CardTitle>PREFIXO PA: {fpo.pa}... </CardTitle>
            </div>
            <Row className="justify-content-center">
                <Col sm={4}>
                    <div className="text-center">
                        <h5 className="mb-0 font-size-20">
                            {maskPointThree(fpo.quantOrcada)}
                        </h5>
                        <p className="text-muted">QUANT. ORÇADA</p>
                    </div>
                </Col>
                <Col sm={4}>
                    <div className="text-center">
                        <h5 className="mb-0 font-size-20"></h5>
                        <p className="text-muted"></p>
                    </div>
                </Col>
                <Col sm={4}>
                    <div className="text-center">
                        <h5 className="mb-0 font-size-20">
                            {maskPointThree(fpo.quantProd)}
                        </h5>
                        <p className="text-muted">QUANT. PRODUZIDA</p>
                    </div>
                </Col>
            </Row>
            {quantOrcada === 0 ? (
                <div className="flex justify-center w-full my-20 font-bold">
                    VOCÊ NÃO TEM PROCEDIMENTOS COM ESSE PREFIXO DE PA
                </div>
            ) : (
                <ReactApexChart
                    options={options}
                    series={series}
                    type="pie"
                    height="320"
                />
            )}
        </Card>
    );
}

PieChart.propTypes = {
    fpo: PropTypes.any,
};

export default PieChart;
