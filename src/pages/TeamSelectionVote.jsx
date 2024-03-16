import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { GameContext } from "../components/GameProvider.js";
import { Navigate, useNavigate } from "react-router-dom";
import QRCodeComponent from "../components/QRCode.js";
import gear from "../res/Gear.png";
import FeatureSelectionPage from "./FeatureSelectionPage.jsx";
import scroll from "../res/Scroll.png";

const TeamSelectionVote = () => {
	const [popupState, setPopupState] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	//const isAdmin = location ? location.state.isAdmin : undefined;
	const { playerState, gameID, name } = useContext(GameContext);

	const VoteClick = (val, team) => {
		//const indOf = selectedRoles.indexOf(val);
		/*
		setNumGood(0);
		setSelectedRoles([]);
		return;
		*/
		// if (indOf == -1) {
		// 	setSelectedRoles([...selectedRoles, val]);
		// 	if (team) {
		// 		setNumGood(numGood + 1);
		// 	}
		// } else {
		// 	setSelectedRoles([
		// 		...selectedRoles.slice(0, indOf),
		// 		...selectedRoles.slice(indOf + 1),
		// 	]);
		// 	if (team) {
		// 		setNumGood(numGood - 1);
		// 	}
		// }
	};

	const moveOn = () => {
		navigate("/game");
	};

	return (
		<div>
			<h4>VOTE</h4>
			<div id={"RoleSelections"}>
				<button
					onClick={() => {
						VoteClick(1, 1);
					}}
				>
					"Approve"
				</button>
				<button
					onClick={() => {
						VoteClick(1, 0);
					}}
				>
					"Reject"
				</button>
			</div>
		</div>
	);
};
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

export default TeamSelectionVote;
