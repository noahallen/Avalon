import { useState, useContext } from "react";
import SampleAuth from "./sampleAuth";
import { GameContext } from "./GameProvider";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const UserNameInputBox = (props) => {
	const shouldUseAuth = props.shouldUseAuth;
	const isCreate = props.isCreate;
	const roomId = props.roomId;
	const [isAuthCompleted, setIsAuthCompleted] = useState(false);
	const { userName, setUserName } = useContext(GameContext);
	const { name, setName } = useContext(GameContext);
	const navigate = useNavigate();

	const handleChange = (e) => {
		setUserName(e.target.value);
	};

	const handleDisplayChange = (e) => {
		setName(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (isCreate) {
			console.log("is create room");
			console.log(roomId);
			// call the create room function here
			navigate("/waiting-room", {
				state: { isAdmin: isCreate, roomId: roomId },
			});
		} else {
			console.log("is join room");
			console.log(roomId);
			//call the load and join game code here
			navigate("/waiting-room", {
				state: { isAdmin: isCreate, roomId: roomId },
			});
		}
	};

	const isButtonDisabled =
		userName === "" || name === "" || (shouldUseAuth && !isAuthCompleted);

	return (
		<div className="box-input">
			<form onSubmit={handleSubmit}>
				<h3>Enter Your Username:</h3>
				<input
					type="text"
					placeholder="Enter your username here"
					onChange={handleChange}
				/>
				<input
					type="text"
					placeholder="Enter you display name here"
					onChange={handleDisplayChange}
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
