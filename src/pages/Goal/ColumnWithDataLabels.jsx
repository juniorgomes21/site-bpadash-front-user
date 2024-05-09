import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import ReactApexChart from "react-apexcharts";
import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import loadingGif from "../../assets/images/loading/Iphone-spinner-2.gif";
import { maskPointThree } from "../../Validation&Formatation/formatation";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Tooltip } from "@mui/material";


function ColumnWithDataLabels({ budget, fpoList }) {

    const listLength = fpoList.length;
    const totalProd = budget.totalProd;

    const [prefixesPa, setPrefixesPa] = useState([
        "000000000",
        "000000000",
        "000000000",
        "000000000",
        "000000000",
        "000000000",
        "000000000",
        "000000000",
        "000000000",
        "000000000"
    ])
    const [prefixesPaHover, setPrefixesPaHover] = useState("");
    const [series, setSeries] = useState([0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]);

    useEffect(() => {
        createGraphics();
        getPrefixesPa();
    }, [fpoList])

    function createGraphics() {
        const array = fpoList.map(fpo => {
            const percentage = (fpo.quantProd / totalProd) * 100;
            return parseFloat(percentage.toFixed(2));
        });
        setSeries(array);
    }

    function getPrefixesPa() {
        const array = fpoList.map(fpo => {
            return fpo.pa;
        });
        setPrefixesPa(array);
    }

    function handleMouseOver(event, chartContext, config) {
        const categoryIndex = config.dataPointIndex;
        const categories = chartContext.w.config.xaxis.categories;
        if (categories && categories.length > categoryIndex) {
            const hoveredCategory = categories[categoryIndex];
            setPrefixesPaHover(hoveredCategory);
        }
    }

    function handleMouseOverEnd() {
        setPrefixesPaHover("");
    }

    return (
        <Card className="border-[1px] border-gray-400 rounded-lg h-full">
            {
                !(listLength === 0) ?
                    <CardBody>
                        <div className="flex w-full justify-between">
                            <CardTitle className="mb-4">
                                <div className="flex items-center">
                                    <p>
                                        METAS
                                    </p>
                                    <Tooltip placement="top" title="Porcentagem de procedimentos produzidos por prefixo de PA">
                                        <InfoOutlinedIcon sx={{ fontSize: 18, ml: 1 }} />
                                    </Tooltip>
                                </div>
                            </CardTitle>
                            <div>
                                <p className="font-bold">
                                    Quant. Produzida: {maskPointThree(totalProd)}
                                </p>
                            </div>
                        </div>
                        <ReactApexChart
                            options={{
                                chart: {
                                    events: {
                                        dataPointMouseEnter: function(event, chartContext, config) {
                                            handleMouseOver(event, chartContext, config);
                                        },
                                        dataPointMouseLeave: function(event, chartContext, config) {
                                            handleMouseOverEnd();
                                        }
                                    },
                                    toolbar: {
                                        show: false,
                                    },
                                },
                                plotOptions: {
                                    bar: {
                                        dataLabels: {
                                            position: "top", // top, center, bottom
                                        },
                                    },
                                },
                                dataLabels: {
                                    enabled: true,
                                    formatter: function (val) {
                                        return val + "%";
                                    },
                                    offsetY: -20,
                                    style: {
                                        fontSize: "12px",
                                        colors: ["#304758"],
                                    },
                                }, xaxis: {
                                    categories: prefixesPa,
                                    position: "top",
                                    labels: {
                                        offsetY: -18,
                                    },
                                    tooltip: {
                                        enabled: true,
                                        offsetY: -35,
                                    },
                                },
                                colors: ["#259efa"],
                                grid: {
                                    borderColor: "#f1f1f1",
                                },
                                fill: {
                                    gradient: {
                                        shade: "light",
                                        type: "horizontal",
                                        shadeIntensity: 0.25,
                                        gradientToColors: undefined,
                                        inverseColors: true,
                                        opacityFrom: 1,
                                        opacityTo: 1,
                                        stops: [50, 0, 100, 100],
                                    },
                                },
                                yaxis: {
                                    axisBorder: {
                                        show: false,
                                    },
                                    axisTicks: {
                                        show: false,
                                    },
                                    labels: {
                                        show: true,
                                        formatter: function (val) {
                                            return val + "%";
                                        },
                                    },
                                },
                                title: {
                                    text: "",
                                    floating: true,
                                    offsetY: 330,
                                    align: "center",
                                    style: {
                                        color: "#444",
                                    },
                                },
                            }}
                            series={[{
                                name: "PROCEDIMENTOS",
                                data: series,
                            }]}
                            type="bar"
                            height={350}
                            className="apex-charts"
                        />
                        <div className="text-center text-muted">
                            <Row className="flex-wrap justify-center w-full">
                                {
                                    prefixesPa.slice(0, 10).map(( prefixePa, index) => (
                                        <div key={index} className="mt-4 w-48">
                                            <p className={`flex justify-start mb-2 text-truncate ${ prefixesPaHover === prefixePa ? "text-green-500 font-bold" : "text-blue-400"}`}>
                                                <i className={`mdi mdi-circle me-1`} />{" "}
                                                {prefixePa}...
                                            </p>
                                        </div>
                                    ))
                                }
                            </Row>
                        </div>
                    </CardBody>
                
                :
                    <div className="flex justify-center items-center w-full h-full">
                        <img src={loadingGif} alt="loading..." />
                    </div>
            }
        </Card>
    )
}

ColumnWithDataLabels.propTypes = {
    budget: PropTypes.any,
    fpoList: PropTypes.any
};

export default ColumnWithDataLabels;
