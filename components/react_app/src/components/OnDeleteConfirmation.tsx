import React from 'react';
// @ts-ignore
import {Button, Modal} from 'react-bootstrap';

const OnDeleteConfirmation = (props: { confirmDeleteShow: boolean; handleConfirmDeleteModelClose: () => void; componentsData: any; deleteID: string; handleDeleteRow: (arg0: any) => void; }) => {
    return (
            <Modal show={props.confirmDeleteShow} onHide={props.handleConfirmDeleteModelClose} animation={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure?</Modal.Title>
                </Modal.Header>
                {/*<Modal.Body>Do you really want to*/}
                {/*    delete {props.componentsData[props.deleteID]["supplier_short_name"]} {props.componentsData[props.deleteID]["item_no"]}?</Modal.Body>*/}
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleConfirmDeleteModelClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => {
                        props.handleDeleteRow(props.deleteID);
                        props.handleConfirmDeleteModelClose();
                    }} style={{color: "white"}}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
    )
};


export default OnDeleteConfirmation;