import React, { useState } from "react";
import JoinBox from "../components/box-join";

const RoomCreationPage = () => {
	return (
		<div className="room-creation">
			<JoinBox joinCode="" error="" />
		</div>
	);
};

export default RoomCreationPage;
