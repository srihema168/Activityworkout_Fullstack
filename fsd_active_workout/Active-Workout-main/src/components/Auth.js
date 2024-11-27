// src/components/Auth.js
// src/components/Auth.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../axios";
import '../styles/Auth.css';

const Auth = ({ setUser }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? "/auth/login" : "/auth/register";

        try {
            const { data } = await api.post(endpoint, { username, email, password });
            if (isLogin) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                setUser(data.user);
                navigate("/dashboard");
            } else {
                setIsLogin(true);
                setError("Registration successful. Please log in.");
            }
        } catch (err) {
            setError(err.response?.data?.msg || "Error occurred");
        }
    };

    return (
        <div className="auth-container">
            <h2>{isLogin ? "Login" : "Register"}</h2>
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <div>
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                )}
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">{isLogin ? "Login" : "Register"}</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <p onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Don’t have an account? Register" : "Already have an account? Login"}
            </p>
        </div>
    );
};

export default Auth;
