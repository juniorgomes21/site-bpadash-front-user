import PropTypes from 'prop-types'
import React from "react"
import { Switch, BrowserRouter as Router } from "react-router-dom"
import { connect } from "react-redux"
import { authProtectedRoutes, publicRoutes } from "./routes"
import Authmiddleware from "./routes/route"
import VerticalLayout from "./components/VerticalLayout/"
import NonAuthLayout from "./components/NonAuthLayout"
import "./assets/scss/theme.scss"


function App() {


  return (
    <>
      <Router>
        <Switch>
          {publicRoutes.map((route, idx) => (
            <Authmiddleware
              exact
              key={idx}
              path={route.path}
              isAuthProtected={false}
              layout={NonAuthLayout}
              component={route.component}
            />
          ))}

          {authProtectedRoutes.map((route, idx) => (
            <Authmiddleware
              exact
              key={idx}
              path={route.path}
              isAuthProtected={true}
              layout={route.path.includes("/login/employee") ? NonAuthLayout : VerticalLayout}
              component={route.component}
            />
          ))}
        </Switch>
      </Router>
    </>
  )
}

App.propTypes = {
  layout: PropTypes.any
}

const mapStateToProps = state => {
  return {
    layout: state.Layout,
  }
}

export default connect(mapStateToProps, null)(App)
