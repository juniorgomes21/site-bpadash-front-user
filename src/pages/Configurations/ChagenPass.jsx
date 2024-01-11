import PropTypes from "prop-types";
import React, { useContext, useState } from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack"; 
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { LoadingButton } from "@mui/lab";
import api from "../../services/api";
import SnackBarContext from "../../contexts/managerService";

function ChangePass(props) {

  document.title="Editar Senha";

  const { openSnackBarFun } = useContext(SnackBarContext);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState({ "password": "", "newPassword": "", "confPassword": "" });
  const [error, setError] = useState({ "password": false, "newPassword": false, "confPassword": false });
  const [errorMsg, setErrorMsg] = useState("");

  async function apiChangePassword() {
    setLoading(true);
    try {
      const obj = {
          "password": password.password,
          "newPassword": password.newPassword,
          "confPassword": password.confPassword 
      }
      const response = await api.post("/user/edit/password", obj);
      localStorage.setItem("@User", JSON.stringify(response.data));
      setErrorMsg("");
      openSnackBarFun(false, "Senha Alterada");
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch(e) {
      setErrorMsg(e.response.data);
    }
    setLoading(false);
  }

  function isValidValue() {
    const isValidPass = password.password.length >= 8;
    const isValidNewPass = password.newPassword.length >= 8;
    const isValidConfPass = password.confPassword.length >= 8;

    if(isValidPass && isValidNewPass && isValidConfPass) {
      apiChangePassword();
    } else {
      setError({ "password": !isValidPass, "newPassword": !isValidNewPass, "confPassword": !isValidConfPass });
    }
  }

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title={props.t("Editar Senha")}
            breadcrumbItem={props.t("Editar Senha")}
          />
          {
            errorMsg != "" &&
              <div className="flex justify-center w-full text-red-500 text-base">
                <p>
                  {errorMsg}
                </p>
              </div>
          }
          <div className="flex flex-col justify-center w-full items-center">
                <TextField
                    id="outlined-basic"
                    label="Senha Atual"
                    variant="outlined"
                    type='password'
                    error={error.password}
                    onChange={ e => setPassword({ ...password, ["password"]: e.target.value})}
                    helperText={error.password && "Deve conter pelo menos 8 caracteres"}
                    className="w-1/2 mt-3"
                />
                <TextField
                    id="outlined-basic"
                    label="Nova Senha"
                    variant="outlined"
                    type='password'
                    error={error.newPassword}
                    onChange={e => setPassword({ ...password, ["newPassword"]: e.target.value})}
                    helperText={ error.newPassword && "Deve conter pelo menos 8 caracteres"}
                    className="w-1/2 mt-3"
                />
                <TextField
                    id="outlined-basic"
                    label="Repita a nova senha"
                    variant="outlined"
                    type='password'
                    error={error.confPassword}
                    onChange={e => setPassword({ ...password, ["confPassword"]: e.target.value})}
                    helperText={error.confPassword && "Deve conter pelo menos 8 caracteres"}
                    className="w-1/2 mt-3"
                />
                  <LoadingButton
                      variant="contained"
                      loading={loading}
                      onClick={isValidValue}
                      className="w-1/4 mt-5"
                  >
                      Alterar
                  </LoadingButton>
          </div>
        </Container>
      </div>

    </>
  );
};

ChangePass.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(ChangePass);
