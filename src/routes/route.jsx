import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

function Authmiddleware({ component: Component, layout: Layout, isAuthProtected, path, ...rest}) {

    const isValid = isAuthProtected && !localStorage.getItem("@TokenAuthentication");

    return (
        <Route
            {...rest}
            render={(props) => {
                if (isValid) {

                    return (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: props.location },
                            }}
                        />
                    );
                } 
                
                if(isAuthProtected && !localStorage.getItem("@Employee") && !path.includes("/login/employee")) {
                    return (
                        <Redirect
                            to={{
                                pathname: "/login/employee",
                                state: { from: props.location },
                            }}
                        />
                    );
                }

                if(!isAuthProtected && localStorage.getItem("@TokenAuthentication") && localStorage.getItem("@Employee")) {
                    return (
                        <Redirect
                            to={{
                                pathname: "/welcome/user/bpadash",
                                state: { from: props.location },
                            }}
                        />
                    );
                }

                return (
                    <Layout>
                        <Component {...props} />
                    </Layout>
                );
            }}
        />
    );
}

Authmiddleware.propTypes = {
    isAuthProtected: PropTypes.bool,
    path: PropTypes.string,
    component: PropTypes.any,
    location: PropTypes.object,
    layout: PropTypes.any,
};

export default Authmiddleware;

