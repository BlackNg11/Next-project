import Head from "next/head";
import { useContext } from "react";
import { DataContext } from "../store/GlobalState";
import { addToCart } from "../store/Actions";

const Cart = () => {
	const [state, dispatch] = useContext(DataContext);
	const { cart } = state;

	if (cart.length === 0) {
		return (
			<img
				className="img-responsive w-100"
				src="/empty_cart.jpg"
				alt="/empty_cart.jpg"
			/>
		);
	}

	return (
		<div>
			<Head>
				<title>Cart Page</title>
			</Head>
		</div>
	);
};

export default Cart;
