import React, { useContext, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import DatePickerContext from "../../../contexts/DateGlobalBpa";
import api from "../../../services/api";
import loadingGif from "../../../assets/images/loading/Iphone-spinner-2.gif";
import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";

const colors = [
    "#4bdb1f",
    "#b5b811",
    "#c23939"
]

function RadialChart() {
    
    const { month, year, getFormattedDate } = useContext(DatePickerContext);
    
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [series, setSeries] = useState([0, 0, 0]);

    useEffect(() => {
        getAgePercent();
    }, [month, year])

    useEffect(() => {

    }, [total])

    async function getAgePercent() {
        setLoading(true);
        try {
            const response = await api.get(`/graphics/age/${getFormattedDate()}`);
            const obj = response.data;

            setTotal(obj.total);
            
            let array = [];
            array.push(obj.yong);
            array.push(obj.middleAge);
            array.push(obj.old);

            setSeries(array);
            
        } catch (e) {
            console.log(e.response);
        }
        setLoading(false);
    }

    function calculatePercent(percents) {
        const valuePercent = (percents / 100) * total;

        return Math.round(valuePercent);
    }


    return (
        <Card className="border-[1px] border-gray-400 rounded-lg h-full">
                {
                    !loading ?
                        <>
                            <CardBody>
                                <div className="flex w-full justify-between">
                                    <CardTitle className="mb-4">Distribuição por Idade</CardTitle>
                                    <p className="font-bold">
                                        Total: {total}
                                    </p>
                                </div>
                            </CardBody>
                            <ReactApexChart
                                options={{
                                    labels: [
                                        calculatePercent(series[0]),
                                        calculatePercent(series[1]),
                                        calculatePercent(series[2]),
                                    ],
                                    legend: { show: true },
                                    plotOptions: {
                                        radialBar: {
                                            dataLabels: {
                                                name: {
                                                    fontSize: "22px",
                                                },
                                                value: {
                                                    fontSize: "16px",
                                                },
                                                total: {
                                                    show: true,
                                                    label: "Total",
                                                    formatter: function (w) {
                                                        return total;
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    colors: colors,
                                }}
                                series={series}
                                type="radialBar"
                                height="370"
                                className="apex-charts"
                            />
                            <div className="text-center text-muted">
                                <Row>
                                    {
                                        ["0 - 20 anos", "21 - 50 anos", "51 anos+"].slice(0, 3).map(( age, index) => (
                                            <Col xs="4" key={index}>
                                                <div className="mt-4">
                                                    <p className="mb-2 text-truncate">
                                                        <i className={`mdi mdi-circle me-1`} style={{ color: colors[index] }}/>{" "}
                                                        {age}
                                                    </p>
                                                </div>
                                            </Col>
                                        ))
                                    }
                                </Row>
                            </div>
                        </>
                    :
                        <div className="flex justify-center items-center w-full h-full">
                            <img src={loadingGif} alt="loading..." />
                        </div>
                }
            </Card>
    )
}

export default RadialChart;
