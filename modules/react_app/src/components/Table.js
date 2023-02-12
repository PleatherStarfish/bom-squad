import React, {useState, useEffect} from "react";
import DataTable from "react-data-table-component";
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import InnerTable from "./InnerTable";

const ExpandedComponent = ({data, compLookup, suppliersLookup, userInventory, components, handleAddComponent}) => {
	return (
		<InnerTable
			data={data}
			compLookup={compLookup}
			suppliersLookup={suppliersLookup}
			userInventory={userInventory}
			components={components}
			handleAddComponent={handleAddComponent}
		/>
	);
};

const BOMListTable = ({moduleList, compLookup, suppliersLookup, userInventory, components, handleAddComponent}) => {
	const [columns, setColumns] = useState([
		{
			name: "Description",
			selector: "description",
			sortable: true,
		},
		{
			name: "Type",
			selector: "type",
			sortable: true,
		},
		{
			name: "Quantity",
			selector: "quantity",
			sortable: true,
		},
	]);

	useEffect(() => {
		if (userInventory) {
			setColumns((prev) => [
				...prev,
				{
					name: "Sufficient # in Inventory",
					selector: "in_user_inventory",
					sortable: true,
				},
			]);
		}
	}, [userInventory]);

	const data = moduleList.map((obj) => ({...obj.fields}));

	return (
		<div className="module-table">
			<DataTable
				columns={columns}
				data={data}
				expandableRows
				expandableRowsComponent={ExpandedComponent}
				expandableRowsComponentProps={{
					compLookup,
					suppliersLookup,
					userInventory,
					components,
					handleAddComponent,
				}}
			/>
		</div>
	);
};

export default BOMListTable;