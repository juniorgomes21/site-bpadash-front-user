import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Container, Row, Card, Col } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import api from "../../services/api";
import Alert from '@mui/material/Alert';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import LoadingButton from '@mui/lab/LoadingButton';
import { formatDateString } from '../../Validation&Formatation/formatation';
import AlertCustom from "../../GlobalComponents/AlertCustom";

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

  const [loading, setLoading] = useState(false);
  const [loadingFile, setLoadingFile] = useState({ "loading": false, "index": -1 });
  const [bpaList, setBpaList] = useState([]);
  const [fileDownloaded, setFileDownloaded] = useState(false);

  useEffect(() => {
    apiGetAllBpa();
  }, [])

  async function apiGetAllBpa() {
    try {
      const response = await api.get("/bpa/get/all");
      setBpaList(response.data);
    } catch(e) {
    }
  }

  async function handleDownloadClick(identifier, date, index) {
    if(loadingFile.loading == false) {
      setLoadingFile({ "loading": true, "index": index });
      try {
        const response = await api.get(`/bpa/generateFile/${identifier}`);
        const blob = new Blob([response.data], { type: 'application/octet-stream' });
        // Crie um objeto Blob a partir da resposta
        const url = window.URL.createObjectURL(blob);
  
        // Crie um elemento <a> para iniciar o download
        const link = document.createElement('a');
        link.href = url;
  
        link.setAttribute('download', `BPA_${date.replace("-", "_")}.txt`);
        document.body.appendChild(link);
  
        // Inicie o download
        link.click();
  
        // Limpe o objeto <a> da página
        document.body.removeChild(link);
  
      } catch(e) {
        console.log('Erro ao fazer o download do arquivo:', e);
      }
      setLoadingFile({ "loading": false, "index": -1 });
    }
  }

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={props.t("Downloads")} breadcrumbItem={props.t("Downloads")} />
          {
            bpaList.length == 0 ?
              <div className="flex justify-center">
                <AlertCustom
                  msg="Você não possui nenhum arquivo BPA!"
                  type="info"
                />
              </div>
            :
              <Row>
                  {
                    bpaList.map((item, index) => (
                        <Col xl="4" sm="6" key={index}>
                          <Card className='border-[1px] border-default rounded-md'>
                            <Row>
                              <Col xl="5">
                                <div className="text-center p-4 border-end">
                                  <div className="avatar-sm mx-auto mb-3 mt-1">
                                    <DescriptionIcon sx={{ fontSize: 45 }}/>
                                  </div>
                                  <h5 className="text-truncate pb-1">{item.name}</h5>
                                </div>
                              </Col>
                  
                              <Col xl="7">
                                <div className="p-4 text-center text-xl-start">
                                  <Row>
                                    <Col xs="6">
                                      <div>
                                        <p className="text-muted mb-2 text-truncate">Tamanho</p>
                                        <h5>{item.sizeFile}</h5>
                                      </div>
                                    </Col>
                                    <Col xs="6">
                                      <div>
                                        <p className="text-muted mb-2 text-truncate">
                                          Data
                                        </p>
                                        <h5>{formatDateString(item.date, false)}</h5>
                                      </div>
                                    </Col>
                                  </Row>
                                  <div className="flex w-full justify-end mt-4">
                                    <LoadingButton
                                      variant='contained'
                                      size='small'
                                      disabled={loadingFile.loading}
                                      loading={loadingFile.loading && index === loadingFile.index}
                                      onClick={() => handleDownloadClick(item.identifier, formatDateString(item.date, false), index)}
                                    >
                                      Download
                                      <DownloadIcon sx={{ fontSize: 18, marginLeft: 1 }}/>
                                    </LoadingButton>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </Card>
                        </Col>
                    ))
                  }
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
