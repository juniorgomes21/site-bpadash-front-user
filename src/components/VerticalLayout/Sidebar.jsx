import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import SidebarContent from "./SidebarContent";
import { Link } from "react-router-dom";
import logoLightPng from "../../assets/images/logo_bpa.png";
import bpa from "../../assets/images/bpa.png";

function Sidebar(props) {

  return (
    <>
      <div className="vertical-menu">
        <div className="navbar-brand-box">
          <Link to="/" className="logo logo-light">
            <span className="logo-sm">
              <img src={logoLightPng} alt="" style={{ height: 70, width: 100 }} />
            </span>
            <span className="logo-lg">
              <div className="flex justify-center">
                <img src={bpa} style={{ height: 80, width: 190 }} />
              </div>
            </span>
          </Link>
        </div>
        <div data-simplebar className="h-100">
          {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
        </div>
        
        <div className="sidebar-background"></div>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  type: PropTypes.string,
};

const mapStatetoProps = state => {
  return {
    layout: state.Layout,
  };
};
export default connect(
  mapStatetoProps,
  {}
)(withRouter(withTranslation()(Sidebar)));
