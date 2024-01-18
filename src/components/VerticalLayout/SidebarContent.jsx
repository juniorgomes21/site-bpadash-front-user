import PropTypes from "prop-types";
import React, { useContext, useEffect, useRef, useState } from "react";
import SimpleBar from "simplebar-react";
import MetisMenu from "metismenujs";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import ListAltIcon from '@mui/icons-material/ListAlt';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { blue, green } from '@mui/material/colors';
import pt from 'date-fns/locale/pt-BR';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import DateGlobalBpaContext from "../../contexts/DateGlobalBpa";
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import PageviewIcon from '@mui/icons-material/Pageview';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import AuthContext from "../../contexts/Auth";
import DescriptionIcon from '@mui/icons-material/Description';
import { formatMonth } from "../../Validation&Formatation/formatation";
import AlertCustom from "../../GlobalComponents/AlertCustom";
import SettingsIcon from '@mui/icons-material/Settings';
import Alert from '@mui/material/Alert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function SidebarContent(props) {

  const ref = useRef();
  registerLocale('pt-BR', pt);
  setDefaultLocale('pt-BR');

  const user = JSON.parse(localStorage.getItem("@User"));
  const { dates } = useContext(AuthContext);
  const { month, year, startDateChange, getFormatedDate } = useContext(DateGlobalBpaContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const pathName = props.location.pathname;

    function initMenu() {
      new MetisMenu("#side-menu");

      let matchingMenuItem = null;

      const ul = document.getElementById("side-menu");
      const items = ul.getElementsByTagName("a");

      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }

      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    }
    
    initMenu();
  }, [props.location.pathname])

  useEffect(() => {
    ref.current.recalculate()
  })

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300
      }
    }
  }

  function activateParentDropdown(item) {
    item.classList.add("active")
    const parent = item.parentElement
    const parent2El = parent.childNodes[1]
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show")
    }

    if (parent) {
      parent.classList.add("mm-active")
      const parent2 = parent.parentElement

      if (parent2) {
        parent2.classList.add("mm-show") // ul tag

        const parent3 = parent2.parentElement // li tag

        if (parent3) {
          parent3.classList.add("mm-active") // li
          parent3.childNodes[0].classList.add("mm-active") //a
          const parent4 = parent3.parentElement // ul
          if (parent4) {
            parent4.classList.add("mm-show") // ul
            const parent5 = parent4.parentElement
            if (parent5) {
              parent5.classList.add("mm-show") // li
              parent5.childNodes[0].classList.add("mm-active") // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false
    }
    scrollElement(item);
    return false
  }

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleListItemClick(date) {
    startDateChange(date);
    handleClose();
  }

  function testDate(date) {
    const datex = (date[1] + "-" + ( date[0] < 10 ? "0" + date[0] : date[0]) + "-" + "01");
    return datex === getFormatedDate();
  }

  return (
    <>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title mt-2">{props.t("Data Geral")} </li>
              <div className="logo logo-light ml-6 cursor-pointer" onClick={handleClickOpen}>
                <CalendarMonthIcon sx={{ fontSize: 20, mr: 1.5 }}/>

                <span className="logo-lg">
                  {props.t(`${formatMonth(month)} de ${year}`)}
                </span>
              </div>
            <li className="menu-title">{props.t("Menu")} </li>

            {
              !user.changePass &&
                <div>
                  <Alert variant="filled" severity="warning">
                    Altere sua senha!
                  </Alert>
                </div>
            }

            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bxs-file-doc"></i>
                <span>{props.t("Meus Arquivos")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/file/bpa">{props.t("BPA")}</Link>
                </li>
                <li>
                  <Link to="/file/edit/title">{props.t("CABEÇALHO")}</Link>
                </li>
                <li>
                  <Link to="/file/edit/bpai">{props.t("BPA-I")}</Link>
                </li>
                <li>
                  <Link to="/file/edit/bpac">{props.t("BPA-C")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/timeline/bpa" className="">
                <ListAltIcon sx={{ fontSize: 20, mr: 1.5 }}/>
                <span>{props.t("Linha do Tempo BPA")}</span>
              </Link>
            </li>

            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-stats"></i>
                <span>{props.t("Dashboards")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/storage/memory">{props.t("Memória de Armazenamento")}</Link>
                </li>
                {/* <li>
                  <Link to="/dashboard">{props.t("Produção por Meta")}</Link>
                </li>
                <li>
                  <Link to="/dashboard-saas">{props.t("Produção CNSMED (QT)")}</Link>
                </li>
                <li>
                  <Link to="/dashboard-crypto">{props.t("Produção CNSMED (R$)")}</Link>
                </li>
                <li>
                  <Link to="/blog">{props.t("Produção por Procedimento")}</Link>
                </li>
                <li>
                  <Link to="/blog">{props.t("Análise Geral")}</Link>
                </li>
                <li>
                  <Link to="/blog">{props.t("Relatório de Custos")}</Link>
                </li>
                <li>
                  <Link to="/blog">{props.t("Distribuição por Idade")}</Link>
                </li>
                <li>
                  <Link to="/blog">{props.t("Distribuição por Sexo")}</Link>
                </li>
                <li>
                  <Link to="/blog">{props.t("Distribuição por Raça")}</Link>
                </li>
                <li>
                  <Link to="/blog">{props.t("Distribuição por IBGE")}</Link>
                </li>
                <li>
                  <Link to="/blog">{props.t("Distribuição por CBO")}</Link>
                </li>
                <li>
                  <Link to="/blog">{props.t("Distribuição por CNSMED")}</Link>
                </li>
                <li>
                  <Link to="/blog">{props.t("Distribuição por Data de Atendimento")}</Link>
                </li>
                <li>
                  <Link to="/blog">{props.t("Distribuição por Procedimento (BPA-I)")}</Link>
                </li>
                <li>
                  <Link to="/blog">{props.t("Distribuição por Procedimento (BPA-C)")}</Link>
                </li> */}
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow">
                <PageviewIcon sx={{ fontSize: 20, mr: 1.5 }}/>
                <span>{props.t("Consulta SIGTAP")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/file/consult/professionals">{props.t("Profissionais")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bxs-cloud-upload"></i>
                <span>{props.t("Uploads")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/upload/bpa">{props.t("BPA")}</Link>
                </li>
                <li>
                  <Link to="/upload/bpai">{props.t("BPA-I")}</Link>
                </li>
                <li>
                  <Link to="/upload/bpac">{props.t("BPA-C")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow">
                <DomainVerificationIcon sx={{ fontSize: 20, mr: 1.5 }}/>
                <span>{props.t("Tratamento BPA")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/treatment/pa">{props.t("PA")}</Link>
                </li>
                <li>
                  <Link to="/treatment/pa/cbo">{props.t("PA & CBO")}</Link>
                </li>
                <li>
                  <Link to="/treatment/public/place">{props.t("Logradouro")}</Link>
                </li>
                <li>
                  <Link to="/treatment/pa/delete">{props.t("Apagar por PA")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/inconsistency" className="">
                <WarningAmberIcon sx={{ fontSize: 20, mr: 1.5 }}/>
                <span>{props.t("Inconsistências BPA")}</span>
              </Link>
            </li>

            <li>
              <Link to="/validation/file" className="">
                <i className="bx bx-task"></i>
                <span>{props.t("Validação de arquivo")}</span>
              </Link>
            </li>

            <li>
              <Link to="/download/bpa" className="">
                <i className="bx bx-download"></i>
                <span>{props.t("Download BPA")}</span>
              </Link>
            </li>
            
            <li>
              <Link to="/#" className="has-arrow">
                <SettingsIcon sx={{ fontSize: 20, mr: 1.5 }}/>
                <span>{props.t("Configurações")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/configurations/files">{props.t("Arquivos de Validações")}</Link>
                </li>
                <li>
                  <Link to="/configurations/register">{props.t("Cadastro")}</Link>
                </li>
                <li>
                  <Link to="/configurations/password">{props.t("Mudar Senha")}</Link>
                </li>
                <li>
                  <Link to="/logout">{props.t("Sair")}</Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </SimpleBar>
      <Dialog onClose={handleClose} open={open}>
          <DialogTitle className="w-80">Selecione a data do BPA</DialogTitle>
          <List sx={{ pt: 0 }}>
            <div className="m-3">
              {
                dates.length == 0 ?
                  <div className="m-4">
                    <AlertCustom
                      type="info"
                      msg="Você não possui nenhum arquivo BPA"
                    />
                  </div>
                :
                  dates.map((date, index) => (
                    <ListItem disableGutters key={index} className={`border-[1px] ${testDate(date) ? "border-green-500" : "border-default"} my-2 rounded-md hover:bg-green-100`}>
                      <ListItemButton onClick={() => handleListItemClick(date)}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: testDate(date) ? green[100] : blue[100], color: blue[600] }}>
                            { testDate(date) ? <CheckCircleIcon color="success"/> : <DescriptionIcon />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={formatMonth(date[0]) + " de " + date[1]} />
                      </ListItemButton>
                    </ListItem>
              ))}
            </div>
          </List>
        </Dialog>
    </>
  )
}

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
}

export default withRouter(withTranslation()(SidebarContent))

