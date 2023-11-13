import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import CardShop from "./CardShop";
import api from "../../services/api";
import Alert from '@mui/material/Alert';

const cards = [
    {
        id: "1",
        name: "name",
        product: "775,5 KB",
        balance: "23/05/2023"
    },
    {
        id: "1",
        name: "name",
        product: "775,5 KB",
        balance: "23/05/2023"
    },
    {
        id: "1",
        name: "name",
        product: "775,5 KB",
        balance: "23/05/2023"
    },
    {
        id: "1",
        name: "name",
        product: "775,5 KB",
        balance: "23/05/2023"
    },
    {
        id: "1",
        name: "name",
        product: "775,5 KB",
        balance: "23/05/2023"
    },
    {
        id: "1",
        name: "name",
        product: "775,5 KB",
        balance: "23/05/2023"
    },
    {
        id: "1",
        name: "name",
        product: "775,5 KB",
        balance: "23/05/2023"
    }
]

function Download(props) {

  document.title="Downloads";

  const [loading, setLoading] = useState(true);
  const [loadingFile, setLoadingFile] = useState(false);
  const [bpaList, setBpaList] = useState([]);
  const [fileDownloaded, setFileDownloaded] = useState(false);

  useEffect(() => {
    apiGetAllBpa();
  }, [])

  async function apiGetAllBpa() {
    try {
      const response = await api.get("/bpa/get/all");
      setBpaList(response.data);
      console.log(response.data);
    } catch(e) {
      console.log("error", e.response);
    }
  }

  async function handleDownloadClick(identifier) {
    setLoadingFile(true);
    try {
      const response = await api.get(`/bpa/generateFile/${identifier}`);

      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      // Crie um objeto Blob a partir da resposta
      const url = window.URL.createObjectURL(blob);

      // Crie um elemento <a> para iniciar o download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'arquivo.txt');
      document.body.appendChild(link);

      // Inicie o download
      link.click();

      // Limpe o objeto <a> da página
      document.body.removeChild(link);

    } catch(e) {
      console.log('Erro ao fazer o download do arquivo:', e);
    }
    setLoadingFile(false);
  };

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={props.t("Downloads")} breadcrumbItem={props.t("Downloads")} />
          {
            bpaList.length == 0 ?
              <div className="flex justify-center">
                <Alert severity="warning" className="">Você não possui nenhum arquivo BPA!</Alert>
              </div>
            :
              <Row>
                {bpaList.map((item, index) => (
                  <CardShop
                    key={index}
                    loading={loadingFile}
                    api={handleDownloadClick}
                    item={item}
                  />
                ))}
              </Row>
          }
        </Container>
      </div>
    </>
  );
};

Download.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(Download);
