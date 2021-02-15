import mongoose from "mongoose";

const CategoriesSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{
		timestamp: true,
	}
);

let Dataset =
	mongoose.models.categories ||
	mongoose.model("categories", CategoriesSchema);

export default Dataset;
