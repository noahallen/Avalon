import React, { useState, createContext } from "react";

export const GameContext = createContext();

export const GameContextProvider = ({ children }) => {
	const [playerState, setPlayerState] = useState({});
	const [gameID, setGameID] = useState("");
	const [name, setName] = useState("");
	const [userName, setUserName] = useState("");
	const [selectedGoodRoles, setSelectedGoodRoles] = useState([]);
	const [selectedEvilRoles, setSelectedEvilRoles] = useState([]);
	const [listeners, setListeners] = useState({});
	const [featureSelectionSettings, setFeatureSelectionSettings] = useState(
		{},
	);
	const [isAdmin, setIsAdmin] = useState();

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

	const gamePhases = {
		WaitingRoom: "WR",
		RoleEdit: "RE",
		TeamSelection: "TS",
		TeamSelectionVote: "VOTE",
		TeamSelectionReveal: "REV",
		MissionRun: "MR",
		MissionReveal: "MREV",
		Lady: "LAD",
	};

	return (
		<GameContext.Provider
			value={{
				playerState,
				setPlayerState,
				goodRoles,
				evilRoles,
				gamePhases,
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
				listeners,
				setListeners,
				featureSelectionSettings,
				setFeatureSelectionSettings,
				isAdmin,
				setIsAdmin,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};
