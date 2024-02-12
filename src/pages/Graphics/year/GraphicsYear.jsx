import React, { useContext } from "react";
import LineApexChart from "../../AllCharts/apex/chartapex";
import DashedLine from "../../AllCharts/apex/dashedLine";
import SplineArea from "../../AllCharts/apex/SplineArea";
import Apaexlinecolumn from "../../AllCharts/apex/apaexlinecolumn";
import LineColumnArea from "../../AllCharts/apex/LineColumnArea";
import RadialChart from "../../AllCharts/apex/RadialChart";
import PieChart from "../../AllCharts/apex/PieChart";
import DonutChart from "../../AllCharts/apex/dountchart";
import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import AuthContext from "../../../contexts/Auth";
import AlertCustom from "../../../GlobalComponents/AlertCustom";
import DatePickerContext from "../../../contexts/DateGlobalBpa";
import ApexRevenue from "../../Dashboard/welcome/ApexRevenue";
import TotalSellingProduct from "../../Dashboard/welcome/TotalSellingProduct";
import Earning from "../../Dashboard/welcome/Earning";


function GraphicsYear() {
    
    document.title = "Gráficos do Ano";

    const { dates } = useContext(AuthContext);
    const { year } = useContext(DatePickerContext);

    
    return !(dates.length == 0) ? (
        <div className="page-content">
            <div className="container-fluid">
                <Breadcrumbs
                    title="Gráficos do Mês"
                    breadcrumbItem="Gráficos do Mês"
                />
                <Row>
                    <Col lg={6}>
                        <ApexRevenue />
                    </Col>

                    <Col lg={6}>
                        <Earning />
                    </Col>
                </Row>

                <Row>
                    <Col lg={6}>
                        <LineApexChart year={year}/>
                    </Col>

                    <Col lg={6}>
                        <DashedLine year={year} />
                    </Col>
                </Row>

                {/* <Row>
                    <Col lg={6}>
                        <Card>
                            <CardBody>
                                <CardTitle className="mb-4">
                                    {" "}
                                    Spline Area{" "}
                                </CardTitle>
                                <SplineArea dataColors='["--bs-primary", "--bs-success"]' />
                            </CardBody>
                        </Card>
                    </Col>

                    <Col lg={6}>
                        <Apaexlinecolumn year={year} />
                    </Col>
                </Row> */}

            </div>
        </div>
    ) : (
        <div className="mt-24">
            <AlertCustom type="info" msg="Você não possui nenhum arquivo BPA" />
        </div>
    );
}

export default GraphicsYear;
