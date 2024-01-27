import React from "react";
import { initializeApp } from "firebase/app";
import { getDatabase , ref, onValue, get, child, set, update, off} from "firebase/database";
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
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

  //Game creation functions
  
  function createGameLobby(userName, displayName, setPlayers, setGoodRoles, setBadRoles) {
    //create id until no existing game ahs it
    let gameId = makeid(6);


    set(ref(database, '/games/' + gameId), {
      playerCount: 1,
      players: {
      [userName]: {index: '0', displayName: displayName, role:''},
      },
      goodRoles: ['Merlin'],
      badRoles: ['Assassin','Mordred'],
    });
    const playerListener = onValue(ref(database,'/games/' + gameId + `/players/`), (snapshot) => {
      setPlayers(snapshot.val());
    })

    const goodRolesListener = onValue(ref(database, '/games/' + gameId + '/goodRoles/'), (snapshot) => {
      setGoodRoles(snapshot.val());
    })
    const badRolesListener = onValue(ref(database, '/games/' + gameId + '/badRoles/'), (snapshot) => {
      setBadRoles(snapshot.val());
    })
    return {gameId: gameId, pL: playerListener,gRL: goodRolesListener, bRL: badRolesListener};
  }

  //uses load players finished to tell when player array is ready
  //set good bad and players are functions to be passed in
  function loadGameLobby(gameId, setPlayers, setGoodRoles, setBadRoles) {
    const playerListener = onValue(ref(database,'/games/' + gameId + `/players/`), (snapshot) => {
      setPlayers(snapshot.val());
    });

    const goodRolesListener = onValue(ref(database, '/games/' + gameId + '/goodRoles/'), (snapshot) => {
      setGoodRoles(snapshot.val());
    });

    const badRolesListener = onValue(ref(database, '/games/' + gameId + '/goodRoles/'), (snapshot) => {
      setBadRoles(snapshot.val());
    });

    return {pL: playerListener,gRL: goodRolesListener, bRL: badRolesListener};
  }


  //0 = lobby full, 1 = success, 2 = already in, 3 = game doesn't exist
  async function joinGameLobby(userName, displayName, gameId) {
    const dbref = ref(database);
    let playerCount;
    let alreadyIn = 0;
    await get(child(dbref,'/games/' + gameId + '/players/' + userName )).then((snapshot) => {
      if (snapshot.exists()) {
        alreadyIn = 1;
      }
    })
    await get(child(dbref,'/games/' + gameId + '/playerCount')).then((snapshot) => {
      if (snapshot.exists()) {
        playerCount = snapshot.val();
      }
    })
    if (alreadyIn) {
      return 2;
    }
  
    if (playerCount < 1) {
      return 3
    }
    if (playerCount > 10) {
      return 0;
    }
    set(ref(database,'/games/' + gameId + '/playerCount'), playerCount + 1);
    set(ref(database,'/games/' + gameId + '/players/' + userName), {index: playerCount, displayName: displayName, role:''});
    return 1;
  }

  const apiFunctions = {
    createGameLobby,
    loadGameLobby,
    joinGameLobby,
  }

  export default apiFunctions;