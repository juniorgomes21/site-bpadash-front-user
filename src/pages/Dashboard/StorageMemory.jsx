import PropTypes from "prop-types";
import React from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import Storage from "./Storage";

function StorageMemory(props) {
  //meta title
  document.title="StorageMemory";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("StorageMemory")}
            breadcrumbItem={props.t("StorageMemory")}
          />
          <Storage dataColors='["--bs-primary"]' />
        </Container>
      </div>

    </React.Fragment>
  );
};

StorageMemory.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(StorageMemory);
