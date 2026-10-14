import { useState } from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    ArrowLeft,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    Sparkles,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import "./Login.css";


function Login() {

    const navigate =
        useNavigate();

    const {
        login: loginUser,
    } = useAuth();


    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        setLoading(true);

        try {

            /*
            | This calls AuthContext.login
            | which calls the API once.
            */

            const user =
                await loginUser(
                    email.trim(),
                    password
                );


            /*
            | Redirect according to role
            */

            if (
                user?.role === "admin" ||
                user?.role === "super_admin"
            ) {

                navigate(
                    "/admin",
                    {
                        replace: true,
                    }
                );

                return;
            }


            navigate(
                "/student",
                {
                    replace: true,
                }
            );

        } catch (error) {

            console.error(
                "Login failed:",
                error
            );


            const validationErrors =
                error.response?.data?.errors;


            if (validationErrors) {

                const firstError =
                    Object.values(
                        validationErrors
                    )[0];


                setError(
                    Array.isArray(firstError)
                        ? firstError[0]
                        : "Login failed."
                );

            } else {

                setError(
                    error.response?.data?.message ||
                    error.message ||
                    "Login failed."
                );
            }

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="auth-page">

            <div className="auth-background-shape auth-shape-one" />
            <div className="auth-background-shape auth-shape-two" />
            <div className="auth-background-shape auth-shape-three" />


            <div className="auth-container">


                {/* Left Side */}

                <div className="auth-visual">

                    <div className="auth-brand">

                        <Link
                            to="/"
                            className="auth-logo"
                        >

                            <span className="auth-logo-mark">
                                <span />
                            </span>

                            <span>
                                EduMatch
                            </span>

                        </Link>

                    </div>


                    <div className="auth-visual-content">

                        <div className="auth-visual-badge">

                            <Sparkles size={15} />

                            <span>
                                AI-powered opportunity matching
                            </span>

                        </div>


                        <h1>
                            Find opportunities
                            <span>
                                made for you.
                            </span>
                        </h1>


                        <p>
                            EduMatch helps you discover scholarships
                            and educational opportunities based on your
                            education, skills and goals.
                        </p>


                        <div className="auth-check-list">

                            <div>

                                <span className="auth-check">
                                    ✓
                                </span>

                                Personalized opportunities

                            </div>


                            <div>

                                <span className="auth-check">
                                    ✓
                                </span>

                                AI-powered matching

                            </div>


                            <div>

                                <span className="auth-check">
                                    ✓
                                </span>

                                One place for your applications

                            </div>

                        </div>

                    </div>


                    <div className="auth-visual-footer">
                        Your next opportunity starts here.
                    </div>

                </div>


                {/* Right Side */}

                <div className="auth-form-section">

                    <Link
                        to="/"
                        className="back-home"
                    >

                        <ArrowLeft size={17} />

                        Back to Home

                    </Link>


                    <div className="auth-form-wrapper">


                        <div className="auth-mobile-logo">

                            <Link
                                to="/"
                                className="auth-logo"
                            >

                                <span className="auth-logo-mark">
                                    <span />
                                </span>

                                <span>
                                    EduMatch
                                </span>

                            </Link>

                        </div>


                        <div className="auth-heading">

                            <h2>
                                Welcome back
                            </h2>

                            <p>
                                Log in to continue to your EduMatch account.
                            </p>

                        </div>


                        <form
                            className="auth-form"
                            onSubmit={handleSubmit}
                        >


                            {/* Email */}

                            <div className="auth-field">

                                <label htmlFor="email">
                                    Email
                                </label>


                                <div className="auth-input-wrapper">

                                    <Mail size={18} />

                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter your email"
                                        autoComplete="email"
                                        required
                                    />

                                </div>

                            </div>


                            {/* Password */}

                            <div className="auth-field">

                                <div className="auth-label-row">

                                    <label htmlFor="password">
                                        Password
                                    </label>

                                </div>


                                <div className="auth-input-wrapper">

                                    <LockKeyhole size={18} />

                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        required
                                    />


                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >

                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}

                                    </button>

                                </div>

                            </div>


                            {/* Error */}

                            {error && (

                                <div className="auth-error">
                                    {error}
                                </div>

                            )}


                            {/* Submit */}

                            <button
                                type="submit"
                                className="auth-submit"
                                disabled={loading}
                            >

                                {loading
                                    ? "Logging in..."
                                    : "Log In"}

                            </button>

                        </form>


                        {/* Register */}

                        <div className="auth-switch">

                            <span>
                                Don't have an account?
                            </span>

                            <Link to="/register">
                                Sign Up
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default Login;
