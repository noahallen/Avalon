import React, { useContext, useState } from "react";
import { GameContext } from "../components/GameProvider.js";

const RoleSelectionPage = () => {

    const {
		gameState,
		addPlayerRole,
        goodRoles,
        evilRoles,
	} = useContext(GameContext);
    const userName1 = "hi";
    addPlayerRole(userName1, goodRoles.Merlin);

    return (
        <div>
            <h2 className='page-header'>
                {goodRoles.Merlin}
            </h2>
        </div>
    );
}

export default RoleSelectionPage;