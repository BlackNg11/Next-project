import jwt from "jsonwebtoken";

export const createAccessToken = (payload) => {
	return jwt.sign(payload, process.env.ACCESSS_TOKEN_SECRET, {
		expiresIn: "15m",
	});
};

export const createRefreshToken = (payload) => {
	return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});
};
