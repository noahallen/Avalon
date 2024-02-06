import React, { useState, useEffect } from "react";
import UserNameInputBox from "../components/userNameInputBox";
import { useLocation } from "react-router-dom";

const EnterName = () => {
	const location = useLocation();
	console.log(location);
	return (
		<div>
			<UserNameInputBox
				shouldUseAuth={false}
				roomId={location.state.gameID}
				isCreate={location.state.isCreate}
			/>
		</div>
	);
};

export default EnterName;
