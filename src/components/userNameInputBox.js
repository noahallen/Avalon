import { useState, useContext } from "react";
import SampleAuth from "./sampleAuth";
import { GameContext } from "./GameProvider";

const UserNameInputBox = (props) => {
	const shouldUseAuth = props.shouldUseAuth;
	const [isAuthCompleted, setIsAuthCompleted] = useState(false);
	const { userName, setUserName } = useContext(GameContext);

	const handleChange = (e) => {
		setUserName(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
	};

	const isButtonDisabled =
		userName === "" || (shouldUseAuth && !isAuthCompleted);

	return (
		<div className="box-input">
			<form onSubmit={handleSubmit}>
				<h3>Enter Your Username:</h3>
				<input
					type="text"
					placeholder="Enter your username here"
					onChange={handleChange}
				/>
				<SampleAuth
					shouldRender={shouldUseAuth}
					isAuthCompleted={isAuthCompleted}
					setIsAuthCompleted={setIsAuthCompleted}
				/>
				<button disabled={isButtonDisabled}>Continue</button>
			</form>
		</div>
	);
};

export default UserNameInputBox;
