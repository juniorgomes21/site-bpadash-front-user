import React, { useEffect, useState, useContext } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import DatePickerContext from "../../../contexts/DateGlobalBpa";
import api from "../../../services/api";
import { maskMoney } from "../../../Validation&Formatation/formatation";
import loadingGif from "../../../assets/images/loading/Iphone-spinner-2.gif";

function InfosGeneral() {

    const { month, year, getFormattedDate } = useContext(DatePickerContext);

    const [totalBpa, setTotalBpa] = useState(0);
    const [invoicing, setInvoicing] = useState(0);
    const [invoicingYear, setInvoicingYear] = useState(0);
    const [totalRoles, setTotalRoles] = useState([]);
    const [loading, setLoading] = useState({ "totalBpa": true, "totalRoles": true, "invoicing": true, "invoicingYear": true });

    useEffect(() => {
        getTotalBpa();
        getTotalRoles();
        getInvoicingYear();
    }, [])

    useEffect(() => {
        getInvoicing();
        getInvoicingYear();
    }, [month, year])

    async function getTotalBpa() {
        try {
            const response = await api.get("/user/get/total/bpa");
            setTotalBpa(response.data);
        } catch (e) {
            console.log(e);
        }
        setLoading(prevLoading => ({ ...prevLoading, ["totalBpa"]: false }));
    }
    
    async function getTotalRoles() {
        try {
            const response = await api.get("/user/get/total/rules");
            setTotalRoles(response.data);
            
        } catch (e) {
            console.log(e);
        }
        setLoading(prevLoading => ({ ...prevLoading, ["totalRoles"]: false }));
    }
    
    async function getInvoicing() {
        try {
            const response = await api.get(`/bpa/invoicing/${getFormattedDate()}`);
            setInvoicing(maskMoney(response.data));
        } catch (e) {
            console.log(e);
        }
        setLoading(prevLoading => ({ ...prevLoading, ["invoicing"]: false }));
    }

    async function getInvoicingYear() {
        try {
            const response = await api.get(`/bpa/invoicing/year/${year}`);
            setInvoicingYear(maskMoney(response.data));
        } catch (e) {
            console.log(e);
        }
        setLoading(prevLoading => ({ ...prevLoading, ["invoicingYear"]: false }));
    }

    return (
        <Row>
            <Col md="3" className=''>
                <Card className="mini-stats-wid border-[1px] border-zinc-400">
                    <CardBody>
                        <div className="d-flex">
                            <div className="flex-grow-1">
                                <p className="fw-medium mb-2">
                                    Arquivos BPA salvos
                                </p>
                                <h4 className="text-base mb-0">{totalBpa}</h4>
                            </div>
                            <div className="mini-stat-icon avatar-sm align-self-center rounded-circle bg-primary">
                                <span className="avatar-title">
                                    <i className={"bx bx-check-circle font-size-24"} />
                                </span>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
            <Col md="3" className=''>
                <Card className="mini-stats-wid border-[1px] border-zinc-400">
                    <CardBody>
                        <div className="d-flex">
                            <div className="flex-grow-1">
                                <p className="fw-medium mb-2">
                                    Regras salvas
                                </p>
                                {
                                    loading.totalRoles ?
                                        <img src={loadingGif} width={23} alt="loading..." />
                                    :
                                        <h4 className="text-base mb-0">
                                            {totalRoles[0] + " de " + totalRoles[1]}
                                        </h4>
                                }
                            </div>
                            <div className="mini-stat-icon avatar-sm align-self-center rounded-circle bg-primary">
                                <span className="avatar-title">
                                    <i className={"bx bx-purchase-tag font-size-24"} />
                                </span>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
            <Col md="3" className=''>
                <Card className="mini-stats-wid border-[1px] border-zinc-400">
                    <CardBody>
                        <div className="d-flex">
                            <div className="flex-grow-1">
                                <p className="fw-medium mb-2">
                                    {`Faturamento do mês`}
                                </p>
                                {
                                    loading.invoicing ?
                                        <img src={loadingGif} width={23} alt="loading..." />
                                    :
                                        <h4 className="text-base mb-0">
                                            {invoicing}
                                        </h4>
                                }
                            </div>
                            <div className="mini-stat-icon avatar-sm align-self-center rounded-circle bg-primary">
                                <span className="avatar-title">
                                    <i className={"bx bx-dollar-circle font-size-24"} />
                                </span>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
            <Col md="3" className=''>
                <Card className="mini-stats-wid border-[1px] border-zinc-400">
                    <CardBody>
                        <div className="d-flex">
                            <div className="flex-grow-1">
                                <p className="fw-medium mb-2">
                                    {`Faturamento anual`}
                                </p>
                                {
                                    loading.invoicingYear ?
                                        <img src={loadingGif} width={23} alt="loading..." />
                                    :
                                        <h4 className="text-base mb-0">
                                            {invoicingYear}
                                        </h4>
                                }
                            </div>
                            <div className="mini-stat-icon avatar-sm align-self-center rounded-circle bg-primary">
                                <span className="avatar-title">
                                    <i className={"bx bx-dollar-circle font-size-24"} />
                                </span>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    )
}

export default InfosGeneral;
