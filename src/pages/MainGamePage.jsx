import React, { useState, useContext, useEffect } from "react";
import { GameContext } from "../components/GameProvider.js";
import apiFunctions from "../firebase/api";
import "../style/popup.css";
import OvalSVG from "../components/table";

const MainGamePage = () => {
	const {
		playerState,
		setPlayerState,
		gameState,
		isAdmin,
		userName,
		gameID,
		rounds,
		listeners,
		setRound,
		setListeners,
		roundSuccess,
		setRoundSuccess,
		helperText,
		setCurrentRound,
		setCurrentTrial,
		currentRound,
		currentTrial,
		isDebugFlag,
	} = useContext(GameContext);
	const [showRoleInfo, setShowRoleInfo] = useState(false);
	const [currentPage, setCurrentPage] = useState(1); // New state to track current page
	const [showMyRole, setShowMyRole] = useState(false);
	const [showVotes, setShowVotes] = useState(false);
	const [currentVote, setCurrentVote] = useState(0);
	const [totalApproves, setTotalApproves] = useState(-1);
	const [currentVotesAdmin, setCurrentVotesAdmin] = useState({});
	const [adminListener, setAdminListener] = useState();

	useEffect(() => {
		apiFunctions.setRoundsListen(
			gameID,
			setRound,
			listeners,
			setCurrentRound,
			setCurrentTrial,
			setListeners,
		);
	}, []);

	useEffect(() => {
		if (
			Object.keys(currentVotesAdmin).length ===
			Object.keys(playerState).length
		) {
			finalizeVotes();
		}
	}, [currentVotesAdmin]);

	function importAllImages(r) {
		let images = {};
		r.keys().forEach((item, index) => {
			images[item.replace("./", "")] = r(item);
		});
		return images;
	}
	const characterImages = importAllImages(
		require.context("../res", true, /\.(png|jpe?g|svg)$/),
	);

	const handleRoleInfoClick = () => {
		setShowMyRole(false); // Close "My Role" popup if open
		setShowVotes(false); // Close "Votes" popup
		setShowRoleInfo((prevState) => !prevState); // Close popup
		setCurrentPage(1); // Default to page 1
	};

	useEffect(() => {
		if (gameState === "TS") {
			setTotalApproves(-1);
		}
		if (gameState === "VOTE") {
			handleVotes();
		}
		if (gameState === "REV") {
			//calc the result
			if (totalApproves === -1) {
				let votes = 0;
				const simplifiedRound =
					rounds[currentRound]["trials"][currentTrial]["votes"];
				for (const key in simplifiedRound) {
					votes += simplifiedRound[key];
				}
				setTotalApproves(votes);
			}
		}
		if (gameState === "GO") {
		}
	}, [gameState]);

	const handleMyRoleClick = () => {
		setShowRoleInfo(false); // Close popup
		setShowVotes(false); // Close "Votes" popup
		setShowMyRole((prevState) => !prevState); // Close "My Role" popup if open
	};

	//debug functions
	const allFail = () => {
		apiFunctions.allVote(
			gameID,
			currentRound,
			currentTrial,
			playerState,
			0,
		);
	};
	const allPass = () => {
		apiFunctions.allVote(
			gameID,
			currentRound,
			currentTrial,
			playerState,
			1,
		);
	};

	// open the votes pop-up
	const handleVotes = () => {
		setShowRoleInfo(false); // Close popup
		setShowMyRole(false); // Close "My Role" popup if open
		setShowVotes(true); // Close "Votes" popup
	};

	const handleClose = () => {
		setShowRoleInfo(false);
		setShowMyRole(false);
		setShowVotes(false);
	};

	const nextPage = () => {
		setCurrentPage(2); // Go to page 2
	};

	const prevPage = () => {
		setCurrentPage(1); // Go back to page 1
	};

	const goodStyle = {
		fontFamily: "Helvetica",
		fontWeight: "bold",
		color: "#3599a1",
		fontSize: "0.9rem",
		textAlign: "left",
		letterSpacing: "-1px",
	};

	const infoStyle = {
		fontFamily: "Courier",
		fontSize: "0.9rem",
		letterSpacing: "-1.6px",
	};

	const badStyle = {
		fontFamily: "Helvetica",
		fontWeight: "bold",
		color: "#cf4f48",
		fontSize: "0.9rem",
		textAlign: "left",
		letterSpacing: "-1px",
	};

	const VoteClick = (userName, vote) => {
		//let index = playerState[userName].index; // don't need the index rn
		apiFunctions.playerVote(
			gameID,
			userName,
			vote,
			currentRound,
			currentTrial,
		);

		setShowVotes(false);

		if (isAdmin) {
			adminListener();
			apiFunctions.attachAdminListener(
				gameID,
				setAdminListener,
				setCurrentVotesAdmin,
			);
		}
	};

	const finalizeVotes = () => {
		//calculate vote results
		let votes = 0;
		const simplifiedRound =
			rounds[currentRound]["trials"][currentTrial]["votes"];
		if (
			Object.keys(simplifiedRound).length !==
			Object.keys(playerState).length
		) {
			console.log("all need to vote still");
			return;
		}

		for (const key in simplifiedRound) {
			votes += simplifiedRound[key];
		}
		const didPass = Object.keys(playerState).length / 2 < votes;
		setTotalApproves(votes);
		apiFunctions.countVoteResults(
			gameID,
			didPass,
			currentRound,
			currentTrial,
		);
	};

	const finishVoteReview = () => {
		//set new king
		const ind = playerState[userName].index + 1;
		let newKing;
		for (const key in playerState) {
			if (playerState[key].index === ind) {
				newKing = key;
				break;
			}
			if (playerState[key].index === 0) {
				newKing = key;
			}
		}
		if (!isDebugFlag) {
			apiFunctions.setKing(gameID, newKing, userName);
		}
		console.log("set to TS");
		apiFunctions.setGameState(gameID, "TS");
	};

	const confirmTeamSelection = () => {
		console.log("set to vote");
		apiFunctions.setGameState(gameID, "VOTE");
	};

	const confimPlayerOrder = () => {
		apiFunctions.setGameState(gameID, "KS");
	};

	return (
		<div>
			{gameState === "OS" && isAdmin && (
				<button onClick={confimPlayerOrder}>
					Confirm Player Order
				</button>
			)}
			{gameState === "KS" && isAdmin && <h1>Please select a king!</h1>}
			<OvalSVG />
			{gameState === "TS" && playerState[userName].isKing && (
				<button onClick={confirmTeamSelection}>
					Confirm Team Selection
				</button>
			)}
			<div className="tab-bar">
				<div className="tabs">
					<button
						className={showRoleInfo ? "tabsOpen" : ""}
						onClick={handleRoleInfoClick}
					>
						Roles Info
					</button>
					<button
						className={showMyRole ? "tabsOpen" : ""}
						onClick={handleMyRoleClick}
					>
						My Role
					</button>
				</div>
			</div>

			{showRoleInfo && (
				<div className="popup">
					{currentPage === 1 ? (
						<>
							<div
								style={{
									backgroundColor: "#3599a1",
									height: "25px",
								}}
							>
								<span
									style={{
										fontFamily: "Courier",
										fontSize: "22px",
										color: "#FFFFFF",
									}}
								>
									GOOD CHARACTERS
								</span>
							</div>
							<p>
								<span
									style={{
										fontFamily: "Courier",
										fontWeight: "bold",
										color: "#3599a1",
										alignContent: "center",
										fontSize: "1.1rem",
									}}
								>
									-------------BASE-------------
								</span>
								<br />

								<div className="popuptext">
									<span style={goodStyle}>
										Loyal Servant of Arthur&nbsp;
									</span>
									<span style={infoStyle}>
										- No special ability
									</span>

									<br />
									<span style={goodStyle}>Merlin&nbsp;</span>
									<span style={infoStyle}>
										- Knows Evil, must remain hidden
									</span>
									<br />
									<span
										style={{
											fontFamily: "Courier",
											fontWeight: "bold",
											color: "#3599a1",
											alignContent: "center",
											fontSize: "1.1rem",
										}}
									>
										-----------OPTIONAL-----------
									</span>
								</div>
								<div className="popuptext">
									<span style={goodStyle}>
										Percival&nbsp;
									</span>
									<span style={infoStyle}>
										- Knows Merlin
									</span>
									<br />
									<span style={goodStyle}>Cleric&nbsp;</span>
									<span style={infoStyle}>
										- Secretly investigates the first Leader
									</span>
									<br />
									<span style={goodStyle}>
										Troublemaker&nbsp;
									</span>
									<span style={infoStyle}>
										- Must Lie about loyalty
									</span>
									<br />
									<span style={goodStyle}>
										Good Lancelot&nbsp;
									</span>
									<span style={infoStyle}>
										- Knows Evil Lancelot, or can switch
										allegiance
									</span>
									<br />
									<span style={goodStyle}>
										Good Rogue&nbsp;
									</span>
									<span style={infoStyle}>
										- May play Rogue Success
									</span>
									<br />
									<span style={goodStyle}>
										Good Sorcerer&nbsp;
									</span>
									<span style={infoStyle}>
										- May play Magic
									</span>
									<br />
									<span style={goodStyle}>
										Junior Messenger&nbsp;
									</span>
									<span style={infoStyle}>
										- May play Good Message
									</span>

									<br />
									<span style={goodStyle}>
										Senior Messenger&nbsp;
									</span>
									<span style={infoStyle}>
										- Knows Junior Messenger, may play Good
										Message
									</span>
									<br />
									<span style={goodStyle}>
										Untrustworthy Servant
									</span>
									<span style={infoStyle}>
										- Appears Evil to Merlin, knows the
										Assassin, can become Evil during the
										Recruitment stage
									</span>
								</div>
							</p>
							<div className="popup-footer">
								<button
									onClick={nextPage}
									style={{ marginRight: "10px" }}
								>
									Next
								</button>
								<button onClick={handleClose}>Close</button>
							</div>{" "}
						</>
					) : (
						<>
							<div
								style={{
									backgroundColor: "#cf4f48",
									height: "25px",
								}}
							>
								<span
									style={{
										fontFamily: "Courier",
										fontSize: "22px",
										color: "#FFFFFF",
									}}
								>
									EVIL CHARACTERS
								</span>
							</div>

							<p>
								<span
									style={{
										fontFamily: "Courier",
										fontWeight: "bold",
										color: "#cf4f48",
										alignContent: "center",
										fontSize: "1.1rem",
									}}
								>
									-------------BASE-------------
								</span>
								<br />

								<div className="popuptext">
									<span style={badStyle}>
										Minion of Mordred&nbsp;
									</span>
									<span style={infoStyle}>
										- No special ability
									</span>

									<br />
									<span style={badStyle}>Assassin&nbsp;</span>
									<span style={infoStyle}>
										- May activate Assassination stage if
										three Quests succeed
									</span>
									<br />
									<span
										style={{
											fontFamily: "Courier",
											fontWeight: "bold",
											color: "#cf4f48",
											alignContent: "center",
											fontSize: "1.1rem",
										}}
									>
										-----------OPTIONAL-----------
									</span>
								</div>
								<div className="popuptext">
									<span style={badStyle}>Mordred&nbsp;</span>
									<span style={infoStyle}>
										- Unknown to Merlin
									</span>
									<br />
									<span style={badStyle}>Oberon&nbsp;</span>
									<span style={infoStyle}>
										- Unknown to Evil, does not know Evil
									</span>
									<br />
									<span style={badStyle}>Morgana&nbsp;</span>
									<span style={infoStyle}>
										- Appears as Merlin
									</span>
									<br />
									<span style={badStyle}>Lunatic&nbsp;</span>
									<span style={infoStyle}>
										- Must Fail every Quest
									</span>
									<br />
									<span style={badStyle}>Brute&nbsp;</span>
									<span style={infoStyle}>
										- May Fail only the first three Quests
									</span>
									<br />
									<span style={badStyle}>Revealer&nbsp;</span>
									<span style={infoStyle}>
										- Reveals loyalty after second failed
										Quest
									</span>
									<br />
									<span style={badStyle}>
										Trickster&nbsp;
									</span>
									<span style={infoStyle}>
										- May lie about loyalty
									</span>

									<br />
									<span style={badStyle}>
										Evil Lancelot&nbsp;
									</span>
									<span style={infoStyle}>
										- Knows Good Lancelot, or can switch
										allegiance
									</span>
									<br />
									<span style={badStyle}>
										Evil Rogue&nbsp;
									</span>
									<span style={infoStyle}>
										- May play Rogue Fail, unknown to Evil,
										does not know Evil
									</span>
									<br />
									<span style={badStyle}>
										Evil Sorcerer&nbsp;
									</span>
									<span style={infoStyle}>
										- May play Magic, may not play Fail
									</span>
									<br />
									<span style={badStyle}>
										Evil Messenger&nbsp;
									</span>
									<span style={infoStyle}>
										- May play Evil message
									</span>
									<br />
								</div>
							</p>

							<button
								onClick={prevPage}
								style={{ marginRight: "10px" }}
							>
								Previous
							</button>
							<button onClick={handleClose}>Close</button>
						</>
					)}
				</div>
			)}

			{showMyRole && (
				<div className="popup my-role-tab">
					{/* Popup content for My Role */}
					<h1>{playerState[userName]["role"]}</h1>
					<img
						src={
							characterImages[
								`${playerState[userName]["role"]}.jpg`
							]
						}
						alt={playerState[userName]["role"]}
					></img>
					<p>{playerState[userName]["helperText"]}</p>

					<button onClick={handleClose}>Close</button>
				</div>
			)}
			{showVotes && gameState === "VOTE" && (
				<div className="popup votes">
					<div>
						<h4>
							VOTE: {currentVote === 1 ? "Approve" : "Reject"}
						</h4>
						<h4>{userName}</h4>
						<div id={"VoteSelection"}>
							<button
								onClick={() => {
									setCurrentVote(1);
								}}
							>
								Approve
							</button>
							<button
								onClick={() => {
									setCurrentVote(0);
								}}
							>
								Reject
							</button>
							{isDebugFlag && (
								<div>
									<button onClick={allPass}>All Pass</button>
									<button onClick={allFail}>All Fail</button>
								</div>
							)}

							<button
								onClick={() => {
									VoteClick(userName, currentVote);
								}}
							>
								Vote
							</button>
						</div>
					</div>
				</div>
			)}
			{gameState === "REV" && (
				<div className="popup">
					{" "}
					Approves: {totalApproves} Rejects:{" "}
					{playerState
						? Object.keys(playerState).length - totalApproves
						: 0}{" "}
					{playerState[userName].isKing && (
						<button onClick={finishVoteReview}>
							Finish Review
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default MainGamePage;
