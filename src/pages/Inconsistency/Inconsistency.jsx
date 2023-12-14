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
import IndateService from "./InDateService";
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
  //meta title
  document.title="Inconsistências";

  const monthL = localStorage.getItem("@Month");
  const yearL = localStorage.getItem("@Year");
  const dateCurrenty = yearL + "-" + monthL + "-01"

  const { dates } = useContext(AuthContext);
  const { haveErrors, errorsFile } = useContext(SnackBarContext);
  const [month, setMonth] = useState(monthL);
  const [year, setYear] = useState(yearL);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [dateBpa, setDateBpa] = useState(dateCurrenty);


  useEffect(() => {
    console.log(haveErrors());
  }, []);

  function handleClickOpen() {
    setOpen(true);
  };

  function handleClose() {
    setOpen(false);
  };

  function handleListItemClick(date) {
    setYear(date[1]);
    setMonth(date[0]);
    setDateBpa(date[1] + "-" + date[0] + "-01");
    setOpen(false);
  };


  return (
    <>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title={props.t("Inconsistências")} breadcrumbItem={props.t("Inconsistências BPA")} />
          <div className="flex justify-center w-full my-14">
            <div className="flex items-center cursor-pointer" onClick={handleClickOpen}>
              <div className="flex flex-col items-center w-9">
                <DescriptionIcon />
                <p className="font-bold">BPA</p>
              </div>
              <p className="mx-3 w-40">{formatMonth(month)} de {year}</p>
              <KeyboardArrowDownIcon />
            </div>
          </div>
          <div>
            {
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
          <AgeDate
            dateBpa={dateBpa}
          />
          <AgeMinMax
            dateBpa={dateBpa}
          /> {/* dividir por mes */}
          <InCep
            dateBpa={dateBpa}
          />
          <InQtService // precisa de PA
            dateBpa={dateBpa}
          />
          <IndateService
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
          /> {/* VERIFICAR */}
        </Container>
        <Dialog onClose={handleClose} open={open}>
          <DialogTitle>Selecione o BPA</DialogTitle>
          <List sx={{ pt: 0 }}>
            {dates.map((date, index) => (
              <ListItem disableGutters key={index}>
                <ListItemButton onClick={() => handleListItemClick(date)}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                      <DescriptionIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={formatMonth(date[0]) + " de " + date[1]} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Dialog>
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
