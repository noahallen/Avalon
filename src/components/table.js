import React, { useState, useEffect, useContext } from "react";
import { GameContext } from "../components/GameProvider.js";

const OvalSVG = () => {
	const { playerState, userName, setPlayerState } = useContext(GameContext);
	const numPlayers = Object.keys(playerState).length;
	const scaleFactor = 0.78;
	const [dimension, setDimension] = useState(window.innerWidth * scaleFactor);

	//For debugging purposes
	// useEffect(() => {
	// 	setPlayerState({
	// 		...playerState,
	// 		["Noah"]: {
	// 			index: 0,
	// 			displayName: "Noah",
	// 			isKing: true,
	// 			onTeam: false,
	// 		},
	// 		["Peter"]: {
	// 			index: 1,
	// 			displayName: "Peter",
	// 			isKing: false,
	// 			onTeam: false,
	// 		},
	// 		["John"]: {
	// 			index: 2,
	// 			displayName: "John",
	// 			isKing: false,
	// 			onTeam: false,
	// 		},
	// 		["James"]: {
	// 			index: 3,
	// 			displayName: "James",
	// 			isKing: false,
	// 			onTeam: false,
	// 		},
	// 		["Andrew"]: {
	// 			index: 4,
	// 			displayName: "Andrew",
	// 			isKing: false,
	// 			onTeam: false,
	// 		},
	// 		["Philip"]: {
	// 			index: 5,
	// 			displayName: "Philip",
	// 			isKing: false,
	// 			onTeam: false,
	// 		},
	// 		["Bartholomew"]: {
	// 			index: 6,
	// 			displayName: "Bartholomew",
	// 			isKing: false,
	// 			onTeam: false,
	// 		},
	// 		["Matthew"]: {
	// 			index: 7,
	// 			displayName: "Matthew",
	// 			isKing: false,
	// 			onTeam: false,
	// 		},
	// 		["Thomas"]: {
	// 			index: 8,
	// 			displayName: "Thomas",
	// 			isKing: false,
	// 			onTeam: false,
	// 		},
	// 		["NotJames"]: {
	// 			index: 9,
	// 			displayName: "NotJames",
	// 			isKing: false,
	// 			onTeam: false,
	// 		},
	// 		["Simon"]: {
	// 			index: 10,
	// 			displayName: "Simon",
	// 			isKing: false,
	// 			onTeam: false,
	// 		},
	// 	});
	// }, [userName, setPlayerState]);

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

	const handleCircleClick = React.useCallback(
		(clickedUserName) => {
			// For debugging purposes
			// if (playerState["Noah"]?.isKing) {
			if (playerState[userName]?.isKing) {
				playerState[clickedUserName].onTeam =
					!playerState[clickedUserName].onTeam;
				setPlayerState({
					...playerState,
					[clickedUserName]: playerState[clickedUserName],
				});
			}
		},
		[playerState, setPlayerState, userName],
	);

	const renderCircles = React.useCallback(() => {
		const circles = Object.entries(playerState).map(
			([key, player], index) => {
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
									fontWeight: player.onTeam
										? "bold"
										: "lighter",
								}}
							>
								{player.displayName}
							</text>
						</a>
					</g>
				);
			},
		);
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