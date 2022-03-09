import React, { useEffect, useState } from 'react';
import { Button, Offcanvas } from 'react-bootstrap'
// import BOMListTable from "./components/Table";

function getTotalPrice(number, price, currencyOrPrice) {
    const quant = parseInt(number);
    const currency = price.charAt(0);
    const stringWithoutCurrency = price.substring(1);
    const floatPrice = parseFloat(stringWithoutCurrency);
    if (currencyOrPrice === "currency") {
        return currency
    } else if (currencyOrPrice === "price") {
        return (floatPrice * quant).toFixed(2)
    }
}

function App() {
    const [show, setShow] = useState(false);

    const [quantityState, setQuantityState] = useState(null);
    const [locationState, setLocationState] = useState(null);
    const [componentsData, setComponentsData] = useState(null);

    const [totalQuantityToAdd, setTotalQuantityToAdd] = useState(0);

    const [tableRows, setTableRows] = useState(null);

    const handleClick = () => setShow(!show);
    const handleClose = () => {
        setShow(false)
    };
    const handleShow = () => {
        setShow(true)
    };

    useEffect(() => {
        setQuantityState(JSON.parse(localStorage.getItem('quantity_state')));
        setLocationState(JSON.parse(localStorage.getItem('location_state')));
        setComponentsData(JSON.parse(localStorage.getItem('components_data_state')));
    }, [show]);

    useEffect(() => {
        if (quantityState) {
            const compListQuant = Object.values(quantityState).reduce((partialSum, a) => partialSum + a, 0);
            setTotalQuantityToAdd(compListQuant)
        }

    }, [quantityState]);

    useEffect(() => {
        let rows = null;
        if (quantityState && componentsData && quantityState) {
            rows = Object.keys(quantityState).map((value, index) => {
                return (
                    <tr>
                        <td>{componentsData[value].description}</td>
                        <td>{componentsData[value].supplier_short_name}</td>
                        <td>{componentsData[value].item_no}</td>
                        <td>{quantityState ? `${getTotalPrice(quantityState[value], componentsData[value].price, "currency")}${getTotalPrice(quantityState[value], componentsData[value].price, "price")}` : ""}</td>
                        <td>{quantityState ? quantityState[value] : ""}</td>
                        <td>{locationState ? locationState[value] : ""}</td>
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
    }, [quantityState, locationState, componentsData]);

    return (
        <>
            <Button id="components__offcanvas-button"
                    className={!show ? "btn btn-success px-3 components__offcanvas-button" : "btn btn-success px-3 components__offcanvas-button components__offcanvas-button--lifted"}
                    type="button"
                    style={{ zIndex: 9999 }}
                    onClick={handleClick}>
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
                        <thead className={"components__offcanvas-thead"}>
                            <tr>
                                <th scope="col">Description</th>
                                <th scope="col">Supplier</th>
                                <th scope="col">Supplier Item #</th>
                                <th scope="col">Total</th>
                                <th scope="col">Quantity to Add</th>
                                <th scope="col">Location</th>
                                <th scope="col"><span className="sr-only">Remove</span></th>
                            </tr>
                        </thead>
                        <tbody id="components__offcanvas-tbody">
                            { tableRows }
                        </tbody>
                    </table>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default App;