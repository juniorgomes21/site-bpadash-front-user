import React, { useEffect } from "react"

import { Container, Row, Col, Card, CardBody, Badge } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const IconMaterialdesign = () => {
  useEffect(() => {
    function isNew(icon) {
      return icon.version === "5.0.45"
    }

    function getIconItem(icon, isNewIcon) {
      const div = document.createElement("div"),
        i = document.createElement("i")
      div.className = "col-xl-3 col-lg-4 col-sm-6"
      i.className = "mdi mdi-" + icon.name
      div.appendChild(i)
      const span = document.createElement("span")
      span.appendChild(document.createTextNode("mdi-" + icon.name))
      div.appendChild(span)
      return div
    }
    (function () {
      const icons = [
        {
          name: "wifi-arrow-down",
          hex: "F16B6",
          version: "5.8.55"
        }, {
          name: "wifi-arrow-left",
          hex: "F16B7",
          version: "5.8.55"
        }, {
          name: "wifi-arrow-left-right",
          hex: "F16B8",
          version: "5.8.55"
        }, {
          name: "wifi-arrow-right",
          hex: "F16B9",
          version: "5.8.55"
        }, {
          name: "wifi-arrow-up",
          hex: "F16BA",
          version: "5.8.55"
        }, {
          name: "wifi-arrow-up-down",
          hex: "F16BB",
          version: "5.8.55"
        }, {
          name: "wifi-cancel",
          hex: "F16BC",
          version: "5.8.55"
        }, {
          name: "wifi-check",
          hex: "F16BD",
          version: "5.8.55"
        }, {
          name: "wifi-cog",
          hex: "F16BE",
          version: "5.8.55"
        }, {
          name: "wifi-lock",
          hex: "F16BF",
          version: "5.8.55"
        }, {
          name: "wifi-lock-open",
          hex: "F16C0",
          version: "5.8.55"
        }, {
          name: "wifi-marker",
          hex: "F16C1",
          version: "5.8.55"
        }, {
          name: "wifi-minus",
          hex: "F16C2",
          version: "5.8.55"
        }, {
          name: "wifi-off",
          hex: "F05AA",
          version: "1.5.54"
        }, {
          name: "wifi-plus",
          hex: "F16C3",
          version: "5.8.55"
        }, {
          name: "wifi-refresh",
          hex: "F16C4",
          version: "5.8.55"
        }, {
          name: "wifi-remove",
          hex: "F16C5",
          version: "5.8.55"
        }, {
          name: "wifi-settings",
          hex: "F16C6",
          version: "5.8.55"
        }, {
          name: "wifi-star",
          hex: "F0E0B",
          version: "3.5.94"
        }, {
          name: "wifi-strength-1",
          hex: "F091F",
          version: "2.3.50"
        }, {
          name: "wifi-strength-1-alert",
          hex: "F0920",
          version: "2.3.50"
        }, {
          name: "wifi-strength-1-lock",
          hex: "F0921",
          version: "2.3.50"
        }, {
          name: "wifi-strength-1-lock-open",
          hex: "F16CB",
          version: "5.8.55"
        }, {
          name: "wifi-strength-2",
          hex: "F0922",
          version: "2.3.50"
        }, {
          name: "wifi-strength-2-alert",
          hex: "F0923",
          version: "2.3.50"
        }, {
          name: "wifi-strength-2-lock",
          hex: "F0924",
          version: "2.3.50"
        }, {
          name: "wifi-strength-2-lock-open",
          hex: "F16CC",
          version: "5.8.55"
        }, {
          name: "wifi-strength-3",
          hex: "F0925",
          version: "2.3.50"
        }, {
          name: "wifi-strength-3-alert",
          hex: "F0926",
          version: "2.3.50"
        }, {
          name: "wifi-strength-3-lock",
          hex: "F0927",
          version: "2.3.50"
        }, {
          name: "wifi-strength-3-lock-open",
          hex: "F16CD",
          version: "5.8.55"
        }, {
          name: "wifi-strength-4",
          hex: "F0928",
          version: "2.3.50"
        }, {
          name: "wifi-strength-4-alert",
          hex: "F0929",
          version: "2.3.50"
        }, {
          name: "wifi-strength-4-lock",
          hex: "F092A",
          version: "2.3.50"
        }, {
          name: "wifi-strength-4-lock-open",
          hex: "F16CE",
          version: "5.8.55"
        }, {
          name: "wifi-strength-alert-outline",
          hex: "F092B",
          version: "2.3.50"
        }, {
          name: "wifi-strength-lock-open-outline",
          hex: "F16CF",
          version: "5.8.55"
        }, {
          name: "wifi-strength-lock-outline",
          hex: "F092C",
          version: "2.3.50"
        }, {
          name: "wifi-strength-off",
          hex: "F092D",
          version: "2.3.50"
        }, {
          name: "wifi-strength-off-outline",
          hex: "F092E",
          version: "2.3.50"
        }, {
          name: "wifi-strength-outline",
          hex: "F092F",
          version: "2.3.50"
        }, {
          name: "wifi-sync",
          hex: "F16C7",
          version: "5.8.55"
        }, {
          name: "wikipedia",
          hex: "F05AC",
          version: "1.5.54"
        }, {
          name: "wind-turbine",
          hex: "F0DA5",
          version: "3.4.93"
        }, {
          name: "window-close",
          hex: "F05AD",
          version: "1.5.54"
        }, {
          name: "window-closed",
          hex: "F05AE",
          version: "1.5.54"
        }, {
          name: "window-closed-variant",
          hex: "F11DB",
          version: "4.5.95"
        }, {
          name: "window-maximize",
          hex: "F05AF",
          version: "1.5.54"
        }, {
          name: "window-minimize",
          hex: "F05B0",
          version: "1.5.54"
        }, {
          name: "window-open",
          hex: "F05B1",
          version: "1.5.54"
        }, {
          name: "window-open-variant",
          hex: "F11DC",
          version: "4.5.95"
        }, {
          name: "window-restore",
          hex: "F05B2",
          version: "1.5.54"
        }, {
          name: "window-shutter",
          hex: "F111C",
          version: "4.3.95"
        }, {
          name: "window-shutter-alert",
          hex: "F111D",
          version: "4.3.95"
        }, {
          name: "window-shutter-open",
          hex: "F111E",
          version: "4.3.95"
        }, {
          name: "windsock",
          hex: "F15FA",
          version: "5.6.55"
        }, {
          name: "wiper",
          hex: "F0AE9",
          version: "2.7.94"
        }, {
          name: "wiper-wash",
          hex: "F0DA6",
          version: "3.4.93"
        }, {
          name: "wizard-hat",
          hex: "F1477",
          version: "5.2.45"
        }, {
          name: "wordpress",
          hex: "F05B4",
          version: "1.5.54"
        }, {
          name: "wrap",
          hex: "F05B6",
          version: "1.5.54"
        }, {
          name: "wrap-disabled",
          hex: "F0BDF",
          version: "3.0.39"
        }, {
          name: "wrench",
          hex: "F05B7",
          version: "1.5.54"
        }, {
          name: "wrench-outline",
          hex: "F0BE0",
          version: "3.0.39"
        }, {
          name: "xamarin",
          hex: "F0845",
          version: "2.1.19"
        }, {
          name: "xamarin-outline",
          hex: "F0846",
          version: "2.1.19"
        }, {
          name: "xing",
          hex: "F05BE",
          version: "1.5.54"
        }, {
          name: "xml",
          hex: "F05C0",
          version: "1.5.54"
        }, {
          name: "xmpp",
          hex: "F07FF",
          version: "2.0.46"
        }, {
          name: "y-combinator",
          hex: "F0624",
          version: "1.6.50"
        }, {
          name: "yahoo",
          hex: "F0B4F",
          version: "2.8.94"
        }, {
          name: "yeast",
          hex: "F05C1",
          version: "1.5.54"
        }, {
          name: "yin-yang",
          hex: "F0680",
          version: "1.7.12"
        }, {
          name: "yoga",
          hex: "F117C",
          version: "4.4.95"
        }, {
          name: "youtube",
          hex: "F05C3",
          version: "1.5.54"
        }, {
          name: "youtube-gaming",
          hex: "F0848",
          version: "2.1.19"
        }, {
          name: "youtube-studio",
          hex: "F0847",
          version: "2.1.19"
        }, {
          name: "youtube-subscription",
          hex: "F0D40",
          version: "3.3.92"
        }, {
          name: "youtube-tv",
          hex: "F0448",
          version: "1.5.54"
        }, {
          name: "yurt",
          hex: "F1516",
          version: "5.4.55"
        }, {
          name: "z-wave",
          hex: "F0AEA",
          version: "2.7.94"
        }, {
          name: "zend",
          hex: "F0AEB",
          version: "2.7.94"
        }, {
          name: "zigbee",
          hex: "F0D41",
          version: "3.3.92"
        }, {
          name: "zip-box",
          hex: "F05C4",
          version: "1.5.54"
        }, {
          name: "zip-box-outline",
          hex: "F0FFA",
          version: "4.0.96"
        }, {
          name: "zip-disk",
          hex: "F0A23",
          version: "2.5.94"
        }, {
          name: "zodiac-aquarius",
          hex: "F0A7D",
          version: "2.6.95"
        }, {
          name: "zodiac-aries",
          hex: "F0A7E",
          version: "2.6.95"
        }, {
          name: "zodiac-cancer",
          hex: "F0A7F",
          version: "2.6.95"
        }, {
          name: "zodiac-capricorn",
          hex: "F0A80",
          version: "2.6.95"
        }, {
          name: "zodiac-gemini",
          hex: "F0A81",
          version: "2.6.95"
        }, {
          name: "zodiac-leo",
          hex: "F0A82",
          version: "2.6.95"
        }, {
          name: "zodiac-libra",
          hex: "F0A83",
          version: "2.6.95"
        }, {
          name: "zodiac-pisces",
          hex: "F0A84",
          version: "2.6.95"
        }, {
          name: "zodiac-sagittarius",
          hex: "F0A85",
          version: "2.6.95"
        }, {
          name: "zodiac-scorpio",
          hex: "F0A86",
          version: "2.6.95"
        }, {
          name: "zodiac-taurus",
          hex: "F0A87",
          version: "2.6.95"
        }, {
          name: "zodiac-virgo",
          hex: "F0A88",
          version: "2.6.95"
        }
      ]
      icons.push({ name: "blank", hex: "f68c" })
      icons.forEach(function (icon) {
        const item = getIconItem(icon, isNew(icon))
        document.getElementById("icons").appendChild(item)
        if (isNew(icon)) {
          const newItem = getIconItem(icon, false, false)
          document.getElementById("newIcons").appendChild(newItem)
        }
      })
    })()
  })

   //meta title
   document.title = "Material Design | apcodes - Vite React Admin & Dashboard Template";

  return (
    <React.Fragment>
      {/* <div className="page-content">
      <Container fluid>
          <Breadcrumbs title="Icons" breadcrumbItem="MDI" />

          <Row className="icons-demo-content">
            <Col xs="12">
              <Card>
                <CardBody>
                  <h4 className="card-title">New Icons</h4>
                  <p className="card-title-desc mb-2">
                    Use{" "}
                    <code>&lt;i className="mdi mdi-speedometer-slow"&gt;&lt;/i&gt;</code>
                     {" "} <Badge color="success">v 5.8.55</Badge>.{" "}
                    <span className="badge badge-success">v 5.0.45</span>.
                  </p>

                  <Row className="icon-demo-content" id="newIcons"></Row>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">All Icons</h4>
                  <Row className="icon-demo-content" id="icons"></Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <h4 className="card-title">Size</h4>

                  <Row className="icon-demo-content">
                    <Col xl="3" lg="4" sm="6">
                      <i className="mdi mdi-18px mdi-account"></i> mdi-18px
                    </Col>

                    <Col xl="3" lg="4" sm="6">
                      <i className="mdi mdi-24px mdi-account"></i> mdi-24px
                    </Col>

                    <Col xl="3" lg="4" sm="6">
                      <i className="mdi mdi-36px mdi-account"></i> mdi-36px
                    </Col>

                    <Col xl="3" lg="4" sm="6">
                      <i className="mdi mdi-48px mdi-account"></i> mdi-48px
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <h4 className="card-title">Rotate</h4>

                  <Row className="icon-demo-content">
                    <Col xl="3" lg="4" sm="6">
                      <i className="mdi mdi-rotate-45 mdi-account"></i>{" "}
                      mdi-rotate-45
                    </Col>
                    <Col xl="3" lg="4" sm="6">
                      <i className="mdi mdi-rotate-90 mdi-account"></i>{" "}
                      mdi-rotate-90
                    </Col>
                    <Col xl="3" lg="4" sm="6">
                      <i className="mdi mdi-rotate-135 mdi-account"></i>{" "}
                      mdi-rotate-135
                    </Col>
                    <Col xl="3" lg="4" sm="6">
                      <i className="mdi mdi-rotate-180 mdi-account"></i>{" "}
                      mdi-rotate-180
                    </Col>
                    <Col xl="3" lg="4" sm="6">
                      <i className="mdi mdi-rotate-225 mdi-account"></i>{" "}
                      mdi-rotate-225
                    </Col>
                    <Col xl="3" lg="4" sm="6">
                      <i className="mdi mdi-rotate-270 mdi-account"></i>{" "}
                      mdi-rotate-270
                    </Col>
                    <Col xl="3" lg="4" sm="6">
                      <i className="mdi mdi-rotate-315 mdi-account"></i>{" "}
                      mdi-rotate-315
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <h4 className="card-title">Spin</h4>

                  <Row className="icon-demo-content">
                    <Col xl="3" lg="4" sm="6">
                      <i className="mdi mdi-spin mdi-loading"></i> mdi-spin
                    </Col>
                    <Col xl="3" lg="4" sm="6">
                      <i className="mdi mdi-spin mdi-star"></i> mdi-spin
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div> */}
    </React.Fragment>
  )
}

export default IconMaterialdesign
