import connectDB from "../../../../utils/connectDB";
import Orders from "../../../../models/orderModel";
import Products from "../../../../models/productModel";
import auth from "../../../../middleware/auth";

connectDB();

export default async (req, res) => {
	switch (req.method) {
		case "PATCH":
			await deliveredOrder(req, res);
			break;

		default:
			// statements_def
			break;
	}
};

const deliveredOrder = async (req, res) => {
	try {
		const result = await auth(req, res);
		if (result.role !== "admin") {
			return res.status(400).json({ err: "Not valid" });
		}
		const { id } = req.query;

		const order = await Orders.findOne({
			_id: id,
		});

		if (order.paid) {
			await Orders.findOneAndUpdate(
				{ _id: id },
				{
					delivered: true,
				}
			);
			res.json({
				msg: "Update success",
				result: {
					delivered: true,
					paid: true,
					dateOfPayment: order.dateOfPayment,
					method: order.method,
				},
			});
		} else {
			await Orders.findOneAndUpdate(
				{ _id: id },
				{
					delivered: true,
					paid: true,
					dateOfPayment: new Date().toISOString(),
					method: "Receive Cash",
				}
			);
			res.json({
				msg: "Update success",
				result: {
					delivered: true,
				},
			});
		}
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};
