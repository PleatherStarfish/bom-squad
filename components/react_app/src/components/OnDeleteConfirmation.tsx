import React from "react";
// @ts-ignore
import { Button, Modal } from "react-bootstrap";

interface OnDeleteConfirmationTypes {
  confirmDeleteShow: boolean;
  handleConfirmDeleteModelClose: () => void;
  componentsAppState: any;
  deleteID: string;
  handleDeleteRow: (arg0: any) => void;
}

const OnDeleteConfirmation = ({
  confirmDeleteShow,
  handleConfirmDeleteModelClose,
  componentsAppState,
  deleteID,
  handleDeleteRow,
}: OnDeleteConfirmationTypes) => {
  return (
    <Modal
      show={confirmDeleteShow}
      onHide={handleConfirmDeleteModelClose}
      animation={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>Are you sure?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Do you really want to delete{" "}
        {componentsAppState[deleteID]["supplier_short_name"]}{" "}
        {componentsAppState[deleteID]["item_no"]}?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleConfirmDeleteModelClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            handleDeleteRow(deleteID);
            handleConfirmDeleteModelClose();
          }}
          style={{ color: "white" }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OnDeleteConfirmation;
