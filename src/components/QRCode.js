import React from "react";
import QRCode from "qrcode.react";

const QRCodeComponent = ({ code }) => {
	// TODO: Change URL to real hosted URL later
	const URL = "http://localhost:3000";
	return <QRCode value={URL + "/" + code} />;
};

export default QRCodeComponent;
