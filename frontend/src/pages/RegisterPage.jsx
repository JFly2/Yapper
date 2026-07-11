import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import api from "../services/api.js";

export function RegisterPage() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleRegister(event) {
        event.preventDefault();
        setError("");

        if (!email.includes("@")) {
            setError("Invalid email");
            return;
        }

        const registerData = {
            email,
            username,
            password
        };

        try {
            await api.post(
                "/auth/register",
                registerData
            );

            navigate("/login");
        } catch (error) {
            if (error.response?.status === 409) {
                setError(error.response.data);
                return;
            }

            setError("Could not register user.");
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <span className="auth-logo">🗣️</span>
                    <h1 className="auth-app-name">Yapper</h1>
                </div>

                <h2 className="auth-title">Create your account</h2>
                <p className="auth-subtitle">Sign-up to start yapping!</p>

                <form className="auth-form" onSubmit={handleRegister}>
                    <div className="auth-field">
                        <label className="auth-label" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            className="auth-input"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>

                    <div className="auth-field">
                        <label className="auth-label" htmlFor="username">
                            Username
                        </label>
                        <input
                            id="username"
                            className="auth-input"
                            type="text"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                        />
                    </div>

                    <div className="auth-field">
                        <label className="auth-label" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            className="auth-input"
                            type="password"
                            placeholder="Choose a password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>

                    {error && <p className="auth-error">{error}</p>}

                    <button className="auth-button" type="submit">
                        Register
                    </button>
                </form>

                <div className="auth-divider">or</div>

                <p className="auth-switch-text">
                    Already have an account? <Link to="/login" className="auth-link">Log in</Link>
                </p>
            </div>
        </div>
    );
}
