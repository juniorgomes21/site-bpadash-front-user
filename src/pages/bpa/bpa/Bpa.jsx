import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import TableBpac from "../bpac/table/TableBpac";
import TableBpai from "../bpai/table/TableBpai";
import TitleBpa from "./TitleBpa";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Alert from '@mui/material/Alert';
import loadingSvg from "../../../assets/images/svg/loading.svg";
import api from "../../../services/api";
import { setMonthAsyncStorage, setYearAsyncStorage } from "../../../asyncStorageFunc/asyncStorageFUnc";


function BPA(props) {

  //TODO fazer com que o async inicie com os valores do mes e ano atuais..
  document.title="Meus arquivos BPA";

  const [bpa, setBpa] = useState({});
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(localStorage.getItem("@Month"));
  const [year, setYear] = useState(localStorage.getItem("@Year"));

  useEffect(() => {
    apiGetBPA();
  }, [month, year])

  async function apiGetBPA() {
    try {
      const response = await api.get(`/bpa/get/${month}/${year}`);
      setBpa(response.data);
      setIdentifier(response.data.identifier);
    } catch(e) {
      setBpa({});
      console.log("Erro: ", e.response);
    }
    setLoading(false);
  }

  function handleChangeMonth(event) {
    setMonth(event.target.value);
    localStorage.setItem("@Month", event.target.value);
  };

  function handleChangeYear(event) {
    setYear(event.target.value);
    localStorage.setItem("@Year", event.target.value);
  };

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <div className="sm:flex justify-between mb-6">
            <div className="mb-3">
              {
                Object.keys(bpa).length > 0 &&
                  <div className="flex justify-center text-base border-2 border-[#2a3042] rounded-xl p-2">
                    <div>
                      <p>Tamanho do Documento:</p>
                    </div>
                    <div className="ml-2">
                      <p>{bpa.sizeFile}</p>
                    </div>
                  </div>
              }
            </div>
            <div className="flex">
              <div className="mr-10">
                <div className="mb-2">
                  <p className="text-base">Selecione o mês desejado</p>
                </div>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">{'mês ' + month}</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={month}
                    label={'mês ' + month}
                    onChange={handleChangeMonth}
                  >
                    <MenuItem value={"01"}>Janeiro</MenuItem>
                    <MenuItem value={"02"}>Fevereiro</MenuItem>
                    <MenuItem value={"03"}>Março</MenuItem>
                    <MenuItem value={"04"}>Abril</MenuItem>
                    <MenuItem value={"05"}>Maio</MenuItem>
                    <MenuItem value={"06"}>junho</MenuItem>
                    <MenuItem value={"07"}>Julho</MenuItem>
                    <MenuItem value={"08"}>Agosto</MenuItem>
                    <MenuItem value={"09"}>Setembro</MenuItem>
                    <MenuItem value={10}>Outubro</MenuItem>
                    <MenuItem value={11}>Novembro</MenuItem>
                    <MenuItem value={12}>Dezembro</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div>
                <div className="mb-2">
                  <p className="text-base">Selecione o ano desejado</p>
                </div>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">{year}</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={year}
                    label={year}
                    onChange={handleChangeYear}
                  >
                    {
                      Array.from({ length: 20 }, (_, index) => (
                        <MenuItem key={index} value={2023 - index}>{2023 - index}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </div>

            </div>
          </div>
          {
            loading ?
              <div className="flex justify-center mt-20">
                <img src={loadingSvg} alt="svg" width={70}/>
              </div>
            :
              Object.keys(bpa).length == 0 ?
                <div className="flex justify-center">
                  <Alert severity="warning" className="">Nenhum BPA encontrado nesse período!</Alert>
                </div>
              :
                Array.from({ length: 1}).map((_, index) => (
                  <div key={index}>
                    <div className="container-fluid mb-6">
                      <Breadcrumbs title={props.t("BPA")} breadcrumbItem={props.t("BPA")}/>
                      <TitleBpa identifier={identifier} setBpa={setBpa} setLoadingBpa={setLoading}/>
                    </div>
                    <div className="container-fluid mb-6">
                      <Breadcrumbs title="Tables" breadcrumbItem="Tabela BPA-C" />
                      <TableBpac identifier={identifier} />
                    </div>
                    <div className="container-fluid">
                      <Breadcrumbs title="Tabela" breadcrumbItem="Tabela BPA-I" />
                      <TableBpai identifier={identifier} />
                    </div>
                  </div>
                ))
          }
        </Container>
      </div>
    </>
  );
};

BPA.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(BPA);

