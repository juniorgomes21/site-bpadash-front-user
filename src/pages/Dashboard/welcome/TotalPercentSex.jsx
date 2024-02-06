import React, { useContext, useEffect, useState } from "react";
import { Col, Card, CardBody, CardTitle, Table } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import api from "../../../services/api";
import DatePickerContext from "../../../contexts/DateGlobalBpa";
import loadingGif from "../../../assets/images/loading/Iphone-spinner-2.gif";

const sellingData = [
    { name: "Pacientes", desc: "Homens", key: "M" },
    { name: "Pacientes", desc: "Mulheres", key: "F" },
]


function TotalPercentSex() {

    const { month, year, getFormattedDate } = useContext(DatePickerContext);

    const [percents, setPercents] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSexPercent();
    }, [month, year])

    async function getSexPercent() {
        setLoading(true);
        try {
            const response = await api.get(`/graphics/sex/per/${getFormattedDate()}`);
            setPercents(response.data);
        } catch (e) {
            console.log(e.response);
        }
        setLoading(false);
    }

    function getChartOptions (index) {
        var options = {
            chart: { sparkline: { enabled: !0 } },
            dataLabels: { enabled: false },
            colors: ["#556ee6"],
            plotOptions: {
                radialBar: {
                    hollow: { margin: 0, size: "60%" },
                    track: { margin: 0 },
                    dataLabels: { show: false },
                },
            },
        };
        switch (index) {
            case 1:
                options["colors"][0] = "#0e33ec";
                break;
            case 2:
                options["colors"][0] = "#e225e2";
                break;
            default:
                break;
        }
    
        return options;
    }

    return (
        <Card className="border-[1px] border-zinc-400">
            <CardBody>
                <CardTitle className="mb-4">
                    Total de pacientes { percents["total"] ? percents["total"] : "0"}
                </CardTitle>
                <div className="table-responsive mt-4">
                    <Table className="table align-middle mb-0">
                        <tbody>
                            {sellingData.map((data, key) => {
                                const options = getChartOptions(key + 1);

                                return (
                                    <tr key={key}>
                                        <td className=" ">
                                            <h5 className="mr-9 font-size-14 mb-1">
                                                {data.name}
                                            </h5>
                                            <p className="text-muted mb-0">
                                                {data.desc}
                                            </p>
                                        </td>

                                        <td>
                                            <div id="radialchart-1">
                                                <ReactApexChart
                                                    options={options}
                                                    series={[percents[data.key] ? percents[data.key] : 0]}
                                                    type="radialBar"
                                                    height={60}
                                                    width={60}
                                                    className="apex-charts"
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            {loading ? (
                                                <img src={loadingGif} width={30} alt="" />
                                            ) : (
                                                <h5 className="mb-0">
                                                    {percents[data.key]
                                                        ? percents[data.key] +
                                                          "%"
                                                        : 0 + "%"}
                                                </h5>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
            </CardBody>
        </Card>
    )
}

export default TotalPercentSex;
