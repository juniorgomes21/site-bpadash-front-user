import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import Storage from "../../Dashboard/Storage";
import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import ColumnWithDataLabels from "./ColumnWithDataLabels";
import TableManager from "./TableManager";
import api from "../../../services/api";


const seriesInitial = {
	"sizeByteProfe": "0 KB",
	"sizeByteFpo": "0 KB",
	"percents": [
		0.0,
		0.0,
		0.0
	],
	"sizeByteBpa": "0 KB"
}

function StorageMemory(props) {

    document.title = "Memória de Armazenamento";

    const user = JSON.parse(localStorage.getItem("@User"));

    const [series, setSeries] = useState(seriesInitial);
  

    useEffect(() => {
        getStorageGraphics();
    }, [])

    async function getStorageGraphics() {
        try {
            const response = await api.get("/graphics/storage/files");
            setSeries(response.data);

        } catch(e) {
            console.log(e);
        }
    }
  

    function getBackgroundColor(packageName) {
        console.log(user);

        switch(packageName) {
            case "bronze":
                return "from-orange-600 via-orange-400 to-orange-800";
            case "gold":
                return "from-yellow-600 via-yellow-500 to-yellow-700";
            default:
                return "from-slate-500 via-slate-400 to-slate-700";
        }
    }

    return (
        <>
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
                    <div className="flex justify-center mt-10">
                            <Col lg={8}>
                                <Card>
                                    <CardBody>
                                        <CardTitle className="mb-4">
                                            Porcentagem de uso de seus arquivos
                                        </CardTitle>
                                        <ColumnWithDataLabels data={series.percents} />
                                    </CardBody>
                                </Card>
                            </Col>
                    </div>
                    <div className="flex justify-center mt-10 mb-20">
                        <TableManager data={series} />
                    </div>
                </Container>
                <div className="fixed bottom-20 right-14">
                    <div className={`flex justify-center items-center p-3 rounded-xl bg-gradient-to-r ${getBackgroundColor(user.packageName)}`}>
                        <p className="text-white text-sm font-bold uppercase">
                            {user.packageName + ": " + user.storageTotal}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

StorageMemory.propTypes = {
    t: PropTypes.any,
    chartsData: PropTypes.any,
    onGetChartsData: PropTypes.func,
};

export default withTranslation()(StorageMemory);
