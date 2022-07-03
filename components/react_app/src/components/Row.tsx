import React, {useEffect, useState} from 'react';
import CData from '../App'
// @ts-ignore
import { Button, CloseButton, Form } from 'react-bootstrap';

const Row = (props: { componentsData: any | false; valueString: string; componentsChecked: Set<string>; shoppingChecked: Set<string>; handleSwitchesChange: any; handleQuantityChange: any; location: any; handleLocationChange: any; handleLocationBubbleDelete: any; handleDeleteRow: (arg0: any) => any; }) => {
    const componentsData = props.componentsData;
    const value = props.valueString;
    const componentsChecked = props.componentsChecked;
    const shoppingChecked = props.shoppingChecked;
    const handleSwitchesChange = props.handleSwitchesChange;
    const handleQuantityChange = props.handleQuantityChange;
    const location = props.location;
    const handleLocationChange = props.handleLocationChange;
    const handleLocationBubbleDelete = props.handleLocationBubbleDelete;

    const [locationList, setLocationList] = useState(null);
    console.log("hello world 3");
    console.log(componentsData);

    useEffect(() => {
        if (value && location[value] && location[value]["location"]) {
            const arrayLength = location[value]["location"].length;

            const placeList = location[value]["location"].map((name: string, index: React.Key) => {

                let close = null;
                if (index !== arrayLength-1) {
                    close = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16"> <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/> </svg>
                }

                return (
                    <div key={index} style={{display: "inline-block", whiteSpace: "nowrap"}}>
                        <div style={{fontSize: "10px", display: "inline-block", padding: "3px 6px", border: "1px solid black", borderRadius: ".8em", margin: "3px 0 0 0"}}>
                            <b>{ name }</b><CloseButton id={`deleteLocationButton_${value}_${index}`} style={{fontSize: "0.8em", marginLeft: "3px"}} onClick={(e: object) => handleLocationBubbleDelete(e)} />
                        </div>
                        { close }
                    </div>
                )
            });
            setLocationList(placeList)
        }
    }, [location]);

    return (
        <tr>
            <td>{componentsData[value].description}</td>
            <td>{componentsData[value].supplier_short_name}</td>
            <td><b><a href={componentsData[value].item_url}>{componentsData[value].item_no}</a></b></td>
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
            <td style={componentsChecked.size ? (componentsChecked.has(value) ? {verticalAlign: "middle", fontSize: "16px"} : {visibility: "hidden"}) : {display: "none"}}>
                <label className={"sr-only"} htmlFor={`offcanvasLocation_${value}`}>Location:</label>
                <input id={`offcanvasLocation_${value}`}
                       type="text"
                       name="location"
                       style={{maxWidth: "150px"}}
                       value={(value && location[value] && location[value]["remainder"]) ? location[value]["remainder"] : ""}
                       onChange={(e) => handleLocationChange(e)}
                       onPaste={(e) => handleLocationChange(e)} /><br/>
                { locationList }
            </td>
            <td className={"h-100"} style={{verticalAlign: "middle", fontSize: "16px"}}>
                <Form>
                    <Form.Check
                        type="switch"
                        id={`contentSwitch_${value}`}
                        checked={componentsChecked.has(value)}
                        onChange={(e: object) => handleSwitchesChange(e, 'components')}
                    />
                </Form>
            </td>
            <td className={"h-100"} style={{verticalAlign: "middle", fontSize: "16px"}}>
                <Form>
                    <Form.Check
                        type="switch"
                        id={`shoppingSwitch_${value}`}
                        checked={shoppingChecked.has(value)}
                        onChange={(e: object) => handleSwitchesChange(e, 'shopping')}
                    />
                </Form>
            </td>
            <td className={"h-100"} style={{verticalAlign: "middle"}}>
                <Button className="components__offcanvas-remove-btn"
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

};

export default Row;