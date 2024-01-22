import React, { useState } from "react";
import {
	BrowserRouter as Router,
	Navigate,
	Route,
	Routes,
} from "react-router-dom";
import HomePage from "../pages/HomePage";
import NotFound from "../pages/NotFound";
import TestState from "../pages/TestStatePage";
import PrivateRoute from "./PrivateRoute";
const Routing = (props) => {
	return (
		<Router>
			<Routes>
				<Route exact path="/" element={<HomePage />} />
				<Route exact path="/test" element={<TestState />} />
				<Route exact path="/testPrivate" element={<PrivateRoute redirectRoute="/"><TestState /></PrivateRoute>} />
				<Route exact path="*" element={<NotFound />} />
			</Routes>
		</Router>
	);
};

export default Routing;
