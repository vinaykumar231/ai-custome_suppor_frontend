import "./App.css";
import { LoginProvider } from "./auth/LoginContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthPage from "./auth/Login";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./auth/ProtectedRoute";
import RazorpayCheckout from "./components/RazorpayCheckout";
import MillisDashboard from "./components/millis_dashboard";
import UsersList from "./components/user";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/pay" element={<RazorpayCheckout />} />
        <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/millis_dashboard" element={<MillisDashboard />} />
        <Route path="/user" element={<UsersList />} />
        </Route>
       
      </Routes>
    </div>
  );
}

export default function RootApp() {
  return (
    <LoginProvider>

      <Router>
        <App />
      </Router>

    </LoginProvider>
  );
}
