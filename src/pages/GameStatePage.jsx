import React, { useState, useEffect } from "react";
import MissionTab from "../components/MissionTab";
import RoleInfoTab from "../components/RoleInfoTab";

const GameStatePage = () => {
	/* Keys
	 * 0: game tab
	 * 1: all roles info tab
	 * 2: own role tab
	 */
	const [mainTab, setMainTab] = useState(0);

	return (
		<div>
			{mainTab === 0 &&
				{
					/*depending on game phase context state
                     render which game tab */
				}}
			{mainTab === 1 && <RoleInfoTab />}
			{mainTab === 2 && <UserRoleTab />}
		</div>
	);
};

export default GameStatePage;
