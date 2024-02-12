import React, { useContext } from "react";
import ColumnWithDataLabels from "../../AllCharts/apex/ColumnWithDataLabels";
import BarChart from "../../AllCharts/apex/barchart";
import RadialChart from "../../AllCharts/apex/RadialChart";
import RadialChartRace from "../../AllCharts/apex/RadialChartRace";
import PieChart from "../../AllCharts/apex/PieChart";
import { Row, Col } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import SalesAnalytics from "../../Dashboard/welcome/SalesAnalytics";
import AuthContext from "../../../contexts/Auth";
import AlertCustom from "../../../GlobalComponents/AlertCustom";

function Graphics() {
    
    document.title = "Gráficos do Mês";
    const { dates } = useContext(AuthContext);

    return (
        !(dates.length == 0) ?
            <div className="page-content">
                <div className="container-fluid">
                    <Breadcrumbs title="Gráficos do Mês" breadcrumbItem="Gráficos do Mês" />

                    <Row>
                        <Col lg={6}>
                            {/* Distribuição por Sexo */}
                            <PieChart />
                        </Col>
                        <Col lg={6}>
                            {/* PAs mais utilizados */}
                            <SalesAnalytics />
                        </Col>
                    </Row>

                    <Row className="mt-10">
                        <Col lg={6}>
                            {/* Distribuição por Idade */}
                            <RadialChart />
                        </Col>
                        <Col lg={6}>
                            {/* ATENDIMENTOS POR CNSMED */}
                            <ColumnWithDataLabels />
                        </Col>
                    </Row>

                    <Row className="mt-10">
                        <Col lg={6}>
                            {/* Distribuição por CBO */}
                            <BarChart />
                        </Col>
                        <Col lg={6}>
                            {/* Distribuição por Raça */}
                            <RadialChartRace />
                        </Col>
                    </Row>

                </div>
            </div>
        :
            <div className="mt-24">
                <AlertCustom
                    type="info"
                    msg="Você não possui nenhum arquivo BPA"
                />
            </div>

    )
}

export default Graphics;
