import React, { useEffect, useState, useRef } from 'react';
import { Button, Offcanvas, Form } from 'react-bootstrap';


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

function App() {

    // Show hide state of tab
    const [show, setShow] = useState(false);

    // Main data from browser state
    const [componentsData, setComponentsData] = useState(null);

    // Number displayed in tab
    const [totalQuantityToAdd, setTotalQuantityToAdd] = useState(0);

    // LSX for table rows
    const [tableRows, setTableRows] = useState(null);

    const [componentsChecked, setComponentsChecked] = useState(new Set([]));
    const [shoppingChecked, setShoppingChecked] = useState(new Set([]));

    const [allCSwitchesOn, setAllCSwitchesOn] = useState(false);
    const [allSSwitchesOn, setAllSSwitchesOn] = useState(false);

    useEffect(() => console.log(componentsChecked), [componentsChecked]);

    //
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

    const handleSwitchesChange = (e, type) => {
        const switchID = e.target.id.split('_')[1];
        const username = window.username;
        const compState = JSON.parse(localStorage.getItem(`${username}_comp_data`));

        if (compState[`${switchID}`][`add_to_${type}_list`] === "true") {
            compState[`${switchID}`][`add_to_${type}_list`] = "false";
        } else {
            compState[`${switchID}`][`add_to_${type}_list`] = "true";
        }

        localStorage.setItem(`${username}_comp_data`, JSON.stringify(compState));

        if (type === 'components') {
            switchHandler(componentsChecked, switchID, setComponentsChecked)
        } else {
            switchHandler(shoppingChecked, switchID, setShoppingChecked)
        }
    };

    const handleMetaSwitchChange = (e, type) => {
        if (type === 'components') {
            setAllCSwitchesOn(!allCSwitchesOn)
        } else {
            setAllSSwitchesOn(!allSSwitchesOn)
        }
    };

    useEffect(() => {
        if (componentsData) {
            if (allCSwitchesOn) {
                setComponentsChecked(new Set([...Object.keys(componentsData)]))
            } else {
                setComponentsChecked(new Set([]))
            }

            if (allSSwitchesOn) {
                setShoppingChecked(new Set([...Object.keys(componentsData)]))
            } else {
                setShoppingChecked(new Set([]))
            }
        }
    }, [allCSwitchesOn, allSSwitchesOn]);

    useEffect(() => {
        let rows = null;
        if (componentsData) {
            rows = Object.keys(componentsData).map((value, index) => {
                return (
                    <tr>
                        <td>{componentsData[value].description}</td>
                        <td>{componentsData[value].supplier_short_name}</td>
                        <td>{componentsData[value].item_no}</td>
                        <td>{componentsData[value].quantity}</td>
                        <td style={{visibility: "hidden"}}></td>
                        <td style={{fontSize: "16px"}}>
                            <Form>
                                <Form.Check
                                    type="switch"
                                    id={`contentSwitch_${value}`}
                                    checked={componentsChecked.has(value)}
                                    onChange={(e) => handleSwitchesChange(e, 'components')}
                                />
                            </Form>
                        </td>
                        <td style={{fontSize: "16px"}}>
                            <Form>
                                <Form.Check
                                    type="switch"
                                    id={`shoppingSwitch_${value}`}
                                    checked={shoppingChecked.has(value)}
                                    onChange={(e) => handleSwitchesChange(e, 'shopping')}
                                />
                            </Form>
                        </td>
                        <td><Button className="components__offcanvas-remove-btn" variant="outline-danger" size="sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-trash3" viewBox="0 0 16 16">
                                    <path
                                        d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                </svg>
                            </Button>
                        </td>
                    </tr>
                )
            });
            setTableRows(rows)
        }
    }, [componentsData, componentsChecked, shoppingChecked]);

    return (
        <>
            <Button id="components__offcanvas-button"
                    className={!show ? "btn btn-success px-3 components__offcanvas-button" : "btn btn-success px-3 components__offcanvas-button components__offcanvas-button--lifted"}
                    type="button"
                    style={{ zIndex: 9999}}
                    onClick={handleOffcanvasButtonClick}>
                Components to Add [<span id="components-quantity-tab-number">{ totalQuantityToAdd || 0 }</span>]
                <span className="components__offcanvas-svg">
                    <svg id="components__offcanvas-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                         fill="currentColor" className={!show ? "bi bi-caret-up-fill components__offcanvas-arrow" : "bi bi-caret-up-fill components__offcanvas-arrow--flipped"} viewBox="0 0 16 16">
                        <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                    </svg>
                </span>
            </Button>

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
                                <th scope="col" style={{visibility: "hidden"}}>Location</th>
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