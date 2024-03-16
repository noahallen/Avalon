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
	setListeners({ ...listeners, stateListener });
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

function setGameState(gameID, state) {
	set(ref(database, "/games/" + gameID + "/gameState"), state);
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

//debug functions start
function addMembers(gameID, number) {
	const baseName = "test user ";

	for (let i = 0; i < number; i++) {
		set(
			ref(
				database,
				"/games/" + gameID + "/players/" + baseName + i.toString(),
			),
			{ displayName: baseName + i.toString(), role: "", index: i + 1 },
		);
	}
	set(ref(database, "/games/" + gameID + "/playerCount"), 1 + Number(number));
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
	voteCount,
	beginGame,
	setGameStateListen,
	setGameState,
	//debug functions below
	addMembers,
};

// Call assignRoles like this:
//const { gameID, selectedGoodRoles, selectedEvilRoles } = useContext(GameContext);
// const assignRoleOnClick = () => {
//     const combinedSelectedRoles =
//         selectedGoodRoles.concat(selectedEvilRoles);

//     apiFunctions.assignRoles(combinedSelectedRoles, gameID);
// };

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
// round: {
//     trial: {
//         [1]:{
//             kingIndex: -1,
//             kingUsername,
//             success,
//         },
//     },
// },
// gets called whenever someone clicks to vote
// it updates the vote count in round
// advances to the next round if everyone voted
// displays the results
async function voteCount(gameId, playerUserName, vote, playerState) {
	const dbref = ref(database);
	let rounds;
	let round;
	let roundCount;
	let currentRound;
	let playerPath = "/games/" + gameId + "/players/";
	let roundPath = "/games/" + gameId + "/rounds/";
	let roundObjects;
	let playerObjects;
	let players;
	let playerCount;
	let trial;
	let totVotes;
	// await get(child(dbref, playerPath)).then((snapshot) => {
	// 	playerObjects = snapshot.val();
	// });

	//const players = Object.values(playerObjects);

	await get(child(dbref, playerPath)).then((snapshot) => {
		const playerObjects = snapshot.val();
		const players = Object.values(playerObjects);
		playerCount = Object.keys(playerObjects).length;
	});

	await get(child(dbref, roundPath)).then((snapshot) => {
		roundObjects = snapshot.val();
		if (!!roundObjects) {
			round = Object.values(roundObjects);
			roundCount = Object.values(roundObjects).length;
			round.sort();
			currentRound = round[roundCount - 1];
			trial = currentRound[currentRound.length - 1];
			//totVotes = trial.totalVotes + 1;
		}
	});
	rounds = 0;
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
	await set(
		ref(
			database,
			"/games/" +
				gameId +
				"/rounds/" +
				rounds +
				"/" +
				currentRound.length +
				"/player/" +
				playerUserName,
		),
		{
			vote: vote,
		},
	);
	//check if everyone voted
	//if success then update then start the next round
	// await set(
	// 	ref(database, "/games/" + gameId + "/round-" + round + "/"),
	// 	round,
	// );
}

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
