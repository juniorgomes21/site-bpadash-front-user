import PropTypes from "prop-types";
import React, { useContext, useEffect } from "react";
import { withRouter } from "react-router-dom";
import AuthContext from "../../contexts/Auth";

function Logout() {

  const { handleLogout } = useContext(AuthContext);

  useEffect(() => {
    handleLogout();
  }, [])

  return <></>
}

Logout.propTypes = {
  history: PropTypes.object,
}

export default withRouter(Logout);
