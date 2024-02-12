import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import api from "../../../services/api";
import DatePickerContext from "../../../contexts/DateGlobalBpa";
import loadingGif from "../../../assets/images/loading/Iphone-spinner-2.gif";


const colors = [
    "text-success",
    "text-primary",
    "text-orange-600",
    "text-secondary"
]

function SalesAnalytics() {

    const { month, year, getFormattedDate } = useContext(DatePickerContext);

    const [pas, setPas] = useState([]);
    const [total, setTotal] = useState(0);
    const [series, setSeries] = useState([25, 25, 25, 25]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        getPercent();
    }, [month, year])

    async function getPercent() {
        setLoading(true);
        try {
            const response = await api.get(`/graphics/pa/used/${getFormattedDate()}`);

            const arrayM = response.data;
            setPas(arrayM);
    
            let sumTotal = arrayM.reduce((sum, item) => sum + item.occurrences, 0);
            setTotal(sumTotal);

            const array = arrayM.slice(0, 3).map(obj => obj.percent);
            const num = 100 - array.reduce((sum, percent) => sum + percent, 0);
    
            array.push(num);
            setSeries(array);

        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    }

    const options = {
        labels: [
            pas[0] ? pas[0].occurrences : "",
            pas[1] ? pas[1].occurrences : "",
            pas[2] ? pas[2].occurrences : "",
            total > 0 ? total - pas[0].occurrences - pas[1].occurrences - pas[2].occurrences  : ""
        ],
        dataLabels: {
            enabled: true,
            formatter: function (val) {
              return val + "%"
            }
        },
        colors: ["#27cf4b", "#423fdd", "#eb5216", "#afb6b0"],
        legend: { show: true },
        plotOptions: {
            pie: {
                donut: {
                    size: "60%",
                },
            },
        }
    }

    return (
        <Card className="border-[1px] border-gray-400 rounded-lg h-full">
            {
                !loading ?
                    <CardBody>
                        <div className="flex justify-between">
                            <h4 className="card-title mb-4">PAs mais utilizados</h4>
                            <h4 className="card-title mb-4">Total: {total}</h4>
                        </div>

                        <div>
                            <div id="donut-chart">
                                <ReactApexChart
                                    options={options}
                                    series={series}
                                    type="donut"
                                    height={260}
                                    className="apex-charts"
                                />
                            </div>
                        </div>

                        <div className="text-center text-muted">
                            <Row>
                                {
                                    pas.slice(0, 4).map(( pa, index) => (
                                        <Col xs="4" key={index}>
                                            <div className="mt-4">
                                                <p className="mb-2 text-truncate">
                                                    <i className={`mdi mdi-circle ${colors[index]} me-1`} />{" "}
                                                    {index < 3 ? pa.pa : "outros PAs"}
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

export default SalesAnalytics;
