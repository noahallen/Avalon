import React, { useContext, useEffect, useState } from "react";
import { GameContext } from "../components/GameProvider.js";
import { useNavigate } from "react-router-dom";
import apiFunctions from "../firebase/api.jsx";
import "../index.css";

const RoleSelectionPage = () => {
	const { goodRoles, evilRoles, isAdmin, playerState, gameID, gameState } =
		useContext(GameContext);
	const [selectedRoles, setSelectedRoles] = useState([]);
	const [numBad, setNumBad] = useState(0);
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
	const characterText = {
		Merlin: "Knows Evil, must remain hidden",
		Percival: "Knows Merlin",
		"Loyal Servant of Arthur": "No special ability",
		Troublemaker: "",
		Cleric: "Secretly investigates the first Leader",
		"Untrustworthy Servant":
			"Appears Evil to Merlin, knows the Assassin can become Evil during the Recruitment stage",
		"Good Lancelot": "Knows Evil Lancelot, or can switch allegiance",
		"Good Sorcerer": "May play Magic",
		"Good Rogue": "May play Rouge Success",
		"Senior Messenger": "Knows Junior Messenger, may play Good Message",
		"Junior Messenger": "May play Good Message",
		Mordred: "Unknown to Merlin",
		Morgana: "Appears as Merlin",
		Oberon: "Unkownto Evil, does not know Evil",
		Assassin: "May activate Assassination stage if three Quests succeed",
		"Minion of Mordred": "No special ability",
		Trickster: "May lie about loyalty",
		Lunatic: "Must Fail every Quest",
		Brute: "May Fail only the first three Quests",
		Revealer: "Reveals loyalty after second failed quest",
		"Evil Lancelot": "Knows Good Lancelot, or can switch allegiance",
		"Evil Sorcerer": "May play Magic, may not play Fail",
		"Evil Rogue":
			"May play Rogue Fail, unknown to Evil, does not know Evil",
		"Evil Messenger": "May play Evil Message",
	};

	useEffect(() => {
		if (!isAdmin) {
			apiFunctions.setRoleListener(gameID, setSelectedRoles);
		}
	}, []);

	useEffect(() => {
		if (gameState && gameState !== "RoleSelect") {
			navigate("/game");
		}
	}, [gameState]);

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
			{isAdmin && (
				<div id="RoleSelections">
					{Object.values(goodRoles).map((val) => (
						<img
							className={`icon-selected ${selectedRoles.includes(val) ? "highlighted" : ""}`}
							src={characterImages[`${val}.jpg`]}
							key={val}
							id={val}
							alt={val}
							title={characterText[val]}
							onClick={() => {
								RoleButtonClick(val, 0);
							}}
						></img>
					))}
					<div className="role-separator"></div>

					{Object.values(evilRoles).map((val) => (
						<img
							className={`icon-selected ${selectedRoles.includes(val) ? "highlighted" : ""}`}
							src={characterImages[`${val}.jpg`]}
							key={val}
							id={val}
							alt={val}
							title={characterText[val]}
							onClick={() => {
								RoleButtonClick(val, 1);
							}}
						></img>
					))}
					{selectedRoles.length ===
						Object.keys(playerState).length && (
						<div>
							<button onClick={confirmRoles}>Confirm</button>
						</div>
					)}
				</div>
			)}
			<div id={"SelectedRoles"}>
				{selectedRoles &&
					selectedRoles.map((val) => <div key={val}>{val}</div>)}
			</div>
		</div>
	);
};

export default RoleSelectionPage;
