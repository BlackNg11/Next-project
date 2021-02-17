import connectDB from "../../../utils/connectDB";
import Products from "../../../models/productModel";
import auth from "../../../middleware/auth";

connectDB();

export default async (req, res) => {
	switch (req.method) {
		case "GET":
			await getProduct(req, res);
			break;
		case "PUT":
			await updateProduct(req, res);
			break;
		default:
			// statements_def
			break;
	}
};

const getProduct = async (req, res) => {
	try {
		const { id } = req.query;
		const product = await Products.findById(id);
		if (!product)
			return res
				.status(400)
				.json({ err: "this product does not exist." });

		res.json({
			product,
		});
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};

const updateProduct = async (req, res) => {
	try {
		const result = await auth(req, res);
		if (result.role !== "admin")
			return res.status(500).json({ err: "Not Valid" });

		const { id } = req.query;
		const {
			title,
			price,
			inStock,
			description,
			content,
			category,
			images,
		} = req.body;

		if (
			!title ||
			!price ||
			!inStock ||
			!description ||
			!content ||
			category === "all" ||
			images.length === 0
		) {
			return res.status(400).json({ err: "Ple add all field" });
		}

		await Products.findOneAndUpdate(
			{ _id: id },
			{
				title,
				price,
				inStock,
				description,
				content,
				category,
				images,
			}
		);

		res.json({ msg: "Success!!!Update product" });
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};
