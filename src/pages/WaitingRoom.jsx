import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { GameContext } from "../components/GameProvider.js";
import { Navigate } from "react-router-dom";
import QRCodeComponent from "../components/QRCode.js";
import gear from "../res/Gear.png";

const WaitingRoom = () => {
	const location = useLocation();
	const isAdmin = location ? location.state.isAdmin : undefined;

	const { playerState, gameID, name } = useContext(GameContext);
	console.log(gameID);
	if (isAdmin === null || isAdmin === undefined) {
		return <Navigate to={"/"} />;
	} else {
		return (
			<div>
				<h1> {name ? "Welcome " + name : ""}</h1>
				<h3>Game ID: {gameID}</h3>
				<QRCodeComponent code={gameID} />
				<h3>Members: </h3>
				<pre>
					{playerState
						? Object.keys(playerState).map(
								(key) => playerState[key].displayName + "\n",
							)
						: ""}
				</pre>
			</div>
		);
	}
};

export default WaitingRoom;
