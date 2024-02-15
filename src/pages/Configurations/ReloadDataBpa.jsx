import PropTypes from "prop-types";
import React, { useContext, useState } from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { Button } from "@mui/material";
import gear from "../../assets/images/loading/gear-spinner.svg";
import LinearProgress from '@mui/material/LinearProgress';
import api from "../../services/api";
import SnackBarContext from "../../contexts/managerService";
import DateGlobalBpaContext from "../../contexts/DateGlobalBpa";

function ReloadDataBpa(props) {

    document.title = "Recalcular Dados BPA";

    const { getFormattedDate } = useContext(DateGlobalBpaContext);
    const { openSnackBarFun } = useContext(SnackBarContext);
    const [loading, setLoading] = useState(false);

    async function recalculate() {
        setLoading(true);
        try {
            await api.post(`/bpa/recalculate/${getFormattedDate()}`);
            openSnackBarFun(false, "Dados BPA recalculados");

        } catch (e) {
            console.log(e);
            const response = e.response.data;

            switch(response) {
                case "NOT FOUND BPA": {
                    openSnackBarFun(true, "BPA não encontrado");
                    break;
                } default: {
                    openSnackBarFun();
                }
            }
        }
        setLoading(false);
    }


    return (
        <>
            <div className="page-content">
                <Container fluid>
                    {!loading ? (
                        <>
                            <Breadcrumbs
                                title={props.t("Recalcular Dados")}
                                breadcrumbItem={props.t("Recalcular Dados")}
                            />
                            <div className="flex flex-col items-center mt-10">
                                <p className="text-sm text-center">
                                    Aqui você pode recalcular os dados do seu
                                    arquivo BPA. Esta funcionalidade é exclusiva
                                    para recalcular os dados, não fazendo
                                    quaisquer alterações em seus arquivos.
                                </p>
                                <div className="mt-10">
                                    <Button variant="contained" color="success" onClick={() => recalculate()}>
                                        RECALCULAR
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col justify-center items-center">
                            <div className="">
                                <img src={gear} alt="loading..." width="350" />
                            </div>
                            <div className="mt-10 w-1/2">
                                <LinearProgress />
                            </div>
                        </div>
                    )}
                </Container>
            </div>
        </>
    );
}

ReloadDataBpa.propTypes = {
    t: PropTypes.any,
    chartsData: PropTypes.any,
    onGetChartsData: PropTypes.func,
}

export default withTranslation()(ReloadDataBpa);
