import PropTypes from "prop-types";
import React from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import AlertCust from "../../GlobalComponents/AlertCustom";
import { formatNameMonth } from "../../Validation&Formatation/formatation";


function PublicPlace(props) {

  document.title="Logradouro";


  return (
    <>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Logradouro")}
            breadcrumbItem={props.t("Logradouro")}
          />
          <AlertCust
            type="warning"
            msg={`As regras seram aplicadas no arquivo BPA do mês de ${formatNameMonth(month)} de ${year}`}
          />
        </Container>
      </div>

    </>
  );
};

PublicPlace.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(PublicPlace);
