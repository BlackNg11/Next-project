import jwt from "jsonwebtoken";
import User from "../models/userModel";

const auth = async (req, res) => {
	const token = req.headers.authorization;
	if (!token) return res.status(400).json({ err: "Invalid Authentication" });
	const decode = jwt.verify(token, process.env.ACCESSS_TOKEN_SECRET);
	if (!decode) return res.status(400).json({ err: "Invalid Authentication" });

	const user = await User.findOne({
		_id: decoded.id,
	});

	return {
		id: user._id,
	};
};

export default auth;
