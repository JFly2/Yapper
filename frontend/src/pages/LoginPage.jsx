import {useState} from "react";
import {useNavigate} from "react-router-dom";
import "../styles/LoginPage.css"
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

           localStorage.setItem("jwt_token", token);
           localStorage.setItem("username", username);

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
        <div className={"auth-page"}>
            <div className={"login-container"}>
               <h1>Login</h1>
               <p className={"error-message"}>
                   {error}
               </p>
                <form onSubmit={handleLogin}>

                    <input
                        className={"login-input"}
                        placeholder={"username"}
                        type={"text"}
                        size="30"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <input
                        className={"login-input"}
                        placeholder={"password"}
                        type={"password"}
                        size="30"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />

                    <button className={"login-button"} type={"submit"}>Login</button>
                </form>

                <Link to={"/"} className={"register-link"}>
                    Don't have an account?
                </Link>
            </div>

        </div>
    );
}
