import React, { useState, useContext } from "react";
import { GameContext } from "../components/GameProvider.js";
import JoinBox from "../components/box-join";

const HomePage = () => {
	//Add the GameContext hooks and state you need to the below line
	const {} = useContext(GameContext);
	return (
		<div>
			<h2>HomePage</h2>

			<JoinBox />
		</div>
	);
};

export default HomePage;
