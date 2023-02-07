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

interface ComponentsAppState {
  [key: string]: {
    supplier_short_name: string;
    item_no: string;
  }
}

interface OnDeleteConfirmationProps {
  confirmDeleteShow: boolean;
  handleConfirmDeleteModelClose: () => void;
  componentsAppState: ComponentsAppState;
  deleteID: string;
  handleDeleteRow: (deleteId: string) => void;
}

const ModalBody = ({ componentsAppState, deleteID }: OnDeleteConfirmationProps) => {
  return (
    <>
      Do you really want to delete{" "} {deleteID}
      {/*{componentsAppState[deleteID]["supplier_short_name"]}{" "}*/}
      {/*{componentsAppState[deleteID]["name"]}?*/}
    </>
  );
};

const ModalFooter = ({ handleConfirmDeleteModelClose, handleDeleteRow, deleteID }: OnDeleteConfirmationProps) => {

  const handleDelete = React.useCallback(() => {
    console.log(deleteID)
    handleDeleteRow(deleteID);
    handleConfirmDeleteModelClose();
  }, [handleDeleteRow, deleteID, handleConfirmDeleteModelClose]);

  return (
    <>
      <Button variant="secondary" onClick={handleConfirmDeleteModelClose}>
        Close
      </Button>
      <Button variant="primary" onClick={handleDelete} style={{ color: "white" }}>
        Delete
      </Button>
    </>
  );
};

const OnDeleteConfirmation = (props: OnDeleteConfirmationProps) => {
  return (
    <Modal
      show={props.confirmDeleteShow}
      onHide={props.handleConfirmDeleteModelClose}
      animation={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>Are you sure?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ModalBody {...props} />
      </Modal.Body>
      <Modal.Footer>
        <ModalFooter {...props} />
      </Modal.Footer>
    </Modal>
  );
};

export default OnDeleteConfirmation;
