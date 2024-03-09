import { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinBox = (props) => {
	const [inputValue, setInputValue] = useState("");
	const navigate = useNavigate();

	const handleCreate = async (e) => {
		e.preventDefault();
		navigate("/enterName", {
			state: { isCreate: true, roomId: "PLACEHOLDER" },
		});
	};

	const handleJoin = async (e) => {
		e.preventDefault();
		navigate("/enterName", {
			state: { isCreate: false, roomId: inputValue },
		});
	};

	const handleChange = (e) => {
		if (e.target.value.length <= 6) {
			setInputValue(e.target.value);
		}
	};

	return (
		<div className="box-input">
			<form onSubmit={handleJoin}>
				<h3 style={{ fontFamily: "Georgia" }}>Join the Resistance:</h3>
				<input
					type="text"
					placeholder="Enter 6 digit room code"
					value={inputValue}
					onChange={handleChange}
				/>
				<button
					disabled={inputValue.length < 6}
					className="join-button"
				>
					Join!
				</button>
			</form>
			<h2 style={{ fontFamily: "Georgia" }}>OR</h2>
			<form onSubmit={handleCreate}>
				<button className="create-room-button">Create a room</button>
			</form>
		</div>
	);
};

export default JoinBox;
