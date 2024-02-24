import React, { useContext, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import loadingGif from "../../../assets/images/loading/Iphone-spinner-2.gif";
import api from "../../../services/api";
import DatePickerContext from "../../../contexts/DateGlobalBpa";


function ColumnWithDataLabels() {

    const { month, year, getFormattedDate } = useContext(DatePickerContext);

    const [total, setTotal] = useState(0);
    const [occurrences, setOccurrences] = useState([]);
    const [cnsmed, setCnsmed] = useState([
        "000000000000000",
        "000000000000000",
        "000000000000000",
        "000000000000000",
        "000000000000000",
        "000000000000000",
        "000000000000000",
        "000000000000000",
        "000000000000000",
        "000000000000000"
    ])
    const [cnsmedHover, setCnsmedHover] = useState("");
    const [series, setSeries] = useState([0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0, 0.0, 0.0, 0.0, 0.0]); 
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        getCnsmedPercent();
    }, [month, year])

    async function getCnsmedPercent() {
        setLoading(true);
        try {
            const response = await api.get(`/graphics/cnsmed/used/${getFormattedDate()}`);
            
            let arrayPercents = [];
            let arrayCnsmed = [];
            let occurrences = [];
            console.log(response.data);
            for(let i = 0; i < 10; i++) {
                try {
                    const obj = response.data[i];
                    occurrences.push(obj.occurrences);
                    arrayCnsmed.push(obj.cnsmed);
                    arrayPercents.push(obj.percent);
                } catch(e) {
                    break;
                }
            }

            setCnsmed(arrayCnsmed);
            setOccurrences(occurrences);
            setSeries(arrayPercents);

            let total = 0;
            for (const item of response.data) {
                total += item.occurrences;
            }
            
            setTotal(total);

        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    }

    function handleMouseOver(event, chartContext, config) {
        const categoryIndex = config.dataPointIndex;
        const categories = chartContext.w.config.xaxis.categories;
        if (categories && categories.length > categoryIndex) {
            const hoveredCategory = categories[categoryIndex];
            setCnsmedHover(hoveredCategory);
        }
    }

    function handleMouseOverEnd() {
        setCnsmedHover("");
    }

    return (
        <Card className="border-[1px] border-gray-400 rounded-lg h-full">
            {
                !loading ?
                    <CardBody>
                        <div className="flex w-full justify-between">
                            <CardTitle className="mb-4">
                                ATENDIMENTOS POR CNSMED
                            </CardTitle>
                            <p className="font-bold">
                                Total: {total}
                            </p>
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
                                    categories: cnsmed,
                                    position: "top",
                                    labels: {
                                        offsetY: -18,
                                    },
                                    tooltip: {
                                        enabled: true,
                                        offsetY: -35,
                                    },
                                },
                                colors: ["#23acce"],
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
                                name: "ATENDIMENTOS",
                                data: series,
                            }]}
                            type="bar"
                            height={350}
                            className="apex-charts"
                        />
                        <div className="text-center text-muted">
                            <Row>
                                {
                                    cnsmed.slice(0, 10).map(( cnsmedM, index) => (
                                        <Col xs="4" key={index}>
                                            <div className="mt-4">
                                                <p className={`flex justify-start mb-2 text-truncate ${ cnsmedHover === cnsmedM ? "text-green-500 font-bold" : "text-blue-400"}`}>
                                                    <i className={`mdi mdi-circle me-1`} />{" "}
                                                    {cnsmedM}: ({occurrences[index]} atend.)
                                                </p>
                                            </div>
                                        </Col>
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

export default ColumnWithDataLabels;
