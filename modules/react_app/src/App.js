import React, { useEffect, useState } from 'react';
import BOMListTable from "./components/Table";

function App() {
    
    // A list of columns in the outer (BOM list) table
    const [moduleBOMList, setModuleBOMList] = useState({});

    // A list of columns in the outer (BOM list) table
    const [componentsOptionsDict, setComponentsOptionsDict] = useState({});

    // User inventory; only populated if user is logged in
    const [userInventory, setUserInventory] = useState({});

    useEffect(() => {
        fetch('data/')
            .then(res => res.json())
            .then((json) => {
                setModuleBOMList({...json["module_bom_list"]});
                setComponentsOptionsDict({...json["components_options_dict"]});
                setUserInventory({...json["inventory"]})
            })
            .catch((error) => {
              console.log(error)
            })
    }, []);

    return (
        <>
            <h2 className={"mb-4"}>Components</h2>
            <BOMListTable />
        </>
    );
};

export default App;