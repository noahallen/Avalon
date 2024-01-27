import { render, screen } from "@testing-library/react";
import React from "react";
import App from "./App";
import { GameContextProvider } from "./components/GameProvider";

// Test suite for App component
// describe("App component", () => {
// 	// Test case: App renders without crashing
// 	test("renders without crashing", () => {
// 		// Render the App component
// 		const { container } = render(
// 			<React.StrictMode>
// 				<GameContextProvider>
// 					<App />
// 				</GameContextProvider>
// 			</React.StrictMode>,
// 		);

// 		expect(container).toBeTruthy();
// 	});
// });
