import React, { useState } from "react";
import JoinBox from "../components/box-join";

const RoomCreationPage = () => {
	return (
		<div>
			{/* <h2 className="page-header">AVALON</h2> */}
            <svg width="100%" height="220px" viewBox="0 0 600 200">
            {/* Define the path along which your text will be displayed */}
            <path id={"123"} d="M65,150 A500,500 0 0,1 500,175"  stroke="none" fill="transparent"/>
			{/* fill="transparent" */}

			{/* fill="yell" */}

            {/* Apply the text to the path */}
            
			{/* startOffset="50%" */}

			{/*  */}
            <text style={{ textAlign: "center", fill: 'yellow', fontSize: '8em' }}>
                <textPath href={`#${"123"}`}>Avalon</textPath>
            </text>
        </svg>
			<div className="room-creation">
				<JoinBox joinCode="" error="" />
			</div>
		</div>
	);
};

export default RoomCreationPage;
