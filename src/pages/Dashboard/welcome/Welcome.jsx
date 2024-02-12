import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { Card, CardBody, CardTitle, Col, Container, Row, Table } from "reactstrap";
import Breadcrumbs from "/src/components/Common/Breadcrumb";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import profile1 from "/src/assets/images/profile-img.png";
import ApexRevenue from "./ApexRevenue";
import { getUserProfile } from "/src/store/actions";
import ApartmentIcon from '@mui/icons-material/Apartment';
import Earning from "./Earning";
import SalesAnalytics from "./SalesAnalytics";
import TotalSellingProduct from "./TotalSellingProduct";
import InfosGeneral from "./InfosGeneral";
import Storage from "../Storage";
import TotalPercentSex from "./TotalPercentSex";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

const supports = [
    {
        id: 1,
        name: "WhatsApp",
        contact: "9182510975",
        iconClass: "bxl-whatsapp-square",
        timeDuration: "(91) 9 8251-0975"
    },
    {
        id: 2,
        name: "Email",
        contact: "plabpadash@gmail.com",
        iconClass: "bx-mail-send",
        timeDuration: "plabpadash@gmail.com"
    },
    {
        id: 3,
        name: "Horário de atendimento",
        contact: "8h - 18hs",
        iconClass: "bx-message-rounded-dots",
        timeDuration: "8h - 18h"
    }
]

