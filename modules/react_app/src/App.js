import React, { useEffect, useState } from 'react';
import BOMListTable from "./components/Table";

function App() {
    
    // A list of columns in the outer (BOM list) table
    const [moduleBOMList, setModuleBOMList] = useState(null);

    // A list of columns in the outer (BOM list) table
    const [componentsOptionsDict, setComponentsOptionsDict] = useState(null);

    // User inventory; only populated if user is logged in
    const [userInventory, setUserInventory] = useState(null);

    useEffect(() => console.log(componentsOptionsDict), [componentsOptionsDict]);

    useEffect(() => {
        fetch('data/')
            .then(res => res.json())
            .then((json) => {
                setModuleBOMList([...json["module_bom_list"]]);
                setComponentsOptionsDict({...json["components_options_dict"]});
                setUserInventory([...json["inventory"]])
            })
            .catch((error) => {
              console.log(error)
            })
    }, []);

    return (
        <>
            <h2 className={"mb-4"}>Components</h2>
            {moduleBOMList && <BOMListTable moduleList={moduleBOMList} compLookup={componentsOptionsDict} />}
        </>
    );
};

export default App;