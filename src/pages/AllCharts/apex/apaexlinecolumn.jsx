import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardBody, CardTitle } from "reactstrap";

const options = {
    chart: {
        toolbar: {
            show: false,
        },
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: "45%",
            endingShape: "rounded",
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

    colors: ["#e04a0e", "#1f31cfa0", "#49bb14"],
    xaxis: {
        categories: [
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
        ],
    },
    yaxis: {
        title: {
            text: "$ (thousands)",
        },
    },
    grid: {
        borderColor: "#f1f1f1",
    },
    fill: {
        opacity: 1,
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return "$ " + val + " thousands";
            },
        },
    },
};


function Apaexlinecolumn({ year }) {

 
    return (
        <Card>
            <CardBody>
                <CardTitle className="mb-4"> Column Chart </CardTitle>
                <ReactApexChart
                    options={options}
                    series={[
                        {
                            name: "Net Profit",
                            data: [46, 57, 59, 54, 62, 58, 64, 60, 66],
                        },
                        {
                            name: "Revenue",
                            data: [74, 83, 102, 97, 86, 106, 93, 114, 94],
                        },
                        {
                            name: "Free Cash Flow",
                            data: [37, 42, 38, 26, 47, 50, 54, 55, 43],
                        },
                    ]}
                    type="bar"
                    height={350}
                />
            </CardBody>
        </Card>
    );
};

export default Apaexlinecolumn;
