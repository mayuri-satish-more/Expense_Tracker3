
# 💰 Expense Tracker — MERN Stack

A modern, full-stack **Expense Tracker** application built using the **MERN stack — MongoDB, Express.js, React.js, and Node.js**.

The application helps users manage their personal finances by tracking income and expenses, managing multiple accounts, setting budgets, creating savings goals, analyzing spending patterns, managing recurring transactions, and exporting transaction history as CSV.

---

## 🚀 Live Demo

**Frontend:**
[https://expense-tracker3-frontend.onrender.com/]

**Backend API:**
[https://expense-tracker3-backend.onrender.com/]

---

## 📂 GitHub Repository


https://github.com/mayuri-satish-more/Expense_Tracker3.git

---

# 📌 Project Overview

Expense Tracker is a full-stack personal finance management application designed to help users organize and monitor their financial activities from a single dashboard.

### Users can:

* Create an account and securely log in
* Track income and expenses
* Manage multiple financial accounts
* Set monthly and category-wise budgets
* Monitor budget usage
* Create and track savings goals
* Add recurring transactions
* Analyze financial activity using charts
* Search and filter transaction history
* Create custom categories
* Export filtered transactions as CSV
* View their overall financial summary

The application follows a **client-server architecture**, where the React frontend communicates with the Node.js/Express backend through REST APIs, while MongoDB is used for persistent data storage.

---

# ✨ Key Features

## 🔐 1. Authentication & Authorization

The application provides secure user authentication using JWT.

### Features

* User registration
* User login
* Logout
* JWT-based authentication
* Protected frontend routes
* Protected backend routes
* Password hashing using bcrypt
* JWT expiration
* User-specific data isolation

Each user's financial data is associated with their authenticated user ID.

---

## 📊 2. Dashboard

The dashboard provides a quick overview of the user's financial situation.

### Dashboard includes

* Total Balance
* Total Income
* Total Expenses
* Monthly Budget
* Remaining Budget
* Budget Usage Percentage
* Recent Transactions
* Income vs Expense Chart
* Quick Add Transaction

The dashboard displays data from the user's actual stored transactions.

---

## 💸 3. Transaction Management

Users can create and manage their financial transactions.

### Supported operations

* Add transaction
* Edit transaction
* Delete transaction
* View transaction history

### Transaction fields

* Amount
* Type
* Category
* Account
* Note
* Date
* Recurring status
* Recurring frequency

### Income Categories

* Salary
* Freelance
* Business
* Investment
* Gift
* Other

### Expense Categories

* Food
* Travel
* Shopping
* Bills
* Rent
* Entertainment
* Health
* Education
* Subscription
* Other

---

## 🔎 4. Transaction Search, Filters & Pagination

Transaction history supports multiple filters and search options.

### Filters

* Income / Expense
* Category
* Account
* Date range
* Amount range

### Search

Users can search transactions by:

* Note
* Category
* Amount

Multiple filters can be combined.

The backend also supports pagination for transaction history.

---

## 📈 5. Analytics

The Analytics section provides visual insights into the user's financial activity.

### Analytics includes

* Monthly income
* Monthly expenses
* Net savings
* Category-wise spending
* Spending trends
* Income vs expense comparison

### Available time periods

* Week
* Month
* 3 Months
* Year

Charts are generated using the user's actual stored transaction data.

---

## 🏦 6. Account Management

Users can manage multiple financial accounts.

### Supported account types

* Cash
* Bank Account
* Credit Card
* Wallet
* Savings

Each account maintains its own balance, and the application also calculates the combined balance across active accounts.

---

## 🎯 7. Budget Management

Users can create and monitor their budgets.

### Budget features

* Monthly overall budget
* Category-wise budgets
* Budget progress
* Spending percentage
* Budget warning indicators

The application provides warnings as spending approaches important budget thresholds such as:

* 50%
* 75%
* 90%
* 100%+

---

## 🔄 8. Recurring Transactions

The application supports recurring financial transactions.

### Supported frequencies

* Daily
* Weekly
* Monthly
* Yearly

Recurring transactions store their next occurrence, and the backend processes recurring transactions automatically through a scheduled process.

---

## 🏆 9. Savings Goals

Users can create personal savings goals and track their progress.

### Goal tracking includes

* Goal name
* Target amount
* Current amount
* Progress
* Remaining amount

This allows users to monitor progress toward individual financial targets.

---

## 🏷️ 10. Custom Categories

Users can create their own custom transaction categories in addition to the predefined categories.

This provides flexibility for different personal finance requirements.

---

## 📥 11. CSV Export

Users can export transaction history as a CSV file.

The export respects the currently applied transaction filters.

### Exported fields

* Date
* Type
* Category
* Account
* Amount
* Note

The exported CSV can be opened in Excel, Google Sheets, or other spreadsheet applications.

---

# 🛡️ Security

Security has been considered throughout the application.

### Implemented security measures

* JWT authentication
* Password hashing using bcrypt
* Protected API routes
* User ownership checks
* Input validation
* NoSQL injection sanitization
* API rate limiting
* CORS configuration
* JWT expiration
* User-specific database queries

Backend ownership checks ensure that users can access only their own financial records.

---

# 🧱 Technology Stack

## Frontend

* React.js
* React Router
* Redux Toolkit
* Axios
* Tailwind CSS
* Recharts
* Lucide React
* React Hot Toast
* Jest
* React Testing Library

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Express Validator
* Express Rate Limit
* Express Mongo Sanitize
* Jest
* Supertest

## Tools & Deployment

* Git
* GitHub
* VS Code
* MongoDB Atlas
* Vite
* Render

---

# 🏗️ Project Architecture

```text
User
  │
  ▼
React Frontend
  │
  │ Axios / REST API
  ▼
Express.js Backend
  │
  ├── Routes
  ├── Controllers
  ├── Middleware
  ├── Validators
  └── Authentication
  │
  ▼
MongoDB Atlas
```

---

# 📁 Project Structure

```text
Expense-Tracker/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── accounts/
│   │   │   ├── analytics/
│   │   │   ├── budgets/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   ├── goals/
│   │   │   ├── layout/
│   │   │   └── transactions/
│   │   │
│   │   ├── pages/
│   │   │   ├── accounts/
│   │   │   ├── analytics/
│   │   │   ├── auth/
│   │   │   ├── budgets/
│   │   │   ├── categories/
│   │   │   ├── dashboard/
│   │   │   ├── goals/
│   │   │   └── transactions/
│   │   │
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   └── slices/
│   │   │
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── tests/
│   │   ├── Button.test.jsx
│   │   ├── Login.test.jsx
│   │   └── AddTransaction.test.jsx
│   │
│   ├── .gitignore
│   ├── babel.config.js
│   ├── jest.config.js
│   ├── jest.setup.js
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── validators/
│   ├── utils/
│   │
│   ├── tests/
│   │   ├── auth.test.js
│   │   └── transaction.test.js
│   │
│   ├── .gitignore
│   ├── jest.config.js
│   ├── package.json
│   └── server.js
│
└── README.md
```

> `.env` files are intentionally excluded from the repository and should be created locally using the required environment variables.

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone [YOUR-GITHUB-REPOSITORY-URL]
cd Expense-Tracker
```

If frontend and backend are maintained in separate repositories, clone both repositories.

---

# 🔧 Backend Setup

Open a terminal and navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=http://localhost:5173
```

If additional services are enabled, add their required environment variables.

---

## ▶️ Run Backend

For development:

```bash
npm run dev
```

Or:

```bash
node server.js
```

The backend runs on:

```text
http://localhost:8000
```

---

# 💻 Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file if required by the frontend API configuration:

```env
VITE_API_URL=http://localhost:8000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

---

# 🧪 Testing

## Backend Tests

From the `backend` folder:

```bash
npm test
```

Current result:

```text
Test Suites: 2 passed
Tests: 6 passed
```

Backend tests cover authentication middleware and transaction API behavior, including CRUD operations and user isolation.

---

## Frontend Tests

From the `frontend` folder:

```bash
npm test
```

Current result:

```text
Test Suites: 3 passed
Tests: 7 passed
```

Frontend tests use:

* Jest
* React Testing Library
* Jest DOM

Tested components:

* Button
* Login
* Add Transaction

---

# 🏭 Production Build

To create a production build:

```bash
cd frontend
npm run build
```

The generated production files are stored in:

```text
frontend/dist/
```

The production build has been successfully tested.

---

# 🔑 Environment Variables

Never commit real `.env` files or secret values to GitHub.

## Backend

```env
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

## Frontend

```env
VITE_API_URL=http://localhost:8000/api
```

---

# 🌐 Deployment

The application can be deployed using the following services:

### Backend

* Render

### Frontend

* Render


### Database

* MongoDB Atlas

For production deployment, update the environment variables with the deployed frontend and backend URLs.

Example:

```env
CLIENT_URL=https://your-frontend-url.com
```

Frontend:

```env
VITE_API_URL=https://your-backend-url.com/api
```

---

# 🔌 API Overview

## Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

## Transactions

```text
POST   /api/transactions
GET    /api/transactions
GET    /api/transactions/:id
PUT    /api/transactions/:id
DELETE /api/transactions/:id
GET    /api/transactions/export
```

Additional API modules include:

```text
Accounts
Budgets
Categories
Savings Goals
Recurring Transactions
Analytics
```

Protected endpoints require valid JWT authentication.

---

# 🔒 Data Isolation

Each financial record is associated with the authenticated user's ID.

```text
User
 │
 ├── Transactions
 ├── Accounts
 ├── Budgets
 ├── Categories
 └── Savings Goals
```

Backend ownership checks prevent users from accessing another user's financial records.

---

# 📱 Responsive Design

The application follows a responsive, mobile-friendly design approach.

Supported screen sizes include:

* Desktop
* Laptop
* Tablet
* Mobile

The application also provides:

* Loading states
* Empty states
* Error handling
* Toast notifications
* Responsive navigation

---

# 🧪 Testing Summary

| Area                      | Status |
| ------------------------- | ------ |
| Authentication Middleware | ✅      |
| Transaction API Behavior  | ✅      |
| Transaction CRUD Tests    | ✅      |
| User Isolation Test       | ✅      |
| Login Component           | ✅      |
| Add Transaction Component | ✅      |
| Button Component          | ✅      |
| Frontend Production Build | ✅      |
| Backend Server Startup    | ✅      |
| MongoDB Connection        | ✅      |

### Current Results

**Backend**

```text
2 Test Suites Passed
6 Tests Passed
```

**Frontend**

```text
3 Test Suites Passed
7 Tests Passed
```

---

# 📌 Project Highlights

* Full-stack MERN architecture
* JWT authentication
* Secure password hashing
* User-specific financial data
* Transaction CRUD
* Search, filtering and pagination
* Financial analytics
* Multiple account management
* Budget management
* Recurring transactions
* Savings goals
* Custom categories
* CSV export
* Responsive UI
* Input validation
* Rate limiting
* NoSQL injection protection
* Automated frontend and backend testing

---

# 🚧 Limitations

* Attachment upload is not included in the current user-facing transaction workflow.
* Bank account synchronization is not currently supported.
* Advanced financial integrations are outside the current project scope.

---

# 🔮 Future Improvements

* Bank account synchronization
* Email notifications
* PDF financial reports
* Expense reminders
* Multi-currency support
* Advanced financial insights
* Mobile application
* AI-powered spending recommendations

---

# 👩‍💻 Developer

**Mayuri More**

B.E. Information Technology
Shree L.R. Tiwari College of Engineering
University of Mumbai

### GitHub

[https://github.com/mayuri-satish-more ]

### LinkedIn

[https://www.linkedin.com/in/mayuri-more-01j05]

### Portfolio

[https://expense-tracker3-frontend.onrender.com/]

---

# ⭐ Conclusion

Expense Tracker is a full-stack MERN application designed to simplify personal financial management.

It combines transaction management, account management, budgeting, savings goals, recurring transactions, analytics, search and filtering, and CSV export into a single responsive application while following secure backend practices and automated testing.
