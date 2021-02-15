import connectDB from "../../../utils/connectDB";
import User from "../../../models/userModel";
import auth from "../../../middleware/auth";

connectDB();

export default async (req, res) => {
	switch (req.method) {
		case "PATCH":
			await updateRole(req, res);
			break;
		case "DELETE":
			await deleteUser(req, res);
			break;
		default:
			// statements_def
			break;
	}
};

const updateRole = async (req, res) => {
	try {
		const result = await auth(req, res);

		if (result.role !== "admin" || !result.root) {
			return res.status(400).json({ err: "not valid" });
		}

		const { id } = req.query;
		const { role } = req.body;
		await User.findOneAndUpdate({ _id: id }, { role });

		res.json({
			msg: "Update Success",
		});
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};

const deleteUser = async (req, res) => {
	try {
		const result = await auth(req, res);

		if (result.role !== "admin" || !result.root) {
			return res.status(400).json({ err: "not valid" });
		}

		const { id } = req.query;

		await User.findByIdAndDelete(id);

		res.json({
			msg: "Delete Success",
		});
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};
