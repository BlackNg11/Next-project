import connectDB from "../../../utils/connectDB";
import User from "../../../models/userModel";
import auth from "../../../middleware/auth";

connectDB();

export default async (req, res) => {
	switch (req.method) {
		case "PATCH":
			await uploadInfo(req, res);
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
