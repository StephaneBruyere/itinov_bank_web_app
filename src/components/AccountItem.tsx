import React from "react";
import { Button, Collapse } from "react-bootstrap";
import { Spinner } from "react-bootstrap";
import TransactionsTable from "./TransactionsTable";
import { Account } from "./types";

interface Props {
  account: Account;
  idx: number;
  isOpen: boolean;
  toggleTransactions: (id: number) => void;
  openModal: (type: "deposit" | "withdraw" | "transfer", accountId: number) => void;
  loadingTransactions?: boolean;
}

const AccountItem: React.FC<Props> = ({ 
  account, isOpen, toggleTransactions, openModal, loadingTransactions = false }) => {
  return (
    <div className="mb-4">
      <div className="my-4 border-top"></div>

      <h5>
        Account #{account.id} ({account.number}) → Balance:{" "}
        <span style={{ color: account.balance < 0 ? "red" : "green", fontWeight: account.balance < 0 ? "bold" : "normal" }}>
          {account.balance} {account.currency}
        </span>
      </h5>

      <div className="mb-2 d-flex gap-2">
        <Button variant="warning" size="sm" onClick={() => toggleTransactions(account.id)}>
          {isOpen ? "Hide transactions" : "View transactions"}
        </Button>
        <Button variant="success" size="sm" onClick={() => openModal("deposit", account.id)}>Deposit</Button>
        <Button variant="danger" size="sm" onClick={() => openModal("withdraw", account.id)}>Withdraw</Button>
        <Button variant="secondary" size="sm" onClick={() => openModal("transfer", account.id)}>Transfer</Button>
      </div>

      <Collapse in={isOpen}>
        <div>
          {
          loadingTransactions ? (
            <div className="text-center my-3">
              <Spinner animation="border" />
              <div>Loading transactions...</div>
            </div>
          ) : account.transactions ? (
            <TransactionsTable transactions={account.transactions} />
          ) : null
          }
        </div>
      </Collapse>
    </div>
  );
};

export default AccountItem;
