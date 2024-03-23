import React from "react";
import { initializeApp } from "firebase/app";
import {
	getDatabase,
	ref,
	onValue,
	get,
	child,
	set,
	update,
	off,
} from "firebase/database";
import { getAuth, signInWithRedirect } from "firebase/auth";

const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
	measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
	databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);
const auth = getAuth();

//helper functions
function makeid(length) {
	let result = "";
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength),
		);
		counter += 1;
	}
	return result;
}

function shuffle(array) {
	let currentIndex = array.length,
		randomIndex;
	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}
	return array;
}

//Game creation functions

function createGameLobby(
	userName,
	displayName,
	setPlayers,
	setGoodRoles,
	setBadRoles,
) {
	//create id until no existing game has it
	let gameID = makeid(6);

	set(ref(database, "/games/" + gameID), {
		players: {
			[userName]: {
				index: "0",
				displayName: displayName,
				role: "",
			},
		},
		goodRoles: ["Merlin"],
		badRoles: ["Assassin", "Mordred"],
		featureSettings: {
			useLady: false,
			useKingChoose: false,
			useKingTracking: false,
			useNarration: false,
			useRoleDist: false,
			useQuestCards: false,
		},
		playerCount: 1,
		gameState: "Waiting",
		selectedRoles: [],
		currentRound: 1,
		currentTrial: 1,
		currentRound: 1,
		currentTrial: 1,
	});
	const listeners = loadGameLobby(
		gameID,
		setPlayers,
		setGoodRoles,
		setBadRoles,
	);

	const response = {};
	response.listeners = listeners;
	response.gameID = gameID;
	return response;
}

//uses load players finished to tell when player array is ready
//set good bad and players are functions to be passed in
function loadGameLobby(gameId, setPlayers, setGoodRoles, setBadRoles) {
	let basePath = "/games/" + gameId;

	const playerListener = onValue(
		ref(database, basePath + "/players/"),
		(snapshot) => {
			setPlayers(snapshot.val());
		},
	);

	const goodRolesListener = onValue(
		ref(database, basePath + "/goodRoles/"),
		(snapshot) => {
			setGoodRoles(snapshot.val());
		},
	);

	const badRolesListener = onValue(
		ref(database, basePath + "/badRoles/"),
		(snapshot) => {
			setBadRoles(snapshot.val());
		},
	);

	return {
		pL: playerListener,
		gRL: goodRolesListener,
		bRL: badRolesListener,
	};
}

//0 = lobby full, 1 = success, 2 = already in, 3 = game doesn't exist
async function joinGameLobby(userName, displayName, gameID) {
	const dbref = ref(database);
	let playerCount;
	let alreadyIn = 0;
	let path = "/games/" + gameID + "/players/";

	await get(child(dbref, path)).then((snapshot) => {
		const playerObjects = snapshot.val();
		playerCount = Object.keys(playerObjects).length;
		if (userName in playerObjects) {
			alreadyIn = 1;
		}
	});

	if (alreadyIn) {
		return 2;
	}

	if (playerCount < 1) {
		return 3;
	}
	if (playerCount > 10) {
		return 0;
	}

	await set(ref(database, "/games/" + gameID + "/players/" + userName), {
		index: playerCount,
		displayName: displayName,
		role: "",
	});

	await set(
		ref(database, "/games/" + gameID + "/playerCount"),
		playerCount + 1,
	);
	return 1;
}

// feature selection set
function loadFeatureSelection(
	gameID,
	setFeatureSelectionSettings,
	setListeners,
	listeners,
	featureFunctions,
) {
	const featureSelectionListener = onValue(
		ref(database, "/games/" + gameID + "/featureSettings"),
		(snapshot) => {
			setFeatureSelectionSettings(snapshot.val());
			for (const key in snapshot.val()) {
				featureFunctions[key](snapshot.val()[key]);
			}
		},
	);

	setListeners({
		...listeners,
		featureSelectionListener: featureSelectionListener,
	});
}
function setFeatureSelection(gameID, value) {
	set(ref(database, "/games/" + gameID + "/featureSettings"), value);
}

function setGameStateListen(gameID, setGameState, listeners, setListeners) {
	const stateListener = onValue(
		ref(database, "/games/" + gameID + "/gameState"),
		(snapshot) => {
			setGameState(snapshot.val());
		},
	);
	setListeners({ ...listeners, stateListener: stateListener });
}

