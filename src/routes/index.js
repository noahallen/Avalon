import React, { useState } from "react";
import {
	BrowserRouter as Router,
	Navigate,
	Route,
	Routes,
} from "react-router-dom";

// Page Imports
import HomePage from "../pages/HomePage";
import NotFound from "../pages/NotFound";
import FeatureSelectionPage from "../pages/FeatureSelectionPage";
import RoleSelectionPage from "../pages/RoleSelectionPage";
import RoomCreationPage from "../pages/RoomCreationPage";

import TestState from "../pages/TestStatePage";
const Routing = (props) => {
	return (
		<Router>
			<Routes>
				<Route exact path="/" element={<HomePage />} />
				<Route exact path="/test" element={<TestState />} />
				<Route exact path="*" element={<NotFound />} />

				<Route
					exact
					path="room-creation"
					element={<RoomCreationPage />}
				/>
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
			</Routes>
		</Router>
	);
};

export default Routing;
