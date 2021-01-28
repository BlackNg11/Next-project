import connectDB from "../../../utils/connectDB";
import Product from "../../../models/productModel";

connectDB();

export default async (req, res) => {
	switch (req.method) {
		case "GET":
			await getProducts(req, res);
			break;
		default:
			// statements_def
			break;
	}
};

const getProducts = async (req, res) => {
	try {
		const products = await Product.find();

		res.json({
			status: "success",
			result: products.length,
			products,
		});
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};
