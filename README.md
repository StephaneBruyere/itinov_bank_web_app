# Itinov Bank Web App

This is a React-based web application for managing bank accounts, visualizing account balances, and viewing transaction history. The app uses Vite for fast development, TypeScript for type safety, and integrates with a backend API for customer and account data. Authentication is handled via Keycloak.

## Features

- **User Authentication:** Secure login using Keycloak.
- **Account Overview:** View all your bank accounts and their balances.
- **Transaction History:** See detailed transaction lists for each account.
- **Interactive Charts:** Visualize account balances over the last 10 days using dynamic line charts (powered by [Recharts](https://recharts.org/)).
- **Responsive Design:** Works well on desktop and mobile devices.

## Project Structure

```
itinov-bank-front/
├── src/
│   ├── components/
│   │   ├── AccountItem.tsx
│   │   ├── AccountModal.tsx
│   │   ├── Accounts.tsx
│   │   ├── AccountsChart.tsx
│   │   ├── Customers.tsx
│   │   └── TransactionsTable.tsx
│   ├── App.tsx
│   ├── App.test.tsx
│   └── keycloak.ts
├── public/
├── index.html
├── package.json
└── vite.config.ts
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/StephaneBruyere/itinov_bank_web_app.git
   cd itinov-bank-web-app
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up Java / Spring backend and Keycloak server:**
   - backend & Keycloak server config are available from https://github.com/StephaneBruyere/itinov_bank_app.git project

4. **Start the development server:**
   ```sh
   npm run dev
   ```

5. **Open the app:**
   - Visit [http://localhost:5173](http://localhost:5173) in your browser.

## Running Tests

This project uses [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for unit testing.

- **Run all tests:**
  ```sh
  npx vitest run
  ```

- **Run tests in watch mode:**
  ```sh
  npx vitest --watch
  ```

## Technologies Used

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Recharts](https://recharts.org/)
- [Keycloak](https://www.keycloak.org/)
- [Vitest](https://vitest.dev/)

## API Endpoints

- GET /api/customer
Returns the authenticated customer's ID.

- GET /api/accounts/customer/:customerId
Returns all accounts for the given customer.

- GET /api/public/customers
Returns a list of all customers (public endpoint).

- POST /api/accounts/:accountId/deposit?amount={amount}&performedBy={username}
Deposits the specified amount into the given account.

- POST /api/accounts/:accountId/withdraw?amount={amount}&performedBy={username}
Withdraws the specified amount from the given account.

- POST /api/accounts/transfer?fromAccountId={id}&toAccountId={id}&amount={amount}&performedBy={username}
Transfers the specified amount from one account to another.
