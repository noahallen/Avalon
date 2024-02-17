import React from "react";

import "./App.css";
import AvalonHeader from "./components/AvalonHeader";
import Routing from "./routes/index";

function App() {
	return (
		<div className="App">
			<AvalonHeader />
			<Routing />
		</div>
	);
}

export default App;
