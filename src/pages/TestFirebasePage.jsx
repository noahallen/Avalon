import React, { useState,useEffect  } from 'react';
import apiFunctions from '../firebase/api';


const TestFirebasePage = () => {
    const [players, setPlayers] = useState({});
    const [goodRoles, setGoodRoles] = useState([]);
    const [badRoles, setBadRoles] = useState([]);
    const [gameId, setGameId] = useState("");
    const testid1 = "Troll1";
    const test1 = "Merlin Plus";
    const testid2 = "Troll2";
    const test2 = "Merlin Plus Plus";
    const testid3 = "Troll3";
    const test3 = "Merlin Minus";
    const testid4 = "Troll4";
    const test4 = "Merlin Minus Minus";

    const createGame = () => {
        const holder = apiFunctions.createGameLobby(testid1,test1,setPlayers,setGoodRoles,setBadRoles);
        setGameId(holder.gameId);
    }

    const loadGame = () => {

    }

    const joinGame = async () => {
        await apiFunctions.joinGameLobby(testid2,test2,gameId);
    }

    return (
        <div>
            <h3>
                TestFirebase
            </h3>
                <button onClick={createGame}>create game</button>
                <button>load game</button>
                <button onClick={joinGame}>join game</button>
            <h3>
                Game information: {players? Object.keys(players):null} - {goodRoles} - {badRoles} - {gameId}
            </h3>

        </div>
    );
}

export default TestFirebasePage;
