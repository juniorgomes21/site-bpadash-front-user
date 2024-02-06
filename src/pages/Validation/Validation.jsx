import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import api from "../../services/api";
import TableBpac from "./TableBpac";
import SnackbarContext from "../../contexts/managerService";
import TableBpai from "./TableBpai";
import Button from "@mui/material/Button";
import TableTitle from "./TableTitle";

const titleBpax = {
    lin: true,
    flh: true,
    smtVrf: true,
    cgccpf: true
}

const bpacValidationx = {
  cnes: true,
  cmp: true,
  cbo: false,
  pa: false,
  idade: true,
  qt: true,
  org: true
}

const bpaiValidationx = {
  cnes: true,
  cmp: true,
  cnsmed: true,
  cbo: true,
  dtaten: true,
  pa: true,
  cnspac: true,
  sexo: true,
  ibge: true,
  cid: true,
  idade: true,
  qt: true,
  caten: true,
  naut: true,
  org: true,
  nmpac: true,
  dtnasc: true,
  raca: true,
  etnia: true,
  nac: true,
  srv: true,
  clf: true,
  equipeSeq: true,
  equipeArea: true,
  cnpj: true,
  cepPcnte: true,
  logradPcnte: true,
  endPcnte: true,
  complPcnte: true,
  numPcnte: true,
  bairroPcnte: true,
  ddtelPcnte: true,
  emailPcnte: true,
  ine: true
}

function Validation(props) {

  document.title="Validações";

  const { openSnackBarFun } = useContext(SnackbarContext);
  const [titleBpa, setTitleBpa] = useState(titleBpax);
  const [bpacValidation, setBpacValidation] = useState(bpacValidationx);
  const [bpaiValidation, setBpaiValidation] = useState(bpaiValidationx);

  useEffect(() => {
    apiGetValidations();
  }, [])

  async function apiGetValidations() {
    try {
      const response = await api.get("/user/get/validations");
      setTitleBpa(response.data.titleValidation);
      setBpacValidation(response.data.bpacValidation);
      setBpaiValidation(response.data.bpaiValidation);
    } catch(e) {
      // log
    }
  }


  async function apiSetValidations() {
    try {
      api.post("/user/set/validations/title", titleBpa);
      api.post("/user/set/validations/bpac", bpacValidation);
      api.post("/user/set/validations/bpai", bpaiValidation);
      openSnackBarFun(false, "Validações salvas");
    } catch(e) {
      openSnackBarFun();
    }
  }


  return (
    <>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={props.t("Validações")} breadcrumbItem={props.t("Validações")} />
          <div>
            <div >
              <p className="text-sm">Clique no campo que você deseja validar ou invalidar</p>
              <p className="text-base">Os campos em verde passarão</p>
            </div>
            <TableTitle
              obj={titleBpa}
              setObj={setTitleBpa}
            />
            <TableBpac
              obj={bpacValidation}
              setObj={setBpacValidation}
            />
            <TableBpai
              obj={bpaiValidation}
              setObj={setBpaiValidation}
            />
            <div className="flex justify-end w-full mt-10">
              <Button
                variant="contained"
                color="success"
                onClick={apiSetValidations}
              >
                Salvar alterações
              </Button>
            </div>
          </div>
        </Container>
      </div>

    </>
  );
};

Validation.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(Validation);



{/* <div className="mt-8">
<div className="border-[1px] p-3 rounded-lg border-default">
  <div>
    <p>Validações BPA-C</p>
  </div>
  <div className="flex flex-row flex-wrap justify-around my-5">
      {
        Object.keys(bpacValidation).map((key, index) => (
          <div
            key={index}
            className={`py-2 px-4 cursor-pointer border-[1px] rounded-full ${bpacValidation[key] ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}`}
            onClick={() => {
            }}
          >
            {key}
          </div>
        ))
      }
  </div>
</div>
<div className=" mt-4 border-[1px] p-3 rounded-lg border-default">
  <div>
    <p>Validações BPA-I</p>
  </div>
  <div className="flex flex-row flex-wrap justify-around my-5 w-full">
      {
        Object.keys(bpaiValidation).map((key, index) => (
          <div
            key={index}
            className={`my-2 py-2 px-4 cursor-pointer border-[1px] rounded-full ${bpaiValidation[key] ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}`}
            onClick={() => {
              setBpaiValidation(prevBpaiValidation => ({...prevBpaiValidation, [key]: !bpaiValidation[key]}));
            }}
          >
            {key}
          </div>
        ))
      }
  </div>
</div>
</div> */}
