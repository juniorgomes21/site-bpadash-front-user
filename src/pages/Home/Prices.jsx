import React, { useState, useContext } from "react";
import Button from "@mui/material/Button";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Navbar from "./Navbar";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useForm, Controller } from "react-hook-form";
import api from "../../services/api";
import SnackBarContext from "../../contexts/managerService";
import Footer from "./Footer";
import LoadingButton from "@mui/lab/LoadingButton";

const plans = [
    {
        packageName: "Bronze",
        packageNameParam: "bronze",
        value: "4.500,00",
        desc: "Pacote básico para quem esta começando",
        benefits: {
            employee: 5,
            support: "Atendimento online + email",
            storage: "250 MB",
            rules: "25",
        },
    },
    {
        packageName: "Ouro",
        packageNameParam: "gold",
        value: "6.000,00",
        desc: "Para quem já vende e quer se profissionalizar.",
        benefits: {
            employee: 10,
            support: "Atendimento online + email + WhatsApp",
            storage: "500 MB",
            rules: "50",
        },
    },
    {
        packageName: "Platina",
        packageNameParam: "platinum",
        value: "12.000,00",
        desc: "Para quem quer impulsionar suas vendas.",
        benefits: {
            employee: 15,
            support: "Atendimento prioritário em todos os canais",
            storage: "1 GB",
            rules: "100",
        },
    },
];

