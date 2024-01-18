import PropTypes from "prop-types";
import React from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";

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
            <div className="flex w-full justify-center text-4xl text-red-700 mb-3">
                <p>Para a moça mais especial da minha vida!</p>
            </div>
            <div className="flex w-full justify-center">
                <img src="https://www.polenflor.com.br/media/catalog/product/cache/1/image/800x/17f82f742ffe127f42dca9de82fb58b1/i/m/img_12.jpg" alt="..." />
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
