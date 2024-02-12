import PropTypes from "prop-types";
import React, { useEffect, useState, useContext } from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { BarChart } from '@mui/x-charts/BarChart';
import api from "../../../services/api";
import DateGlobalBpaContext from "../../../contexts/DateGlobalBpa";
import { formatMonth } from "../../../Validation&Formatation/formatation";


function SexGraphics(props) {

    document.title = "Gráficos Sexo";

    const { month, year, getFormattedDate } = useContext(DateGlobalBpaContext);
    const [data, setData] = useState([0, 0]);
    const [dataAll, setDataAll] = useState([0, 0]);

    useEffect(() => {
        apiGetGraphicsSex();
    }, []);

    async function apiGetGraphicsSex() {
        try {
            const responseAll = await api.get(`/graphics/sex/all`);
            const response = await api.get(`/graphics/sex/${getFormattedDate()}`);

            console.log(responseAll.data);
            setData((prevData) => {
                return [response.data.countM, response.data.countF];
            });

            console.log(response.data);

            setDataAll((prevData) => {
                return [responseAll.data.countM, responseAll.data.countF];
            });

        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <div className="page-content">
                <Container fluid>
                    {/* Render Breadcrumb */}
                    <Breadcrumbs title={props.t("Gráficos Sexo")} breadcrumbItem={props.t("Gráficos Sexo")} />
                    <p>
                        Aqui você tem a métrica de quantos pacientes são do sexo feminino e masculino
                    </p>
                    <div className="flex flex-col items-center">
                        <h1 className="mt-5 text-sm">
                            {`Métrica do mês de (${formatMonth(month)} de ${year})`}
                        </h1>
                        <BarChart
                            xAxis={[
                                {
                                    data: ['Sexo M', 'Sexo F'],
                                    scaleType: 'band',
                                }
                            ]}
                            series={[
                                {
                                    data: data,
                                }
                            ]}
                            width={800}
                            height={400}
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <h1 className="mt-5 text-sm">
                            {`Métrica de todos os Atendimentos`}
                        </h1>
                        <BarChart
                            xAxis={[
                                {
                                    id: 'barCategories',
                                    data: ['Sexo M', 'Sexo F'],
                                    scaleType: 'band',
                                    
                                }
                            ]}
                            series={[
                                {
                                    data: dataAll,
                                }
                            ]}
                            width={800}
                            height={400}
                        />
                    </div>
                </Container>
            </div>

        </>
    )
}

SexGraphics.propTypes = {
    t: PropTypes.any,
    chartsData: PropTypes.any,
    onGetChartsData: PropTypes.func,
}

export default withTranslation()(SexGraphics);
