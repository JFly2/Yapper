import './App.css';
import { Route, Routes } from "react-router-dom";
import { RegisterPage } from "./pages/RegisterPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { ChatPage } from "./pages/ChatPage.jsx";
import { ProtectedRoute } from "../ProtectedRoute.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<RegisterPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/chat"
                element={
                    <ProtectedRoute>
                        <ChatPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