function setRoundsListen(
	gameID,
	setRoundState,
	listeners,
	setCurrentRound,
	setCurrentTrial,
	setListeners,
) {
	const stateListener = onValue(
		ref(database, "/games/" + gameID + "/rounds"),
		(snapshot) => {
			setRoundState(snapshot.val());
		},
	);

	const roundListener = onValue(
		ref(database, "/games/" + gameID + "/currentRound"),
		(snapshot) => {
			setCurrentRound(snapshot.val());
		},
	);
	const triaListener = onValue(
		ref(database, "/games/" + gameID + "/currentTrial"),
		(snapshot) => {
			setCurrentTrial(snapshot.val());
		},
	);

	setListeners({ ...listeners, roundsListener: stateListener });
}

// Role functions
function goToRoleSelection(gameID) {
	setGameState(gameID, "RoleSelect");
}
function setRoleListener(gameID, setSelectedRoles) {
	const listener = onValue(
		ref(database, "/games/" + gameID + "/selectedRoles"),
		(snapshot) => {
			console.log(snapshot.val());
			setSelectedRoles(snapshot.val());
		},
	);
	return listener;
}
function changeRoles(gameID, selectedRoles) {
	set(ref(database, "/games/" + gameID + "/selectedRoles/"), selectedRoles);
}
//Add role

//general purpose set game state for use in main game page and progressing game along
function setGameState(gameID, state, playerState) {
	set(ref(database, "/games/" + gameID + "/gameState"), state);

	//if changing to TS reset all on team statuses
	if (state === "TS") {
		for (const key in playerState) {
			set(
				ref(
					database,
					"/games/" + gameID + "/players/" + key + "/onTeam",
				),
				false,
			);
		}
	}
}

function beginGame(gameID, playerUsers, selectedRoles) {
	//randomly assign roles
	let playerInd;
	let roleInd;
	let playerName;
	let roleName;
	while (selectedRoles.length > 0) {
		playerInd = Math.floor(Math.random() * playerUsers.length);
		roleInd = Math.floor(Math.random() * selectedRoles.length);
		playerName = playerUsers.splice(playerInd, 1);
		roleName = selectedRoles.splice(roleInd, 1);

		set(
			ref(
				database,
				"/games/" + gameID + "/players/" + playerName + "/role",
			),
			roleName[0],
		);
	}
	setGameState(gameID, "OS");
}

function setPlayerField(gameID, userName, field, value) {
	set(
		ref(
			database,
			"/games/" + gameID + "/players/" + userName + "/" + field,
		),
		value,
	);
}

async function assignRoles(roles, gameId) {
	const dbref = ref(database);

	const shuffledRoles = shuffle(roles);
	let path = "/games/" + gameId + "/players/";
	let playerObjects;
	await get(child(dbref, path)).then((snapshot) => {
		playerObjects = snapshot.val();
	});

	const players = Object.values(playerObjects);

	for (let player of players) {
		player.role = shuffledRoles.pop();
	}

	await set(ref(database, "/games/" + gameId + "/players/"), players);
	return 1;
}

async function playerVote(
	gameId,
	playerUserName,
	vote,
	currentRound,
	currentTrial,
) {
	//const dbref = ref(database);
	//let roundPath = "/games/" + gameId + "/rounds/";
	/*
	let {
		currentRoundIndex,
		currentRound,
		roundObjects,
		currentTrialIndex,
		numRounds,
		currentTrial,
	} = await get(child(dbref, roundPath)).then((snapshot) => {
		roundObjects = snapshot.val();
		if (!!roundObjects) {
			numRounds = roundObjects.trackRoundCount;
			currentRoundIndex = Object.keys(roundObjects).length - 1;
			currentRound = roundObjects[currentRoundIndex];
			currentTrialIndex = Object.keys(currentRound).length - 1;
			currentTrial = currentRound[currentTrialIndex];
			return {
				currentRoundIndex,
				currentRound,
				roundObjects,
				currentTrialIndex,
				numRounds,
				currentTrial,
			};
		}
		return {};
	});
	*/
	//const playerVote = { [playerUserName]: vote };

	await set(
		ref(
			database,
			"/games/" +
				gameId +
				"/rounds/" +
				currentRound +
				"/trials/" +
				currentTrial +
				"/votes/" +
				playerUserName,
		),
		vote,
	);
}

