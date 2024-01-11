import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";
import logo from "../../assets/images/logo.svg";
import logoLightSvg from "../../assets/images/logo-light.svg";
import { withTranslation } from "react-i18next";
import { showRightSidebarAction, toggleLeftmenu, changeSidebarType } from "../../store/actions";
import DateGlobalBpaContext from '../../contexts/DateGlobalBpa';
import api from "../../services/api";

const array = [
  "090890",
  "233400",
  "125300",
  "976500",
  "126890",
  "123089",
  "642890",
  "123455",
  "893436",
  "923457",
  "567890",
  "178900",
  "123452",
  "123456",
  "1234567890",
  "2334567890",
  "1253346789",
  "9765567890",
  "1264567890",
  "1233534589",
  "6423890890",
  "1234557890",
  "8934367890",
  "9234576450",
  "3456456789",
  "9782317890",
  "1234527829",
  "1234568565",
  "1234567890",
  "2334567890",
  "1253346789",
  "9765567890",
  "1264567890",
  "1233534589",
  "6423890890",
  "1234557890",
  "8934367890",
  "9234576450",
  "3456456789",
  "9782317890",
  "1234527829",
  "1234568565",
  "1234567890",
  "2334567890",
  "1253346789",
  "9765567890",
  "1264567890",
  "1233534589",
  "6423890890",
  "1234557890",
  "8934367890",
  "9234576450",
  "3456456789",
  "9782317890",
  "1234527829",
  "1234568565",
  "1234567890",
  "2334567890",
  "1253346789",
  "9765567890",
  "1264567890",
  "1233534589",
  "6423890890",
  "1234557890",
  "8934367890",
  "9234576450",
  "3456456789",
  "9782317890",
  "1234527829",
  "1234568565",
]

function Header(props) {

  const { month, year } = useContext(DateGlobalBpaContext);
  const [bpax, setBpax] = useState({});
  const [open, setOpen] = useState(false);
  const [paCbo, setPaCbo] = useState(array);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");


  useEffect(() => {
    // getPaCbo();
  }, [])

  // async function getPaCbo() {
  //   try {
  //     const response = await api.get(`/bpai/get/pa/cbo/${month}/${year}`);
  //     setPaCbo(response.data);
  //   } catch(e) {
  //     console.log(e.response);
  //   }
  // }

  async function searchPaCbo() {
    setLoading(true);
    open(true);
    try {
      const response = await api.get(`/bpa/get/${inputValue}`);
      setBpax(response.data);
    } catch(e) {
      console.log(e.response);
    }
    setLoading(false);
  }

  function tToggle() {
    var body = document.body;
    if (window.screen.width <= 998) {
      body.classList.toggle("sidebar-enable");
    } else {
      body.classList.toggle("vertical-collpsed");
      body.classList.toggle("sidebar-enable");
    }
  }

  function handleInputChange(e) {
    const value = e.target.value;
    const filteredSuggestions = getSuggestions(value);

    setInputValue(value);
    setPaCbo(filteredSuggestions);
  }

  function getSuggestions(input) {
    return array.filter((num) => num.includes(input));
  }

  return (
    <>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <button
              type="button"
              onClick={() => {
                tToggle();
              }}
              className="btn btn-sm px-3 font-size-16 header-item "
              id="vertical-menu-btn"
            >
              <i className="fa fa-fw fa-bars" />
            </button>

            {/* <form className="app-search d-none d-lg-block">
              <div className="relative">
                <div className='border-default border-[1px] rounded-xl'>
                  <span className="bx bx-search-alt text-gray-500" onClick={searchPaCbo}/>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={props.t("Search") + "..."}
                    value={inputValue}
                    // onChange={handleInputChange}
                    onChange={ e => {
                      if(!isNaN(Number(e.target.value)) && e.target.value.length <= 10) setInputValue(e.target.value);
                    }}
                  />
                </div>
                {/* {
                  inputValue.length > 0 && (
                    <ul className="suggestions-list absolute z-10 mt-2 w-full bg-white border rounded-xl shadow-lg">
                      {paCbo.map((suggestion, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            setInputValue(suggestion);
                            setPaCbo([]);
                          }}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                )}
              </div>
            </form> */}

          </div>
          <div className="d-flex">
            <ProfileMenu />
          </div>
        </div>
      </header>
    </>
  );
};

Header.propTypes = {
  changeSidebarType: PropTypes.func,
  leftMenu: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func
};

const mapStatetoProps = state => {
  const {
    layoutType,
    showRightSidebar,
    leftMenu,
    leftSideBarType,
  } = state.Layout;
  return { layoutType, showRightSidebar, leftMenu, leftSideBarType };
};

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
})(withTranslation()(Header));
