import React, { useState,useEffect  } from 'react';
import apiFunctions from '../firebase/api';


const TestFirebasePage = () => {
    const [players, setPlayers] = useState({});
    const [goodRoles, setGoodRoles] = useState({});
    const [badRoles, setBadRoles] = useState({});
    const testid1 = "Troll1";
    const test1 = "Merlin Plus";
    const testid2 = "Troll2";
    const test2 = "Merlin Plus Plus";
    const testid3 = "Troll3";
    const test3 = "Merlin Minus";
    const testid4 = "Troll4";
    const test4 = "Merlin Minus Minus";

    const createGame = () => {

    }

    const loadGame = () => {

    }

    const joinGame = () => {

    }

    return (
        <div>
            <h3>
                TestFirebase
                <button>create game</button>
                <button>load game</button>
                <button>join game</button>
            </h3>
                <button>create game</button>
                <button>load game</button>
                <button>join game</button>
            <h3>
                Game information: 
            </h3>

        </div>
    );
}

export default TestFirebasePage;