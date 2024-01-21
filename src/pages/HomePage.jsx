import React, { useState, useContext, useSyncExternalStore } from 'react';
import apiFunctions from '../../firebase/api';

import { GameContext } from "../components/GameProvider.js";
import JoinBox from "../components/box-join";

const HomePage = () => {
    const [players, setPlayers] = useState({});
    const [goodRoles,setGoodRoles] = useState([]);
    const [badRoles, setBadRoles] = useState([]);



    return (
        <div>
            <h3>
                HomePage
            </h3>
        </div>
    );
}

export default HomePage;
