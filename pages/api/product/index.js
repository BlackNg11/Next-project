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

class APIfeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	filtering() {
		const queryObject = { ...this.queryString };
		const excludeField = ["page", "sort", "limit"];
		excludeField.forEach((el) => delete queryObject[el]);

		if (queryObject.category !== "all") {
			this.query.find({ category: queryObject.category });
		}

		if (queryObject.title !== "all") {
			this.query.find({ title: { $regex: queryObject.title } });
		}

		this.query.find();

		return this;
	}

	sorting() {
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(",").join(" ");
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort("-createdAt");
		}

		return this;
	}

	paginating() {
		const page = this.queryString.page * 1 || 1;
		const limit = this.queryString.limit * 1 || 6;
		const skip = (page - 1) * limit;

		this.query = this.query.skip(skip).limit(limit);
		return this;
	}
}

const getProducts = async (req, res) => {
	try {
		const features = new APIfeatures(Products.find(), req.query)
			.filtering()
			.sorting()
			.paginating();

		const products = await features.query;

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
