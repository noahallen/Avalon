import React, { useState, useContext } from "react";
import { GameContext } from "../components/GameProvider.js";

const HomePage = () => {
	//Add the GameContext hooks and state you need to the below line
	const {} = useContext(GameContext);
	return (
		<div>
			<h3>HomePage</h3>
		</div>
	);
};

export default HomePage;
