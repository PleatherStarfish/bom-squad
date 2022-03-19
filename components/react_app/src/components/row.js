import React, {useEffect, useState, useRef} from 'react';
import { Button, Offcanvas, Form } from 'react-bootstrap';


const Row = (props) => {
    const componentsData = props.componentsData;
    const value = props.valueString;
    const componentsChecked = props.componentsChecked;
    const shoppingChecked = props.shoppingChecked;
    const handleSwitchesChange = props.handleSwitchesChange;
    const handleQuantityChange = props.handleQuantityChange;

    return (
        <tr>
            <td>{componentsData[value].description}</td>
            <td>{componentsData[value].supplier_short_name}</td>
            <td>{componentsData[value].item_no}</td>
            <td className={"h-100"} style={{verticalAlign: "middle"}}>
                <label className={"sr-only"} htmlFor={`offcanvasQuantity_${value}`}>Quantity:</label>
                <input id={`offcanvasQuantity_${value}`}
                       type="number"
                       name="quantity"
                       min="1"
                       style={{maxWidth: "50px"}}
                       value={componentsData[value].quantity}
                       onChange={(e) => handleQuantityChange(e)} />
            </td>
            <td style={componentsChecked.size ? (componentsChecked.has(value) ? {verticalAlign: "middle", fontSize: "16px"} : {visibility: "hidden"}) : {display: "none"}}>x</td>
            <td className={"h-100"} style={{verticalAlign: "middle", fontSize: "16px"}}>
                <Form>
                    <Form.Check
                        type="switch"
                        id={`contentSwitch_${value}`}
                        checked={componentsChecked.has(value)}
                        onChange={(e) => handleSwitchesChange(e, 'components')}
                    />
                </Form>
            </td>
            <td className={"h-100"} style={{verticalAlign: "middle", fontSize: "16px"}}>
                <Form>
                    <Form.Check
                        type="switch"
                        id={`shoppingSwitch_${value}`}
                        checked={shoppingChecked.has(value)}
                        onChange={(e) => handleSwitchesChange(e, 'shopping')}
                    />
                </Form>
            </td>
            <td><Button className="components__offcanvas-remove-btn"
                        variant="outline-danger"
                        size="sm"
                        id={`rowDelete_${value}`}
                        onClick={() => props.handleDeleteRow(value)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                     className="bi bi-trash3" viewBox="0 0 16 16">
                    <path
                        d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                </svg>
            </Button>
            </td>
        </tr>
    )

}

export default Row;