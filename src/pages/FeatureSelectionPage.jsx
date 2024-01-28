import React, { useState } from "react";
import ToggleSlider from "../components/ToggleSlider";

const FeatureSelectionPage = () => {
	const [roleDistribution, setRoleDistribution] = useState(false);
	const [narrationInfo, setNarrationInfoToggle] = useState(false);
	const [playWithLady, setPlayWithLady] = useState(false);
	const [kingTracking, setKingTracking] = useState(false);
	const [questCards, setQuestCards] = useState(false);
	const [kingChoosesQuestPlayers, setKingChoosesQuestPlayers] =
		useState(false); // New state for sub toggle button

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
		// Reset sub toggle state when toggle4 is unchecked
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
				{/* Conditionally render the sub toggle button */}
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
			</main>
			<footer></footer>
		</div>
	);
};

export default FeatureSelectionPage;
