import React, { useState } from "react";
import "../style/popup.css";
const MainGamePage = () => {
	const [showRoleInfo, setShowRoleInfo] = useState(false);
	const [showMyRole, setShowMyRole] = useState(false);

	const handleRoleInfoClick = () => {
		setShowRoleInfo(true);
	};

	const handleMyRoleClick = () => {
		setShowMyRole(true);
	};

	const handleClose = () => {
		setShowRoleInfo(false);
		setShowMyRole(false);
	};

	return (
		<div>
			<h2 className="page-header">AVALON</h2>
			{/* ...other content... */}
			<div className="tabs">
				<button onClick={handleRoleInfoClick}>Role Info</button>
				<button onClick={handleMyRoleClick}>My Role</button>
			</div>

			{showRoleInfo && (
				<div className="popup">
					{/* Popup content for Role Info */}
					<button onClick={handleClose}>Close</button>
				</div>
			)}

			{showMyRole && (
				<div className="popup">
					{/* Popup content for My Role */}
					<button onClick={handleClose}>Close</button>
				</div>
			)}
		</div>
	);
};

export default MainGamePage;
