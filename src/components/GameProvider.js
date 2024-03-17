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
	const [roundSuccess, setRoundSuccess] = useState([]);
	const [isAdmin, setIsAdmin] = useState();
	const [rounds, setRound] = useState({});
	const [gameState, setGameState] = useState();

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
		WaitingRoom: "Waiting",
		RoleEdit: "RoleSelect",
		TeamSelection: "TS",
		OrderSelection: "OS",
		KingSelection: "KS",
		TeamSelectionVote: "VOTE",
		TeamSelectionReveal: "REV",
		MissionRun: "MR",
		MissionReveal: "MREV",
		Lady: "LAD",
	};

	const helperText = {
		Merlin: "Knows Evil, must remain hidden",
		Percival: "Knows Merlin",
		"Loyal Servant of Arthur": "No special ability",
		Troublemaker: "",
		Cleric: "Secretly investigates the first Leader",
		"Untrustworthy Servant":
			"Appears Evil to Merlin, knows the Assassin can become Evil during the Recruitment stage",
		"Good Lancelot": "Knows Evil Lancelot, or can switch allegiance",
		"Good Sorcerer": "May play Magic",
		"Good Rogue": "May play Rouge Success",
		"Senior Messenger": "Knows Junior Messenger, may play Good Message",
		"Junior Messenger": "May play Good Message",
		Mordred: "Unknown to Merlin",
		Morgana: "Appears as Merlin",
		Oberon: "Unkownto Evil, does not know Evil",
		Assassin: "May activate Assassination stage if three Quests succeed",
		"Minion of Mordred": "No special ability",
		Trickster: "May lie about loyalty",
		Lunatic: "Must Fail every Quest",
		Brute: "May Fail only the first three Quests",
		Revealer: "Reveals loyalty after second failed quest",
		"Evil Lancelot": "Knows Good Lancelot, or can switch allegiance",
		"Evil Sorcerer": "May play Magic, may not play Fail",
		"Evil Rogue":
			"May play Rogue Fail, unknown to Evil, does not know Evil",
		"Evil Messenger": "May play Evil Message",
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
				roundSuccess,
				setRoundSuccess,
				setName,
				userName,
				setUserName,
				listeners,
				setListeners,
				featureSelectionSettings,
				setFeatureSelectionSettings,
				isAdmin,
				setIsAdmin,
				rounds,
				setRound,
				gameState,
				setGameState,
				helperText,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};
