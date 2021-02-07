import Head from "next/head";
import { useContext, useState, useEffect } from "react";
import { DataContext } from "../../store/GlobalState";
import { useRouter } from "next/router";

function EditUser() {
	const router = useRouter();
	const { id } = router.query;

	const [state, dispatch] = useContext(DataContext);
	const { users, auth } = state;

	const [editUser, setEditUser] = useState([]);
	const [checkAdmin, setCheckAdmin] = useState(false);

	useEffect(() => {
		users.forEach((user) => {
			if (user._id === id) {
				setEditUser(user);
				setCheckAdmin(user.role === "admin" ? true : false);
			}
		});
	}, [users]);

	const handleCheck = () => {};

	return (
		<div className="edit_user my-3 w-100">
			<Head>
				<title>Edit User</title>
			</Head>
			<div>
				<button className="btn btn-dark" onClick={() => router.back()}>
					<i className="fas fa-long-arrow-alt-left"></i>Go Back
				</button>
				<div className="col-md-4 mx-auto my-4">
					<h2 className="text-uppercase text-secondary">Edit User</h2>

					<div className="form-group">
						<label htmlFor="name" className="d-block">
							Name
						</label>
						<input
							type="text"
							id="name"
							defaultValue={editUser.name}
							disabled
						/>
					</div>

					<div className="form-group">
						<label htmlFor="email" className="d-block">
							Email
						</label>
						<input
							type="text"
							id="email"
							defaultValue={editUser.email}
							disabled
						/>
					</div>

					<div className="form-group">
						<input
							type="checkbox"
							id="isAdmin"
							checked={checkAdmin}
							style={{ width: "20px", height: "20px" }}
							onChange={handleCheck}
						/>
						<label
							htmlFor="isAdmin"
							style={{
								transform: "translate(4px,-3px)",
							}}
						>
							isAdmin
						</label>
					</div>

					<button className="btn btn-dark">Update</button>
				</div>
			</div>
		</div>
	);
}

export default EditUser;
