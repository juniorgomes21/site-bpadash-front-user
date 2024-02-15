import React, { useContext, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../../components/Common/ChartsDynamicColor";
import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import DatePickerContext from "../../../contexts/DateGlobalBpa";
import api from "../../../services/api";
import loadingGif from "../../../assets/images/loading/Iphone-spinner-2.gif";


const options = {
    chart: {
        height: 320,
        type: "pie",
    },
    dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + "%"
        }
    },
    series: [0, 0],
    labels: ["Homens", "Mulheres"],
    colors: ["#0011fc", "#df04f3"],
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
}

function PieChart() {

    const { month, year, getFormattedDate } = useContext(DatePickerContext);

    const [series, setSeries] = useState([0, 0]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSexPercent();
    }, [month, year])

    async function getSexPercent() {
        setLoading(true);
        try {
            const response = await api.get(`/graphics/sex/per/${getFormattedDate()}`);

            let array = [];
            array.push(response.data.M);
            array.push(response.data.F);

            setTotal(response.data.total);
            setSeries(array);

        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    }

    return (
        <Card className="border-[1px] border-gray-400 rounded-lg h-full">
            {
                !loading ?
                    <>
                        <div className="p-3 mb-6">
                            <CardTitle>Distribuição por Sexo</CardTitle>
                        </div>
                        <Row className="justify-content-center">
                            <Col sm={4}>
                            <div className="text-center">
                                <h5 className="mb-0 font-size-20">{total}</h5>
                                <p className="text-muted">Total</p>
                            </div>
                            </Col>
                            <Col sm={4}>
                            <div className="text-center">
                                <h5 className="mb-0 font-size-20">{Math.round(total * (series[0] / 100))}</h5>
                                <p className="text-muted">Homens</p>
                            </div>
                            </Col>
                            <Col sm={4}>
                            <div className="text-center">
                                <h5 className="mb-0 font-size-20">{Math.round(total * (series[1] / 100))}</h5>
                                <p className="text-muted">Mulheres</p>
                            </div>
                            </Col>
                        </Row>
                        <ReactApexChart
                            options={options}
                            series={series}
                            type="pie"
                            height="320"
                        />
                    </>
                :
                    <div className="flex justify-center items-center w-full h-full">
                        <img src={loadingGif} alt="loading..." />
                    </div>
            }
        </Card>
    )
}

export default PieChart;
