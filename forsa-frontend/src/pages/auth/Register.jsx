import { useState } from "react";
import {
    ArrowRight,
    Eye,
    EyeOff,
    Check,
    User,
    Mail,
    Lock,
    Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../../api/auth";

import "./Register.css";


function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] =
        useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] =
        useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");


        /*
        |--------------------------------------------------------------------------
        | Client Validation
        |--------------------------------------------------------------------------
        */

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();


        if (!trimmedName) {
            setError("Name is required.");
            return;
        }


        if (!trimmedEmail) {
            setError("Email is required.");
            return;
        }


        if (password.length < 8) {
            setError(
                "Password must be at least 8 characters."
            );
            return;
        }


        if (password !== passwordConfirmation) {
            setError(
                "Password confirmation does not match."
            );
            return;
        }


        setLoading(true);


        try {

            /*
            |--------------------------------------------------------------------------
            | Register
            |--------------------------------------------------------------------------
            */

            await register(
                trimmedName,
                trimmedEmail,
                password,
                passwordConfirmation
            );


            /*
            |--------------------------------------------------------------------------
            | Registration Successful
            |--------------------------------------------------------------------------
            |
            | Do NOT call saveLogin() here.
            |
            | Registration creates the account only.
            | Login creates the authentication token.
            |
            */

            navigate("/login", {
                replace: true,
                state: {
                    registered: true,
                    email: trimmedEmail,
                },
            });


        } catch (error) {

            console.error(
                "Registration failed:",
                error
            );


            /*
            |--------------------------------------------------------------------------
            | Laravel Validation Errors
            |--------------------------------------------------------------------------
            */

            const validationErrors =
                error.response?.data?.errors;


            if (validationErrors) {

                const firstError =
                    Object.values(validationErrors)[0];


                if (Array.isArray(firstError)) {

                    setError(firstError[0]);

                } else {

                    setError(
                        String(firstError)
                    );

                }

            } else {

                setError(
                    error.response?.data?.message ||
                    "Registration failed. Please try again."
                );

            }

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="register-page">

            <div className="register-background">

                <div className="register-shape register-shape-one" />

                <div className="register-shape register-shape-two" />

                <div className="register-shape register-shape-three" />


                <div className="register-container">


                    {/* =====================================================
                        Left Side
                    ===================================================== */}

                    <div className="register-left">

                        <div className="register-brand">

                            <Link
                                to="/"
                                className="register-logo"
                            >

                                <span className="register-logo-mark">
                                    <span />
                                </span>

                                <span>
                                    EduMatch
                                </span>

                            </Link>

                        </div>


                        <div className="register-left-content">

                            <div className="register-badge">

                                <Sparkles size={15} />

                                <span>
                                    AI-powered opportunity matching
                                </span>

                            </div>


                            <h1>

                                Start finding

                                <span>
                                    opportunities
                                </span>

                                made for you

                            </h1>


                            <p>

                                Create your EduMatch account and
                                discover scholarships and educational
                                opportunities that match your academic
                                background, skills and goals.

                            </p>


                            <div className="register-benefits">


                                <div className="register-benefit">

                                    <div className="benefit-icon">
                                        <Check size={16} />
                                    </div>

                                    <div>

                                        <strong>
                                            Personalized Matching
                                        </strong>

                                        <span>
                                            Get opportunities based on
                                            your profile.
                                        </span>

                                    </div>

                                </div>


                                <div className="register-benefit">

                                    <div className="benefit-icon">
                                        <Check size={16} />
                                    </div>

                                    <div>

                                        <strong>
                                            Save Time
                                        </strong>

                                        <span>
                                            Find relevant opportunities
                                            in one place.
                                        </span>

                                    </div>

                                </div>


                                <div className="register-benefit">

                                    <div className="benefit-icon">
                                        <Check size={16} />
                                    </div>

                                    <div>

                                        <strong>
                                            Free Student Account
                                        </strong>

                                        <span>
                                            Create your account and
                                            complete your profile.
                                        </span>

                                    </div>

                                </div>


                            </div>

                        </div>


                        <div className="register-left-footer">

                            © 2026 EduMatch

                        </div>

                    </div>


                    {/* =====================================================
                        Right Side
                    ===================================================== */}

                    <div className="register-right">

                        <div className="register-form-wrapper">


                            <div className="register-form-header">

                                <h2>
                                    Create your account
                                </h2>

                                <p>
                                    Join EduMatch and start discovering
                                    opportunities that fit you.
                                </p>

                            </div>


                            <form
                                onSubmit={handleSubmit}
                                className="register-form"
                            >


                                {/* =================================================
                                    Full Name
                                ================================================= */}

                                <div className="register-field">

                                    <label htmlFor="name">
                                        Full Name
                                    </label>


                                    <div className="register-input-wrapper">

                                        <User size={18} />

                                        <input
                                            id="name"
                                            type="text"
                                            value={name}
                                            onChange={(event) =>
                                                setName(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Enter your full name"
                                            autoComplete="name"
                                            disabled={loading}
                                            required
                                        />

                                    </div>

                                </div>


                                {/* =================================================
                                    Email
                                ================================================= */}

                                <div className="register-field">

                                    <label htmlFor="email">
                                        Email Address
                                    </label>


                                    <div className="register-input-wrapper">

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
                                            disabled={loading}
                                            required
                                        />

                                    </div>

                                </div>


                                {/* =================================================
                                    Password
                                ================================================= */}

                                <div className="register-field">

                                    <label htmlFor="password">
                                        Password
                                    </label>


                                    <div className="register-input-wrapper">

                                        <Lock size={18} />

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
                                            placeholder="Create a password"
                                            autoComplete="new-password"
                                            minLength={8}
                                            disabled={loading}
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
                                            disabled={loading}
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


                                    <span className="field-hint">

                                        Password must be at least 8
                                        characters.

                                    </span>

                                </div>


                                {/* =================================================
                                    Confirm Password
                                ================================================= */}

                                <div className="register-field">

                                    <label htmlFor="password_confirmation">
                                        Confirm Password
                                    </label>


                                    <div className="register-input-wrapper">

                                        <Lock size={18} />

                                        <input
                                            id="password_confirmation"
                                            type={
                                                showConfirmation
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                passwordConfirmation
                                            }
                                            onChange={(event) =>
                                                setPasswordConfirmation(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Confirm your password"
                                            autoComplete="new-password"
                                            disabled={loading}
                                            required
                                        />


                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() =>
                                                setShowConfirmation(
                                                    !showConfirmation
                                                )
                                            }
                                            disabled={loading}
                                            aria-label={
                                                showConfirmation
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >

                                            {showConfirmation ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}

                                        </button>

                                    </div>

                                </div>


                                {/* =================================================
                                    Error
                                ================================================= */}

                                {error && (

                                    <div className="register-error">
                                        {error}
                                    </div>

                                )}


                                {/* =================================================
                                    Submit
                                ================================================= */}

                                <button
                                    type="submit"
                                    className="register-submit"
                                    disabled={loading}
                                >

                                    <span>

                                        {loading
                                            ? "Creating Account..."
                                            : "Create Account"}

                                    </span>


                                    {!loading && (
                                        <ArrowRight size={19} />
                                    )}

                                </button>


                                {/* =================================================
                                    Login
                                ================================================= */}

                                <div className="register-login">

                                    <span>
                                        Already have an account?
                                    </span>

                                    <Link to="/login">
                                        Log In
                                    </Link>

                                </div>

                            </form>


                            {/* =====================================================
                                Next Step
                            ===================================================== */}

                            <div className="register-next-step">

                                <div className="next-step-line" />

                                <span>
                                    What happens next?
                                </span>

                                <div className="next-step-line" />

                            </div>


                            <p className="register-next-description">

                                After creating your account, you will
                                be redirected to login. Then you can
                                complete your profile with your academic
                                information and documents.

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default Register;
