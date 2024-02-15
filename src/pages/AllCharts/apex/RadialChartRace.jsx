import React, { useContext, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import DatePickerContext from "../../../contexts/DateGlobalBpa";
import api from "../../../services/api";
import loadingGif from "../../../assets/images/loading/Iphone-spinner-2.gif";
import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";

const colors = [
    "#3fd9e4",
    "#497ef0",
    "#bdeb3e",
    "#5b39d6",
    "#ce1f45",
    "#00ff0d"
]

function RadialChartRace() {
    
    const { month, year, getFormattedDate } = useContext(DatePickerContext);
    
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [series, setSeries] = useState([0, 0, 0, 0, 0, 0]);

    useEffect(() => {
        getRacePercent();
    }, [month, year])

    useEffect(() => {

    }, [total])

    async function getRacePercent() {
        setLoading(true);
        try {
            const response = await api.get(`/graphics/race/${getFormattedDate()}`);
            const obj = response.data;

            setTotal(obj.total);

            let array = [];
            array.push(obj.blank);
            array.push(obj.black);
            array.push(obj.brown);
            array.push(obj.yellow);
            array.push(obj.Indigenous);
            array.push(obj.noInformation);

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
                    <CardBody>
                        <div className="flex justify-between">
                            <CardTitle className="mb-4">Distribuição por Raça</CardTitle>
                            <h4 className="card-title mb-4">Total: {total}</h4>
                        </div>
                        <ReactApexChart
                            options={{
                                labels: [
                                    calculatePercent(series[0]),
                                    calculatePercent(series[1]),
                                    calculatePercent(series[2]),
                                    calculatePercent(series[3]),
                                    calculatePercent(series[4]),
                                    calculatePercent(series[5]),
                                ],
                                legend: { show: true },
                                plotOptions: {
                                    radialBar: {
                                        dataLabels: {
                                            name: {
                                                fontSize: "22px",
                                            },
                                            value: {
                                                fontSize: "20px",
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
                                colors: ["#3fd9e4", "#497ef0", "#bdeb3e", "#5b39d6", "#ce1f45", "#00ff0d"],
                            }}
                            series={series}
                            type="radialBar"
                            height="370"
                            className="apex-charts"
                        />
                        <div className="text-center text-muted">
                            <Row>
                                {
                                    ["Branca", "Preta", "Parda", "Amarela", "Indígena", "Sem informação"].slice(0, 6).map(( race, index) => (
                                        <Col xs="4" key={index}>
                                            <div className="mt-4">
                                                <p className="mb-2 text-truncate">
                                                    <i className={`mdi mdi-circle me-1`} style={{ color: colors[index] }}/>{" "}
                                                    {race}
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

export default RadialChartRace;