function Prices() {
    const {
        control,
        register,
        handleSubmit,
        reset,
        getValues,
        setValue,
        formState: { errors },
    } = useForm();

    const { openSnackBarFun } = useContext(SnackBarContext);
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [packageUser, setPackageUser] = useState("bronze");

    async function sendMessage(data) {
        setLoading(true);
        try {
            await api.post("/contact/message", data);
            openSnackBarFun(
                false,
                "Mensagem enviada! Em breve entraremos em contato."
            );
            setPhoneNumber("");
            setValue("cell", "");
            reset();
            
        } catch (e) {
            openSnackBarFun();
        }
        setLoading(false);
    }

    function formatPhoneNumber(value) {
        if(value.length === 11) {
            // Remove todos os caracteres não numéricos do número de telefone
            const cleaned = ('' + value).replace(/\D/g, '');
            
            // Aplica a máscara do número de telefone
            const match = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);
            if (match) {
              return `(${match[1]}) ${match[2]} ${match[3]}-${match[4]}`;
            }
        }

        return value;
    }

    
    function handleChangeCell(event) {
        const { value } = event.target;
        setPhoneNumber(formatPhoneNumber(value));
        setValue("cell", event.target.value);
    }
    

    function handleChange(event) {
        const value = event.target.value;
        setValue("packageName", value);
        setPackageUser(value);
    }

    function handleSelectPlan(packageName) {
        setPackageUser(packageName);
        setValue("packageName", packageName);
        const section = document.getElementById("contact");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    }

    function auxBorder() {
        switch (packageUser) {
            case "bronze":
                return "border-l-yellow-500 border-t-yellow-500 border-b-[#cd7f32] border-r-[#cd7f32] shadow-[#cd7f32]";
            case "gold":
                return "border-l-yellow-300 border-t-yellow-300 border-b-yellow-400 border-r-yellow-400 shadow-yellow-400";
            case "platinum":
                return "border-l-gray-400 border-t-gray-400 border-b-gray-500 border-r-gray-500 shadow-gray-500";
            case "custom":
                return "border-l-green-400 border-t-green-400 border-b-green-500 border-r-green-500 shadow-green-400";
        }
    }

    return (
        <>
            <Navbar bg="bg-gradient-to-r from-blue-800 via-blue-600 to-blue-800" />
            <div className="flex justify-center relative text-center sm:p-0 md:p-0 lg:p-32 bg-cover">
                <div className="flex flex-col items-center container w-full pb-px sm:px-8 px-4">
                    <h2 className="mb-2.5 text-[#252c38] lg:max-w-xl lg:mx-auto text-5xl text-center">
                        Opções de preços para todos os orçamentos
                    </h2>
                    <p className="mb-16 text-center w-full text-[#252c38] lg:max-w-3xl lg:mx-auto">
                        Confira nossos Pacotes e preços e comece a gerenciar
                        seus arquivos.
                    </p>

                    <div className="flex flex-wrap w-full">
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className="relative bg-white max-w-xs mx-auto mb-12 border-[1px] border-[#bcc4ca] rounded-lg"
                            >
                                <div className="pt-12 pr-7 pb-9 pl-7">
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
                                            <div className="ml-1">
                                                {plan.benefits.support}
                                            </div>
                                        </li>
                                        <li className="flex items-center">
                                            <TaskAltIcon className="text-green-400" />
                                            <div className="ml-1">
                                                {plan.benefits.storage} de
                                                Armazenamento
                                            </div>
                                        </li>
                                        <li className="flex items-center cursor-pointer">
                                            <TaskAltIcon className="text-green-400" />
                                            <div className="ml-1">
                                                {plan.benefits.rules} automações
                                            </div>
                                            <Tooltip
                                                placement="top"
                                                title="Você poderá adicionar regras de automatização para que ações sejam executadas no seu arquivo BPA com apenas um clique"
                                            >
                                                <HelpOutlineIcon
                                                    sx={{ fontSize: 20, ml: 1 }}
                                                />
                                            </Tooltip>
                                        </li>
                                        <li className="flex items-center cursor-pointer">
                                            <TaskAltIcon className="text-green-400" />
                                            <div className="ml-1">
                                                {plan.benefits.employee}{" "}
                                                Funcionários
                                            </div>
                                            <Tooltip
                                                placement="top"
                                                title="Quantidade de funcionários que poderão fazer login simultaneamente"
                                            >
                                                <HelpOutlineIcon
                                                    sx={{ fontSize: 20, ml: 1 }}
                                                />
                                            </Tooltip>
                                        </li>
                                    </ul>
                                    <Button
                                        variant="contained"
                                        className="bg-gradient-to-r from-blue-800 !via-blue-400 to-blue-500"
                                        onClick={() =>
                                            handleSelectPlan(
                                                plan.packageNameParam
                                            )
                                        }
                                    >
                                        ESCOLHER
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <div className="relative bg-white max-w-xs mx-auto mb-12 border-[1px] border-[#bcc4ca] rounded-lg">
                            <div className="pt-12 pr-7 pb-9 pl-7">
                                <div className="mb-4 text-blue-500 font-bold text-lg text-center">
                                    Personalizado
                                </div>
                                <div className="price">
                                    <span className="mr-2 text-[#252c38] text-2xl leading-[80%]"></span>
                                    <span className="text-[#252c38] font-bold text-[2.5rem] text-center leading-[3rem]"></span>
                                </div>
                                <p className="mb-5 text-center">
                                    Pacote personalizado para quem quiser mais
                                    armazenamento e automações
                                </p>
                                <ul className="flex-1 ml-1 mb-7 space-y-2 text-left">
                                    <li className="flex items-center">
                                        <TaskAltIcon className="text-green-400" />
                                        <div className="ml-1">
                                            Atendimento prioritário em todos os
                                            canais
                                        </div>
                                    </li>
                                    <li className="flex items-center">
                                        <TaskAltIcon className="text-green-400" />
                                        <div className="ml-1">
                                            ~ de Armazenamento
                                        </div>
                                    </li>
                                    <li className="flex items-center">
                                        <TaskAltIcon className="text-green-400" />
                                        <div className="ml-1">~ automações</div>
                                        <Tooltip placement="top" title="">
                                            <HelpOutlineIcon
                                                sx={{ fontSize: 20, ml: 1 }}
                                            />
                                        </Tooltip>
                                    </li>
                                    <li className="flex items-center cursor-pointer">
                                        <TaskAltIcon className="text-green-400" />
                                        <div className="ml-1">
                                            ~ Funcionários
                                        </div>
                                        <Tooltip
                                            placement="top"
                                            title="Quantidade de funcionários que poderão fazer login simultaneamente"
                                        >
                                            <HelpOutlineIcon
                                                sx={{ fontSize: 20, ml: 1 }}
                                            />
                                        </Tooltip>
                                    </li>
                                </ul>
                                <Button
                                    variant="contained"
                                    className="bg-gradient-to-r from-blue-800 !via-blue-400 to-blue-500"
                                    onClick={() => handleSelectPlan("custom")}
                                >
                                    ESCOLHER
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section id="contact" className="relative block lg:pt-0 mb-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center">
                        <div className="w-full lg:w-6/12 px-4">
                            <div
                                className={`relative flex flex-col min-w-0 break-words w-full mb-6 border-4 rounded-lg ${auxBorder()} shadow-2xl rounded-lg`}
                            >
                                <form
                                    className={`flex-auto p-5 lg:p-10 `}
                                    onSubmit={handleSubmit(sendMessage)}
                                >
                                    <h4 className="text-center text-2xl font-semibold">
                                        Escolha um pacote e informe seus dados.
                                        Entraremos em contato o mais breve
                                        possível.
                                    </h4>
                                    <div className="relative w-full mb-3 mt-8">
                                        <label
                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                            htmlFor="full-name"
                                        >
                                            Nome completo
                                        </label>
                                        <input
                                            type="text"
                                            maxLength={50}
                                            className="border-0 px-3 py-3 mb-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            placeholder="Nome Completo"
                                            {...register("name", {
                                                required:
                                                    "O nome é obrigatório",
                                                minLength: {
                                                    value: 5,
                                                    message:
                                                        "Deve ter mais de 4 letras",
                                                },
                                            })}
                                        />
                                        <span className="text-red-500 pt-2">
                                            {errors.name && errors.name.message}
                                        </span>
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
                                            className="border-0 px-3 py-3 mb-2 placeholder-blueGray-300 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            placeholder="Email"
                                            {...register("email", {
                                                required: "Email é obrigatório",
                                                minLength: {
                                                    value: 10,
                                                    message:
                                                        "Caracteres insuficientes",
                                                },
                                            })}
                                        />
                                        <span className="text-red-500 pt-2">
                                            {errors.email &&
                                                errors.email.message}
                                        </span>
                                    </div>

                                    <div className="relative w-full mb-3">
                                        <label
                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                            htmlFor="cell"
                                        >
                                            WhatsApp (opcional)
                                        </label>
                                        <input
                                            type="text"
                                            maxLength={16}
                                            value={phoneNumber}
                                            className="border-0 px-3 py-3 mb-2 placeholder-blueGray-300 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            placeholder="(99) 9 9999-9999"
                                            onChange={handleChangeCell}
                                        />
                                        <span className="text-red-500 pt-2">
                                            {errors.cell && errors.cell.message}
                                        </span>
                                    </div>

                                    <div className="relative w-full mb-3">
                                        <label
                                            className="block uppercase text-xs font-bold mb-2"
                                            htmlFor="email"
                                        >
                                            Pacote
                                        </label>
                                        <FormControl
                                            fullWidth
                                            className="bg-white rounded-md"
                                        >
                                            <InputLabel id="demo-simple-select-label"></InputLabel>
                                            <Controller
                                                name="packageName"
                                                control={control}
                                                defaultValue="bronze"
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={packageUser}
                                                        label=""
                                                        onChange={handleChange}
                                                    >
                                                        <MenuItem value="bronze">
                                                            Bronze
                                                        </MenuItem>
                                                        <MenuItem value="gold">
                                                            Ouro
                                                        </MenuItem>
                                                        <MenuItem value="platinum">
                                                            Platina
                                                        </MenuItem>
                                                        <MenuItem value="custom">
                                                            Personalizado
                                                        </MenuItem>
                                                    </Select>
                                                )}
                                            />
                                        </FormControl>
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
                                            className="border-0 px-3 py-3 mb-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                            placeholder="Sua mensagem..."
                                            maxLength={255}
                                            {...register("message", {
                                                required: "Campo obrigatório",
                                                minLength: {
                                                    value: 10,
                                                    message:
                                                        "Mínimo de 10 caracteres",
                                                },
                                            })}
                                        />
                                        <span className="text-red-500 pt-2">
                                            {errors.message &&
                                                errors.message.message}
                                        </span>
                                    </div>
                                    <div className="text-center mt-6">
                                        <LoadingButton
                                            type="submit"
                                            loading={loading}
                                            fullWidth
                                            className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 text-white active:bg-blueGray-600 !text-base font-bold uppercase px-10 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        >
                                            Enviar Mensagem
                                        </LoadingButton>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default Prices;
