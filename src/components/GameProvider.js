import React, { useState, createContext } from "react";

export const GameContext = createContext();

export const GameContextProvider = ({ children }) => {
	const [playerState, setPlayerState] = useState({});
	const [gameID, setGameID] = useState("");
	const [name, setName] = useState("");
	const [userName, setUserName] = useState("");
	const [selectedGoodRoles, setSelectedGoodRoles] = useState([]);
	const [selectedEvilRoles, setSelectedEvilRoles] = useState([]);
	/* Key for states
	 * 0: member selection for quest
	 * 1: voting for approving team or not
	 * 2: quest action
	 * 3: quest result
	 * 4: lady phase
	 * 5: narration / role info reveal
	 */
	const [gamePhase, setGamePhase] = useState(0);
	const [questNumber, setQuestNumber] = useState(0);
	const [successfulQuests, setSuccessfulQuests] = useState(0);
	const [missionInfo, setMissionInfo] = useState({});

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

	return (
		<GameContext.Provider
			value={{
				playerState,
				setPlayerState,
				goodRoles,
				evilRoles,
				selectedGoodRoles,
				setSelectedGoodRoles,
				selectedEvilRoles,
				setSelectedEvilRoles,
				gameID,
				setGameID,
				name,
				setName,
				userName,
				setUserName,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};
