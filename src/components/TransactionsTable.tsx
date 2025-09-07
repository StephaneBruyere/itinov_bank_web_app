import React from "react";
import { Table } from "react-bootstrap";
import { Transaction } from "./types";

const TransactionsTable: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  return (
    <Table striped bordered hover size="sm" className="mt-2">
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Currency</th>
          <th>Performed By</th>
          <th>Balance After</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t) => (
          <tr key={t.id}>
            <td>{new Date(t.date).toLocaleString()}</td>
            <td>{t.type}</td>
            <td>{t.amount}</td>
            <td>{t.currency}</td>
            <td>{t.performedBy}</td>
            <td style={{ color: t.balanceAfter < 0 ? "red" : "green", fontWeight: t.balanceAfter < 0 ? "bold" : "normal" }}>
              {t.balanceAfter}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TransactionsTable;
