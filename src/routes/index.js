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
import EnterName from "../pages/EnterName";
import WaitingRoom from "../pages/WaitingRoom";
import JoinIntermediate from "../pages/JoinIntermediate";
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
				<Route exact path="/enterName" element={<EnterName />} />
				<Route exact path="/waiting-room" element={<WaitingRoom />} />
				<Route
					exact
					path="/join-intermediate/:gameID"
					element={<JoinIntermediate />}
				/>
			</Routes>
		</Router>
	);
};

export default Routing;
