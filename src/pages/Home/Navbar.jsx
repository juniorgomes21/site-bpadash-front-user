import PropTypes from "prop-types";
import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LoginIcon from '@mui/icons-material/Login';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import LaptopChromebookIcon from '@mui/icons-material/LaptopChromebook';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Tooltip from "@mui/material/Tooltip";


function Navbar({ bg }) {
    
    const [navbarOpen, setNavbarOpen] = useState(false);
    
    return (
        <>
            <nav className={"top-0 absolute z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg " + bg}>
                <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
                    <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
                        <Link
                            className="text-white text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
                            to="/"
                        >
                            Agência Ontech
                            <LaptopChromebookIcon sx={{ marginLeft: 1 }}/>
                        </Link>
                        <button
                            className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
                            type="button"
                            onClick={() => setNavbarOpen(!navbarOpen)}
                        >
                            <i className="text-white fas fa-bars"></i>
                        </button>
                    </div>
                    <div
                        className={
                            "lg:flex flex-grow items-center lg:bg-opacity-0 lg:shadow-none" +
                            (navbarOpen ? " block rounded shadow-lg bg-white" : " hidden")
                        }
                        id="example-navbar-warning"
                    >
                        <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
                            <li className="flex items-center">
                                <Tooltip
                                    title="Preços"
                                >
                                    <Link
                                        to="/prices"
                                        className="lg:text-white px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                                    >
                                        <AttachMoneyIcon />
                                        <span className="lg:hidden inline-block ml-2">Intagram</span>
                                    </Link>
                                </Tooltip>
                            </li>


                            <li className="flex items-center">
                                <Tooltip
                                    title="Intagram"
                                >
                                    <a
                                        className="lg:text-white px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                                        href="https://www.instagram.com/ontech_solucoes?igsh=MWZ5M3JqMjhsNGVsMQ=="
                                    >
                                        <InstagramIcon />
                                        <span className="lg:hidden inline-block ml-2">Intagram</span>
                                    </a>
                                </Tooltip>
                            </li>

                            <li className="flex items-center">
                                <Tooltip
                                    title="LinkedIn"
                                >
                                    <a
                                        className="lg:text-white px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                                        href="https://www.linkedin.com/company/ontech-tecnologias-e-solu%C3%A7%C3%B5es/"
                                    >
                                        <LinkedInIcon />
                                        <span className="lg:hidden inline-block ml-2">Linkedin</span>
                                    </a>
                                </Tooltip>
                            </li>

                            <li className="flex items-center">
                                <a href="/login">
                                    <button
                                        className="flex items-center text-xs text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400"
                                        type="button"
                                    >
                                        <p>
                                            Login
                                        </p>
                                        <LoginIcon sx={{ fontSize: 20, marginLeft: 1 }}/>
                                    </button>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

Navbar.propTypes = {
    t: PropTypes.any,
    bg: PropTypes.string,
    chartsData: PropTypes.any,
    onGetChartsData: PropTypes.func,
}

export default withTranslation()(Navbar);
