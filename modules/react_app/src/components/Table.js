import React from "react";
import DataTable, { expandableRowsComponentProps } from "react-data-table-component";
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import InnerTable from "./InnerTable";

const ExpandedComponent = ({data, ...props}) => {
    return (
        // For each item in data
        <InnerTable data={data} compLookup={props.compLookup} suppliersLookup={props.suppliersLookup} />
    )
};

const columns = [
    {
        name: 'Description',
        selector: row => row.description,
        sortable: true,
    },
    {
        name: 'Type',
        selector: row => row.type,
        sortable: true,
    },
    {
        name: 'Quantity',
        selector: row => row.quantity,
        sortable: true,
    },
];

const BOMListTable = (props) => {

    const data = props.moduleList.map((obj) => {
        return Object.assign({}, obj, obj.fields);
    });

    return (
        <div className="module-table">
            <DataTable
                columns={columns}
                data={data}
                expandableRows
                expandableRowsComponent={ExpandedComponent}
                // noTableHead={!!data}
                // noHeader={!!data}
                expandableRowsComponentProps={{"compLookup": props.compLookup, "suppliersLookup": props.suppliersLookup}}
            />
        </div>
    );
};

export default BOMListTable;