import "./App.css";
import { LoginProvider } from "./auth/LoginContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthPage from "./auth/Login";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
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
