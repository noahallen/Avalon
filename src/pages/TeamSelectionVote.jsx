import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { GameContext } from "../components/GameProvider.js";
import { Navigate } from "react-router-dom";
import QRCodeComponent from "../components/QRCode.js";
import gear from "../res/Gear.png";
import FeatureSelectionPage from "./FeatureSelectionPage.jsx";
import scroll from "../res/Scroll.png";

const TeamSelectionVote = () => {
	const [popupState, setPopupState] = useState(false);
	const location = useLocation();
	//const isAdmin = location ? location.state.isAdmin : undefined;
	const { playerState, gameID, name } = useContext(GameContext);
	return <h1>Hello</h1>;
	// const [popupState, setPopupState] = useState(false);
	// const location = useLocation();
	// const isAdmin = location ? location.state.isAdmin : undefined;
	// const { playerState, gameID, name } = useContext(GameContext);

	// const gearOnClick = () => {
	// 	setPopupState(true);
	// };
	// return (
	// 	<div>
	// 		{!popupState && (
	// 			<div className="welcome-message">
	// 				<h1 className="welcome-title">
	// 					{" "}
	// 					{name ? "Welcome " + name : ""}
	// 				</h1>
	// 				<h3 className="game-id">Room Code: {gameID}</h3>
	// 				<div style={{ textAlign: "center", marginTop: "1em" }}>
	// 					<QRCodeComponent code={gameID} />
	// 				</div>
	// 				<div className="members-list">
	// 					<img src={scroll} alt="scroll" className="scrollList" />
	// 					{playerState
	// 						? Object.keys(playerState).map((key) => (
	// 								<div
	// 									id={toString(key)}
	// 									className="member-name"
	// 								>
	// 									{playerState[key].displayName}
	// 								</div>
	// 							))
	// 						: ""}
	// 				</div>
	// 				<div>
	// 					{isAdmin && (
	// 						<>
	// 							<a onClick={gearOnClick}>
	// 								<img
	// 									src={gear}
	// 									alt="settings"
	// 									className="small-gear-image"
	// 								/>
	// 							</a>
	// 						</>
	// 					)}
	// 				</div>
	// 			</div>
	// 		)}
	// 		{popupState && isAdmin && (
	// 			<FeatureSelectionPage
	// 				isAdmin={isAdmin}
	// 				setPopupState={setPopupState}
	// 			/>
	// 		)}
	// 	</div>
	// );
};

export default TeamSelectionVote;
