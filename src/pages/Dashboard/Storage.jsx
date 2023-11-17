import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Card, CardBody } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../components/Common/ChartsDynamicColor";
import { CircularProgress } from "@mui/material";
import api from "../../services/api";


const storagexy = {
  storageTotal: "0 GB",
  storagePorcent: 0
}

function Storage({ dataColors }) { 
  
  const [storage, setStorage] = useState(storagexy);
  const [series, setSeries] = useState([storage.storagePorcent]);

  useEffect(() => {
    getStorage();
  }, [])

  
  async function getStorage() {
    try {
      const response = await api.get("/user/storage");
      setStorage(response.data);
      setSeries([response.data.storagePorcent]);
    } catch(e) {
      console.log("Erro ao buscar usuário.", e.response);
    }
  }

  const options = {
    chart: {
      height: 150,
      type: "radialBar",
      sparkline: {
        enabled: true,
      },
    },
    colors: series[0] > 90 ? ["#f50707"] : ["#0f57f3"],
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#e7e7e7",
          strokeWidth: "97%",
          margin: 5, // margin is in pixels
        },

        hollow: {
          size: "60%",

        },

        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: -2,
            fontSize: "16px",
          },
        },
      },
    },
    grid: {
      padding: {
        top: -10,
      },
    },
    stroke: {
      dashArray: 3,
    },
    labels: ["Storage"],
  };

  return (
    <>
      <Card className="filemanager-sidebar ms-lg-2">
        <CardBody>
          <div className="text-center">
            <h5 className="font-size-15 mb-4">Armazenamento</h5>
            <div>
              <ReactApexChart
                options={options}
                series={series}
                type="radialBar"
                height={150}
                className="apex-charts"
              />
            </div>
            <p className="text-muted mt-4">{storage.storageUsed} de {storage.storageTotal} usados</p>
          </div>
        </CardBody>
      </Card>
    </>
  );
};


export default Storage;
