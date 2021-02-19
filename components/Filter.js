import React, { useState, useEffect } from "react";
import filterSearch from "../utils/filterSearch";
import { getData } from "../utils/fetchData";
import { useRouter } from "next/router";

function Filter({ state }) {
	// const [title, setTitle] = useState("");
	const [search, setSearch] = useState("");
	const [sort, setSort] = useState("");
	const [category, setCategory] = useState("");

	const { categories } = state;

	const router = useRouter();

	const handleCategory = (e) => {
		setCategory(e.target.value);
		filterSearch({ router, category: e.target.value });
	};

	const handleSort = (e) => {
		setSort(e.target.value);
		filterSearch({ router, sort: e.target.value });
	};

	useEffect(() => {
		filterSearch({ router, search: search ? search : "all" });
	}, [search]);

	return (
		<div className="input-group">
			<div className="input-group-prepend col-md-2 px-0 mt-2">
				<select
					value={category}
					onChange={handleCategory}
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
			<form autocomplete="off" className="mt-2 col-md-8 px-0">
				<input
					type="text"
					className="form-control"
					list="title_product"
					value={search.toLowerCase()}
					onChange={(e) => setSearch(e.target.value)}
				/>
				{/*<datalist id="title_product">
					<option value="name">Title Name</option>
				</datalist>
				<button
					className="position-absolute btn btn-info"
					type="submit"
					style={{
						top: 0,
						right: 0,
					}}
				>
					Search
				</button>*/}
			</form>

			<div className="input-group-prepend col-md-2 px-0 mt-2">
				<select
					value={sort}
					className="custom-select text-capitalize"
					onChange={handleSort}
				>
					<option value="-createdAt">Newest</option>
					<option value="oldest">Oldest</option>
					<option value="-sold">Best Sales</option>
					<option value="-price">Price: Hight-Low</option>
					<option value="price">Price: Low-Hight</option>
				</select>
			</div>
		</div>
	);
}

export default Filter;
