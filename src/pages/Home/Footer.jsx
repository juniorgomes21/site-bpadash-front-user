import React from "react";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import logo from "../../assets/images/logo_bpadash_dark.png";
import Tooltip from "@mui/material/Tooltip";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

function Footer() {

    return (
        <section className="flex flex-col items-center py-20 relative bg-gradient-to-r from-blue-800 via-blue-600 to-blue-800">
            <div className="flex items-center">
                <img src={logo} alt="logo" width={70}/>
                <p className="font-bold text-lg text-white">BPADASH</p>
            </div>
            <div className="text-center text-white">
                © 2021-2024 AgênciaOntech™. Todos os direitos reservados. Distribuído por Agência Ontech.
            </div>
            <div className="flex text-white">
                <Tooltip
                    placement="top"
                    title="Intagram"
                >
                    <a
                        className="px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                        href="https://www.instagram.com/ontech_solucoes?igsh=MWZ5M3JqMjhsNGVsMQ=="
                    >
                        <InstagramIcon />
                        <span className="lg:hidden inline-block ml-2">Intagram</span>
                    </a>
                </Tooltip>
                <Tooltip
                    placement="top"
                    title="LinkedIn"
                >
                    <a
                        className="px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                        href="https://www.linkedin.com/company/ontech-tecnologias-e-solu%C3%A7%C3%B5es/"
                    >
                        <LinkedInIcon />
                        <span className="lg:hidden inline-block ml-2">Linkedin</span>
                    </a>
                </Tooltip>
                <Tooltip
                    placement="top"
                    title="+55 (91) 9 8251-0975"
                >
                    <div className="px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold">
                        <WhatsAppIcon />
                        <span className="lg:hidden inline-block ml-2">WhatsApp</span>
                    </div>
                </Tooltip>
            </div>
        </section>
    )
}

export default Footer;