function setKing(gameID, newKing, oldKing) {
	set(
		ref(database, "/games/" + gameID + "/players/" + oldKing + "/isKing"),
		false,
	);
	set(
		ref(database, "/games/" + gameID + "/players/" + newKing + "/isKing"),
		true,
	);
}

async function countVoteResults(gameID, didPass, currentRound, currentTrial) {
	/*
	const dbref = ref(database);
	let roundPath = "/games/" + gameID + "/rounds/";
	let playerPath = "/games/" + gameID + "/players/";
	let playerCount = 0;

	await get(child(dbref, playerPath)).then((snapshot) => {
		const playerObjects = snapshot.val();
		playerCount = Object.keys(playerObjects).length;
	});

	let {
		currentRoundIndex,
		currentRound,
		roundObjects,
		currentTrialIndex,
		numRounds,
		currentTrial,
	} = await get(child(dbref, roundPath)).then((snapshot) => {
		roundObjects = snapshot.val();
		if (!!roundObjects) {
			numRounds = roundObjects.trackRoundCount;
			currentRoundIndex = Object.keys(roundObjects).length - 1;
			currentRound = roundObjects[currentRoundIndex];
			currentTrialIndex = Object.keys(currentRound).length - 1;
			currentTrial = currentRound[currentTrialIndex];
			return {
				currentRoundIndex,
				currentRound,
				roundObjects,
				currentTrialIndex,
				numRounds,
				currentTrial,
			};
		}
		return {};
	});
	if (Object.keys(currentTrial).length !== playerCount) {
		return;
	}
	let approveCount = 0;
	let rejectCount = 0;
	//Loop over the players in the trial and count the approves and rejects
	Object.keys(currentTrial).map((key) => {
		if (currentTrial[key] === 1) {
			approveCount++;
		} else {
			rejectCount++;
		}
	});
	const pass = approveCount > rejectCount;
	if (pass) {
		if (currentRoundIndex < 5) {
			currentRoundIndex++;
			currentTrialIndex = 0;
			await set(
				ref(
					database,
					"/games/" +
						gameID +
						"/rounds/" +
						currentRoundIndex +
						"/trials/" +
						currentTrialIndex,
				),
				{},
			);
		}
	} else {
		currentTrialIndex++;
		await set(
			ref(
				database,
				"/games/" +
					gameID +
					"/rounds/" +
					currentRoundIndex +
					"/trials/" +
					currentTrialIndex,
			),
			{},
		);
	}
	*/
	if (didPass) {
		set(
			ref(database, "/games/" + gameID + "/currentRound"),
			currentRound + 1,
		);
		set(ref(database, "/games/" + gameID + "/currentTrial"), 1);
	} else {
		set(
			ref(database, "/games/" + gameID + "/currentTrial"),
			currentTrial + 1,
		);
	}
	if (currentTrial + 1 === 5) {
		setGameState(gameID, "GO");
	} else {
		setGameState(gameID, "REV");
	}
	return;
}

//debug functions start
function addMembers(gameID, existing, number) {
	const baseName = "test user ";

	for (let i = 0; i < number; i++) {
		set(
			ref(
				database,
				"/games/" + gameID + "/players/" + baseName + i.toString(),
			),
			{
				displayName: baseName + i.toString(),
				role: "",
				index: i + existing,
				isKing: false,
			},
		);
	}
	set(
		ref(database, "/games/" + gameID + "/playerCount"),
		existing + Number(number),
	);
}
function allVote(gameID, currentRound, currentTrial, playerState, result) {
	const path =
		"/games/" +
		gameID +
		"/rounds/" +
		currentRound +
		"/trials/" +
		currentTrial +
		"/votes/";
	for (let key in playerState) {
		set(ref(database, path + key), result);
	}
}
//debug functions end

const apiFunctions = {
	setRoleListener,
	createGameLobby,
	loadGameLobby,
	joinGameLobby,
	goToRoleSelection,
	changeRoles,
	setFeatureSelection,
	loadFeatureSelection,
	assignRoles,
	beginGame,
	setGameStateListen,
	setGameState,
	playerVote,
	countVoteResults,
	setRoundsListen,
	setKing,
	setPlayerField,
	//debug functions below
	addMembers,
	allVote,
};

// Call assignRoles like this:
//const { gameID, selectedGoodRoles, selectedEvilRoles } = useContext(GameContext);
// const assignRoleOnClick = () => {
//     const combinedSelectedRoles =
//         selectedGoodRoles.concat(selectedEvilRoles);

