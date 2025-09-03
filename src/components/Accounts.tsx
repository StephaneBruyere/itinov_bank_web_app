import React, { useEffect, useState, useCallback } from "react";
import keycloak from "../keycloak";
import { ToastContainer, Toast } from "react-bootstrap";
import AccountItem from "./AccountItem";
import AccountModal from "./AccountModal";

interface Transaction {
  id: number;
  date: string;
  amount: number;
  type: string;
  currency: string;
  performedBy: string;
  balanceAfter: number;
}

interface Account {
  id: number;
  number: string;
  balance: number;
  currency: string;
  transactions: Transaction[];
}

type ActionType = "deposit" | "withdraw" | "transfer" | null;

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [overdrawnAccounts, setOverdrawnAccounts] = useState<Account[]>([]);
  const [openAccountId, setOpenAccountId] = useState<number | null>(null);

  // Modale
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [currentAccountId, setCurrentAccountId] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [toAccountId, setToAccountId] = useState<number | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVariant, setToastVariant] = useState<"success" | "danger">("success");

  // --- Fetch accounts ---
  const fetchAccounts = useCallback(async () => {
    if (!keycloak.authenticated) return;
    try {
      const customerId: number = await fetch("/api/customer", {
        headers: { Authorization: `Bearer ${keycloak.token}` },
      }).then((res) => res.json());

      const accountsData: Account[] = await fetch(
        `/api/accounts/customer/${customerId}`,
        { headers: { Authorization: `Bearer ${keycloak.token}` } }
      ).then((res) => res.json());

      setAccounts(accountsData);
      setOverdrawnAccounts(accountsData.filter((acc) => acc.balance < 0));
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const toggleTransactions = (accountId: number) => {
    setOpenAccountId(openAccountId === accountId ? null : accountId);
  };

  const openModal = (type: ActionType, accountId: number) => {
    setActionType(type);
    setCurrentAccountId(accountId);
    setAmount(0);
    setToAccountId(null);
    setShowModal(true);
  };

  const handleAction = async () => {
    if (!currentAccountId || !actionType) return;
    try {
      let res: Response;
      if (actionType === "deposit") {
        res = await fetch(
          `/api/accounts/${currentAccountId}/deposit`,
          { 
            method: "POST",
            headers: {
              "Authorization": `Bearer ${keycloak.token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ amount })
          }
        );
      } else if (actionType === "withdraw") {
        res = await fetch(
          `/api/accounts/${currentAccountId}/withdraw`,
          { 
            method: "POST",
            headers: {
              "Authorization": `Bearer ${keycloak.token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ amount })
          }
        );
      } else {
        res = await fetch(
         `/api/accounts/${currentAccountId}/transfer`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${keycloak.token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ toAccountId, amount })
          }
        );
      }

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(errorMessage || `Action failed (${res.status})`);
      }

      setToastMessage(`${actionType} successful!`);
      setToastVariant("success");
      setShowModal(false);
      await fetchAccounts();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setToastMessage(err.message);
      } else {
        setToastMessage("Unknown error");
      }
      setToastVariant("danger");
    }
  };

  if (!keycloak.authenticated) return null;

  return (
    <div>
      <h3>Accounts</h3>

      {/* --- Alertes comptes débiteurs --- */}
      {overdrawnAccounts.length > 0 && (
        <div style={{ backgroundColor: "red", color: "white", padding: "10px", marginBottom: "1em" }}>
          {overdrawnAccounts.map((acc) => (
            <div key={acc.id}>
              ⚠️ Warning !!! Account #{acc.number} is overdrawn (Balance: {acc.balance})
            </div>
          ))}
        </div>
      )}

      {/* --- Liste des comptes --- */}
      {accounts.map((account, idx) => (
        <AccountItem
          key={account.id}
          account={account}
          idx={idx}
          isOpen={openAccountId === account.id}
          toggleTransactions={toggleTransactions}
          openModal={openModal}
        />
      ))}

      {/* --- Modale --- */}
      <AccountModal
        show={showModal}
        onHide={() => setShowModal(false)}
        actionType={actionType}
        amount={amount}
        setAmount={setAmount}
        toAccountId={toAccountId}
        setToAccountId={setToAccountId}
        handleAction={handleAction}
      />

      {/* --- Toasts --- */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          bg={toastVariant}
          onClose={() => setToastMessage(null)}
          show={toastMessage !== null}
          delay={12000}
          autohide
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default Accounts;
