import React, { useEffect } from "react";
import JoinBox from "../components/box-join";
import apiFunctions from "../firebase/api";

const RoomCreationPage = () => {
	useEffect(() => {
		apiFunctions.logOut();
	}, []);
	return (
		<div className="room-creation">
			<JoinBox joinCode="" error="" />
		</div>
	);
};

export default RoomCreationPage;
