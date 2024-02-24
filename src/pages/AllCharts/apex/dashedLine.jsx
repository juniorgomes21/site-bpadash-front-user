import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardBody, CardTitle } from "reactstrap";
import api from "../../../services/api";
import loadingGif from "../../../assets/images/loading/Iphone-spinner-2.gif";


const options = {
    chart: { 
        zoom: { enabled: false },
        toolbar: { show: false }
    },
    colors: ["#52d132", "#15b0bb", "#5f0faa"],
    dataLabels: { enabled: false },
    stroke: {
        width: [3, 4, 3],
        curve: "straight",
        dashArray: [0, 8, 5]
    },
    title: {
        text: "",
        align: "left"
    },
    markers: {
        size: 0,
        hover: { sizeOffset: 6 }
    },
    xaxis: {
        categories: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    },
    yaxis: {
        title: {
            text: "Analise Por Idade",
        },
        labels: {
            show: true,
            formatter: function (val) {
                return Number.parseInt(val) + "%";
            },
        },
        min: 0,
    },
    tooltip: {
        y: [
            {
                title: {
                    formatter: function (e) {
                        return e;
                    },
                },
            },
            {
                title: {
                    formatter: function (e) {
                        return e;
                    },
                },
            },
            {
                title: {
                    formatter: function (e) {
                        return e;
                    },
                },
            },
        ],
    },
    grid: { borderColor: "#f1f1f1" },
};

function DashedLine({ year }) {

    const [yongs, setYongs] = useState([]);
    const [middleAges, setMiddleAges] = useState([]);
    const [olds, setOlds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFiles();
    }, [year]);

    async function getFiles() {
        setLoading(true);
        try {
            const response = await api.get(`/graphics/age/year/${year}`);
            setYongs(response.data.yongs);
            setMiddleAges(response.data.middleAges);
            setOlds(response.data.olds);

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
                        <CardTitle className="mb-4">Distribuição por Idade Anual</CardTitle>
                        <ReactApexChart
                            options={options}
                            series={[
                                {
                                    name: "0 - 20 anos",
                                    data: yongs,
                                },
                                {
                                    name: "21 - 50 anos",
                                    data: middleAges,
                                },
                                {
                                    name: "51 anos+",
                                    data: olds,
                                }
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

export default DashedLine;
