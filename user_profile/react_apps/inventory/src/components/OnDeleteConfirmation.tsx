import React from "react";
// @ts-ignore
import { Button, Modal } from "react-bootstrap";

interface OnDeleteConfirmationProps {
  confirmDeleteShow: boolean;
  handleConfirmDeleteModelClose: () => void;
  data: any;
  deleteID: string;
  handleDeleteRow: (deleteId: string) => void;
}

const ModalBody = ({ data, deleteID }: OnDeleteConfirmationProps) => {
  console.log(data)
  console.log(deleteID)
  const target = data.find(obj => obj.id === deleteID);
  return (
    <>
      {target ? `Do you really want to delete ${target.component}?` : null}
    </>
  );
};

const ModalFooter = ({ handleConfirmDeleteModelClose, handleDeleteRow, deleteID }: OnDeleteConfirmationProps) => {
  const handleDelete = () => {
    handleDeleteRow(deleteID);
    handleConfirmDeleteModelClose();
  };

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
    <Modal show={props.confirmDeleteShow} onHide={props.handleConfirmDeleteModelClose}>
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

