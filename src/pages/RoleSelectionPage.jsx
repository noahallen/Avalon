import React, { useContext, useState } from "react";
import { GameContext } from "../components/GameProvider.js";
import { apiFunctions } from "../firebase/api.jsx";

const RoleSelectionPage = () => {
	const { goodRoles, evilRoles } = useContext(GameContext);
	const userName1 = "hi";
	// addPlayerRole(userName1, goodRoles.Merlin);

	const [currentRoles, setCurrentRoles] = useState([]);

	const handleOnClick = (key) => {
		console.log(`key ${key}`);
		if (key in currentRoles) {
			console.log(`This was already selected!`);
			if (key === `Servant` || key === `Minion`) {
			}
		} else {
			console.log(`${key} was added!`);
			// If the current role isn't in the selected roles at all
			setCurrentRoles((currentRolesSelected) => [
				...currentRolesSelected,
				key,
			]);
		}

		console.log(`currentIDs: ${currentRoles}`);
	};

	return (
		<div className="container-roles">
			<div className="good-roles-list">
				<h3>Good Roles</h3>
				{goodRoles
					? Object.keys(goodRoles).map((key) => (
							<div
								// Pass in the key of the clicked character
								onClick={() => handleOnClick(key)}
								key={goodRoles[key]}
								id={goodRoles[key]}
							>
								{goodRoles[key]}
							</div>
						))
					: ""}
			</div>

			<div className="evil-roles-list">
				<h3>Evil Roles</h3>
				{evilRoles
					? Object.keys(evilRoles).map((key) => (
							<div
								// Pass in the key of the clicked character
								onClick={() => handleOnClick(key)}
								key={evilRoles[key]}
								id={evilRoles[key]}
							>
								{evilRoles[key]}
							</div>
						))
					: ""}
			</div>

			<div className="current-roles-list">
				<h3>Currently Selected Roles</h3>
				{currentRoles
					? Object.keys(currentRoles).map((key) => (
							<div
								// Pass in the key of the clicked character
								onClick={() => handleOnClick(key)}
								key={currentRoles[key]}
								id={currentRoles[key]}
							>
								{currentRoles[key]}
							</div>
						))
					: ""}
			</div>
		</div>
	);
};

export default RoleSelectionPage;
