import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Types.ObjectId,
			ref: "user",
		},
		address: String,
		mobile: String,
		cart: Array,
		total: Number,
		delivered: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamp: true,
	}
);

let Dataset = mongoose.models.order || mongoose.model("product", orderSchema);

export default Dataset;
