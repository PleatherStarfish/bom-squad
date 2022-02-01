import React from "react";
import {Table, Tbody, Td, Th, Thead, Tr} from "react-super-responsive-table";

const InnerTable = (props) => {

    const rows = props.data.components_options.map((item, index) => {
        const key = props.data.components_options[index];
        return (
            <Tr>
                <Td>{props.compLookup[key][0].fields["description"]}</Td>
            </Tr>
        )
    });

    return (
        <div style={{padding: "0 0 0 48px"}}>
            <Table className={"table table-success"} style={{paddingLeft: "48px"}}>
                <Thead>
                    <Tr>
                        <Th>Description</Th>
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