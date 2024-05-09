import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ReactApexChart from "react-apexcharts";
import { Card, CardBody } from "reactstrap";
import loadingGif from "../../assets/images/loading/Iphone-spinner-2.gif";
import { maskMoney } from "../../Validation&Formatation/formatation";
import api from "../../services/api";
import AlertCustom from "../../GlobalComponents/AlertCustom";

const initialGraphics = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function LineChartYearly({ year }) {

    const [loading, setLoading] = useState(true);
    const [goalsProd, setGoalsProd] = useState(initialGraphics);
    const [goalsValue, setGoalsValue] = useState(initialGraphics);
    const [error, setError] = useState(false);
    
    useEffect(() => {
        apiGetGoals();
    }, [year]);

    async function apiGetGoals() {
        setLoading(true);
        setError(false);
        try {
            const response = await api.get(`/goal/get/budget/yearly/${year}`);

            setGoalsProd(calculateValues(response.data[0]));
            setGoalsValue(calculateValues(response.data[1]));
        } catch (e) {
            console.log(e);
            setError(true);
        }
        setLoading(false);
    }

    function calculateValues(array) {
        let dates = Array(12).fill(0);
        for (let month = 1; month <= 12; month++) {
            for (let item of array) {
                if (item.hasOwnProperty(String(month))) {
                    dates[month - 1] = item[String(month)];
                }
            }
        }

        return dates;
    }


    return (
        <>
            {!loading ? (
                error ?
                    <div className="my-4">
                        <AlertCustom
                            type="info"
                            msg={`NÃO EXISTE ARQUIVO FPO NO ANO SELECIONADO`}
                        />
                    </div>
                 :
                    <Card className="border-[1px] border-gray-400 rounded-lg h-full">
                        <CardBody>
                            <ReactApexChart
                                options={{
                                    chart: {
                                    height: 350,
                                    type: 'area'
                                    },
                                    dataLabels: {
                                    enabled: false,
                                    formatter: function (val) {
                                        return val;
                                        },
                                    },
                                    stroke: {
                                    curve: 'smooth'
                                    },
                                    xaxis: {
                                    type: 'category',
                                    categories: [
                                        "Janeiro",
                                        "Fevereiro",
                                        "Março",
                                        "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
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
                                                return maskMoney(val);
                                            },
                                        },
                                    },
                                }}
                                series={[
                                    {
                                        name: "Valor Orçado",
                                        data: goalsValue,
                                    },
                                    {
                                        name: "Valor Produzido",
                                        data: goalsProd,
                                    },
                                ]}
                                type="area"
                                height={600}
                            />
                        </CardBody>
                    </Card>

            ) : (
                <div className="flex justify-center items-center w-full h-full">
                    <img src={loadingGif} alt="loading..." />
                </div>
            )}
        </>
    );
}

LineChartYearly.propTypes = {
    budget: PropTypes.any,
    fpoList: PropTypes.any,
};

export default LineChartYearly;
