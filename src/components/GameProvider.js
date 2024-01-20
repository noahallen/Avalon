import React from "react";

export const GameContext = React.createContext();

export const GameProvider = ({ children }) => {
	const [gameState, setGameState] = React.useState({
		// numPlayers: represents the number of players in a game.
		numPlayers: 0,

		// The players object should contain the following properties for each player:
		// 1. displayName: The player's display name.
		// 2. userName: The player's user name.
		// 3. index: The player's index relative to the admin (with admin being 0).
		// 4. role: The player's role in the game.
		players: {},
	});

	return (
		<GameContext.Provider value={{ gameState, setGameState }}>
			{children}
		</GameContext.Provider>
	);
};
