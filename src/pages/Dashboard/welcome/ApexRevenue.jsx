import React, { useContext, useEffect, useState } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import DatePickerContext from "../../../contexts/DateGlobalBpa";
import api from "../../../services/api";


const options = {
    chart: {
      height: 300,
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "14%",
        endingShape: "Procedimentos",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    series: [
      {
        name: "Procedimentos",
        data: [42, 85, 2101, 56, 5805, 105, 338, 258, 92, 882, 7342, 32],
      },
    ],
    xaxis: {
      categories: [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ],
    },
    yaxis: {
      title: {
        text: "Total de Procedimentos",
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ["#3330ee"],
}

const initialGraphics = [
    {
		"1": 0
	},
	{
		"2": 0
	},
	{
		"3": 0
	},
	{
		"4": 0
	},
    {
		"5": 0
	},
	{
		"6": 0
	},
	{
		"7": 0
	},
	{
		"8": 0
	},
    {
		"9": 0
	},
	{
		"10": 0
	},
	{
		"11": 0
	},
	{
		"12": 0
	}
]

function ApexRevenue() {

    const { year } = useContext(DatePickerContext);

    const [procedures, setProcedures] = useState(initialGraphics);

    useEffect(() => {
        apiGetProcedure();
    }, [year])

    async function apiGetProcedure() {
        try {
            const response = await api.get(`/graphics/bpa/procedures/per/month/${year}`);
            let dates = Array(12).fill(0);

            for (let month = 1; month <= 12; month++) {
                for (let item of response.data) {
                    if (item.hasOwnProperty(String(month))) {
                        dates[month - 1] = item[String(month)];
                    }
                }
            }

            setProcedures(dates);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Card className="border-[1px] border-zinc-400">
            <CardBody>
                <CardTitle className="mb-4">
                    Procedimentos anual
                </CardTitle>
                <div id="revenue-chart">
                    <ReactApexChart
                        options={options}
                        series={[{
                            name: "Procedimentos",
                            data: procedures,
                        }]}
                        type="bar"
                        height="330"
                        className="apex-charts"
                    />
                </div>
            </CardBody>
        </Card>
    )
}

export default ApexRevenue;
