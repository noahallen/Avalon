import React from "react";
import "../style/Toggleslider.css";

/**
 * Renders a toggle slider component.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.isChecked - The current state of the toggle slider.
 * @param {function} props.handleToggle - The callback function to handle toggle events.
 * @returns {JSX.Element} The toggle slider component.
 */
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
