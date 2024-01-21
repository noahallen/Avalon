import React, { useContext, useState } from "react";
import { GameContext } from "../components/GameProvider.js";

const TestState = () => {
	/*
    The following code snippets is here because they are primarily an example of how to access 
    manipulate the game state in the game context provider. We won't use this page in the final product.
    */

	const {
		gameState,
		addPlayer,
		createPlayer,
		addPlayerRole,
		addPlayerIndex,
	} = useContext(GameContext);

	const [name, setName] = useState("");
	const [userName, setUserName] = useState("");
	const [role, setRole] = useState("");

	const handleSubmit = (event) => {
		event.preventDefault();
		const playerObj = createPlayer(userName, name, 1, role);
		addPlayer(playerObj);
		addPlayerRole(playerObj.userName, role);
		addPlayerIndex(playerObj.userName, 1);
		setName("");
		setUserName("");
		setRole("");
	};

	return (
		<div>
			<h3>Test State Page</h3>
			<p>
				Current number of players:{" "}
				{JSON.stringify(gameState.numPlayers)}
			</p>
			Current roster of players:{" "}
			<pre>
				{gameState.players != {}
					? JSON.stringify(gameState.players, null, 2)
					: ""}
			</pre>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Name"
					required
				/>
				<input
					type="text"
					value={userName}
					onChange={(e) => setUserName(e.target.value)}
					placeholder="Username"
					required
				/>
				<input
					type="text"
					value={role}
					onChange={(e) => setRole(e.target.value)}
					placeholder="Role"
					required
				/>
				<button type="submit">Add Player</button>
			</form>
		</div>
	);
};

export default TestState;
