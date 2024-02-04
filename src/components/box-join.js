import { useState } from "react";

const JoinBox = (props) => {
	const { joinCode, error } = props;
	const [inputValue, setInputValue] = useState("");

	const handleCreate = async (e) => {
		e.preventDefault();
	};

	const handleJoin = async (e) => {
		e.preventDefault();
	};

	const handleChange = (e) => {
		if (e.target.value.length <= 6) {
			setInputValue(e.target.value);
		}
	};

	return (
		<div className="box-input">
			<form onSubmit={handleJoin}>
				<h3>Join the Resistance:</h3>
				<input
					type="text"
					placeholder="Enter 6 digit room code"
					value={inputValue}
					onChange={handleChange}
				/>
				<button disabled={inputValue.length < 6}>Join!</button>
			</form>
			<h2>OR</h2>
			<form onSubmit={handleCreate}>
				<button>Create a room</button>
			</form>
		</div>
	);
};

export default JoinBox;
