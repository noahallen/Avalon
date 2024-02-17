import React, { useEffect, useState, useContext } from "react";
import ToggleSlider from "../components/ToggleSlider";
import apiFunctions from "../firebase/api";
import { GameContext } from "../components/GameProvider.js";

// useLady
// useKingChoose
// useKingTracking
// useNarration
// useRoleDist
// useQuestCards
// props.setPopupState
// isAdmin
const FeatureSelectionPage = (props) => {
	const [roleDistribution, setRoleDistribution] = useState(false);
	const [narrationInfo, setNarrationInfoToggle] = useState(false);
	const [playWithLady, setPlayWithLady] = useState(false);
	const [kingTracking, setKingTracking] = useState(false);
	const [questCards, setQuestCards] = useState(false);
	const [kingChoosesQuestPlayers, setKingChoosesQuestPlayers] =
		useState(false); // New state for sub toggle button
	const { gameID, setFeatureSelectionSettings, listeners, setListeners } =
		useContext(GameContext);

	useEffect(() => {
		if (props.isAdmin) {
			apiFunctions.loadFeatureSelection(
				gameID,
				setFeatureSelectionSettings,
				setListeners,
				listeners,
				{
					useLady: setPlayWithLady,
					useKingChoose: setKingChoosesQuestPlayers,
					useKingTracking: setKingTracking,
					useNarration: setNarrationInfoToggle,
					useRoleDist: setRoleDistribution,
					useQuestCards: setQuestCards,
				},
			);
		}
	}, []);

	const handleRoleDistributionToggle = () => {
		setRoleDistribution(!roleDistribution);
	};

	const handleNarrationInfoToggle = () => {
		setNarrationInfoToggle(!narrationInfo);
	};

	const handlePlayWithLadyToggle = () => {
		setPlayWithLady(!playWithLady);
	};

	const handleKingTrackingToggle = () => {
		setKingTracking(!kingTracking);
		// Reset sub toggle state when kingTracking is unchecked
		if (!kingTracking) {
			setKingChoosesQuestPlayers(false);
		}
	};

	const handleKingChoosesQuestPlayers = () => {
		setKingChoosesQuestPlayers(!kingChoosesQuestPlayers);
	};

	const handleQuestCards = () => {
		setQuestCards(!questCards);
	};

	const saveFeatures = () => {
		apiFunctions.setFeatureSelection(gameID, {
			useLady: playWithLady,
			useKingChoose: kingChoosesQuestPlayers,
			useKingTracking: kingTracking,
			useNarration: narrationInfo,
			useRoleDist: roleDistribution,
			useQuestCards: questCards,
		});
		props.setPopupState(false);
	};

	return (
		<div>
			<header>
				<h1>Feature Selection Page</h1>
			</header>
			<main>
				<h3 className="header">Role Distribution</h3>
				<ToggleSlider
					id="roleDistribution"
					isChecked={roleDistribution}
					handleToggle={handleRoleDistributionToggle}
				/>
				<h3 className="header">Narration Info</h3>
				<ToggleSlider
					id="narrationInfo"
					isChecked={narrationInfo}
					handleToggle={handleNarrationInfoToggle}
				/>
				<h3 className="header">Play with Lady</h3>
				<ToggleSlider
					id="playWithLady"
					isChecked={playWithLady}
					handleToggle={handlePlayWithLadyToggle}
				/>
				<h3 className="header">Keep Track of King</h3>
				<ToggleSlider
					id="kingTracking"
					isChecked={kingTracking}
					handleToggle={handleKingTrackingToggle}
				/>
				{/* Conditionally render the sub toggle button TODO remove padding */}
				{kingTracking && (
					<div className="sub-toggle">
						<h3 className="header">King Chooses Quest Players</h3>
						<ToggleSlider
							id="kingChoosesQuestPlayers"
							isChecked={kingChoosesQuestPlayers}
							handleToggle={handleKingChoosesQuestPlayers}
						/>
					</div>
				)}
				<h3 className="header">Quest Cards</h3>
				<ToggleSlider
					id="questCards"
					isChecked={questCards}
					handleToggle={handleQuestCards}
				/>
				<h3 className="header">controls</h3>
				<button onClick={saveFeatures}>Save</button>
				<button
					onClick={() => {
						props.setPopupState(false);
					}}
				>
					Close
				</button>
			</main>
			<footer></footer>
		</div>
	);
};

export default FeatureSelectionPage;
