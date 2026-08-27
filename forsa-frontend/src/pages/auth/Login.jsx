import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login: saveLogin } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const result = await login(
                email,
                password
            );

            saveLogin(result.data);

            navigate("/student");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Forsa AI</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />
                </div>

                {error && (
                    <p>{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Logging in..."
                        : "Login"}
                </button>
            </form>
        </div>
    );
}

export default Login;
