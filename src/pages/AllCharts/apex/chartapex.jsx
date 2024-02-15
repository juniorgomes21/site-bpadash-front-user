import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardBody, CardTitle } from "reactstrap";
import api from "../../../services/api";
import loadingGif from "../../../assets/images/loading/Iphone-spinner-2.gif";


const options = {
    chart: {
        height: 380,
        type: "line",
        zoom: {
            enabled: false,
        },
        toolbar: {
            show: false,
        },
    },
    colors: ["#0011fc", "#df04f3"],
    dataLabels: {
        enabled: false,
    },
    stroke: {
        width: [3, 3],
        curve: "straight",
    },
    title: {
        text: "",
        align: "left",
        style: {
            fontWeight: "500",
        },
    },
    grid: {
        row: {
            colors: ["transparent", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.2,
        },
        borderColor: "#f1f1f1",
    },
    markers: {
        style: "inverted",
        size: 6,
    },
    xaxis: {
        categories: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        title: {
            text: "",
        },
    },
    yaxis: {
        title: {
            text: "Temperature",
        },
        min: 0,
    },
    legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
    },
    responsive: [
        {
            breakpoint: 600,
            options: {
                chart: {
                    toolbar: {
                        show: false,
                    },
                },
                legend: {
                    show: false,
                },
            },
        },
    ],
};

function chartapex({ year }) {

    const [mans, setMans] = useState([]);
    const [womans, setWomans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFiles();
    }, [year]);

    async function getFiles() {
        setLoading(true);
        try {
            const response = await api.get(`/graphics/sex/${year}`);
            setMans(response.data.mans);
            setWomans(response.data.womans);
        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    }


    return (
        <Card className="border-[1px] border-zinc-400 h-full">
            {
                !loading ?
                    <CardBody>
                        <CardTitle className="mb-4">
                            Distribuição por Sexo
                        </CardTitle>
                        <ReactApexChart
                            options={options}
                            series={[
                                { name: "Homem", data: mans},
                                { name: "Mulher", data: womans},
                            ]}
                            type="line"
                            height="380"
                            className="apex-charts"
                        />
                    </CardBody>
                :
                    <div className="flex justify-center items-center w-full h-full">
                        <img src={loadingGif} alt="loading..." />
                    </div>
            }
        </Card>
    )
}

export default chartapex;
