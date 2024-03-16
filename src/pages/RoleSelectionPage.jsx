import React, { useContext, useEffect, useState } from "react";
import { GameContext } from "../components/GameProvider.js";
import { useNavigate } from "react-router-dom";

const RoleSelectionPage = () => {
	const { goodRoles, evilRoles } = useContext(GameContext);
	const [selectedRoles, setSelectedRoles] = useState([]);
	const [numGood, setNumGood] = useState(0);
	const navigate = useNavigate();

	//1 for team is good, 0 is bad
	const RoleButtonClick = (val, team) => {
		const indOf = selectedRoles.indexOf(val);
		/*
		setNumGood(0);
		setSelectedRoles([]);
		return;
		*/
		if (indOf == -1) {
			setSelectedRoles([...selectedRoles, val]);
			if (team) {
				setNumGood(numGood + 1);
			}
		} else {
			setSelectedRoles([
				...selectedRoles.slice(0, indOf),
				...selectedRoles.slice(indOf + 1),
			]);

			if (team) {
				setNumGood(numGood - 1);
			}
		}
	};
	return (
		<div>
			<h4>Role Selection</h4>
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
			</div>
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
