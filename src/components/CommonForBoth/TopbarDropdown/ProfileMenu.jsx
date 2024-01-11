import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';

function ProfileMenu(props) {

  const user = JSON.parse(localStorage.getItem("@User"));

  return (
    <>
      <div className="flex items-center border-[1px] border-default p-1 rounded-xl">
          <span className="font-bold text-sm d-none d-xl-inline-block ms-2 me-1">{user.name}</span>
          <PersonIcon />
      </div>
    </>
  )
}

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any,
};

const mapStatetoProps = (state) => {
  const { error, success } = state.Profile;
  return { error, success };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
);
