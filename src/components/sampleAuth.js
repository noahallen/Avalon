//Write a basic component that takes in a boolean prop named "shouldRender" and a boolean prop that is named "isAuthenticated"
// If the prop is true, the component should render a sample button that sets the isAuthenticated state to true
// If the prop is false, the component should render nothing

import { useState } from "react";

const SampleAuth = (props) => {
	const { shouldRender, isAuthCompleted, setIsAuthCompleted } = props;

	const handleAuthRequest = () => {
		setIsAuthCompleted(true);
	};

	return shouldRender ? (
		<button disabled={isAuthCompleted} onClick={handleAuthRequest}>
			Authenticate
		</button>
	) : null;
};

export default SampleAuth;