function Welcome(props) {

    document.title = "Bem-vindo";

    const user = JSON.parse(localStorage.getItem("@User"));

    const { userProfile } = props;

    return (
        <div className="page-content">
            <Container fluid>
                {/* Render Breadcrumbs */}
                <Breadcrumbs
                    title="Visão geral"
                    breadcrumbItem="Tela Inicial"
                />
                <div className="mb-5">
                    <div className="mt-1">
                        <h1 className="mb-2 mt-2">
                            Os gráficos variam de acordo com a DATA GERAL do sistema.
                        </h1>
                        <p className="mb-2">Recomendação para upload de arquivo. Faça upload de pelo menos um arquivo FPO antes do BPA.</p>
                        <div className="flex items-center">
                            <Link to="/upload/professionals">
                                <div className="flex flex-col - items-center">
                                    <InsertDriveFileIcon sx={{ fontSize: 30, color: "#4b74f8" }}/>
                                    <p>
                                        PROF
                                    </p>
                                </div>
                            </Link>
                            <div className="mx-3 mb-2">
                                <ArrowRightAltIcon sx={{ color: "#4b74f8" }}/>
                            </div>
                            <Link to="/upload/fpo">
                                <div className="flex flex-col - items-center">
                                    <InsertDriveFileIcon sx={{ fontSize: 30, color: "#4b74f8" }} />
                                    <p>
                                        FPO
                                    </p>
                                </div>
                            </Link>
                            <div className="mx-3 mb-2">
                                <ArrowRightAltIcon sx={{ color: "#4b74f8" }}/>
                            </div>
                            <Link to="/upload/bpa">
                                <div className="flex flex-col - items-center">
                                    <InsertDriveFileIcon sx={{ fontSize: 30, color: "#4b74f8" }} />
                                    <p>
                                        BPA
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
                <Row>
                    <Col xl="4">
                        <Card className="overflow-hidden border-[1px] border-zinc-400">
                            <div className="bg-primary bg-soft">
                                <Row>
                                    <Col xs="7">
                                        <div className="text-primary p-3">
                                            <h5 className="text-primary">
                                                Bem-vindo de volta!
                                            </h5>
                                            <p>Aqui estão algumas métricas da sua conta</p>
                                        </div>
                                    </Col>
                                    <Col xs="5" className="align-self-end">
                                        <img
                                            src={profile1}
                                            alt=""
                                            className="img-fluid"
                                        />
                                    </Col>
                                </Row>
                            </div>
                            <CardBody className="pt-0">
                                <Row>
                                    <Col sm="4">
                                        <div className="avatar-md profile-user-wid mb-4">
                                            <ApartmentIcon
                                                sx={{
                                                    fontSize: 75,
                                                    color: "#2a3042",
                                                }}
                                                className="img-thumbnail rounded-circle border-[1px] border-zinc-400"
                                            />
                                        </div>
                                        <h5 className="font-size-15 text-truncate">
                                            {user.name}
                                        </h5>
                                        <p className="text-muted mb-0 text-truncate">
                                            {userProfile.designation}
                                        </p>
                                    </Col>

                                    <Col sm={8}>
                                        <div className="pt-4">
                                            <Row>
                                                <Col xs="6">
                                                    <h5 className="font-size-15">
                                                        {user.packageName}
                                                        <BookmarkIcon
                                                            color="success"
                                                            className="text-orange-600"
                                                            sx={{
                                                                fontSize: 20,
                                                                mr: 1,
                                                                color:
                                                                    user.packageName ===
                                                                    "bronze"
                                                                        ? "#945c25"
                                                                        : user.packageName ===
                                                                            "gold"
                                                                        ? "#ffd700"
                                                                        : "#6f7270",
                                                            }}
                                                        />
                                                    </h5>
                                                    <p className="text-muted mb-0">
                                                        Seu pacote
                                                    </p>
                                                </Col>
                                                <Col
                                                    xs="6"
                                                    className="flex flex-col items-end"
                                                >
                                                    <h5 className="font-size-15">
                                                        {user.storageTotal}
                                                    </h5>
                                                    <p className="text-muted mb-0">
                                                        Armazenamento total
                                                    </p>
                                                </Col>
                                            </Row>
                                            <div className=" flex justify-between mt-4">
                                                <Link
                                                    to="/configurations/register"
                                                    className="btn btn-primary  btn-sm"
                                                >
                                                    Visualizar Perfil{" "}
                                                    <i className="mdi mdi-arrow-right ms-1" />
                                                </Link>
                                                <Link
                                                    to="/configurations/register"
                                                    className="btn btn-primary  btn-sm"
                                                >
                                                    Termos&Uso{" "}
                                                    <i className="mdi mdi-arrow-right ms-1" />
                                                </Link>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>

                        <Card className="border-[1px] border-zinc-400">
                            <CardBody className=" flex justify-center">
                                <Storage />
                            </CardBody>
                        </Card>

                        <CardBody>
                            <SalesAnalytics />
                        </CardBody>

                        <Card className="border-[1px] border-zinc-400">
                            <CardBody>
                                <CardTitle className="mb-4">
                                    Informações pessoais
                                </CardTitle>
                                <p className="text-muted mb-4">
                                    {userProfile.personalDetail}
                                </p>
                                <div className="table-responsive">
                                    <Table className="table-nowrap mb-0">
                                        <tbody>
                                            <tr>
                                                <th scope="row">Nome :</th>
                                                <td>{user.name}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    Contato :
                                                </th>
                                                <td>{user.cell}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Email :</th>
                                                <td>{user.email}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    Localidade :
                                                </th>
                                                <td>
                                                    {
                                                        user.address
                                                            .localidade
                                                    }
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            </CardBody>
                        </Card>

                        <Card className="border-[1px] border-zinc-400">
                            <CardBody>
                                <CardTitle className="mb-5">
                                    Suporte
                                </CardTitle>
                                <p className="mb-8">
                                    Dúvidas, atualizações de pacote,
                                    sugestões, Bugs, elogios ou críticas?
                                    Envie um email ou entre em contato com a
                                    nossa equipe
                                </p>
                                <div>
                                    <ul className="verti-timeline list-unstyled">
                                        {supports.map((support, i) => (
                                            <li
                                                className={
                                                    support.id === 1
                                                        ? "event-list active"
                                                        : "event-list"
                                                }
                                                key={"_exp_" + i}
                                            >
                                                <div className="event-timeline-dot">
                                                    <i
                                                        className={
                                                            support.id === 1
                                                                ? "bx bx-right-arrow-circle bx-fade-right"
                                                                : "bx bx-right-arrow-circle"
                                                        }
                                                    />
                                                </div>
                                                <div className="d-flex">
                                                    <div className="me-3">
                                                        <i
                                                            className={
                                                                "bx " +
                                                                support.iconClass +
                                                                " h4 text-primary"
                                                            }
                                                        />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <div>
                                                            <h5 className="font-size-15">
                                                                {
                                                                    support.name
                                                                }
                                                            </h5>
                                                            <span className="text-primary">
                                                                {
                                                                    support.timeDuration
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xl="8">
                        <InfosGeneral />
                        
                        <Row>
                            <Earning />
                        </Row>

                        <Row>
                            <ApexRevenue />
                        </Row>
                        
                        <TotalSellingProduct />

                        <TotalPercentSex />

                    </Col>
                </Row>
            </Container>
        </div>
    )
}

Welcome.propTypes = {
    userProfile: PropTypes.any,
    onGetUserProfile: PropTypes.func,
};

const mapStateToProps = ({ contacts }) => ({
    userProfile: contacts.userProfile,
})

const mapDispatchToProps = (dispatch) => ({
    onGetUserProfile: () => dispatch(getUserProfile()),
})

export default connect( mapStateToProps, mapDispatchToProps)(withRouter(Welcome));
