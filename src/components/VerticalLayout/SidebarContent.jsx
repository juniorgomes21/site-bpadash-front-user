import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import SimpleBar from "simplebar-react";
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import ListAltIcon from '@mui/icons-material/ListAlt';

function SidebarContent(props) {

  const ref = useRef()
  
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

  return (
    <>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{props.t("Menu")} </li>

            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-stats"></i>
                <span>{props.t("Dashboards")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/storage/memory">{props.t("Memória de Armazenamento")}</Link>
                </li>
                <li>
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
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow">
                <ListAltIcon sx={{ fontSize: 20, mr: 1.5 }}/>
                <span>{props.t("Linha do Tempo")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/timeline/bpa">{props.t("BPA")}</Link>
                </li>
                <li>
                  <Link to="/timeline/fpo">{props.t("FPO")}</Link>
                </li>
                <li>
                  <Link to="/timeline/professionals">{props.t("Profissionais")}</Link>
                </li>
              </ul>
            </li>

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
                  <Link to="/file/edit/title">{props.t("TÍTULO")}</Link>
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
                <li>
                  <Link to="/upload/fpo">{props.t("FPO")}</Link>
                </li>
                <li>
                  <Link to="/upload/fpo/line">{props.t("Linha FPO")}</Link>
                </li>
                <li>
                  <Link to="/upload/professionals">{props.t("Profissionais")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/validation/file" className="">
                <i className="bx bx-task"></i>
                <span>{props.t("Validação de arquivo")}</span>
              </Link>
            </li>

            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-download"></i>
                <span>{props.t("Download")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/download/bpa">{props.t("BPA")}</Link>
                </li>
              </ul>
            </li>
            
          </ul>
        </div>
      </SimpleBar>
    </>
  )
}

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
}

export default withRouter(withTranslation()(SidebarContent))

