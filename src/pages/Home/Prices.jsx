import React from "react";
import Button from "@mui/material/Button";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Navbar from "./Navbar";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';


const plans = [
    {
        packageName: "Bronze",
        value: "4.500,00",
        desc: "Pacote básico para quem esta começando",
        benefits: {
            support: "Atendimento online + email",
            storage: "250 MB",
            rules: "25"
        }
    },
    {
        packageName: "Ouro",
        value: "6.000,00",
        desc: "Para quem já vende e quer se profissionalizar.",
        benefits: {
            support: "Atendimento online + email + WhatsApp",
            storage: "500 MB",
            rules: "50"
        }
    },
    {
        packageName: "Platina",
        value: "12.000,00",
        desc: "Para quem quer impulsionar suas vendas.",
        benefits: {
            support: "Atendimento prioritário em todos os canais",
            storage: "1 GB",
            rules: "100"
        }
    }
]

function Prices() {


    return (
        <>
            <Navbar
                bg="bg-gradient-to-r from-blue-800 via-blue-600 to-blue-800"
            />
            <div className="flex justify-center relative text-center sm:p-0 md:p-0 lg:p-32 bg-cover">
                <div className="flex flex-col items-center container w-full pb-px sm:px-8 px-4">
                    <h2 className="mb-2.5 text-[#252c38] lg:max-w-xl lg:mx-auto text-5xl text-center">
                        Opções de preços para todos os orçamentos
                    </h2>
                    <p className="mb-16 text-center w-full text-[#252c38] lg:max-w-3xl lg:mx-auto">
                        Confira nossos Pacotes e preços e comece a gerenciar seus arquivos.
                    </p>

                    <div className="flex flex-wrap w-full">
                        {
                            plans.map((plan, index) => (
                                <div key={index} className="relative bg-white max-w-xs mx-auto mb-24 border-[1px] border-[#bcc4ca] rounded-lg">
                                    <div  className="pt-12 pr-7 pb-9 pl-7">
                                        <div className="mb-4 text-blue-500 font-bold text-lg text-center">
                                            {plan.packageName}
                                        </div>
                                        <div className="price">
                                            <span className="mr-2 text-[#252c38] text-2xl leading-[80%]">
                                                R$
                                            </span>
                                            <span className="text-[#252c38] font-bold text-[2.5rem] text-center leading-[3rem]">
                                                {plan.value}
                                            </span>
                                        </div>
                                        <p className="mb-5 text-center">
                                            {plan.desc}
                                        </p>
                                        <ul className="flex-1 ml-1 mb-7 space-y-2 text-left">
                                            <li className="flex items-center">
                                                <TaskAltIcon className="text-green-400" />
                                                <div className="ml-1">{plan.benefits.support}</div>
                                            </li>
                                            <li className="flex items-center">
                                                <TaskAltIcon className="text-green-400" />
                                                <div className="ml-1">{plan.benefits.storage} de Armazenamento</div>
                                            </li>
                                            <li className="flex items-center cursor-pointer">
                                                <TaskAltIcon className="text-green-400" />
                                                <div className="ml-1">{plan.benefits.rules} automações</div>
                                                <Tooltip
                                                    placement="top"
                                                    title="Você poderá adicionar regras de automatização para que ações sejam executadas no seu arquivo BPA com apenas um clique"
                                                >
                                                    <HelpOutlineIcon sx={{ fontSize: 20, ml: 1 }}/>
                                                </Tooltip>
                                            </li>
                                        </ul>
                                        <Button
                                            variant="contained"
                                            className="bg-gradient-to-r from-blue-800 !via-blue-400 to-blue-500"
                                        >
                                            ESCOLHER
                                        </Button>
                                    </div>
                                </div>
                        ))}
                        <div className="relative bg-white max-w-xs mx-auto mb-24 border-[1px] border-[#bcc4ca] rounded-lg">
                            <div  className="pt-12 pr-7 pb-9 pl-7">
                                <div className="mb-4 text-blue-500 font-bold text-lg text-center">
                                    Personalizado
                                </div>
                                <div className="price">
                                    <span className="mr-2 text-[#252c38] text-2xl leading-[80%]">
                                    </span>
                                    <span className="text-[#252c38] font-bold text-[2.5rem] text-center leading-[3rem]">
                                    </span>
                                </div>
                                <p className="mb-5 text-center">
                                    Pacote personalizado para quem quiser mais armazenamento e automações
                                </p>
                                <ul className="flex-1 ml-1 mb-7 space-y-2 text-left">
                                    <li className="flex items-center">
                                        <TaskAltIcon className="text-green-400" />
                                        <div className="ml-1">Atendimento prioritário em todos os canais</div>
                                    </li>
                                    <li className="flex items-center">
                                        <TaskAltIcon className="text-green-400" />
                                        <div className="ml-1">~ de Armazenamento</div>
                                    </li>
                                    <li className="flex items-center">
                                        <TaskAltIcon className="text-green-400" />
                                        <div className="ml-1">~ automações</div>
                                        <Tooltip
                                            placement="top"
                                            title=""
                                        >
                                            <HelpOutlineIcon sx={{ fontSize: 20, ml: 1 }}/>
                                        </Tooltip>
                                    </li>
                                </ul>
                                <Button
                                    variant="contained"
                                    className="bg-gradient-to-r from-blue-800 !via-blue-400 to-blue-500"
                                >
                                    ESCOLHER
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Prices;
