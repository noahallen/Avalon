import React from "react";

export const GameContext = React.createContext();

export const GameContextProvider = ({ children }) => {
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
	const goodRoles = {
		Merlin: "Merlin",
		Percival: "Percival",
		Servant: "Loyal Servant of Arthur",
		Troublemaker: "Troublemaker",
		Cleric: "Cleric",
		UntrustworthyServant: "Untrustworthy Servant",
		GoodLancelot: "Good Lancelot",
		GoodSorcerer: "Good Sorcerer",
		GoodRogue: "Good Rogue",
		SeniorMessenger: "Senior Messenger",
		JuniorMessenger: "Junior Messenger",
	};

	const evilRoles = {
		Mordred: "Mordred",
		Morgana: "Morgana",
		Oberon: "Oberon",
		Assassin: "Assassin",
		Minion: "Minion of Mordred",
		Trickster: "Trickster",
		Lunatic: "Lunatic",
		Brute: "Brute",
		Revealer: "Revealer",
		EvilLancelot: "Evil Lancelot",
		EvilSorcerer: "Evil Sorcerer",
		EvilRogue: "Evil Rogue",
		EvilMessenger: "Evil Messenger",
	};
	const createPlayer = (userName, displayName) => {
		if (!userName) {
			console.error("Invalid userName");
			return;
		}
		if (!displayName) {
			console.error("Invalid displayName");
			return;
		}
		return {
			userName: userName,
			displayName: displayName,
			index: 0,
			role: "",
		};
	};

	const addPlayer = (player) => {
		if (player && player.userName && player.displayName) {
			setGameState((prevState) => ({
				numPlayers: prevState.numPlayers + 1,
				players: {
					...prevState.players,
					[player.userName]: player,
				},
			}));
		} else {
			console.error("Invalid player object or properties");
		}
	};

	const addPlayerRole = (userName, role) => {
		if (userName && role && (!!goodRoles[role] || !!evilRoles[role])) {
			setGameState((prevState) => ({
				numPlayers: prevState.numPlayers,
				players: {
					...prevState.players,
					[userName]: {
						...prevState.players[userName],
						role: role,
					},
				},
			}));
		} else {
			console.error("Invalid userName or role");
		}
	};

	const addPlayerIndex = (userName, index) => {
		if (userName && index && index >= 1) {
			setGameState((prevState) => ({
				numPlayers: prevState.numPlayers,
				players: {
					...prevState.players,
					[userName]: {
						...prevState.players[userName],
						index: index,
					},
				},
			}));
		} else {
			console.error("Invalid userName or index");
		}
	};

	return (
		<GameContext.Provider
			value={{
				gameState,
				addPlayer,
				createPlayer,
				addPlayerRole,
				addPlayerIndex,
				goodRoles,
				evilRoles,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};
