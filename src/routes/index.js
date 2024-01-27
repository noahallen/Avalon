import React, { useState } from "react";
import {
	BrowserRouter as Router,
	Navigate,
	Route,
	Routes,
} from "react-router-dom";

// Page Imports
import NotFound from "../pages/NotFound";
import FeatureSelectionPage from "../pages/FeatureSelectionPage";
import RoleSelectionPage from "../pages/RoleSelectionPage";
import RoomCreationPage from "../pages/RoomCreationPage";

import TestState from "../pages/TestStatePage";
import PrivateRoute from "./PrivateRoute";
import TestFirebasePage from "../pages/TestFirebasePage";
const Routing = (props) => {
	return (
		<Router>
			<Routes>
				<Route exact path="/" element={<RoomCreationPage />} />
				<Route exact path="/test" element={<TestState />} />
				{/*surround element with private route, and specify redirect route*/}
				<Route
					exact
					path="/testPrivate"
					element={
						<PrivateRoute redirectRoute="/">
							<TestState />
						</PrivateRoute>
					}
				/>
				<Route
					exact
					path="/privGame/:id"
					element={
						<PrivateRoute redirectRoute="/">
							<TestState />
						</PrivateRoute>
					}
				/>
				<Route exact path="*" element={<NotFound />} />

				<Route
					exact
					path="feature-selection"
					element={<FeatureSelectionPage />}
				/>
				<Route
					exact
					path="role-selection"
					element={<RoleSelectionPage />}
				/>
				<Route
					exact
					path="/testfirebase"
					element={<TestFirebasePage />}
				/>
			</Routes>
		</Router>
	);
};

export default Routing;
