import React, { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import { blue } from '@mui/material/colors';
import AgeMinMax from "./AgeMinMax";
import AgeDate from "./AgeDate";
import InCep from "./InCep";
import InQtService from "./InQtService";
import InDateService from "./InDateService";
import InRace from "./InRace";
import InProfessionals from "./InProfessionals";
import InFpo from "./InFpo";
import InProcedure from "./InProcedure";
import InOccupation from "./InOccupation";
import AuthContext from "../../contexts/Auth";
import SettingsIcon from '@mui/icons-material/Settings';
import DescriptionIcon from '@mui/icons-material/Description';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { formatMonth } from "../../Validation&Formatation/formatation";
import CachedIcon from '@mui/icons-material/Cached';
import AlertCustom from "../../GlobalComponents/AlertCustom";
import SnackBarContext from "../../contexts/managerService";
import { CircularProgress } from "@mui/material";
import DateGlobalBpaContext from "../../contexts/DateGlobalBpa";

const files = [
  {
    name: 'Ocupação',
    acronym: 'OCU'
  },
  {
    name: 'FPO',
    acronym: 'FPO'
  },
  {
    name: 'Profissional',
    acronym: 'PROF'
  },
  {
    name: 'CEP',
    acronym: 'CEP'
  },
  {
    name: 'Procedimento',
    acronym: 'PROC'
  }
]

function Inconsistency(props) {

  document.title="Inconsistências";
  
  const dates = JSON.parse(localStorage.getItem("@Dates"));
  const { month, year } = useContext(DateGlobalBpaContext);
  const { haveErrors, haveLoading, setErrorsfiles, setLoadingErrorsfiles } = useContext(SnackBarContext);
  const [show, setShow] = useState(false);
  const [dateBpa, setDateBpa] = useState(year + "-" + ( month < 10 ? "0" + month : month) + "-01");


  useEffect(() => {
    const date = year + "-" + ( month < 10 ? "0" + month : month) + "-01";
    if(!(date === dateBpa)) {
      setErrorsfiles({
        "inFpo": true,
        "ageDate": true,
        "ageMinMax": true,
        "inCep": true,
        "inQtService":true,
        "inDateService": true,
        "inRace": true,
        "inProfessionals": true,
        "inProcedure": true,
        "inOccupation": true
      });
      setLoadingErrorsfiles({
        "inFpo": true,
        "ageDate": true,
        "ageMinMax": true,
        "inCep": true,
        "inQtService":true,
        "inDateService": true,
        "inRace": true,
        "inProfessionals": true,
        "inProcedure": true,
        "inOccupation": true
      });
      setDateBpa(date);
    }
  }, [month, year])


  return (
    <>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title={props.t("Inconsistências")} breadcrumbItem={props.t("Inconsistências BPA")} />
          {
            dates.length == 0 &&
              <div>
                <AlertCustom
                  msg="Você não possui nenhum arquivo BPA"
                  type="info"
                />
              </div>
          }
          <div>
            {
              !show ?
                <div className="flex justify-center w-full">
                  <div className="flex flex-col items-center">
                    <p className="text-base">Aqui você pode ver todas as inconsistências do arquivo atual.</p>
                    <Button
                      variant="contained"
                      color="success"
                      className="mt-3"
                      onClick={() => setShow(true)}
                    >
                      EXECUTAR
                    </Button>
                  </div>
                </div>
              :
                <>
                  <div>
                    {
                      haveLoading() ?
                        <div className="flex w-full justify-center mt-4">
                          <CircularProgress size={20} />
                        </div>
                      :
                        !haveErrors() &&
                          <AlertCustom
                            msg="Nenhum erro encontrado no arquivo selecionado"
                            type="info"
                          />
                    }
                  </div>
                  <InFpo // precisa de PA
                    dateBpa={dateBpa}
                  />
                  <AgeMinMax
                    dateBpa={dateBpa}
                  /> 
                  <AgeDate
                    dateBpa={dateBpa}
                  />
                  <InCep
                    dateBpa={dateBpa}
                  />
                  <InQtService // precisa de PA
                    dateBpa={dateBpa}
                  />
                  <InDateService
                    dateBpa={dateBpa}
                  />
                  <InRace
                    dateBpa={dateBpa}
                  />
                  <InProfessionals
                    dateBpa={dateBpa}
                  />
                  <InProcedure // precisa de PA
                    dateBpa={dateBpa}
                  />
                  <InOccupation // precisa de PA
                    dateBpa={dateBpa}
                  />
                </>
            }
          </div>
        </Container>
      </div>
    </>
  );
};

Inconsistency.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(Inconsistency);