//     apiFunctions.assignRoles(combinedSelectedRoles, gameID);
// };

//await set(ref(database, "/games/" + gameId + "/rounds/"), rounds);

// await set(
// 	ref(
// 		database,
// 		"/games/" +
// 			gameId +
// 			"/rounds/" +
// 			rounds +
// 			"/" +
// 			currentRound.length,
// 	),
// 	{
// 		//success: vote, // change the success
// 	},

// await set(
// 	ref(database, "/games/" + gameId + "/rounds/" + "/trackRoundCount"),
// 	numRounds,
// );

// await set(
// 	ref(
// 		database,
// 		"/games/" + gameId + "/rounds/" + numRounds + "/trackTrialCount",
// 	),
// 	trialCount,
// );
// await set(
// 	ref(
// 		database,
// 		"/games/" +
// 			gameId +
// 			"/rounds/" +
// 			numRounds +
// 			"/" +
// 			trialCount +
// 			"/player/" +
// 			playerUserName,
// 	),
// 	{
// 		vote: vote,
// 	},
// );
// playercount < votecount just continue
// player = currentRound[trialCount].player;
// Object.keys(player).map((key) => {
// 	approveCount = approveCount + player[key]["vote"];
// });
// if (playerCount <= totVotes) {
// 	rejectCount = totVotes - approveCount;
// 	// this is the last count
// 	// sincrement the

// 	// if success then move to the next round
// 	//count votes to see if it passes or not
// 	if (approveCount > rejectCount) {
// 		//if passes go to next round
// 		await set(
// 			ref(
// 				database,
// 				"/games/" + gameId + "/rounds/" + "/trackRoundCount",
// 			),
// 			numRounds + 1,
// 		);
// 		//set trial count to 0
// 		await set(
// 			ref(
// 				database,
// 				"/games/" +
// 					gameId +
// 					"/rounds/" +
// 					numRounds +
// 					"/trackTrialCount",
// 			),
// 			0,
// 		);
// 		//set round to sucess
// 		await set(
// 			ref(database, "/games/" + gameId + "/rounds/" + "/success"),
// 			1,
// 		);
// 	} else {
// 		//move to the next trial
// 		await set(
// 			ref(
// 				database,
// 				"/games/" +
// 					gameId +
// 					"/rounds/" +
// 					numRounds +
// 					"/trackTrialCount",
// 			),
// 			trialCount + 1,
// 		);
// 		await set(
// 			ref(database, "/games/" + gameId + "/rounds/" + "/success"),
// 			0,
// 		);
// 	}
// }
//else change the round to next round and display the results

//check if everyone voted
//if success then update then start the next round
// await set(
// 	ref(database, "/games/" + gameId + "/round-" + round + "/"),
// 	round,
// );

//start round
//this starts before each round
// start the round
// set the next king index
// set king username for tracking
// s
// async function startRound(roles, gameId) {
// 	const dbref = ref(database);
// 	let round;
// 	let playerPath = "/games/" + gameId + "/players/";
// 	let roundPath = "/games/" + gameId + "/round/";
// 	let playerObjects;
// 	let players;
// 	let kingIndex;
// 	let kingUsername;
// 	let playerCount;

// 	await get(child(dbref, roundPath)).then((snapshot) => {
// 		const roundObjects = snapshot.val();
// 		round = Object.keys(roundObjects).length + 1;
// 		kingIndex = roundObjects.kingIndex + 1;
// 	});

// 	await get(child(dbref, playerPath)).then((snapshot) => {
// 		const playerObjects = snapshot.val();
// 		const players = Object.values(playerObjects);
// 		playerCount = Object.keys(playerObjects).length;
// 	});

// 	round++;
// 	await set(ref(database, "/games/" + gameId + "/round/"), round);

// 	//check if everyone voted
// 	//if success then update then start the next round
// 	await set(
// 		ref(database, "/games/" + gameId + "/round-" + round + "/"),
// 		round,
// 	);
// }

// //game
// // -round + number
// // -- number
// // --- king: username
// // ---king index
// // --- success:true or false

// async function nextRound(roles, gameId) {
// 	//should update king
// 	//update round count
// 	//reset voteCount
// 	//set previous round
// 	let success;
// 	let reject;
// 	const dbref = ref(database);
// 	let round;
// 	let playerPath = "/games/" + gameId + "/players/";
// 	let roundPath = "/games/" + gameId + "/round/";
// }

export default apiFunctions;
