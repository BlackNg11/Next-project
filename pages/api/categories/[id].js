import connectDB from "../../../utils/connectDB";
import Categories from "../../../models/categoriesModal.js";
import auth from "../../../middleware/auth";

connectDB();

export default async (req, res) => {
	switch (req.method) {
		case "PUT":
			await updateCategory(req, res);
			break;
		case "DELETE":
			await deleteCategories(req, res);
			break;
		default:
			// statements_def
			break;
	}
};

const updateCategory = async (req, res) => {
	try {
		const result = await auth(req, res);
		if (result.role !== "admin")
			return res.status(400).json({ err: "Not Valid" });
		const { id } = result.query;
		const { name } = req.body;

		const newCategory = await Categories.findOneAndUpdate(
			{ _id: id },
			{ name }
		);

		res.json({
			msg: "Success",
			category: {
				...newCategory._doc,
				name,
			},
		});
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};

const deleteCategories = async (req, res) => {
	try {
		const result = await auth(req, res);
		if (result.role !== "admin")
			return res.status(400).json({ err: "Not Valid" });
		const { id } = result.query;

		await Categories.findByIdAndDelete(id);

		res.json({
			msg: "Success DELETE",
		});
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};
