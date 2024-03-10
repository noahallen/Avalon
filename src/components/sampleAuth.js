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
