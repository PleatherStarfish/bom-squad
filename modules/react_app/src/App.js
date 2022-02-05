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

    useEffect(() => console.log(suppliersLookup), [suppliersLookup]);

    useEffect(() => {
        fetch('data/')
            .then(res => res.json())
            .then((json) => {
                console.log(json)
                setModuleBOMList([...json["module_bom_list"]]);
                setCompLookup({...json["components_options_dict"]});
                setUserInventory(json["inventory"] || null);
                setSuppliersLookup({...json["suppliers"]});
            })
            .catch((error) => {
              console.log(error)
            })
    }, []);

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