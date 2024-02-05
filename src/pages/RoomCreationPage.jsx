import React, { useState } from "react";
import JoinBox from "../components/box-join";
import UserNameInputBox from "../components/userNameInputBox";
import { useLocation } from "react-router-dom";

const RoomCreationPage = () => {
	const location = useLocation();
	console.log(location);
	return (
		<div>
			<h2 className="page-header">Room Creation</h2>

			<div className="room-creation">
				<JoinBox joinCode="" error="" />
			</div>
		</div>
	);
};

export default RoomCreationPage;
