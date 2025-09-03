import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

type ActionType = "deposit" | "withdraw" | "transfer" | null;

interface Props {
  show: boolean;
  onHide: () => void;
  actionType: ActionType;
  amount: number;
  setAmount: (val: number) => void;
  toAccountId: number | null;
  setToAccountId: (val: number | null) => void;
  handleAction: () => void;
}

const AccountModal: React.FC<Props> = ({
  show,
  onHide,
  actionType,
  amount,
  setAmount,
  toAccountId,
  setToAccountId,
  handleAction,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {actionType === "deposit" && "Deposit money"}
          {actionType === "withdraw" && "Withdraw money"}
          {actionType === "transfer" && "Transfer money"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
          </Form.Group>
          {actionType === "transfer" && (
            <Form.Group className="mb-3">
              <Form.Label>Destination Account ID</Form.Label>
              <Form.Control
                type="number"
                value={toAccountId || ""}
                onChange={(e) => setToAccountId(parseInt(e.target.value, 10))}
              />
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleAction}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AccountModal;
