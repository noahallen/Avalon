import React, { useState } from "react";
import "../style/popup.css";
import OvalSVG from "../components/table";

const MainGamePage = () => {
	const [showRoleInfo, setShowRoleInfo] = useState(false);
	const [currentPage, setCurrentPage] = useState(1); // New state to track current page
	const [showMyRole, setShowMyRole] = useState(false);

	const handleRoleInfoClick = () => {
		setShowMyRole(false); // Close "My Role" popup if open
		if (!showRoleInfo || showMyRole) {
			setShowRoleInfo(!showRoleInfo); // Toggle "Roles Info" popup
			setCurrentPage(1); // Default to page 1
		} else {
			setShowRoleInfo(false); // Close popup
		}
	};

	const handleMyRoleClick = () => {
		setShowRoleInfo(false); // Close "Roles Info" popup if open
		if (!showMyRole || showRoleInfo) {
			setShowMyRole(!showMyRole); // Toggle "My Role" popup
		} else {
			setShowMyRole(false); // Close popup
		}
	};

	const handleClose = () => {
		setShowRoleInfo(false);
		setShowMyRole(false);
	};

	const nextPage = () => {
		setCurrentPage(2); // Go to page 2
	};

	const prevPage = () => {
		setCurrentPage(1); // Go back to page 1
	};

	return (
		<div>
			<OvalSVG />

			<div className="tab-bar">
				<div className="tabs">
					<button
						className={showRoleInfo ? "tabsOpen" : ""}
						onClick={handleRoleInfoClick}
					>
						Roles Info
					</button>
					<button
						className={showMyRole ? "tabsOpen" : ""}
						onClick={handleMyRoleClick}
					>
						My Role
					</button>
				</div>
			</div>

			{showRoleInfo && (
				<div className="popup">
					{currentPage === 1 ? (
						<>
							<div
								style={{
									backgroundColor: "#3599a1",
									height: "25px",
								}}
							>
								<span
									style={{
										fontFamily: "Courier",
										fontSize: "22px",
										color: "#FFFFFF",
									}}
								>
									GOOD CHARACTERS
								</span>
							</div>
							{/* Page 1 content */}
							<p>Page 1 content here</p>
							<button onClick={nextPage}>Next</button>
							<button onClick={handleClose}>Close</button>
						</>
					) : (
						<>
							<div
								style={{
									backgroundColor: "#cf4f48",
									height: "25px",
								}}
							>
								<span
									style={{
										fontFamily: "Courier",
										fontSize: "22px",
										color: "#FFFFFF",
									}}
								>
									EVIL CHARACTERS
								</span>
							</div>
							{/* Page 2 content */}
							<p>Page 2 content here</p>
							<button onClick={prevPage}>Previous</button>
							<button onClick={handleClose}>Close</button>
						</>
					)}
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
