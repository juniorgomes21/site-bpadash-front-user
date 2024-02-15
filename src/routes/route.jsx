import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { use } from "i18next";

function Authmiddleware({
    component: Component,
    layout: Layout,
    isAuthProtected,
    ...rest
}) {
    return (
        <Route
            {...rest}
            render={(props) => {
                if ( isAuthProtected && !localStorage.getItem("@TokenAuthentication")) {
                    return (
                        <Redirect
                            to={{
                                pathname: "/login",
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
    component: PropTypes.any,
    location: PropTypes.object,
    layout: PropTypes.any,
};

export default Authmiddleware;

