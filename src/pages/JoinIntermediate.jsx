import React from "react";
import { Navigate, useParams } from "react-router-dom";

const JoinIntermediate = () => {
	const { gameID } = useParams();
	return (
		<Navigate
			to={"/enterName"}
			state={{ gameID: gameID, isCreate: false }}
		/>
	);
};

export default JoinIntermediate;
