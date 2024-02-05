import { useState, useContext } from "react";
import SampleAuth from "./sampleAuth";
import { GameContext } from "./GameProvider";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import apiFunctions from "../firebase/api";

const UserNameInputBox = (props) => {
	const shouldUseAuth = props.shouldUseAuth;
	const isCreate = props.isCreate;
	const roomId = props.roomId;
	const [isAuthCompleted, setIsAuthCompleted] = useState(false);
	const {
		setPlayerState,
		setSelectedGoodRoles,
		setSelectedEvilRoles,
		setGameID,
		name,
		setName,
		userName,
		setUserName,
		setListeners,
		gameID,
		playerState,
	} = useContext(GameContext);

	const navigate = useNavigate();

	const handleChange = (e) => {
		setUserName(e.target.value);
	};

	const handleDisplayChange = (e) => {
		setName(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isCreate) {
			const createResponse = apiFunctions.createGameLobby(
				userName,
				name,
				setPlayerState,
				setSelectedGoodRoles,
				setSelectedEvilRoles,
			);
			setListeners(createResponse.listeners);
			setGameID(createResponse.gameID);
			navigate("/waiting-room", {
				state: { isAdmin: isCreate, gameID: gameID },
			});
		} else {
			if (roomId === undefined) {
				navigate("/");
			}
			setListeners(
				apiFunctions.loadGameLobby(
					roomId,
					setPlayerState,
					setSelectedGoodRoles,
					setSelectedEvilRoles,
				),
			);

			const joinResponse = await apiFunctions.joinGameLobby(
				userName,
				name,
				roomId,
			);
			if (joinResponse === 1) {
				setGameID(roomId);
				navigate("/waiting-room", {
					state: { isAdmin: isCreate, gameID: gameID },
				});
			}
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
