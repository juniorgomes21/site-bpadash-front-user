import PropTypes from "prop-types";
import React from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";

function TermsUse(props) {

    document.title = "Termos&Uso";

    return (
        <>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title={props.t("Termos E Uso")} breadcrumbItem={props.t("Termos E Uso")} />
                    <div className="container mx-auto px-4 py-8">
                        <h1 className="text-3xl font-bold mb-4">Termos de Uso para da Plataforma BPA DASH</h1>
                        <ul className="list-decimal pl-4 mb-8">
                            <li className="mb-4">
                                <h3 className="text-xl font-semibold mb-2">Licença de Uso:</h3>
                                <p>
                                    Este software é concedido a você mediante uma licença limitada, não exclusiva e intransferível para uso pessoal ou comercial, de acordo com os termos estabelecidos neste documento.
                                </p>
                            </li>
                            <li className="mb-4">
                                <h3 className="text-xl font-semibold mb-2">Restrições de Uso:</h3>
                                <p>
                                    É proibido reproduzir, distribuir, modificar, criar obras derivadas ou realizar engenharia reversa da Plataforma sem autorização expressa do proprietário.
                                </p>
                            </li>
                            <li className="mb-4">
                                <h3 className="text-xl font-semibold mb-2">Atualizações e Suporte:</h3>
                                <p>
                                    O proprietário do software reserva-se o direito de fornecer atualizações, correções ou suporte técnico, a seu critério, durante o período de vigência desta licença.
                                </p>
                            </li>
                            <li className="mb-4">
                                <h3 className="text-xl font-semibold mb-2">Responsabilidade do Usuário:</h3>
                                <p>
                                    O usuário é responsável por manter a confidencialidade de quaisquer credenciais de acesso e assume total responsabilidade por atividades relacionadas à sua conta.
                                </p>
                            </li>
                            <li className="mb-4">
                                <h3 className="text-xl font-semibold mb-2">Privacidade e Dados:</h3>
                                <p>
                                    A plataforma pode coletar dados necessários para seu funcionamento. O usuário concorda com a política de privacidade disponível no Contrato de uso.
                                </p>
                            </li>
                            <li className="mb-4">
                                <h3 className="text-xl font-semibold mb-2">Garantias e Limitações:</h3>
                                <p>
                                    Esta plataforma é fornecida "como está", sem garantias de qualquer tipo. O proprietário não se responsabiliza por danos diretos, indiretos, incidentais ou consequentes.
                                </p>
                            </li>
                            <li className="mb-4">
                                <h3 className="text-xl font-semibold mb-2">Rescisão:</h3>
                                <p>
                                    A licença pode ser rescindida a qualquer momento por violação dos termos estabelecidos. Após a rescisão, o usuário deve cessar imediatamente o uso da plataforma.
                                </p>
                            </li>
                            <li className="mb-4">
                                <h3 className="text-xl font-semibold mb-2">Lei Aplicável:</h3>
                                <p>
                                    Este acordo é regido pelas leis do Brasil e quaisquer litígios serão submetidos à jurisdição exclusiva dos tribunais competentes no Brasil.
                                </p>
                            </li>
                        </ul>
                        <p className="mb-4">
                            Ao utilizar esta plataforma, o usuário concorda em cumprir integralmente estes termos. Qualquer dúvida ou solicitação de esclarecimento deve ser encaminhada ao suporte técnico disponível na Plataforma.
                        </p>
                        <p>
                            Estes termos estão sujeitos a alterações, e a versão mais recente será sempre disponibilizada na Plataforma BPA DASH.
                        </p>
                    </div>
                </Container>
            </div>
        </>
    )
}

TermsUse.propTypes = {
    t: PropTypes.any,
    chartsData: PropTypes.any,
    onGetChartsData: PropTypes.func,
}

export default withTranslation()(TermsUse);
