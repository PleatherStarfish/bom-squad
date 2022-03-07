import React, { useEffect, useState } from 'react';
import { Button, Offcanvas } from 'react-bootstrap'
// import BOMListTable from "./components/Table";

function App() {
    const [show, setShow] = useState(false);

    const [quantityState, setQuantityState] = useState(null);
    const [locationState, setLocationState] = useState(null);
    const [componentsData, setComponentsData] = useState(null);

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

    return (
        <>
            <Button id="components__offcanvas-button"
                    className={!show ? "btn btn-success px-3 components__offcanvas-button" : "btn btn-success px-3 components__offcanvas-button components__offcanvas-button--lifted"}
                    type="button"
                    style={{ zIndex: 9999 }}
                    onClick={handleClick}>
                Components [<span id="components-number">0</span>], Shopping [<span id="shopping-number">0</span>]
                <span className="components__offcanvas-svg">
                    <svg id="components__offcanvas-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                         fill="currentColor" className="bi bi-caret-up-fill components__offcanvas-arrow" viewBox="0 0 16 16">
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
                                <th scope="col">Supplier Item #</th>
                                <th scope="col">Price</th>
                                <th scope="col">Quantity to Add</th>
                                <th scope="col">Location</th>
                                <th scope="col"><span className="sr-only">Remove</span></th>
                            </tr>
                        </thead>
                        <tbody id="components__offcanvas-tbody">
                        </tbody>
                    </table>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default App;