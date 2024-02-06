import React, { useContext, useEffect, useState } from "react";
import { Row, Col, CardTitle, Card, CardBody } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import { maskMoney } from "../../../Validation&Formatation/formatation";
import api from "../../../services/api";
import DatePickerContext from "../../../contexts/DateGlobalBpa";

const options = {
    chart: {
        toolbar: "false",
        dropShadow: {
            enabled: !0,
            color: "#000",
            top: 18,
            left: 7,
            blur: 8,
            opacity: 0.2,
        },
    },
    dataLabels: {
        enabled: !1,
    },
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
    colors: ["#0639e0"],
    stroke: {
        curve: "smooth",
        width: 3,
    },
    tooltip: {
      y: {
        formatter: function (value) {
          // Formata o valor para "R$ X,XX"
          return maskMoney(value);
        }
      }
    }
}

const initialGraphics = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

function Earning() {

    const { year } = useContext(DatePickerContext);
    const [invoicing, setInvoicing] = useState(initialGraphics);

    useEffect(() => {
        apiGetProcedure();
    }, [year])

    async function apiGetProcedure() {
        try {
            const response = await api.get(`/graphics/bpa/invoicing/per/month/${year}`);

            let dates = Array(12).fill(0);

            for (let month = 1; month <= 12; month++) {
                for (let item of response.data) {
                    if (item.hasOwnProperty(String(month))) {
                        dates[month - 1] = item[String(month)];
                    }
                }
            }

            setInvoicing(dates);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Card className="border-[1px] border-zinc-400">
            <CardBody>
                <CardTitle className="mb-4">Faturamento anual</CardTitle>
                <Row>
                    <Col lg="12">
                        <div id="line-chart" dir="ltr">
                            <ReactApexChart
                                series={[{
                                    name: "Valor Faturado",
                                    data: invoicing
                                }]}
                                options={options}
                                type="line"
                                height={320}
                                className="apex-charts"
                            />
                        </div>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
}

export default Earning;
