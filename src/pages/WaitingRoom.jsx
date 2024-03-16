import React, { useState, useContext, useEffect } from "react";
import { GameContext } from "../components/GameProvider.js";
import { Navigate, useNavigate } from "react-router-dom";
import QRCodeComponent from "../components/QRCode.js";
import gear from "../res/Gear.png";
import FeatureSelectionPage from "./FeatureSelectionPage.jsx";
import scroll from "../res/Scroll.png";
import apiFunctions from "../firebase/api.jsx";

const WaitingRoom = () => {
	const [popupState, setPopupState] = useState(false);
	const {
		playerState,
		gameID,
		name,
		isAdmin,
		gameState,
		setGameState,
		listeners,
		setListeners,
	} = useContext(GameContext);
	/*
	// * debug stuff start
	const [numNew, setNumNew] = useState(0);
	const createMembers = () => {
		if (numNew > 0) {
			apiFunctions.addMembers(gameID, numNew);
		}
	};

	// * debug stuff stop
	*/

	const navigate = useNavigate();

	const gearOnClick = () => {
		setPopupState(true);
	};

	const moveOn = () => {
		if (Object.keys(playerState).length < 6) {
			return;
		}
		apiFunctions.goToRoleSelection(gameID);
		navigate("/role-selection");
	};

	useEffect(() => {
		if (gameState === undefined) {
			apiFunctions.setGameStateListen(
				gameID,
				setGameState,
				listeners,
				setListeners,
			);
		}
		if (gameState !== "Waiting" && gameState !== undefined) {
			navigate("/role-selection");
		}
	}, [gameState]);

	if (isAdmin === null || isAdmin === undefined) {
		return <Navigate to={"/"} />;
	} else {
		return (
			<div>
				{/*
					//debug stuff
					true && (
						<div>
							{" "}
							<input
								onChange={(val) => {
									setNumNew(val.nativeEvent.data);
								}}
								type="number"
								min="1"
								max="9"
							/>
							<button onClick={createMembers}>Add Members</button>
						</div>
					)
					*/}

				{!popupState && (
					<div className="welcome-message">
						<h1 className="welcome-title">
							{" "}
							{name ? "Welcome " + name : ""}
						</h1>
						<h3 className="game-id">Room Code: {gameID}</h3>
						<div style={{ textAlign: "center", marginTop: "1em" }}>
							<QRCodeComponent code={gameID} />
						</div>
						<div className="members-list">
							<img
								src={scroll}
								alt="scroll"
								className="scrollList"
							/>
							{playerState
								? Object.keys(playerState).map((key) => (
										<div
											id={toString(key)}
											className="member-name"
										>
											{playerState[key].displayName}
										</div>
									))
								: ""}
						</div>
						<div>
							{isAdmin && (
								<>
									<a onClick={gearOnClick}>
										<img
											src={gear}
											alt="settings"
											className="small-gear-image"
										/>
									</a>
									<button onClick={moveOn}>Advance</button>
								</>
							)}
						</div>
					</div>
				)}
				{popupState && isAdmin && (
					<FeatureSelectionPage
						isAdmin={isAdmin}
						setPopupState={setPopupState}
					/>
				)}
			</div>
		);
	}
};

export default WaitingRoom;
