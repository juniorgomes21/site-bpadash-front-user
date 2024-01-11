import PropTypes from "prop-types";
import React from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import Storage from "./Storage";

function StorageMemory(props) {
  //meta title
  document.title="Memória de Armazenamento";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={props.t("Meu Armazenamento")} breadcrumbItem={props.t("Meu Armazenamento")} />
          <p>
            Acompanhe seu armazenamento usado
          </p>
          <div className="flex justify-center mt-10 w-full">
            <Storage dataColors='["--bs-primary"]' />
          </div>
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
