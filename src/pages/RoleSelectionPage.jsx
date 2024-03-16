import React, { useContext, useEffect, useState } from "react";
import { GameContext } from "../components/GameProvider.js";
import { useNavigate } from "react-router-dom";
import apiFunctions from "../firebase/api.jsx";

const RoleSelectionPage = () => {
	const { goodRoles, evilRoles, isAdmin, playerState, gameID } =
		useContext(GameContext);
	const [selectedRoles, setSelectedRoles] = useState([]);
	const [numBad, setNumBad] = useState(0);
	const navigate = useNavigate();

	useEffect(() => {
		if (!isAdmin) {
			apiFunctions.setRoleListener(gameID, setSelectedRoles);
		}
	}, []);

	const confirmRoles = () => {
		let allowedBad;
		const numPlayers = Object.keys(playerState).length;
		if (selectedRoles.length != numPlayers) {
			return;
		}
		if (numPlayers < 7) {
			allowedBad = 2;
		} else if (numPlayers < 10) {
			allowedBad = 3;
		} else {
			allowedBad = 4;
		}
		if (numBad != allowedBad) {
			return;
		}
		apiFunctions.beginGame();
	};

	//0 for team is good, 1 is bad
	const RoleButtonClick = (val, team) => {
		const indOf = selectedRoles.indexOf(val);

		if (indOf == -1) {
			setSelectedRoles([...selectedRoles, val]);
			if (team) {
				setNumBad(numBad + 1);
			}
		} else {
			setSelectedRoles([
				...selectedRoles.slice(0, indOf),
				...selectedRoles.slice(indOf + 1),
			]);

			if (team) {
				setNumBad(numBad - 1);
			}
		}
		apiFunctions.changeRoles(gameID, selectedRoles);
	};
	return (
		<div>
			<h4>Role Selection</h4>
			{isAdmin && (
				<div id={"RoleSelections"}>
					{Object.values(goodRoles).map((val) => (
						<button
							id={val}
							onClick={() => {
								RoleButtonClick(val, 1);
							}}
						>
							{val}
						</button>
					))}
					{Object.values(evilRoles).map((val) => (
						<button
							id={val}
							onClick={() => {
								RoleButtonClick(val, 0);
							}}
						>
							{val}
						</button>
					))}
					<button onClick={confirmRoles}>Confirm</button>
				</div>
			)}
			<h6>Roles Selected: {numGood}</h6>
			<div id={"SelectedRoles"}>
				{selectedRoles.map((val) => (
					<div>{val}</div>
				))}
			</div>
		</div>
	);
};

export default RoleSelectionPage;
