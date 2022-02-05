import React, { useState, useEffect } from "react";
import DataTable, { expandableRowsComponentProps } from "react-data-table-component";
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import InnerTable from "./InnerTable";
import {Th} from "react-super-responsive-table";

const ExpandedComponent = ({data, ...props}) => {
    return (
        // For each item in data
        <InnerTable data={data}
                    compLookup={props.compLookup}
                    suppliersLookup={props.suppliersLookup}
                    userInventory={props.userInventory}
        />
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
    }
];


const BOMListTable = (props) => {

    const [columns, setColumns] = useState([
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
        }
    ]);

    const data = props.moduleList.map((obj) => {
        return Object.assign({}, obj, obj.fields);
    });

    useEffect(() => {
        if (props.userInventory) {
            setColumns((prev) => [...prev, {name: 'Sufficient # in Inventory', sortable: true}])
        }
    }, [props.userInventory]);

    console.log(columns)

    return (
        <div className="module-table">
            <DataTable
                columns={columns}
                data={data}
                expandableRows
                expandableRowsComponent={ExpandedComponent}
                // noTableHead={!!data}
                // noHeader={!!data}
                expandableRowsComponentProps={{
                    "compLookup": props.compLookup,
                    "suppliersLookup": props.suppliersLookup,
                    "userInventory": props.userInventory
                }}
            />
        </div>
    );
};

export default BOMListTable;