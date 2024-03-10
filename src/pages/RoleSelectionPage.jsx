import React, { useContext, useState } from "react";
import { GameContext } from "../components/GameProvider.js";
import { apiFunctions } from "../firebase/api.jsx";
import { objectMethod } from "@babel/types";
import { object } from "prop-types";

const RoleSelectionPage = () => {
	const { goodRoles, evilRoles } = useContext(GameContext);
	const userName1 = "hi";
	// addPlayerRole(userName1, goodRoles.Merlin);

	const [currentRoles, setCurrentRoles] = useState([]);

	// console.log(Object.keys(goodRoles));

	const handleOnClick = (key) => {
		setCurrentRoles();
		console.log(`key ${key}`);
		console.log(`current roles ${currentRoles}`);
	};

	let goodRoleButtons = [];
	let evilRoleButtons = [];
	// create the buttons for each good role
	for (let role in goodRoles) {
		goodRoleButtons.push(
			<div onClick={() => handleOnClick(role)}>{goodRoles[role]}</div>,
		);
	}
	// create the buttons for each bad role
	for (let role in evilRoles) {
		evilRoleButtons.push(
			<div onClick={() => handleOnClick(role)}>{evilRoles[role]}</div>,
		);
	}

	return (
		<div className="container-roles">
			<div className="good-roles-list">
				<h3>Good Roles</h3>
				{goodRoleButtons}
			</div>

			<div className="evil-roles-list">
				<h3>Evil Roles</h3>
				{evilRoleButtons}
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
