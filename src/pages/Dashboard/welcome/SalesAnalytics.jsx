import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../../components/Common/ChartsDynamicColor";
import api from "../../../services/api";



const colors = [
    "text-success",
    "text-primary",
    "text-orange-600",
    "text-secondary"
]

function SalesAnalytics() {

    const [pas, setPas] = useState([]);
    const [total, setTotal] = useState(0);
    const [series, setSeries] = useState([60, 20, 10, 10]);
    
    useEffect(() => {
        getPercent();
    }, [])

    async function getPercent() {
        try {
            const response = await api.get("/graphics/pa/used");

            const arrayM = response.data;
            setPas(arrayM);
    
            const array = arrayM.slice(0, 3).map(obj => obj.percent);
            const num = 100 - array.reduce((sum, percent) => sum + percent, 0);
    
            array.push(num);
            setSeries(array);

            let sumTotal = arrayM.reduce((sum, item) => sum + item.occurrences, 0);
            setTotal(sumTotal);
        } catch (e) {
            console.log(e);
        }
    }

    const options = {
        labels: [
            pas[0] ? pas[0].occurrences : "",
            pas[1] ? pas[1].occurrences : "",
            pas[2] ? pas[2].occurrences : "",
            total > 0 ? total - pas[0].occurrences - pas[1].occurrences - pas[2].occurrences  : 0
        ],
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
        <>
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
        </>
    )
}

export default SalesAnalytics;

