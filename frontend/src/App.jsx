import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import MainLayout from "./components/layout/MainLayout.jsx";

import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Transactions from "./pages/transactions/Transactions.jsx";
import AddTransaction from "./pages/transactions/AddTransaction.jsx";
import Accounts from "./pages/accounts/Accounts.jsx";
import EditTransaction from "./pages/transactions/EditTransaction.jsx";
import Analytics from "./pages/analytics/Analytics.jsx";
import Budgets from "./pages/budgets/Budgets.jsx";
import SavingsGoals from "./pages/goals/SavingsGoals.jsx";
import Categories from "./pages/categories/Categories.jsx";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public Routes */}

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected Routes */}

        <Route element={<ProtectedRoute />}>

          <Route element={<MainLayout />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
  path="/transactions"
  element={<Transactions />}
/>

<Route
  path="/transactions/add"
  element={<AddTransaction />}
/>

<Route
    path="/transactions/edit/:id"
    element={<EditTransaction />}
  />


<Route
  path="/accounts"
  element={<Accounts />}
/>


<Route
  path="/analytics"
  element={<Analytics />}
/>

<Route
  path="/budgets"
  element={<Budgets />}
/>

<Route
  path="/savings-goals"
  element={<SavingsGoals />}
/>

<Route path="/categories" element={<Categories />} />

          </Route>

        </Route>

        {/* Unknown Route */}

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;