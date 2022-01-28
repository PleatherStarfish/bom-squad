import React from "react";
import DataTable from "react-data-table-component";
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import InnerTable from "./InnerTable";

const ExpandedComponent = ({data, ...props}) => {
    return (
        <InnerTable data={data} {...props} />
    )
};

const columns = [
    {
        name: 'Title',
        selector: row => row.title,
        sortable: true,
    },
    {
        name: 'Year',
        selector: row => row.year,
        sortable: true,
    },
];

const data = [
    {
        id: 1,
        title: 'Beetlejuice',
        year: '1988',
    },
    {
        id: 2,
        title: 'Ghostbusters',
        year: '1984',
    },
    {
        id: 3,
        title: 'Whatever',
        year: '1989',
    },
];

const BOMListTable = (props) => {
    return (
        <div className="module-table">
            <DataTable
                columns={columns}
                data={data}
                expandableRows
                expandableRowsComponent={ExpandedComponent}
                // noTableHead={!!data}
                // noHeader={!!data}
                {...props}
            />
        </div>
    );
};

export default BOMListTable;