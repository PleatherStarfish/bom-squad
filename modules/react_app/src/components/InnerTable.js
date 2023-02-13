import React from "react";

import {Table, Tbody, Td, Th, Thead, Tr} from "react-super-responsive-table";

const InnerTable = ({ data, compLookup, suppliersLookup, userInventory, components, handleAddComponent }) => {

  const rows = data.components_options.map((key, index) => {
    const supplierKey = parseInt(compLookup[key][0].fields["supplier"]);
    const supplier = suppliersLookup[supplierKey];
    const component = compLookup[key][0].fields;
    return (
      <Tr key={index}>
        <Td>{component["description"]}</Td>
        <Td>{component["voltage_rating"]}</Td>
        <Td>{component["tolerance"]}</Td>
        <Td>{supplier.short_name}</Td>
        <Td>
          <a href={component["link"]}>{component["supplier_item_no"]}</a>
        </Td>
        <Td>
          {component["price"] ? `$${component["price"]} USD` : null}
        </Td>
        <Td>Inventory</Td>
        <Td><input style={{maxWidth: "60px"}} value={components[key] ? components[key]["quantity"] : 0} defaultValue={0} type="number" min="0" onChange={(event) => handleAddComponent(key, event.target.valueAsNumber)} /></Td>
      </Tr>
    );
  });

  return (
    <div style={{ padding: "0 0 0 48px" }}>
      <Table className="table" style={{ paddingLeft: "48px" }}>
        <Thead style={{ backgroundColor: "#505050", color: "white" }}>
          <Tr>
            <Th>Description</Th>
            <Th>Voltage Rating</Th>
            <Th>Tolerance</Th>
            <Th>Supplier</Th>
            <Th>Supplier Item #</Th>
            <Th>Unit Price</Th>
            <Th>Inventory</Th>
            <Th><span className="sr-only">Add</span></Th>
          </Tr>
        </Thead>
        <Tbody style={{ backgroundColor: "#f0f0f0", borderTop: 0 }}>
          {rows}
        </Tbody>
      </Table>
    </div>
  );
};

export default InnerTable;