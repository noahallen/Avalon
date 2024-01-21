import React from "react";
import { initializeApp } from "firebase/app";
import { getDatabase , ref, onValue, get, child, set, update} from "firebase/database";
import { getAuth, signInWithRedirect } from "firebase/auth";
import Constants from "../res/constants.jsx"

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
  
  function createGameLobby(userId, userName, setPlayers, setGoodRoles, setBadRoles) {
    //create id until no existing game ahs it
    let gameId = makeid(6);
    let gameExist = {id:"000000"};
    while (gameExist) {
      const listener = onValue(ref(database, '/games/' + gameId), (snapshot) => {
        gameExist = snapshot.val();
      }, {
        onlyOnce: true
      });
      gameId = makeid(6);
      listener();
    }

    set(ref(database, '/games/' + gameId), {
      players: {
      '1': {userId: userId, displayName: userName, role:''},
      },
      goodRoles: ['Merlin'],
      badRoles: ['Assassin','Mordred'],
    });
    const playerListener = onValue(ref(database,'/games/' + gameId + `/players/`), (snapshot) => {
      setPlayers(snapshot.val());
    })

    const goodRolesListener = onValue(ref(database, '/games/' + gameId + 'goodRoles'), (snapshot) => {
      setGoodRoles(snapshot.val());
    })
    const badRolesListener = onValue(ref(database, '/games/' + gameId + 'goodRoles'), (snapshot) => {
      setBadRoles(snapshot.val());
    })
    return {pL: playerListener,gRL: goodRolesListener, bRL: badRolesListener};
  }

  function loadGameLobby(userName, displayName, gameId, setPlayers, setGoodRoles, setBadRoles) {
    
    const playerListener = onValue(ref(database,'/games/' + gameId + `/players/`), (snapshot) => {
      setPlayers(snapshot.val());
      const playerList = snapshot.val();
    });

    const goodRolesListener = onValue(ref(database, '/games/' + gameId + 'goodRoles'), (snapshot) => {
      setGoodRoles(snapshot.val());
    });

    const badRolesListener = onValue(ref(database, '/games/' + gameId + 'goodRoles'), (snapshot) => {
      setBadRoles(snapshot.val());
    });


    return {pL: playerListener,gRL: goodRolesListener, bRL: badRolesListener, joinStatus: 1};
  }


  //0 = lobby full, 1 = success, 2 = already in
  function joinGameLobby(userName, displayName, gameId, playerList) {
    if (playerList[userName]) {
      return 2;
    }
    const playerCount = Object.keys(playerList).length;
    if (playerCount >= 10) {
      return 0;
    }

    set(ref(database,'/games/' + gameId + '/players/' + userName), {userId: userName, displayName: displayName, role:''});
    return 1;
  }



  const apiFunctions = {
    createGameLobby,
    joinGameLobby,
    loadGameLobby,
  }

  export default apiFunctions;