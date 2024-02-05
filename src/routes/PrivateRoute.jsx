import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

//Pass in to the element param with the intended element as the child. Example :
// private version: <Route exact path="/testPrivate" element={<PrivateRoute redirectRoute="/"><TestState /></PrivateRoute>} />
// public version: <Route exact path="/testPrivate" element={<PrivateRoute redirectRoute="/"><TestState /></PrivateRoute>} />
const PrivateRoute = (props) => {
	//replace true with some authentication condition, where if true redirects to passed in route
	if (true) {
		return <Navigate to={props.redirectRoute} state={{ testState: 12 }} />;
	}
	return props.children;
};

PrivateRoute.propTypes = {
	redirectRoute: PropTypes.string,
};

export default PrivateRoute;
