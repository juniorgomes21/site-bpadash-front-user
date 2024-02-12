import PropTypes from "prop-types";
import React from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import Storage from "./Storage";
import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import ColumnWithDataLabels from "../AllCharts/apex/ColumnWithDataLabels";
import BarChart from "../AllCharts/apex/barchart";


function StorageMemory(props) {
    //meta title
    document.title = "Memória de Armazenamento";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs
                        title={props.t("Meu Armazenamento")}
                        breadcrumbItem={props.t("Meu Armazenamento")}
                    />
                    <p>Acompanhe seu armazenamento usado</p>
                    <div className="flex justify-center mt-10 w-full">
                        <Storage dataColors='["--bs-primary"]' />
                    </div>
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <CardTitle className="mb-4">
                                        Column with Data Labels{" "}
                                    </CardTitle>
                                    <ColumnWithDataLabels dataColors='["--bs-primary"]' />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

StorageMemory.propTypes = {
    t: PropTypes.any,
    chartsData: PropTypes.any,
    onGetChartsData: PropTypes.func,
};

export default withTranslation()(StorageMemory);
