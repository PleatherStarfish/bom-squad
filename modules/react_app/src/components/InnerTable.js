import React from "react";
import {Table, Tbody, Td, Th, Thead, Tr} from "react-super-responsive-table";

const InnerTable = (props) => {

    console.log(props.suppliersLookup);

    const rows = props.data.components_options.map((item, index) => {
        const key = props.data.components_options[index];
        const supplierKey = parseInt(props.compLookup[key][0].fields["supplier"])
        console.log(props.suppliersLookup[supplierKey])
        return (
            <Tr>
                <Td>{props.compLookup[key][0].fields["description"]}</Td>
                <Td>{props.compLookup[key][0].fields["voltage_rating"]}</Td>
                <Td>{props.compLookup[key][0].fields["tolerance"]}</Td>
                <Td>{props.suppliersLookup[supplierKey].short_name}</Td>
                <Td><a href={props.compLookup[key][0].fields["link"]}>{props.compLookup[key][0].fields["supplier_item_no"]}</a></Td>
                <Td>{props.compLookup[key][0].fields["price"]}</Td>
                { props.userInventory && <Td></Td> }
                { props.userInventory && <Td></Td> }
            </Tr>
        )
    });

    return (
        <div style={{padding: "0 0 0 48px"}}>
            <Table className={"table"} style={{paddingLeft: "48px", backgroundColor: "#f8f9fa", border: "2px solid black"}}>
                <Thead style={{backgroundColor: "#dbddde"}}>
                    <Tr>
                        <Th>Description</Th>
                        <Th>Voltage Rating</Th>
                        <Th>Tolerance</Th>
                        <Th>Supplier</Th>
                        <Th>Supplier Item #</Th>
                        <Th>Unit Price</Th>
                        { props.userInventory && <Th>Inventory</Th> }
                        { props.userInventory && <Th><span className={"sr-only"}>Add</span></Th> }
                    </Tr>
                </Thead>
                <Tbody>
                    { rows }
                </Tbody>
            </Table>
        </div>
    )
};


export default InnerTable;