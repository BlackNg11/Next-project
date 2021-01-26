const valid = (name, email, password, cf_password) => {
	if (!name || !email || !password || !cf_password) {
		console.log(name, email, password, cf_password);
		return "Please Add All Fields.";
	}

	if (!validateEmail(email)) {
		return "Invalid emails";
	}

	if (password.length < 6) {
		return "Password must be at least 6 character";
	}

	if (password !== cf_password) {
		return "Confirm password did not match";
	}
};

function validateEmail(email) {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

export default valid;
