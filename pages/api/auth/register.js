import connectDB from "../../../utils/connectDB";
import User from "../../../models/userModel";
import valid from "../../../utils/valid";
import bcrypt from "bcrypt";

connectDB();

const register = async (req, res) => {
	try {
		const { name, email, password, cf_password } = req.body;
		const errMessage = valid(name, email, password, cf_password);

		if (errMessage) {
			return res.status(400).json({
				err: errMessage,
			});
		}

		const user = await User.findOne({ email });
		if (user)
			return res.status(400).json({ err: "This email already taken" });

		const passwordHash = await bcrypt.hash(password, 12);
		const newUser = new User({
			name,
			email,
			password: passwordHash,
			cf_password,
		});

		await newUser.save();

		res.json({ msg: "Register Success!!!" });
	} catch (err) {
		return res.status(500).json({
			err: err.message,
		});
	}
};

export default async (req, res) => {
	switch (req.method) {
		case "POST":
			await register(req, res);
			break;
		default:
			// statements_def
			break;
	}
};
