import PropTypes from "prop-types";
import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, CardBody, CardTitle, Card } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import api from "../../services/api";
import AlertCustom from "../../GlobalComponents/AlertCustom";
import ColumnWithDataLabels from "./ColumnWithDataLabels";
import SnackBarContext from "../../contexts/managerService";
import PieChart from "./PieChart";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import BarChart from "./BarChart";
import BarChartProd from "./BarChartProd";
import { formatDate, formatDateString } from "../../Validation&Formatation/formatation";

function Graphics(props) {

    document.title = "Meta FPO ";

    const { openSnackBarFun } = useContext(SnackBarContext);

    const [fpoList, setFpoList] = useState([]);
    const [budget, setBudget] = useState({});
    const [loading, setLoading] = useState(true);
    const [dateFpo, setDateFpo] = useState("...");
    const [error, setError] = useState(false);

    useEffect(() => {
        getDateFpo();
    }, [])

    
    async function getDateFpo() {
        setError(false);
        setLoading(true);
        try {
            const response = await api.get("/fpo/get/date");
            await getGoals();
            setDateFpo(response.data.date);

        } catch(e) {
            console.log(e);
            setError(true);
        }
        setLoading(false);
    }


    async function getGoals() {
        try {
            const responseBudget = await api.get("/goal/get/budget");
            const response = await api.get("/goal/get/groups");
            setFpoList(response.data);
            setBudget(responseBudget.data);

        } catch(e) {
            console.log(e);
        }
        setLoading(false);
    }


    if(loading) {
        return (
            <div className="flex justify-center mt-20">
                <CircularProgress size={20}/>
            </div>
        )
    }

    return (
        <>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs
                        title={props.t("Gráficos FPO meta")}
                        breadcrumbItem={props.t("Meta FPO")}
                    />
                    <div className="my-4">
                        <AlertCustom
                            type="info"
                            msg={error ? "NÃO EXISTE NENHUM ARQUIVO FPO" : `COMPETÊNCIA FPO: ${formatDateString(dateFpo)}`}
                        />
                    </div>
                    
                    { !error &&
                        <Row>
                            <Col lg={6}>
                                <BarChart budget={budget}/>
                            </Col>
                            <Col lg={6}>
                                <BarChartProd budget={budget}/>
                            </Col>
                        </Row>
                    }
                    {
                        !(fpoList.length === 0) ?
                            <>
                                <Row className="w-full mt-10">
                                    <Col sm={12}>
                                        {/* GRÁFICO GERAL */}
                                        <ColumnWithDataLabels
                                            budget={budget}
                                            fpoList={fpoList}
                                        />
                                    </Col>
                                </Row>
                                <Row className="flex-wrap w-full mt-10">
                                    {
                                        fpoList.map((fpo, index) => (
                                            <Col lg={6} key={index} className="mt-10">
                                                {/* Distribuição por Sexo */}
                                                <PieChart fpo={fpo}/>
                                            </Col>
                                        ))
                                    }
                                </Row>
                            </>
                        :
                            <div className="flex justify-center mt-20">
                                { !error &&
                                    <p>
                                        Crie pelo menos 1 grupo de PA para ver gráficos por grupo. Você pode criar um grupo <Link to="/goal/per/groups" className="text-blue-400 ml-1"> aqui.</Link>
                                    </p>
                                }
                            </div>
                    }
                </Container>
            </div>
        </>
    );
}

Graphics.propTypes = {
    t: PropTypes.any,
    chartsData: PropTypes.any,
    onGetChartsData: PropTypes.func,
}

export default withTranslation()(Graphics);
