import connectDB from "../../../utils/connectDB";
import Products from "../../../models/productModel";
import auth from "../../../middleware/auth";

connectDB();

export default async (req, res) => {
	switch (req.method) {
		case "GET":
			await getProducts(req, res);
			break;
		case "POST":
			await createProducts(req, res);
			break;
		default:
			// statements_def
			break;
	}
};

const getProducts = async (req, res) => {
	try {
		const products = await Products.find();

		res.json({
			status: "success",
			result: products.length,
			products,
		});
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};

const createProducts = async (req, res) => {
	try {
		const result = await auth(req, res);
		if (result.role !== "admin")
			return res.status(500).json({ err: "Not Valid" });

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

		const newProduct = new Products({
			title: title.toLowerCase(),
			price,
			inStock,
			description,
			content,
			category,
			images,
		});

		await newProduct.save();

		res.status(200).json({ msg: "Success !!! Create a product" });
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};
