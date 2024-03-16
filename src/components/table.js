import React, { useState, useEffect, useContext } from "react";
import { GameContext } from "../components/GameProvider.js";
import apiFunctions from "../firebase/api.jsx";

const OvalSVG = () => {
	const {
		playerState,
		userName,
		setPlayerState,
		gameState,
		isAdmin,
		gameID,
	} = useContext(GameContext);
	const numPlayers = Object.keys(playerState).length;
	const scaleFactor = 0.78;
	const [dimension, setDimension] = useState(window.innerWidth * scaleFactor);
	const [selection, setSelection] = useState("");

	useEffect(() => {
		const handleResize = () => {
			setDimension(window.innerWidth * scaleFactor);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [scaleFactor]);

	const calculateCircleCoordinates = React.useCallback(
		(index) => {
			const angle = (2 * Math.PI * index) / numPlayers;
			const radiusX = dimension / 2;
			const radiusY = dimension / 3.85;
			const x = radiusX + radiusX * Math.cos(angle);
			const y = radiusY + radiusY * Math.sin(angle);
			return { x, y };
		},
		[numPlayers, dimension],
	);

	const handleCircleClick = (clickedUserName) => {
		if (gameState === "OS" && isAdmin) {
			if (selection === "") {
				setSelection(clickedUserName);
			} else {
				const temp = playerState[selection].index;
				playerState[selection].index =
					playerState[clickedUserName].index;
				playerState[clickedUserName].index = temp;
				setPlayerState({
					...playerState,
					[selection]: playerState[selection],
					[clickedUserName]: playerState[clickedUserName],
				});
				apiFunctions.setPlayerField(
					gameID,
					selection,
					"",
					playerState[selection],
				);
				apiFunctions.setPlayerField(
					gameID,
					clickedUserName,
					"",
					playerState[clickedUserName],
				);
				setSelection("");
			}
		} else if (gameState === "TS" && playerState[userName]?.isKing) {
			playerState[clickedUserName].onTeam =
				!playerState[clickedUserName].onTeam;
			setPlayerState({
				...playerState,
				[clickedUserName]: playerState[clickedUserName],
			});
			apiFunctions.setPlayerField(
				gameID,
				clickedUserName,
				"onTeam",
				playerState[clickedUserName].onTeam,
			);
		} else if (gameState === "KS" && isAdmin) {
			playerState[clickedUserName].isKing =
				!playerState[clickedUserName].isKing;
			setPlayerState({
				...playerState,
				[clickedUserName]: playerState[clickedUserName],
			});
			apiFunctions.setPlayerField(
				gameID,
				clickedUserName,
				"",
				playerState[clickedUserName],
			);
			apiFunctions.setGameState(gameID, "TS");
		}
	};

	const renderCircles = React.useCallback(() => {
		const circles = Object.entries(playerState).map(([key, player]) => {
			const index = playerState[key].index;
			const { x, y } = calculateCircleCoordinates(index);
			const circleColor = player.isKing ? "#996515" : "black"; // Set different color for isKing players
			return (
				<g key={index}>
					<a onClick={() => handleCircleClick(key)}>
						<ellipse
							cx={x}
							cy={y}
							rx={dimension / 10}
							ry={dimension / 20}
							style={{
								fill: circleColor,
							}}
						></ellipse>

						<text
							x={x}
							y={y}
							textAnchor="middle"
							dominantBaseline="middle"
							style={{
								fill: "white",
								fontSize: dimension / 25,
								fontWeight: player.onTeam ? "bold" : "lighter",
							}}
						>
							{player.displayName}
						</text>
					</a>
				</g>
			);
		});
		return circles;
	}, [playerState, dimension, handleCircleClick, calculateCircleCoordinates]);

	return (
		<div
			style={{
				position: "fixed",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
			}}
		>
			<svg
				width={dimension}
				height={dimension / 2}
				style={{ overflow: "visible" }}
			>
				<ellipse
					cx={dimension / 2}
					cy={dimension / 3.85}
					rx={dimension / 2}
					ry={dimension / 3.85}
					style={{
						fill: "#87342e",
					}}
				/>
				{renderCircles()}
			</svg>
		</div>
	);
};

export default OvalSVG;
