import React from "react";
import PropTypes from "prop-types";
import ReactApexChart from "react-apexcharts";
import { Row, Col, CardBody, CardTitle, Card } from "reactstrap";
import { maskMoney } from "../../Validation&Formatation/formatation";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SouthIcon from '@mui/icons-material/South';

function BarChart({ budget }) {

    const totalValueOrcada = budget.totalValueOrcada;
    const totalValueProd =  budget.totalValueProd;
    const percent = ((totalValueProd / totalValueOrcada) * 100).toFixed(2);
    const up = percent >= 100;

    return (
        <Card className="border-[1px] border-gray-400 rounded-lg h-full">
            <CardBody>
            <CardTitle className="mb-4">
                META DE ORÇAMENTO
            </CardTitle>
            <Row className="justify-content-center">
                <Col sm={4}>
                <div className="text-center">
                    <h5 className="mb-0 font-size-20">{maskMoney(totalValueOrcada)}</h5>
                    <p className="text-muted">VALOR ORÇADO</p>
                </div>
                </Col>
                <Col sm={4}>
                <div className="text-center">
                </div>
                </Col>
                <Col sm={4}>
                <div className="flex flex-col items-center text-center">
                    <div className="flex items-center">
                        <h5 className={`mb-0 font-size-20 ${ up ? "text-green-500" : "text-red-600"}` }>
                            {maskMoney(totalValueProd)}
                        </h5>
                        {
                            up ?
                                <ArrowUpwardIcon sx={{ fontSize: 20 }} className="!text-green-500"/>
                            :
                                <SouthIcon sx={{ fontSize: 20 }} className="!text-red-600"/>
                        }
                    </div>
                    <p className="text-muted">VALOR PRODUZIDO </p>
                </div>
                </Col>
            </Row>
            <ReactApexChart
                options={{
                    chart: {
                        height: 350,
                        type: 'radialBar',
                    },
                    labels: ['Porcentagem']
                }}
                series={[percent]}
                type="radialBar"
                height={350}
            />
            </CardBody>
        </Card>
            
    );
}

BarChart.propTypes = {
    budget: PropTypes.any
};

export default BarChart;
