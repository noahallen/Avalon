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
		board,
		roundSuccess,
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

	//Write a new calculate circle coordinates function that calculates the coordinates for the small circles
	const calculateSmallCircleCoordinates = React.useCallback(
		(index) => {
			const numCircles = 5; // Update this with the actual number of circles
			const containerWidth = dimension * 0.7;
			const circleWidth = containerWidth / numCircles;
			const offset = (dimension * 0.3) / 2;
			const x = offset + circleWidth * index + circleWidth / 2;
			const y = dimension / 3.85;
			return { x, y };
		},
		[dimension],
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
				"",
				playerState[clickedUserName],
			);
		} else if (gameState === "KS" && isAdmin) {
			playerState[clickedUserName].isKing =
				!playerState[clickedUserName].isKing;
			setPlayerState({
				...playerState,
				[clickedUserName]: playerState[clickedUserName],
			});
			apiFunctions.setGameState(gameID, "TS");
			apiFunctions.setPlayerField(
				gameID,
				clickedUserName,
				"",
				playerState[clickedUserName],
			);
		}
	};

	const getMissionColors = React.useCallback((index) => {
		if (roundSuccess !== undefined && roundSuccess[index] !== undefined) {
			return roundSuccess[index] ? "#2778BB" : "#AA1010";
		}
		return "none";
	});

	//Write a new callback that renders 5 small circles across the width of the elipse
	const renderSmallCircles = React.useCallback(() => {
		const smallCircles = Array.from({ length: 5 }, (_, index) => {
			const { x, y } = calculateSmallCircleCoordinates(index);

			return (
				<g key={index}>
					{index === 3 && Object.keys(playerState).length > 6 && (
						<text
							textAnchor="middle"
							dominantBaseline="middle"
							style={{
								fill: "white",
								fontSize: dimension / 30,
							}}
						>
							<tspan x={x} y={y - dimension / 8}>
								Requires two
							</tspan>
							<tspan x={x} y={y - dimension / 8 + dimension / 25}>
								to fail
							</tspan>
						</text>
					)}
					<circle
						cx={x}
						cy={y}
						r={dimension / 20}
						style={{
							fill: getMissionColors(index),
							stroke: "black",
						}}
					/>
					<text
						x={x}
						y={y}
						textAnchor="middle"
						dominantBaseline="middle"
						style={{
							fill: "white",
							fontSize: dimension / 25,
						}}
					>
						<tspan x={x} y={y}>
							{board[index]}
						</tspan>
					</text>
				</g>
			);
		});
		return smallCircles;
	});
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
				{renderSmallCircles()}
			</svg>
		</div>
	);
};

export default OvalSVG;
