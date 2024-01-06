import PropTypes from "prop-types";
import React, {useContext} from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import AlertCust from "../../GlobalComponents/AlertCustom";
import { formatNameMonth } from "../../Validation&Formatation/formatation";
import DatePickerContext from "../../contexts/DateGlobalBpa";


function PublicPlace(props) {

  document.title="Logradouro";

  const { month, year } = useContext(DatePickerContext);

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
            msg={`As regras seram aplicadas no arquivo BPA do mês de ${formatNameMonth(month)} do ano de ${year}`}
          />
          <p className="flex justify-center mt-8">
            Adicione regras de substituição para o campo PA. Ao executar uma regra todos os campos PA informados seram substituidos pelo novo PA informado.
          </p>
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
