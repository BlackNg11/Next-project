import Head from "next/head";
import { useState, useContext, useEffect } from "react";
import { DataContext } from "../../store/GlobalState";
import { imageUpload } from "../../utils/imageUpload";
import { postData, getData, putData } from "../../utils/fetchData";
import { useRouter } from "next/router";

function ProductsManager() {
	const initialState = {
		product_id: "",
		title: "",
		price: "",
		inStock: "",
		description: "",
		content: "",
		category: "",
	};

	const [product, setProduct] = useState(initialState);
	const { title, price, inStock, description, content, category } = product;

	const [state, dispatch] = useContext(DataContext);
	const { categories, auth } = state;
	const [images, setImages] = useState([]);
	const [onEdit, setOnEdit] = useState(false);
	const router = useRouter();
	const { id } = router.query;

	useEffect(() => {
		if (id) {
			setOnEdit(true);
			getData(`product/${id}`).then((res) => {
				setProduct(res.product);
				setImages(res.product.images);
			});
		} else {
			setOnEdit(false);
			setProduct(initialState);
			setImages([]);
		}
	}, [id]);

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setProduct({ ...product, [name]: value });

		dispatch({ type: "NOTIFY", payload: {} });
	};

	const handleUploadInput = (e) => {
		dispatch({ type: "NOTIFY", payload: {} });
		let newImages = [];
		let num = 0;
		let err = "";
		const file = [...e.target.files];
		if (file.length === 0)
			return dispatch({
				type: "NOTIFY",
				payload: { error: "File does not exist" },
			});

		file.forEach((file) => {
			if (file.size > 1024 * 1024)
				return (err = "The largest image size is 1mb");

			if (file.type !== "image/jpeg" && file.type !== "image/png")
				return (err = "Image format is incorrect");

			num += 1;
			if (num <= 5) newImages.push(file);
			return newImages;
		});

		if (err)
			return dispatch({
				type: "NOTIFY",
				payload: { error: err },
			});

		const imgCount = images.length;
		if (imgCount + newImages.length > 5)
			return dispatch({
				type: "NOTIFY",
				payload: { error: "Select up to 5 images" },
			});

		setImages([...images, ...newImages]);
	};

	const deleteImage = (index) => {
		const newArr = [...images];
		newArr.splice(index, 1);
		setImages(newArr);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (auth.user.role !== "admin") {
			return dispatch({
				type: "NOTIFY",
				payload: {
					error: "Not Valid",
				},
			});
		}

		if (
			!title ||
			!price ||
			!inStock ||
			!description ||
			!content ||
			category === "all" ||
			images.length === 0
		) {
			return dispatch({
				type: "NOTIFY",
				payload: {
					error: "Please add all field",
				},
			});
		}

		dispatch({
			type: "NOTIFY",
			payload: {
				loading: true,
			},
		});

		let media = [];
		const imgNewURL = images.filter((img) => !img.url);
		const imgOldURL = images.filter((img) => img.url);

		if (imgNewURL.length > 0) media = await imageUpload(imgNewURL);

		let res;
		if (onEdit) {
			res = await putData(
				`product/${id}`,
				{ ...product, images: [...imgOldURL, ...media] },
				auth.token
			);

			if (res.err) {
				return dispatch({
					type: "NOTIFY",
					payload: {
						error: res.err,
					},
				});
			}
		} else {
			res = await postData(
				"product",
				{ ...product, images: [...imgOldURL, ...media] },
				auth.token
			);

			if (res.err) {
				return dispatch({
					type: "NOTIFY",
					payload: {
						error: res.err,
					},
				});
			}
		}

		return dispatch({
			type: "NOTIFY",
			payload: {
				success: res.msg,
			},
		});
	};

	return (
		<div>
			<Head>
				<title>Products Manager</title>
			</Head>
			<form className="row" onSubmit={handleSubmit}>
				<div className="col-md-6">
					<input
						type="text"
						name="title"
						placeholder="Title"
						value={title}
						className="d-block my-4 w-100 p2"
						onChange={handleChangeInput}
					/>

					<div className="row">
						<div className="col-md-6">
							<label htmlFor="price">Price</label>
							<input
								type="number"
								name="price"
								placeholder="Price"
								value={price}
								className="d-block  w-100 p2"
								onChange={handleChangeInput}
							/>
						</div>
						<div className="col-md-6">
							<label htmlFor="price">In Stock</label>
							<input
								type="number"
								name="inStock"
								placeholder="inStock"
								value={inStock}
								className="d-block  w-100 p2"
								onChange={handleChangeInput}
							/>
						</div>
					</div>

					<textarea
						name="description"
						id="description"
						cols="30"
						rows="4"
						value={description}
						className="d-block my-4 w-100 p2"
						onChange={handleChangeInput}
						placeholder="description"
					/>

					<textarea
						name="content"
						id="content"
						cols="30"
						rows="6"
						value={content}
						className="d-block my-4 w-100 p2"
						onChange={handleChangeInput}
						placeholder="Content"
					/>

					<div className="input-group-prepend px-0 my-2">
						<select
							name="category"
							id="category"
							value={category}
							onChange={handleChangeInput}
							className="custom-select text-capitalize"
						>
							<option value="all">All Products</option>
							{categories.map((item) => (
								<option key={item._id} value={item._id}>
									{item.name}
								</option>
							))}
						</select>
					</div>

					<button className="btn btn-info my-2 px-4" type="submit">
						{onEdit ? "Update" : "Create"}
					</button>
				</div>
				<div className="col-md-6 my-4">
					<div className="input-group mb-3">
						<div className="input-group-prepend">
							<span className="input-group-text">Upload</span>
						</div>
						<div className="custom-file border rounded">
							<input
								type="file"
								className="custom-file-input"
								onChange={handleUploadInput}
								multiple
								accept="image/*"
							/>
						</div>
					</div>
					<div className="row img-up">
						{images.map((img, index) => (
							<div className="file_img my-1" key={index}>
								<img
									src={
										img.url
											? img.url
											: URL.createObjectURL(img)
									}
									className="img-thumbnail rounded"
									alt=""
								/>
								<span onClick={() => deleteImage(index)}>
									X
								</span>
							</div>
						))}
					</div>
				</div>
			</form>
		</div>
	);
}

export default ProductsManager;
