import React, { useContext } from "react";
import { GameContext } from "../components/GameProvider.js";

const RoleSelectionPage = () => {
	const { goodRoles } = useContext(GameContext);
	// addPlayerRole(userName1, goodRoles.Merlin);

	return (
		<div>
			<h2 className="page-header">{goodRoles.Merlin}</h2>
		</div>
	);
};

export default RoleSelectionPage;
