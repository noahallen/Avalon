import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";


const PrivateRoute = props => {
    //replace true with some authentication condition, where if true redirects to passed in route
    if (true) 
        return (<Navigate to={props.redirectRoute} />);
    return (props.children);

}

PrivateRoute.propTypes = {
    redirectRoute: PropTypes.string,
}


export default PrivateRoute;