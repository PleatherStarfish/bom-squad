import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Button, Offcanvas, Form, Modal } from 'react-bootstrap';
import Row from './components/Row'
import OnDeleteConfirmation from './components/OnDeleteConfirmation';


function getTotalPrice(number, price) {
    const quant = parseInt(number);
    const currency = price.charAt(0);
    const stringWithoutCurrency = price.substring(1);
    const floatPrice = parseFloat(stringWithoutCurrency);
    return `${currency}${(floatPrice * quant).toFixed(2)}`
}

const switchHandler = (array, value, setter) => {
    if (array.has(value)) {
        setter(prev => new Set([...prev].filter(x => x !== value)))
    } else {
        setter((prev) => new Set([...prev, value]))
    }
};

const getID = (e) => e.target.id.split('_')[1];

function App() {

    // Show hide state of tab
    const [show, setShow] = useState(false);

    // Main data from browser state
    const [componentsData, setComponentsData] = useState(null);

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

    const handleConfirmDeleteModelClose = () => setConfirmDeleteShow(false);

    // Open popup to confirm delete
    const handleConfirmDeleteModelShow = (e) => {
        setConfirmDeleteShow(true);
        setDeleteID(e);
    };

    // Handle a click on the main button that expands the offcanvas div
    const handleOffcanvasButtonClick = () => {
        const username = window.username;
        setComponentsData(JSON.parse(localStorage.getItem(`${username}_comp_data`)));
        setShow(!show)
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
    const setLocalStorageSwitch = (compID, list_type, username) => {
        const localStorageState = JSON.parse(localStorage.getItem(`${username}_comp_data`));

        if (localStorageState[`${compID}`][`add_to_${list_type}_list`] === "true") {
            localStorageState[`${compID}`][`add_to_${list_type}_list`] = "false";
        } else {
            localStorageState[`${compID}`][`add_to_${list_type}_list`] = "true";
        }
        localStorage.setItem(`${username}_comp_data`, JSON.stringify(localStorageState));
    };

    // Enforce an "all-on" or "all-off" switch state in local storage
    const setLocalStorageSwitchOnOff = (compID, list_type, username, on) => {
        const localStorageState = JSON.parse(localStorage.getItem(`${username}_comp_data`));

        if (on) {
            localStorageState[`${compID}`][`add_to_${list_type}_list`] = "true"
        } else {
            localStorageState[`${compID}`][`add_to_${list_type}_list`] = "false"
        }
        localStorage.setItem(`${username}_comp_data`, JSON.stringify(localStorageState));
    };

    // Update hook with the state of a single row switch
    const setStateFromSwitch = (compID, list_type) => {
        if (list_type === 'components') {
            switchHandler(componentsChecked, compID, setComponentsChecked)
        }
        if (list_type === 'shopping') {
            switchHandler(shoppingChecked, compID, setShoppingChecked)
        }
    };

    // Handle a click on any of the switches for the data rows
    const handleSwitchesChange = (e, type) => {
        const switchID = getID(e);

        setLocalStorageSwitch(switchID, type, window.username);
        setStateFromSwitch(switchID, type)
    };

    // Handle any click on the "meta" switches at the top of the switch columns
    const handleMetaSwitchChange = (e, type) => {
        if (type === 'components') {
            setAllCSwitchesOn(!allCSwitchesOn)
        } else {
            setAllSSwitchesOn(!allSSwitchesOn)
        }
    };

    const handleDeleteRow = (e) => {
        console.log(e)
        const id = parseInt(e);
        const {[id]: _removedComponent, ...newComponentsData} = componentsData;

        setComponentsData(newComponentsData);
        setComponentsChecked(prev => new Set([...prev].filter(x => x !== `${id}`)));
        setShoppingChecked(prev => new Set([...prev].filter(x => x !== `${id}`)));

        const localStorageState = JSON.parse(localStorage.getItem(`${window.username}_comp_data`));
        const {[id]: _removedLocalStateComponent, ...newLocalStorageState} = localStorageState;
        localStorage.setItem(`${window.username}_comp_data`, JSON.stringify(newLocalStorageState));
    };

    const handleQuantityChange = (e) => {
        const id = getID(e);
        const value = e.target.value;

        const localStorageState = JSON.parse(localStorage.getItem(`${window.username}_comp_data`));
        localStorageState[id]["quantity"] = parseInt(value);
        localStorage.setItem(`${window.username}_comp_data`, JSON.stringify(localStorageState));
        setComponentsData(JSON.parse(localStorage.getItem(`${window.username}_comp_data`)));
    };

    const handleLocationChange = (e) => {
        const id = getID(e);
        const value = e.target.value;

        if (value === ",") {
            return;
        }
        console.log("one", value);

        if (value.includes(",")) {
            console.log("two", value);

            // If last charecter in string is comma...
            if (value.slice(-1) === ",") {
                const newLocations = value.split(",");
                newLocations.pop();
                const newLocationArray = [...location[id]["location"],...newLocations];
                setLocation((prev) => {
                    return {...prev, [id]: {"location": newLocationArray, "remainder": ""}
                }});
            } else {
                const newLocations = value.split(",");
                const newLocationArray = [...location[id]["location"],...newLocations];
                setLocation((prev) => {
                    return {...prev, [id]: {"location": newLocationArray, "remainder": ""}
                }});
            }
        } else {
            setLocation((prev) => {
                return {...prev, [id]: {"location": prev[id] ? prev[id]["location"] : [], "remainder": value}}
            })
        }

        // const localStorageState = JSON.parse(localStorage.getItem(`${window.username}_comp_data`));
        // localStorageState[id]["location"] = value;
        // localStorage.setItem(`${window.username}_comp_data`, JSON.stringify(localStorageState));
        // setComponentsData(JSON.parse(localStorage.getItem(`${window.username}_comp_data`)));
    };

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
                    />
                )
            });
            setTableRows(rows)
        }
    }, [componentsData, componentsChecked, shoppingChecked, location]);

    return (
        <>
            <Button id="components__offcanvas-button"
                    className={!show ? "btn btn-success px-3 components__offcanvas-button" : "btn btn-success px-3 components__offcanvas-button components__offcanvas-button--lifted"}
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

            {componentsData && deleteID && componentsData[deleteID] && <OnDeleteConfirmation componentsData={componentsData} deleteID={deleteID} confirmDeleteShow={confirmDeleteShow} handleDeleteRow={handleDeleteRow} handleConfirmDeleteModelClose={handleConfirmDeleteModelClose} />}

            <Offcanvas id="components__offcanvas-container"
                       className={!show ? "offcanvas offcanvas-bottom components__offcanvas-container" : "offcanvas offcanvas-bottom components__offcanvas-container components__offcanvas-container--lifted"}
                       aria-labelledby="offcanvasBottomLabel"
                       show={show}
                       onHide={handleClose}
                       placement={"bottom"}>
                <Offcanvas.Body>
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
                                            onChange={(e) => handleMetaSwitchChange(e, 'components')}
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
                                            onChange={(e) => handleMetaSwitchChange(e, 'shopping')}
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