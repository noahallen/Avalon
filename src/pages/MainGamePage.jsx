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
		setRoundSuccVoteess,
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
	const [showMissionVotes, setShowMissionVotes] = useState(false);
	const [currentVote, setCurrentVote] = useState(0);
	const [currentMissionVote, setCurrentMissionVote] = useState(0);
	const [totalApproves, setTotalApproves] = useState(-1);
	const [totalMissionSuccess, setTotalMissionSuccess] = useState(-1);
	const [totalMissionFails, setTotalMissionFails] = useState(-1);
	const [totalMissionMagic, setTotalMissionMagic] = useState(-1);
	const [votesPassed, setVotesPass] = useState(false);
	const [missionPass, setMissionPass] = useState(false);
	//set the sorceror one later
	const [currentVotesAdmin, setCurrentVotesAdmin] = useState({});
	const [currentMissionVotesAdmin, setCurrentMissionVotesAdmin] = useState(
		{},
	);
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
		const numPlayersOnTeam = Object.values(playerState).filter(
			(player) => player.onTeam,
		).length;

		if (
			numPlayersOnTeam ===
			Object.keys(rounds[currentRound]["mission"]).length
		) {
			finalizeMissionVotes();
		}
	}, [currentVotesAdmin]);

	const missionCardType = {
		SUCCESS: 1,
		FAIL: 2,
		MAGIC: 3,
		MESSAGE: 4,
	};

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
		setShowMissionVotes(false); // Close "Mission Votes" popup
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

			setTotalMissionFails(-1);
			setTotalMissionSuccess(-1);
		}
		if (gameState === "GO") {
		}
		if (gameState === "MR") {
			handleMissionVotes();
		}
		if (gameState === "MREV") {
			//get total approves
			//derya
		}
	}, [gameState]);

	const handleMyRoleClick = () => {
		setShowRoleInfo(false); // Close popup
		setShowVotes(false); // Close "Votes" popup
		setShowMissionVotes(false); // Close "Mission Votes" popup
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
		setShowVotes(true); // Open "Votes" popup
		setShowMissionVotes(false); // Close "Mission Votes" popup
	};

	const handleClose = () => {
		setShowRoleInfo(false);
		setShowMyRole(false);
		setShowVotes(false);
		setShowMissionVotes(false); // Close "Mission Votes" popup
	};

	// open the mission votes pop-up
	const handleMissionVotes = () => {
		setShowRoleInfo(false); // Close popup
		setShowMyRole(false); // Close "My Role" popup if open
		setShowVotes(false); // Close "Votes" popup
		setShowMissionVotes(true); // Open "Mission Votes" popup
	};

	const handleMissionClose = () => {
		setShowRoleInfo(false);
		setShowMyRole(false);
		setShowVotes(false);
		setShowMissionVotes(false); // Close "Mission Votes" popup
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
			if (adminListener) {
				adminListener();
			}
			apiFunctions.attachAdminListener(
				gameID,
				currentRound,
				currentTrial,
				setAdminListener,
				setCurrentVotesAdmin,
			);
		}
	};

	//derya
	const MissionVoteClick = (userName, missionVote) => {
		//let index = playerState[userName].index; // don't need the index rn
		apiFunctions.playerMissionVote(
			gameID,
			userName,
			missionVote,
			currentRound,
		);

		setShowMissionVotes(false);

		// if (isAdmin) {
		// 	if (adminListener) {
		// 		adminListener();
		// 	}
		// 	apiFunctions.attachAdminListener(
		// 		gameID,
		// 		currentRound,
		// 		currentTrial,
		// 		setAdminListener,
		// 		setCurrentMissionVotesAdmin,
		// 	);
		// }
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
		setVotesPass(didPass);
		setTotalApproves(votes);
		apiFunctions.countVoteResults(
			gameID,
			didPass,
			currentRound,
			currentTrial,
		);
	};

	const finalizeMissionVotes = () => {
		//calculate vote results
		const numPlayersOnTeam = Object.values(playerState).filter(
			(player) => player.onTeam,
		).length;

		const simplifiedRound = rounds[currentRound]["mission"];
		if (Object.keys(simplifiedRound).length !== numPlayersOnTeam) {
			console.log("all need to vote still");
			return;
		}

		let success;
		let fail;
		let magic;
		let didPass;
		for (const key in simplifiedRound) {
			success += simplifiedRound[key] === missionCardType.SUCCESS;
			fail += simplifiedRound[key] === missionCardType.FAIL;
			magic += simplifiedRound[key] === missionCardType.MAGIC;
		}

		setTotalMissionFails(fail);
		setTotalMissionSuccess(success);
		setTotalMissionMagic(magic);

		//one before the last round
		if (
			currentRound === 5 &&
			Object.keys(playerState).length >= 7 &&
			fail === 2
		) {
			didPass = false;
		} else if (fail > 0) didPass = false;
		else didPass = true;
		setMissionPass(didPass);

		apiFunctions.countMissionResults(gameID, didPass);
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
		//if vote passes then go to mission vote
		if (votesPassed) {
			apiFunctions.setGameState(gameID, "MR");
		} else {
			apiFunctions.setGameState(gameID, "TS");
		}
	};

	const finishMissionVoteReview = () => {
		//if vote passes then go to mission vote
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
						<button onClick={finishVoteReview()}>
							Finish Review
						</button>
					)}
				</div>
			)}
			//derya
			{gameState === "MREV" && (
				<div className="popup">
					Success: {totalMissionSuccess} Fails:{totalMissionFails}
					Magic:{totalMissionMagic}
					{playerState[userName].isKing && (
						<button onClick={finishMissionVoteReview()}>
							Finish Mission Review
						</button>
					)}
				</div>
			)}
			{showMissionVotes &&
				gameState === "MR" &&
				playerState[userName].onTeam(
					//and isvoting people + check for player cards
					<div className="popup">
						<button
							onClick={() => {
								setCurrentMissionVote(missionCardType.SUCCESS); //success
							}}
						>
							Success
						</button>
						<button
							onClick={() => {
								setCurrentMissionVote(missionCardType.FAIL); //fail
							}}
						>
							Fail
						</button>
						<button
							onClick={() => {
								setCurrentMissionVote(missionCardType.MAGIC); //sorceror
							}}
						>
							Sorceror
						</button>
						<button
							onClick={() => {
								MissionVoteClick(userName, currentMissionVote);
							}}
						>
							Vote
						</button>
					</div>,
				)}
		</div>
	);
};

export default MainGamePage;
