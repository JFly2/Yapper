import {useState} from "react";
import {useNavigate} from "react-router-dom";
import "../styles/Auth.css"
import {Link} from "react-router-dom";
import api from "../services/api.js";

export function LoginPage(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();


    async function handleLogin(event){

        event.preventDefault();
        setError("");

       const loginData = {
            username,
            password
        }

        try {

           const response = await api.post(
               "/auth/login",
               loginData
           );


           const token = response.data;

           sessionStorage.setItem("jwt_token", token);
           sessionStorage.setItem("username", username);

           navigate("/chat");

        } catch(error){

           if(error.response){

               if (error.response?.status === 401){
                   setError("Invalid username or password");
               } else {
                   setError(`Login failed: ${error.response.data?.message || "Unknown error"}`);
               }
           } else if (error.request){
               setError("Could not connect to server");
           } else {
               setError("An unexpected error occurred");
           }
        }
    }

    return (
        <div className="auth-page">

            <div className="auth-card">
                <div className="auth-brand">
                    <span className="auth-logo">🗣️</span>
                    <h1 className="auth-app-name">Yapper</h1>
                </div>

                <h2 className="auth-title">Welcome back</h2>
                <p className="auth-subtitle">Log in to continue yapping!</p>

                <form className="auth-form" onSubmit={handleLogin}>
                    <div className="auth-field">
                        <label className="auth-label" htmlFor="username">
                            Username
                        </label>
                        <input
                            id="username"
                            className="auth-input"
                            placeholder="Enter your username"
                            type="text"
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
                            placeholder="Enter your password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>

                    {error && <p className="auth-error">{error}</p>}

                    <button className="auth-button" type="submit">
                        Login
                    </button>
                </form>

                <div className="auth-divider">or</div>

                <p className="auth-switch-text">
                    Don't have an account? <Link to="/register" className="auth-link">Register</Link>
                </p>
            </div>
        </div>
    );
}
