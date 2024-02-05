import React, { useState } from "react";
import JoinBox from "../components/box-join";

const RoomCreationPage = () => {
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
