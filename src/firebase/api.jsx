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
			[userName]: { index: "0", displayName: displayName, role: "" },
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
	await set(
		ref(database, "/games/" + gameID + "/playerCount"),
		playerCount + 1,
	);
	await set(ref(database, "/games/" + gameID + "/players/" + userName), {
		index: playerCount,
		displayName: displayName,
		role: "",
	});
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

// Role functions

//Add role

function addRole(gameID, newRoleTeam, oldRoles, newRole) {
	// evil
	if (newRoleTeam === false) {
		set(ref(database, "/games/" + gameID + "/badRoles/"), [
			...oldRoles,
			newRole,
		]);
	} else {
		//good
		set(ref(database, "/games/" + gameID + "/goodRoles/"), [
			...oldRoles,
			newRole,
		]);
	}
}

//Remove role
function removeRole(gameID, removeRoleTeam, oldRoles, removedRole) {
	for (let i = 0; i < oldRoles.length; i++) {
		if (oldRoles[i] === removedRole) {
			oldRoles.splice(i, 1);
			break;
		}
	}
	if (removeRoleTeam === false) {
		//bad
		set(ref(database, "/games/" + gameID + "/badRoles/"), oldRoles);
	} else {
		//good
		set(ref(database, "/games/" + gameID + "/goodRoles/"), oldRoles);
	}
}

const apiFunctions = {
	createGameLobby,
	loadGameLobby,
	joinGameLobby,
	addRole,
	removeRole,
	setFeatureSelection,
	loadFeatureSelection,
};

export default apiFunctions;
