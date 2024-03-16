import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AvalonHeader = () => {
	return (
		<svg
			width="100%"
			height="100px"
			viewBox="0 0 600 180"
			style={{ display: "block", margin: "auto", overflow: "visible" }}
		>
			<defs>
				<filter
					id="neon-effect"
					x="-50%"
					y="-50%"
					width="200%"
					height="200%"
				>
					<feGaussianBlur
						stdDeviation="4"
						result="coloredBlur"
					></feGaussianBlur>
					<feMerge>
						<feMergeNode in="coloredBlur"></feMergeNode>

						<feMergeNode in="SourceGraphic"></feMergeNode>
					</feMerge>
				</filter>
			</defs>
			<path
				id="curvePath"
				d="M100,150 Q300,70 500,150"
				stroke="none"
				fill="transparent"
			/>
			<text
				style={{
					fontSize: "7em",
					fontWeight: "bold",
					fill: "#FBC02D",
					filter: "url(#neon-effect)",
					fontFamily: "Didot",
				}}
			>
				<textPath
					xlinkHref="#curvePath"
					startOffset="50%"
					textAnchor="middle"
				>
					AVALON
				</textPath>
			</text>
		</svg>
	);
};

export default AvalonHeader;
