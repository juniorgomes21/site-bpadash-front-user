import PropTypes from "prop-types";
import React from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import Mj from "../../assets/images/MJ.png";

function Mayra(props) {
  //meta title
  document.title="De Junior Para Mayra Clarisse";

  return (
    <>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("S2")}
            breadcrumbItem={props.t("De Junior Para Mayra Clarisse")}
          />
            <div className="flex w-full justify-center text-xl text-red-700 mb-3">
                <p>A mulher da minha vida tem um nome Mayra Clarisse, vc é tudo pra mim meu amor S2!</p>
            </div>
            <div className="flex w-full justify-center">
                <img src={Mj} alt="..." />
            </div>
        </Container>
      </div>

    </>
  );
};

Mayra.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(Mayra);
