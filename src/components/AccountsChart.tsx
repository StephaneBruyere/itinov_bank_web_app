import React, { useEffect, useState } from "react";
import keycloak from "../keycloak";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts";

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

interface ChartDataPoint {
  date: string;
  [accountNumber: string]: number | string;
}

const AccountsChart: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    if (!keycloak.authenticated) return;

    const fetchAccounts = async () => {
      try {
        const customerId: number = await fetch("/api/customer", {
          headers: { Authorization: `Bearer ${keycloak.token}` },
        }).then((res) => res.json());

        const accountsData: Account[] = await fetch(
          `/api/accounts/customer/${customerId}`,
          {
            headers: { Authorization: `Bearer ${keycloak.token}` },
          }
        ).then((res) => res.json());

        setAccounts(accountsData);
        prepareChartData(accountsData);
      } catch (err) {
        console.error(err);
      }
    };

    const prepareChartData = (accounts: Account[]) => {
      const today = new Date();
      const last10Days: string[] = [];

      // Générer les 10 derniers jours
      for (let i = 10; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split("T")[0]; // YYYY-MM-DD
        last10Days.push(key);
      }

      // Préparer structure de données initiale
      const dataMap: Record<string, ChartDataPoint> = {};
      last10Days.forEach((day) => {
        dataMap[day] = { date: day };
      });

      accounts.forEach((account) => {
        // Trier transactions par date croissante
        const sortedTx = [...account.transactions].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        let balance = account.balance;

        // Recalculer solde initial (avant la période)
        sortedTx.forEach((tx) => {
          const txDate = tx.date.split("T")[0];
          if (new Date(txDate) > today) return; // ignore transactions futures
          balance = tx.balanceAfter; // dernière valeur connue
        });

        // Repartir la balance jour par jour
        last10Days.forEach((day) => {
          const dayTx = sortedTx.filter(
            (tx) => tx.date.split("T")[0] === day
          );
          if (dayTx.length > 0) {
            // prendre le solde après la dernière transaction du jour
            // Si pas de transaction, on conserve la balance précédente
            balance = dayTx[dayTx.length - 1].balanceAfter;
          }
          dataMap[day][account.number] = balance;
        });
      });

      setChartData(Object.values(dataMap));
    };

    fetchAccounts();
  }, []);

  if (!keycloak.authenticated) return null;

  return (
    <div>
      <h3>Account balances over the last 10 days</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {/* Ligne rouge horizontale au niveau de 0 */}
          <ReferenceLine y={0} stroke="red" strokeWidth={2} />
          {accounts.map((acc, idx) => (
            <Line
              key={acc.number}
              type="monotone"
              dataKey={acc.number}
              stroke={["#8884d8", "#82ca9d", "#ff7300", "#ff0000", "#00aaff"][idx % 5]}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AccountsChart;
