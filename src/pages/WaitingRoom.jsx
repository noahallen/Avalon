import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { GameContext } from "../components/GameProvider.js";
import { Navigate } from "react-router-dom";
import QRCodeComponent from "../components/QRCode.js";
import gear from "../res/Gear.png";

const WaitingRoom = () => {
	const location = useLocation();
	const isAdmin = location ? location.state.isAdmin : undefined;

	const gearOnClick = () => {
		console.log("gear clicked");
	};

	const { playerState, gameID, name } = useContext(GameContext);
	if (isAdmin === null || isAdmin === undefined) {
		return <Navigate to={"/"} />;
	} else {
		return (
			<div>
				<h1> {name ? "Welcome " + name : ""}</h1>
				<h3>Game ID: {gameID}</h3>
				<QRCodeComponent code={gameID} />
				<h3>Members: </h3>
				<div className="members-list">
					{console.log(playerState)}
					{playerState
						? Object.keys(playerState).map((key) => (
								<div id={toString(key)}>
									{playerState[key].displayName}
								</div>
							))
						: ""}
				</div>
				<div>
					{isAdmin ? (
						<a onClick={gearOnClick}>
							<img
								src={gear}
								alt="settings"
								className="small-gear-image"
							/>
						</a>
					) : null}
				</div>
			</div>
		);
	}
};

export default WaitingRoom;
