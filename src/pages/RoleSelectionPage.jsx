import React, { useContext, useEffect, useState } from "react";
import { GameContext } from "../components/GameProvider.js";
import { useNavigate } from "react-router-dom";
import apiFunctions from "../firebase/api.jsx";
import "../index.css";

const RoleSelectionPage = () => {
	const {
		goodRoles,
		evilRoles,
		isAdmin,
		playerState,
		gameID,
		gameState,
		helperText,
	} = useContext(GameContext);
	const [selectedRoles, setSelectedRoles] = useState([]);
	const [numBad, setNumBad] = useState(0);
	const [requiredBad, setRequiredBad] = useState(0);
	const navigate = useNavigate();

	function importAll(r) {
		let images = {};
		r.keys().forEach((item, index) => {
			images[item.replace("./", "")] = r(item);
		});
		return images;
	}
	const characterImages = importAll(
		require.context("../res", true, /\.(png|jpe?g|svg)$/),
	);

	useEffect(() => {
		if (!isAdmin) {
			apiFunctions.setRoleListener(gameID, setSelectedRoles);
		} else {
			const numPlayers = Object.keys(playerState).length;
			if (numPlayers < 7) {
				setRequiredBad(2);
			} else if (numPlayers >= 7 && numPlayers < 10) {
				setRequiredBad(3);
			} else {
				setRequiredBad(4);
			}
		}
	}, []);

	useEffect(() => {
		if (gameState && gameState !== "RoleSelect") {
			navigate("/game");
		}
	}, [gameState]);

	const confirmRoles = () => {
		const numPlayers = Object.keys(playerState).length;
		if (selectedRoles.length != numPlayers) {
			return;
		}

		if (numBad !== requiredBad) {
			return;
		}
		apiFunctions.beginGame(gameID, Object.keys(playerState), selectedRoles);
	};

	//0 for team is good, 1 is bad
	const RoleButtonClick = (val, team) => {
		const indOf = selectedRoles.indexOf(val);

		if (indOf === -1) {
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
	};

	useEffect(() => {
		if (isAdmin) {
			apiFunctions.changeRoles(gameID, selectedRoles);
		}
	}, [selectedRoles]);

	return (
		<div>
			<h4
				style={{
					fontSize: "30px",
					fontWeight: "bold",
					color: "#FFFFFF",
					fontFamily: "Courier",
					backgroundColor: "#742A01",
				}}
			>
				Role Selection
			</h4>

			{isAdmin &&
				selectedRoles.length === Object.keys(playerState).length &&
				numBad === requiredBad && (
					<div
						style={{
							marginBottom: "10px",
							marginTop: "-30px",
						}}
					>
						<button
							onClick={confirmRoles}
							style={{ borderRadius: "10px" }}
						>
							Confirm
						</button>
					</div>
				)}
			{isAdmin && (
				<div id="RoleSelections">
					{Object.values(goodRoles).map((val) => (
						<span>
							<img
								className={`icon-selected ${selectedRoles.includes(val) ? "highlighted" : ""}`}
								src={characterImages[`${val}.jpg`]}
								key={val}
								id={val}
								alt={val}
								title={helperText[val]}
								onClick={() => {
									RoleButtonClick(val, 0);
								}}
							></img>
							<p className="goodrole-name">{val}</p>
						</span>
					))}

					<div className="role-separator"></div>

					{Object.values(evilRoles).map((val) => (
						<span>
							<img
								className={`icon-selected ${selectedRoles.includes(val) ? "highlighted" : ""}`}
								src={characterImages[`${val}.jpg`]}
								key={val}
								id={val}
								alt={val}
								title={helperText[val]}
								onClick={() => {
									RoleButtonClick(val, 1);
								}}
							></img>
							<p className="evilrole-name">{val}</p>
						</span>
					))}
				</div>
			)}

			<div id="SelectedRoles">
				<div className="selectedRolesColumn">
					{/* Good Roles */}
					{selectedRoles
						.filter((role) =>
							Object.values(goodRoles).includes(role),
						)
						.map((role) => (
							<div key={role}>{role}</div>
						))}
				</div>
				<div className="selectedRolesColumn">
					{/* Evil Roles */}
					{selectedRoles
						.filter((role) =>
							Object.values(evilRoles).includes(role),
						)
						.map((role) => (
							<div key={role}>{role}</div>
						))}
				</div>
			</div>
		</div>
	);
};

export default RoleSelectionPage;
