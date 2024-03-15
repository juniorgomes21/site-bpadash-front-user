
import PropTypes from "prop-types";
import React from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import {Link} from "react-router-dom";
import Navbar from "./Navbar";
import img1 from "../../assets/images/home/team-1-800x800.jpg";
import img2 from "../../assets/images/home/team-2-800x800.jpg";
import img3 from "../../assets/images/home/team-3-800x800.jpg";
import img4 from "../../assets/images/home/team-4-470x470.png";
import padlockImg from "../../assets/images/home/3092704.jpg";
import padlockImg2 from "../../assets/images/home/lock.jpg";
import robot from "../../assets/images/home/robot.avif";
import regulation from "../../assets/images/home/regulation.jpg";
import data from "../../assets/images/home/data.avif";
import bgCircuit from "../../assets/images/home/bgCircuit.avif";

import LockIcon from '@mui/icons-material/Lock';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

function Home(props) {

    document.title = "BPADASH";

    return (
        <>
            <Navbar transparent />
            <main>
                <div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen-75">
                    <div
                        className="absolute top-0 w-full h-full bg-center bg-cover"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80')",
                        }}
                    >
                        <span
                            id="blackOverlay"
                            className="w-full h-full absolute opacity-75 bg-black"
                        ></span>
                    </div>
                    <div className="container relative mx-auto">
                        <div className="items-center flex flex-wrap">
                            <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
                                <div className="pr-12">
                                    <h1 className="text-white font-semibold text-5xl">
                                        Faturamento Inteligente BPADASH
                                    </h1>
                                    <p className="mt-4 text-lg text-gray-200">
                                        Uma nova forma de automatizar tarefas em
                                        faturamento ambulatorial e hospitalar
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
                        style={{ transform: "translateZ(0)" }}
                    >
                        <svg
                            className="absolute bottom-0 overflow-hidden"
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="none"
                            version="1.1"
                            viewBox="0 0 2560 100"
                            x="0"
                            y="0"
                        >
                            <polygon
                                className="text-blueGray-200 fill-current"
                                points="2560 0 2560 100 0 100"
                            ></polygon>
                        </svg>
                    </div>
                </div>

                <section className="pb-20 bg-blueGray-200 -mt-24">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap">
                            <div className="w-full pt-6 lg:pt-12  md:w-4/12 px-4 text-center">
                                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                                    <div className="px-4 py-5 flex-auto">
                                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-13 h-13 mb-5 shadow-lg rounded-full bg-red-400">
                                            <SettingsSuggestIcon />
                                        </div>
                                        <h6 className="text-xl font-semibold">
                                            AUTOMATIZAÇÃO ABRANGENTE
                                        </h6>
                                        <p className="mt-2 mb-4 text-blueGray-500">
                                            Eliminamos a necessidade de
                                            processos manuais demorados por meio
                                            de automação inteligente. Isso não
                                            apenas reduz erros, mas também
                                            libera recursos humanos para focarem
                                            em tarefas estratégicas.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full px-4 md:w-4/12 text-center">
                                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                                    <div className="px-4 py-5 flex-auto">
                                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-13 h-13 mb-5 shadow-lg rounded-full bg-blue-400">
                                            <AssuredWorkloadIcon />
                                        </div>
                                        <h6 className="text-xl font-semibold">
                                            {" "}
                                            CONFORMIDADE COM NORMAS E
                                            REGULAMENTAÇÕES
                                        </h6>
                                        <p className="mt-2 mb-4 text-blueGray-500">
                                            Nosso sistema está alinhado com as
                                            normas e regulamentações do setor de
                                            saúde, garantindo que as
                                            instituições estejam sempre em
                                            conformidade e evitem
                                            possíveis penalidades.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full pt-6 md:w-4/12 px-4 text-center">
                                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                                    <div className="px-4 py-5 flex-auto">
                                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-13 h-13 mb-5 shadow-lg rounded-full bg-emerald-400">
                                            <AccountTreeIcon />
                                        </div>
                                        <h6 className="text-xl font-semibold">
                                            TRATAMENTO DE DADOS AVANÇADO
                                        </h6>
                                        <p className="mt-2 mb-4 text-blueGray-500">
                                            Utilizamos técnicas avançadas de
                                            tratamento de dados para garantir a
                                            precisão e integridade das
                                            informações. Isso resulta em uma
                                            base de dados confiável e pronta
                                            para análises estratégicas.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center mt-32">
                            <div className="w-full md:w-5/12 px-4 mr-auto ml-auto">
                                <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-white">
                                    <i className="fas fa-user-friends text-xl"></i>
                                </div>
                                <h3 className="text-3xl mb-2 font-semibold leading-normal">
                                    Trabalhar conosco é um prazer
                                </h3>
                                <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-blueGray-600">
                                    O BPADASH é uma ferramenta dedicada à
                                    automação, tratamento e análise de
                                    faturamento ambulatorial e hospitalar, com
                                    foco especial no Sistema Único de Saúde
                                    (SUS). Sob a bandeira Faturamento
                                    Inteligente, oferecemos uma abordagem
                                    revolucionária para otimizar e simplificar
                                    as complexidades inerentes ao processo de
                                    faturamento na área da saúde.
                                </p>
                            </div>

                            <div className="w-full md:w-4/12 px-4 mr-auto ml-auto">
                                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg">
                                    <img
                                        alt="..."
                                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80"
                                        className="w-full align-middle rounded-t-lg"
                                    />
                                    <blockquote className="relative p-8 mb-4">
                                        <h4 className="text-xl font-bold">
                                            Serviços de primeira linha
                                        </h4>
                                        <p className="text-md font-light mt-2"></p>
                                    </blockquote>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="relative py-20 bg-bgCircuit bg-top">
                    <div
                        className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20 h-20"
                        style={{ transform: "translateZ(0)" }}
                    >
                        <svg
                            className="absolute bottom-0 overflow-hidden"
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="none"
                            version="1.1"
                            viewBox="0 0 2560 100"
                            x="0"
                            y="0"
                        >
                            <polygon
                                className="text-white fill-current"
                                points="2560 0 2560 100 0 100"
                            ></polygon>
                        </svg>
                    </div>

                    <div className="container mx-auto px-4">
                        <div className="items-center flex flex-wrap">
                            <div className="w-full md:w-4/12 ml-auto mr-auto px-4 bg-white shadow-lg rounded-lg">
                                <a href="http://www.freepik.com">
                                    <img
                                        alt="padlock"
                                        className="max-w-full h-full rounded-lg shadow-lg"
                                        src={padlockImg}
                                    />
                                </a>
                                <blockquote className="relative p-8 mb-4">
                                    <h4 className="text-xl font-bold">
                                        Criptografia de ponta a ponta
                                    </h4>
                                    <p className="text-md font-light mt-2"></p>
                                </blockquote>
                            </div>
                            <div className="w-full md:w-5/12 ml-auto mr-auto px-4 bg-white rounded-xl p-2">
                                <div className="md:pr-12">
                                    <div className="text-lightBlue-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-lightBlue-300">
                                        <LockIcon />
                                    </div>
                                    <h3 className="text-3xl font-semibold">
                                        Seus Dados em Boas Mãos
                                    </h3>
                                    <p className="mt-4 text-lg leading-relaxed text-blueGray-500">
                                        Sua segurança é nossa prioridade número
                                        um. Utilizamos criptografia de ponta a
                                        ponta para garantir que todas as suas
                                        informações e comunicações estejam
                                        protegidas em cada etapa do processo.
                                        Com nossa criptografia robusta, seus
                                        dados permanecem confidenciais e
                                        seguros, protegidos contra acesso não
                                        autorizado. Você pode utilizar nosso
                                        sistema com total tranquilidade, sabendo
                                        que estamos comprometidos em manter a
                                        integridade e privacidade das suas
                                        informações.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="pt-20 pb-48">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap justify-center text-center mb-24">
                            <div className="w-full lg:w-6/12 px-4">
                                <h2 className="text-4xl font-semibold">
                                    VANTAGENS DO SISTEMA BPADASH
                                </h2>
                                <p className="text-lg leading-relaxed m-4 text-blueGray-500">
                                    Nosso sistema oferece uma solução completa,
                                    combinando automatização eficiente,
                                    segurança robusta e total conformidade com
                                    normas e regulamentações. Com tecnologia
                                    avançada, garantimos o tratamento seguro e
                                    responsável dos seus dados, proporcionando
                                    tranquilidade e confiança em cada interação.
                                    Confie em nós para simplificar processos,
                                    proteger suas informações e cumprir todas as
                                    exigências legais, permitindo que você se
                                    concentre no que realmente importa.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap">
                            <div className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
                                <div className="px-6">
                                    <img
                                        alt="..."
                                        src={robot}
                                        className="shadow-lg rounded-full mx-auto max-w-120-px"
                                    />
                                    <div className="pt-6 text-center">
                                        <h5 className="text-xl font-bold">
                                            AUTOMATIZAÇÃO
                                        </h5>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
                                <div className="px-6">
                                    <img
                                        alt="..."
                                        src={padlockImg2}
                                        className="shadow-lg rounded-full mx-auto max-w-120-px"
                                    />
                                    <div className="pt-6 text-center">
                                        <h5 className="text-xl font-bold">
                                            SEGURANÇA
                                        </h5>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
                                <div className="px-6">
                                    <img
                                        alt="..."
                                        src={regulation}
                                        className="shadow-lg rounded-full mx-auto max-w-120-px"
                                    />
                                    <div className="pt-6 text-center">
                                        <h5 className="text-xl font-bold">
                                            NORMAS E REGULAMENTAÇÕES
                                        </h5>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
                                <div className="px-6">
                                    <img
                                        alt="..."
                                        src={data}
                                        className="shadow-lg rounded-full mx-auto h-auto max-w-120-px"
                                    />
                                    <div className="pt-6 text-center">
                                        <h5 className="text-xl font-bold">
                                            TRATAMENTO DE DADOS
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20 relative block"></section>

                <section className="relative block py-24 lg:pt-0 ">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap justify-center lg:-mt-64 -mt-48">
                            <div className="w-full lg:w-6/12 px-4">
                                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200">
                                    <div className="flex-auto p-5 lg:p-10">
                                        <h4 className="text-2xl font-semibold">
                                            Gostou do que viu?
                                        </h4>
                                        <p className="leading-relaxed mt-1 mb-4 text-blueGray-500">
                                            Mande uma mensagem! Preencha este
                                            formulário e entraremos em contato
                                            com você em até 24 horas.
                                        </p>
                                        <div className="relative w-full mb-3 mt-8">
                                            <label
                                                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                htmlFor="full-name"
                                            >
                                                Nome completo
                                            </label>
                                            <input
                                                type="text"
                                                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                placeholder="Nome Completo"
                                            />
                                        </div>

                                        <div className="relative w-full mb-3">
                                            <label
                                                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                htmlFor="email"
                                            >
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                placeholder="Email"
                                            />
                                        </div>

                                        <div className="relative w-full mb-3">
                                            <label
                                                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                                htmlFor="message"
                                            >
                                                Mensagem
                                            </label>
                                            <textarea
                                                rows="4"
                                                cols="80"
                                                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                                placeholder="Sua mensagem..."
                                            />
                                        </div>
                                        <div className="text-center mt-6">
                                            <button
                                                className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-10 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button"
                                            >
                                                Enviar Mensagem
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

Home.propTypes = {
    t: PropTypes.any,
    chartsData: PropTypes.any,
    onGetChartsData: PropTypes.func,
}

export default withTranslation()(Home);
