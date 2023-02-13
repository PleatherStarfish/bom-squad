import React, {useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import BOMListTable from "./components/Table";
import 'regenerator-runtime/runtime'
import Cookies from "js-cookie";
import localforage from "localforage";

function App() {
	const [components, setComponents] = useState({})

	const csrftoken = Cookies.get("csrftoken");

	const {data: username, isLoading: userIsLoading, error: userError} = useQuery(
		['current_user'],
		async () => {
			const response = await fetch(`${window.location.origin}/users/me/`, {
				method: 'GET',
				headers: {
					'X-CSRFToken': csrftoken,
				},
				credentials: 'include',
			});
			return response.json();
		}
	);

	useEffect(() => {
		if (username) {
			window[`localforage_store_${username.username}`] = localforage.createInstance({
				name: username.username
			});

			try {
				window[`localforage_store_${username.username}`].getItem(data["module"][0]["pk"]).then(local_storage => {

					for (const [key, value] of Object.entries(local_storage)) {

						setComponents(prev => {
							return {
								...prev,
								[key]: {quantity: value ? value["quantity"] : undefined}
							};
						});
					}
				});
			} catch {}
		}
	}, [username]);

	const {data, isLoading, error} = useQuery(
		['data'],
		async () => {
			const response = await fetch('data/');
			return await response.json();
		}
	);

	const handleAddComponent = (componentId, quantity) => {
		setComponents((prev) => {
			return {
				...prev,
				[componentId]: {quantity: parseInt(quantity)}
			}
		})

		try {
			window[`localforage_store_${username.username}`].getItem(data["module"][0]["pk"]).then((localStorageComponents) => {
				let mergedComponents = {...localStorageComponents};

				mergedComponents[componentId] = {quantity: quantity};

				window[`localforage_store_${username.username}`].setItem(data["module"][0]["pk"], mergedComponents)
			});
		} catch {}
	}

	const moduleList = (data && data["module_bom_list"])
		? data["module_bom_list"].map((item) => {
			const components = item["fields"]["components_options"];
			const inUserInventory = components.some((component) => component in data["user_inventory"]);

			return {...item, in_user_inv: inUserInventory};
		})
		: [];

	return (
		<div style={{position: "relative"}}>
			{userIsLoading || isLoading ? (
				<div className="spinner-border text-secondary my-4" role="status">
					<span className="sr-only">Loading...</span>
				</div>
			) : userError || error ? (
				<div>Error: {(userError && userError.message) || (error && error.message)}</div>
			) : (
				<BOMListTable
					moduleList={moduleList}
					compLookup={data ? data["components_options_dict"] : {}}
					suppliersLookup={data ? data["suppliers"] : {}}
					userInventory={data ? data["user_inventory"] : null}
					components={components}
					handleAddComponent={handleAddComponent}
				/>
			)}
		</div>
	);
}

export default App;
