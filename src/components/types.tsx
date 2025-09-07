export interface Transaction {
  id: number;
  date: string;
  amount: number;
  type: string;
  currency: string;
  performedBy: string;
  balanceAfter: number;
}

export interface Account {
  id: number;
  number: string;
  balance: number;
  currency: string;
  transactions?: Transaction[];   // undefined si pas chargé
  loadingTransactions?: boolean;
}