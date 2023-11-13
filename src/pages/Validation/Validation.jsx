import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import api from "../../services/api";
import TablePer from "./TablePer";
import SnackbarContext from "../../contexts/managerService";

const bpacValidationx = {
  ident: true,
  cnes: true,
  cmp: true,
  cbo: false,
  flh: true,
  seq: true,
  pa: false,
  idade: true,
  qt: true,
  org: true
}

const bpaiValidationx = {
  ident: true,
  cnes: true,
  cmp: true,
  cnsmed: true,
  cbo: true,
  dtaten: true,
  flh: true,
  seq: true,
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

const initialUser = {
  name: "",
  email: "",
  cell: "",
  valid: "",
  bpacValidation: bpacValidationx,
  bpaiValidation: bpaiValidationx
}


function Validation(props) {

  document.title="Validações";

  const { openSnackBarFun } = useContext(SnackbarContext);
  const [bpacValidation, setBpacValidation] = useState(initialUser.bpacValidation);
  const [bpaiValidation, setBpaiValidation] = useState(initialUser.bpaiValidation);

  useEffect(() => {
    apiGetUser();
  }, [])

  async function apiGetUser() {
    try {
      const response = await api.get("/user");
      setBpacValidation(response.data.bpacValidation);
      setBpaiValidation(response.data.bpaiValidation);
    } catch(e) {
      console.log("error", e.response );
    }
  }

  async function apiSetValidationsBPAC() {
    try {
      await api.post("/user/set/validations/bpac", bpacValidation);
      openSnackBarFun(false, "Validações salvas");
    } catch(e) {
      console.log("error", e.response );
      openSnackBarFun();
    }
  }

  async function apiSetValidationsBPAI() {
    try {
      await api.post("/user/set/validations/bpai", bpaiValidation);
      openSnackBarFun(false, "Validações salvas");
    } catch(e) {
      console.log("error", e.response );
      openSnackBarFun();
    }
  }


  return (
    <>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={props.t("Validações")} breadcrumbItem={props.t("Validações")} />
          {/* <TableBpai /> */}
          <div>
            <div >
                <p className="text-sm">Clique no campo que você quer validar ou invalidar.</p>
                <p className="text-base">Os campos em verde passaram pela validação:</p>
            </div>
            <TablePer
              bpa={bpacValidation}
              api={apiSetValidationsBPAC}
              setBpa={setBpacValidation}
            />
            <TablePer
              bpa={bpaiValidation}
              api={apiSetValidationsBPAI}
              setBpa={setBpaiValidation}
            />
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