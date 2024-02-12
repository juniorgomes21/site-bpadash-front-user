import React, { useState, useEffect, useContext } from "react";
import ReactApexChart from "react-apexcharts";
import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import loadingGif from "../../../assets/images/loading/Iphone-spinner-2.gif";
import api from "../../../services/api";
import DatePickerContext from "../../../contexts/DateGlobalBpa";


function barchart() {

    const { month, year, getFormattedDate } = useContext(DatePickerContext);

    const [total, setTotal] = useState(0);
    const [occurrences, setOccurrences] = useState([]);
    const [cboHover, setCboHover] = useState("");
    const [cbo, setCbo] = useState([
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000"
    ])
    const [series, setSeries] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        getCboPercent();
    }, [month, year])

    async function getCboPercent() {
        setLoading(true);
        try {
            const response = await api.get(`/graphics/cbo/used/${getFormattedDate()}`);
            
            let arrayCbo = [];
            let arrayPercents = [];
            let occurrences = [];

            for(let i = 0; i < 10; i++) {
                const obj = response.data[i];

                arrayPercents.push(obj.percent);
                arrayCbo.push(obj.cbo);
                occurrences.push(obj.occurrences);
            }

            setCbo(arrayCbo);
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
            setCboHover(hoveredCategory);
        }
    }

    function handleMouseOverEnd() {
        setCboHover("");
    }

    return (
        <Card className="border-[1px] border-gray-400 rounded-lg h-full">
            {
                !loading ?
                    <CardBody>
                        <div className="flex w-full justify-between">
                            <CardTitle className="mb-4">
                                Distribuição por CBO
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
                                        horizontal: true,
                                    },
                                },
                                dataLabels: {
                                    enabled: false,
                                },
                        
                                colors: "#80df14",
                                grid: {
                                    borderColor: "#f1f1f1",
                                },
                                xaxis: {
                                    categories: cbo
                                },
                                yaxis: {
                                    axisBorder: {
                                        show: false,
                                    },
                                    axisTicks: {
                                        show: false,
                                    },
                                    labels: {
                                        show: false,
                                        formatter: function (val) {
                                            
                                            return val.length === 6 ? val : val + "%";
                                        },
                                    },
                                },
                            }}
                            series={[{
                                name: "CBO",
                                data: series,
                            }]}
                            type="bar"
                            height="350"
                        />
                        <div className="text-center text-muted">
                            <Row>
                                {
                                    cbo.slice(0, 10).map(( cboM, index) => (
                                        <Col xs="4" key={index}>
                                            <div className="mt-4">
                                                <p className={`flex justify-start mb-2 text-truncate ${ cboHover === cboM ? "text-indigo-500 font-bold" : "text-green-500"}`}>
                                                    <i className={`mdi mdi-circle me-1`} />{" "}
                                                    {cboM}: ({occurrences[index]} atend.)
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

export default barchart;
