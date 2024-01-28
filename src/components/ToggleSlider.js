import React from "react";
import "../style/Toggleslider.css";

const ToggleSlider = ({ isChecked, handleToggle }) => {
	return (
		<label className="switch">
			<input
				type="checkbox"
				checked={isChecked}
				onChange={handleToggle}
			/>
			<span className="slider round"></span>
		</label>
	);
};

export default ToggleSlider;
