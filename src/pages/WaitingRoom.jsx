import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const WaitingRoom = () => {
	const location = useLocation();
	const isAdmin = location.state.isAdmin;
	console.log(isAdmin);

	return <div>Waiting room</div>;
};

export default WaitingRoom;
