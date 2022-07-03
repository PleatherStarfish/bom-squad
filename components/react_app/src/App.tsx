// @ts-ignore
import React, { useEffect, useState, useMemo, useRef } from 'react';
// @ts-ignore
import { Button, Offcanvas, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Row from './components/Row'
import OnDeleteConfirmation from './components/OnDeleteConfirmation';
// @ts-ignore
import Cookies from 'js-cookie'

declare global {
    interface Window { username: string; }
}

interface CData {
  [value: number]: {
      prince: string,
      item_url: string,
      description: string,
      item_no: string,
      quantity: number,
      supplier_short_name: string,
      add_to_components_list: "true" | "false",
      add_to_shopping_list: "true" | "false",
      location: string}
}

function getTotalPrice(number: string, price: string) {
    const quant = parseInt(number);
    const currency = price.charAt(0);
    const stringWithoutCurrency = price.substring(1);
    const floatPrice = parseFloat(stringWithoutCurrency);
    return `${currency}${(floatPrice * quant).toFixed(2)}`
}

const switchHandler = (array: Set<any>, value: any, setter: { (value: React.SetStateAction<Set<any>>): void; (value: React.SetStateAction<Set<any>>): void; (arg0: { (prev: any): Set<any>; (prev: any): Set<any>; }): void; }) => {
    if (array.has(value)) {
        setter(prev => new Set([...prev].filter(x => x !== value)))
    } else {
        setter((prev) => new Set([...prev, value]))
    }
};

const getID = (e: { target: { id: string; }; }) => e.target.id.split('_')[1];

function App() {

    // Show hide state of tab
    const [show, setShow] = useState(false);

    const [extended, setExtended] = useState(false);

    // Main data from browser state
    const [componentsData, setComponentsData] = useState<CData | boolean>(false);

    // Number displayed in tab
    const [totalQuantityToAdd, setTotalQuantityToAdd] = useState(0);

    // LSX for table rows
    const [tableRows, setTableRows] = useState(null);

    // An array of IDs representing the on/off state of the switches (if it's in the array it's "on")
    const [componentsChecked, setComponentsChecked] = useState(new Set([]));
    const [shoppingChecked, setShoppingChecked] = useState(new Set([]));

     // A boolean representing the state of the two "meta" switches at the top of the columns
    const [allCSwitchesOn, setAllCSwitchesOn] = useState(false);
    const [allSSwitchesOn, setAllSSwitchesOn] = useState(false);

    const [confirmDeleteShow, setConfirmDeleteShow] = useState(false);
    const [deleteID, setDeleteID] = useState(null);

    // {"location": [], "remainder": ""}
    const [location, setLocation ] = useState({});

    let addToUserListsEnabled: React.MutableRefObject<boolean> = useRef(false);

    const handleConfirmDeleteModelClose = () => setConfirmDeleteShow(false);

    const handleExtended = () => setExtended(!extended);

    // Handle a click on the main button that expands the offcanvas div
    const handleOffcanvasButtonClick = () => {
        const username = window.username;
        const compState = JSON.parse(localStorage.getItem(`${username}_comp_data`));
        setComponentsData(compState["components"]);

        setAllCSwitchesOn(compState["metadata"]["allCSwitchesOn"]);
        setAllSSwitchesOn(compState["metadata"]["allSSwitchesOn"]);

        setShow(!show);
    };

    // Open popup to confirm delete
    const handleConfirmDeleteModelShow = (e) => {
        setConfirmDeleteShow(true);
        setDeleteID(e);
    };

    // Handle click on update button
    const update = () => {
        const username = window.username;
        const compState = JSON.parse(localStorage.getItem(`${username}_comp_data`));
        setComponentsData(compState["components"]);
    };

    // Handle click on Add Selection to List button
    const addSelectionToList = () => {
        const csrftoken = Cookies.get("csrftoken");

        if (typeof componentsData === 'object') {
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'X-CSRFToken': csrftoken},
                body: JSON.stringify({...componentsData})
            };
            fetch('/users/add_components_to_shopping/', requestOptions)
                .then(response => response.json())
                .catch(function (error) {
                    console.log(error);
                });
            fetch('/users/add_components_to_inventory/', requestOptions)
                .then(response => response.json())
                .catch(function (error) {
                    console.log(error);
                });
        }
    };

    // Handler called when offcanvas closes
    const handleClose = () => {
        setShow(false)
    };

    // Handler called when offcanvas opens
    const handleShow = () => {
        setShow(true)
    };

    // Update local storage with the state of a single row switch
    const setLocalStorageSwitch = (compID: string, list_type: any, username: string) => {
        const localStorageState = JSON.parse(localStorage.getItem(`${username}_comp_data`));

        if (localStorageState["components"][compID][`add_to_${list_type}_list`] === "true") {
            localStorageState["components"][compID][`add_to_${list_type}_list`] = "false";
        } else {
            localStorageState["components"][compID][`add_to_${list_type}_list`] = "true";
        }
        localStorage.setItem(`${username}_comp_data`, JSON.stringify(localStorageState));
    };

    // Enforce an "all-on" or "all-off" switch state in local storage
    const setLocalStorageSwitchOnOff = (compID: string, list_type: string, username: string, on: boolean) => {
        const localStorageState = JSON.parse(localStorage.getItem(`${username}_comp_data`));

        if (on) {
            localStorageState["components"][compID][`add_to_${list_type}_list`] = "true"
        } else {
            localStorageState["components"][compID][`add_to_${list_type}_list`] = "false"
        }
        localStorage.setItem(`${username}_comp_data`, JSON.stringify(localStorageState));
    };

    // Update hook with the state of a single row switch
    const setStateFromSwitch = (compID: string, list_type: string) => {
        if (list_type === 'components') {
            switchHandler(componentsChecked, compID, setComponentsChecked)
        }
        if (list_type === 'shopping') {
            switchHandler(shoppingChecked, compID, setShoppingChecked)
        }
    };

    // Handle a click on any of the switches for the data rows
    const handleSwitchesChange = (e: { target: { id: string; }; }, type: string) => {
        const switchID = getID(e);

        setLocalStorageSwitch(switchID, type, window.username);
        setStateFromSwitch(switchID, type)
    };

    // Handle any click on the "meta" switches at the top of the switch columns
    const handleMetaSwitchChange = (e: object, type: string) => {
        if (type === 'components') {
            setAllCSwitchesOn(!allCSwitchesOn);
        } else {
            setAllSSwitchesOn(!allSSwitchesOn)
        }
    };

    const handleDeleteRow = (e: string) => {
        const id: number = parseInt(e);
        // @ts-ignore
        const {[id]: _removedComponent, ...newComponentsData} = componentsData;

        setComponentsData(newComponentsData);
        // @ts-ignore
        setComponentsChecked(prev => new Set([...prev].filter(x => x !== `${id}`)));
        // @ts-ignore
        setShoppingChecked(prev => new Set([...prev].filter(x => x !== `${id}`)));

        // Get local storage
        const localStorageState = JSON.parse(localStorage.getItem(`${window.username}_comp_data`));

        const localStorageStateComponent = localStorageState["components"];
        const localStorageStateMetadata = localStorageState["metadata"];

        // Remove ID item from "components" object
        const {[id]: _removedLocalStateComponent, ...newLocalStorageState} = localStorageStateComponent;

        // Spread both the "components" object and the "metadata" object into new localStorage
        localStorage.setItem(`${window.username}_comp_data`, JSON.stringify({
                ...{["components"]: newLocalStorageState}, ...{["metadata"]: localStorageStateMetadata}
            })
        );
    };

    const handleQuantityChange = (e: { target: {id: string, value: string}; }) => {
        const id = getID(e);
        const value = e.target.value;

        const localStorageState = JSON.parse(localStorage.getItem(`${window.username}_comp_data`));
        localStorageState["components"][id]["quantity"] = parseInt(value);
        localStorage.setItem(`${window.username}_comp_data`, JSON.stringify(localStorageState));

        const updatedLocalStorageState = localStorage.getItem(`${window.username}_comp_data`);
        setComponentsData(JSON.parse(updatedLocalStorageState)["components"]);
    };

    const handleLocationChange = (e: { target: any; }) => {
        const id = getID(e);
        const value = e.target.value;

        if (value === ",") {
            return;
        }

        if (value.includes(",")) {

            // If last charecter in string is a comma...
            if (value.slice(-1) === ",") {
                const newLocations = value.split(",");
                const newLocationsFiltered = newLocations.filter(function (el: string) { return el !== ""; });
                // @ts-ignore
                const newLocationArray = [...location[id]["location"],...newLocationsFiltered];
                setLocation((prev) => {
                    return {...prev, [id]: {"location": newLocationArray, "remainder": ""}
                }});
            } else {
                const newLocations = value.split(",");
                // @ts-ignore
                const newLocationArray = [...location[id]["location"],...newLocations];
                const newLocationArrayFiltered = newLocationArray.filter(function (el) { return el !== ""; });
                setLocation((prev) => {
                    return {...prev, [id]: {"location": newLocationArrayFiltered, "remainder": ""}
                }});
            }
        } else {
            setLocation((prev) => {
                // @ts-ignore
                return {...prev, [id]: {"location": prev[id] ? prev[id]["location"] : [], "remainder": value}}
            })
        }
    };

    const handleLocationBubbleDelete = (e: { target: { id: string; }; }) => {
        const row_id = e.target.id.split('_')[1];
        const bubble_id = e.target.id.split('_')[2];

        // @ts-ignore
        let newLocationArray = location[row_id]["location"];
        newLocationArray.splice(bubble_id, 1);
        setLocation((prev) => {
            return {...prev, [row_id]: {"location": newLocationArray, "remainder": ""}}
        });
    };

    // When "show" changes, get the switch state from LocalState
    useEffect(() => {
        const localStorageState = JSON.parse(localStorage.getItem(`${window.username}_comp_data`));

        // If local storage is loaded...
        if (localStorageState) {

            // Get switch state from local storage
            const newComponentsSwitchState: string[] = [];
            const newShoppingSwitchState: string[] = [];
            Object.keys(localStorageState["components"]).forEach((item) => {
                if ('add_to_components_list' in localStorageState["components"][item] && localStorageState["components"][item]['add_to_components_list'] === "true") {
                    newComponentsSwitchState.push(item)
                }
                if ('add_to_shopping_list' in localStorageState["components"][item] && localStorageState["components"][item]['add_to_shopping_list'] === "true") {
                    newShoppingSwitchState.push(item)
                }
            });
            // @ts-ignore
            setComponentsChecked((prev) => new Set([...prev, ...newComponentsSwitchState]));
            // @ts-ignore
            setShoppingChecked((prev) => new Set([...prev, ...newShoppingSwitchState]));
        }

    }, [show]);

    useEffect(() => {
        if (componentsData) {
            const localStorageState = JSON.parse(localStorage.getItem(`${window.username}_comp_data`));
            localStorageState["metadata"]["allCSwitchesOn"] = allCSwitchesOn;
            localStorage.setItem(`${window.username}_comp_data`, JSON.stringify(localStorageState));
        }
    }, [allCSwitchesOn]);

    useEffect(() => {
        if (componentsData) {
            const localStorageState = JSON.parse(localStorage.getItem(`${window.username}_comp_data`));
            localStorageState["metadata"]["allSSwitchesOn"] = allSSwitchesOn;
            localStorage.setItem(`${window.username}_comp_data`, JSON.stringify(localStorageState));
        }
    }, [allSSwitchesOn]);

    useEffect(() => {
        if (Object.keys(location).length > 0) {
            for (let id of Object.keys(location)) {
                const localStorageState = JSON.parse(localStorage.getItem(`${window.username}_comp_data`));
                // @ts-ignore
                localStorageState["components"][id]["location"] = location[id];

                const localStorageStateComponent = localStorageState["components"];
                const localStorageStateMetadata = localStorageState["metadata"];

                localStorage.setItem(`${window.username}_comp_data`, JSON.stringify(localStorageState));
                setComponentsData(JSON.parse(localStorage.getItem(`${window.username}_comp_data`))["components"]);
            }
        }
    }, [location]);

    // If the "allCSwitchesOn" state is true, switch all switches to the "on" state, else "off"
    useEffect(() => {
        if (componentsData) {

            if (allCSwitchesOn) {
                Object.keys(componentsData).forEach((value, index) => {
                    setLocalStorageSwitchOnOff(value, 'components', window.username, true);
                });
                setComponentsChecked(new Set([...Object.keys(componentsData)]))
            } else {
                Object.keys(componentsData).forEach((value, index) => {
                    setLocalStorageSwitchOnOff(value, 'components', window.username, false);
                });
                setComponentsChecked(new Set([]))
            }
        }
    }, [allCSwitchesOn]);

    // If the "allSSwitchesOn" state is true, switch all switches to the "on" state, else "off"
    useEffect(() => {
        if (componentsData) {

            if (allSSwitchesOn) {
                Object.keys(componentsData).forEach((value, index) => {
                    setLocalStorageSwitchOnOff(value, 'shopping', window.username, true)
                });
                setShoppingChecked(new Set([...Object.keys(componentsData)]))
            } else {
                Object.keys(componentsData).forEach((value, index) => {
                    setLocalStorageSwitchOnOff(value, 'shopping', window.username, false);
                });
                setShoppingChecked(new Set([]))
            }
        }
    }, [allSSwitchesOn]);

    useEffect(() => {
        // @ts-ignore
        const bothLists = [...componentsChecked, ...shoppingChecked];
        if (bothLists.length > 0) {
            addToUserListsEnabled.current = true
        }
    }, [componentsChecked, shoppingChecked]);

    useMemo(() => {
        let rows = null;
        if (componentsData) {
            rows = Object.keys(componentsData).map((value, index) => {
                return (
                    <Row key={`${value}_${index}`}
                         componentsData={componentsData}
                         valueString={value}
                         componentsChecked={componentsChecked}
                         shoppingChecked={shoppingChecked}
                         handleSwitchesChange={handleSwitchesChange}
                         handleDeleteRow={handleConfirmDeleteModelShow}
                         handleQuantityChange={handleQuantityChange}
                         location={location}
                         handleLocationChange={handleLocationChange}
                         handleLocationBubbleDelete={handleLocationBubbleDelete}
                    />
                )
            });
            setTableRows(rows)
        }
    }, [componentsData, componentsChecked, shoppingChecked, location]);

    return (
        <>
            <Button id="components__offcanvas-button"
                    className={!show ? "btn btn-success px-3 components__offcanvas-button" : ((extended) ? "btn btn-success px-3 components__offcanvas-button components__offcanvas-button--full" : "btn btn-success px-3 components__offcanvas-button components__offcanvas-button--lifted")}
                    type="button"
                    style={{ zIndex: 1045}}
                    onClick={handleOffcanvasButtonClick}>
                Components to Add [<span id="components-quantity-tab-number">{ totalQuantityToAdd || 0 }</span>]
                <span className="components__offcanvas-svg">
                    <svg id="components__offcanvas-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                         fill="currentColor" className={!show ? "bi bi-caret-up-fill components__offcanvas-arrow" : "bi bi-caret-up-fill components__offcanvas-arrow--flipped"} viewBox="0 0 16 16">
                        <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                    </svg>
                </span>
            </Button>

            {
                componentsData &&
                deleteID &&
                <OnDeleteConfirmation componentsData={componentsData} deleteID={deleteID} confirmDeleteShow={confirmDeleteShow} handleDeleteRow={handleDeleteRow} handleConfirmDeleteModelClose={handleConfirmDeleteModelClose} />}

            <Offcanvas id="components__offcanvas-container"
                       className={!show ? "offcanvas offcanvas-bottom components__offcanvas-container" : ((extended) ? "offcanvas offcanvas-bottom components__offcanvas-container components__offcanvas-container--full" : "offcanvas offcanvas-bottom components__offcanvas-container components__offcanvas-container--lifted")}
                       aria-labelledby="offcanvasBottomLabel"
                       show={show}
                       onHide={handleClose}
                       placement={"bottom"}>
                <Offcanvas.Body>
                    <OverlayTrigger
                        placement={'top'}
                        overlay={
                            <Tooltip>Expand</Tooltip>
                        }
                    >
                        <Button variant="outline-primary" className={"offcanvas__buttons"} onClick={handleExtended} style={{padding: ".375rem .575rem", marginRight: "1%"}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                 className="bi bi-arrow-bar-up" viewBox="0 0 15 15" style={(extended) ? {transform: "scale(-1, -1)"} : {transform: "scale(-1, 1)"}}>
                                <path fillRule="evenodd"
                                      d="M8 10a.5.5 0 0 0 .5-.5V3.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 3.707V9.5a.5.5 0 0 0 .5.5zm-7 2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z"/>
                            </svg>
                        </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement={'top'}
                        overlay={
                            <Tooltip>Update</Tooltip>
                        }
                    >
                        <Button variant="outline-primary" className={"offcanvas__buttons"} onClick={update} style={{padding: ".375rem .575rem", marginRight: "1%"}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                 className="bi bi-arrow-clockwise" viewBox="0 0 15 15" style={{transform: "scale(-1, -1)"}}>
                                <path fillRule="evenodd"
                                      d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                                <path
                                    d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                            </svg>
                        </Button>
                    </OverlayTrigger>
                    {(componentsChecked.size || shoppingChecked.size) ?
                    <Button variant="outline-primary" className={"offcanvas__buttons"} onClick={addSelectionToList} style={{padding: ".375rem .575rem", border: "1px #528c69 solid", color: "white"}} active>Add Selection to List</Button>
                        :
                    <Button variant="outline-primary" className={"offcanvas__buttons"} style={{padding: ".375rem .575rem"}} disabled>Add Selection to List</Button>
                    }
                    <table id="components__offcanvas-table" className="table table-sm components__offcanvas-table">
                        <thead className={"components__offcanvas-thead"} style={{fontSize: "13px"}}>
                            <tr>
                                <th scope="col">Description</th>
                                <th scope="col">Supplier</th>
                                <th scope="col">Supplier Item #</th>
                                <th scope="col">Quantity to Add</th>
                                <th scope="col" style={componentsChecked.size ? {width: "12%"} : {display: "none"}}>Location</th>
                                <th scope="col">
                                    Add to Components
                                    <Form style={{fontSize: "16px"}}>
                                        <Form.Check
                                            type="switch"
                                            id="custom-switch"
                                            checked={allCSwitchesOn}
                                            onChange={(e: object) => handleMetaSwitchChange(e, 'components')}
                                        />
                                    </Form>
                                </th>
                                <th scope="col">
                                    Add to Shopping
                                    <Form style={{fontSize: "16px"}}>
                                        <Form.Check
                                            type="switch"
                                            id="custom-switch"
                                            checked={allSSwitchesOn}
                                            onChange={(e: object) => handleMetaSwitchChange(e, 'shopping')}
                                        />
                                    </Form>
                                </th>
                                <th scope="col"><span className="sr-only">Remove</span></th>
                            </tr>
                        </thead>
                        <tbody id="components__offcanvas-tbody" style={{fontSize: "13px"}}>
                            { tableRows }
                        </tbody>
                    </table>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default App;