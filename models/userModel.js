import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			default: "user",
		},
		root: {
			type: Boolean,
			default: false,
		},
		avatar: {
			type: String,
			default:
				"https://res.cloudinary.com/dwviwhgyq/image/upload/v1611566580/image_not_availble_kwbrfn.png",
		},
	},
	{
		timestamp: true,
	}
);

let Dataset = mongoose.models.user || mongoose.model("user", userSchema);

export default Dataset;
