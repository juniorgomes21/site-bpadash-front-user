import PropTypes from "prop-types";
import React, { useEffect, useState, useContext } from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import TableBpac from "../bpac/table/TableBpac";
import TableBpai from "../bpai/table/TableBpai";
import TitleBpa from "./TitleBpa";
import Alert from '@mui/material/Alert';
import loadingSvg from "../../../assets/images/svg/loading.svg";
import api from "../../../services/api";
import DateGlobalBpaContext from "../../../contexts/DateGlobalBpa";
import AlertCustom from "../../../GlobalComponents/AlertCustom";
import { formatMonth } from "../../../Validation&Formatation/formatation";
import { useHistory } from "react-router-dom";

function BPA(props) {

  document.title="Meus arquivos BPA";

  const history = useHistory();
  const { month, year } = useContext(DateGlobalBpaContext);
  const [bpa, setBpa] = useState({});
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetBPA();
  }, [month, year])

  async function apiGetBPA() {
    setLoading(true);
    try {
      const response = await api.get(`/bpa/get/${month}/${year}`);
      setBpa(response.data);
      setIdentifier(response.data.identifier);
    } catch(e) {
      setBpa({});
    }
    setLoading(false);
  }

  function xxx() {
    history.push("/file/edit/bpac")
  }

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <div className="sm:flex justify-between mb-6">
            <div className="mb-3">
              {
                Object.keys(bpa).length > 0 &&
                  <div className="flex justify-center text-base border-2 border-[#2a3042] rounded-xl p-2" onClick={() => xxx()}>
                    <div>
                      <p>Tamanho do Documento:</p>
                    </div>
                    <div className="ml-2">
                      <p>{bpa.sizeFile}</p>
                    </div>
                  </div>
              }
            </div>
          </div>
          {
            loading ?
              <div className="flex justify-center mt-20">
                <img src={loadingSvg} alt="svg" width={70}/>
              </div>
            :
              Object.keys(bpa).length == 0 ?
                <AlertCustom
                  msg={`Nenhum BPA encontrado na data selecionada (${formatMonth(month)} de ${year})`}
                  type="info"
                />
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

