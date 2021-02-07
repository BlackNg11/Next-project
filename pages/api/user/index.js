import connectDB from "../../../utils/connectDB";
import User from "../../../models/userModel";
import auth from "../../../middleware/auth";

connectDB();

export default async (req, res) => {
	switch (req.method) {
		case "PATCH":
			await uploadInfo(req, res);
			break;
		case "GET":
			await getUsers(req, res);
			break;
		default:
			// statements_def
			break;
	}
};

const uploadInfo = async (req, res) => {
	try {
		const result = await auth(req, res);

		const { name, avatar } = req.body;

		const newUser = await User.findOneAndUpdate(
			{
				_id: result._id,
			},
			{
				name,
				avatar,
			}
		);

		res.json({
			msg: "Update Success",
			// user: {
			// 	name,
			// 	email: newUser.email,
			// 	avatar,
			// 	role: newUser.role,
			// },
		});
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};

const getUsers = async (req, res) => {
	try {
		const result = await auth(req, res);

		if (result.role !== "admin") {
			return res.status(400).json({ err: "not valid" });
		}

		const users = await User.find().select("-password");

		res.json({
			users,
		});
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};
