import React, { useContext, useState } from "react";
import { GameContext } from "../components/GameProvider.js";
import apiFunctions from "../firebase/api";

const TestState = () => {
	/*
    The following code snippets is here because they are primarily an example of how to access 
    manipulate the game state in the game context provider. We won't use this page in the final product.
    */

	const {
		playerState,
		setPlayerState,
		selectedGoodRoles,
		selectedEvilRoles,
		setSelectedGoodRoles,
		setSelectedEvilRoles,
		gameID,
		setGameID,
		name,
		setName,
		userName,
		setUserName,
	} = useContext(GameContext);

	const [submitted, setSubmitted] = useState(false);
	const [created, setCreated] = useState(false);
	const [joined, setJoined] = useState(false);

	const handleCreateSubmit = async (event) => {
		event.preventDefault();
		const holder = apiFunctions.createGameLobby(
			userName,
			name,
			setPlayerState,
			setSelectedGoodRoles,
			setSelectedEvilRoles,
		);
		setGameID(holder.gameId);
		setCreated(true);
		setSubmitted(true);
	};

	const handleJoinSubmit = async (event) => {
		event.preventDefault();
		if (gameID === "") {
			return;
		}
		if ((await apiFunctions.joinGameLobby(userName, name, gameID)) === 1) {
			setJoined(true);
		}
	};

	const handleLoadSubmit = (event) => {
		event.preventDefault();
		try {
			const listeners = apiFunctions.loadGameLobby(
				gameID,
				setPlayerState,
				setSelectedGoodRoles,
				setSelectedEvilRoles,
			);
			if (
				listeners.bRL === null ||
				listeners.gRL === null ||
				listeners.pL === null
			) {
				throw new Error("Game does not exist");
			}

			setSubmitted(true);
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div>
			<h1>Test State Page</h1>
			<h3>To create a new game:</h3>
			<form onSubmit={handleCreateSubmit}>
				<button disabled={created} type="submit">
					Create Game
				</button>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Name"
					required
					disabled={created}
				/>
				<input
					type="text"
					value={userName}
					onChange={(e) => setUserName(e.target.value)}
					placeholder="Username"
					required
					disabled={created}
				/>
			</form>
			<h3>To load an existing game:</h3>
			<form onSubmit={handleLoadSubmit}>
				<button disabled={submitted || created} type="submit">
					Load Game
				</button>
				<input
					type="text"
					value={gameID}
					onChange={(e) => setGameID(e.target.value)}
					placeholder="GameID"
					required
					disabled={submitted || created}
				/>
			</form>
			<h3>To join an existing game:</h3>
			<form onSubmit={handleJoinSubmit}>
				<button disabled={joined} type="submit">
					Add Player
				</button>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Name"
					required
					disabled={joined}
				/>
				<input
					type="text"
					value={userName}
					onChange={(e) => setUserName(e.target.value)}
					placeholder="Username"
					required
					disabled={joined}
				/>
				<input
					type="text"
					value={gameID}
					onChange={(e) => setGameID(e.target.value)}
					placeholder="GameID"
					required
					disabled={submitted || created}
				/>
			</form>
			<br></br>
			Current roster of players:{" "}
			<pre>
				{playerState != {} ? JSON.stringify(playerState, null, 2) : ""}
			</pre>
			Current good roles:{" "}
			<pre>
				{selectedGoodRoles != {}
					? JSON.stringify(selectedGoodRoles, null, 2)
					: ""}
			</pre>
			Current evil roles:{" "}
			<pre>
				{selectedEvilRoles != {}
					? JSON.stringify(selectedEvilRoles, null, 2)
					: ""}
			</pre>
			<footer style={{ padding: "20px" }}></footer>
		</div>
	);
};

export default TestState;
