import React, { useEffect, useState } from 'react';
import BOMListTable from "./components/Table";

function App() {
    
    // A list of columns in the outer (BOM list) table
    const [moduleBOMList, setModuleBOMList] = useState(null);

    // A dictionary of components by 'id'
    const [compLookup, setCompLookup] = useState(null);

    // A dictionary of suppliers by 'id'
    const [suppliersLookup, setSuppliersLookup] = useState(null);

    // User inventory; only populated if user is logged in
    const [userInventory, setUserInventory] = useState(null);

    useEffect(() => console.log(userInventory), [userInventory]);

    useEffect(() => {
        fetch('data/')
            .then(res => res.json())
            .then((json) => {
                console.log(json);
                setModuleBOMList([...json["module_bom_list"]]);
                setCompLookup({...json["components_options_dict"]});
                setUserInventory(json["user_inventory"] || null);
                setSuppliersLookup({...json["suppliers"]});
            })
            .catch((error) => {
              console.log(error)
            })
    }, []);

    // For each BOM list item, check if user has any component in their inventory that works for this BOM item
    // and set a variable, "in_user_inventory" in the moduleBOMList dictionary
    useEffect(() => {
        if (moduleBOMList && userInventory && compLookup) {
            for (let i = 0; i < moduleBOMList.length; i++) {
                const components = moduleBOMList[i]["fields"]["components_options"];
                let in_user_inv = false;
                let inter_index = 0;

                // Iterate until a module is found in the user inventory (in sufficient quantity) or until
                // the end of the components array
                while ((!in_user_inv) && (inter_index < components.length)) {
                    if (components[inter_index] in userInventory) {
                        in_user_inv = true;
                        // setModuleBOMList((prev) => {
                        //
                        // })
                    }
                    inter_index += 1
                }
            }
        }
    }, [moduleBOMList, userInventory, compLookup]);

    return (
        <div style={{position: "relative"}}>
            {moduleBOMList ?
                <BOMListTable moduleList={moduleBOMList}
                              compLookup={compLookup}
                              suppliersLookup={suppliersLookup}
                              userInventory={userInventory}
                /> :
                <div className="spinner-border text-secondary my-4" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            }
        </div>
    );
};

export default App;