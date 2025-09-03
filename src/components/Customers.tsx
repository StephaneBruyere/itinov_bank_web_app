import React, { useEffect, useState } from "react";

interface Account {
  id: number;
  number: string;
  balance: number;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  accounts: Account[];
}

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetch("/api/public/customers")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setCustomers)
      .catch(console.error);
  }, []);

  return (
    <>
      <h3>Customers</h3>
      <ul>
        {customers.map(c => (
          <li key={c.id}>
            {c.id} - {c.name} ({c.email})
          </li>
        ))}
      </ul>
    </>
  );
};

export default Customers;
