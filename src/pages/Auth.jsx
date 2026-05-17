import { useContext, useState } from "react"
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Auth() {
    const [mode, setMode] = useState('signup');
    const [error, setError] = useState(null);
    const {register, handleSubmit, formState:{errors}} = useForm();
    const { SignUp, user, logout, LogIn } = useContext(AuthContext);
    const navigate = useNavigate();

    function onSubmit(data) {
        setError(null);
        let result;
        if(mode === 'signup') {
            result = SignUp(data.email, data.password);
        } else {
            result = LogIn(data.email, data.password);
        }

        if(result.success) {
            alert("Success");
            navigate("/");
        } else {
            setError(result.error);
        }
    }

    return (
        <div className="page">
            <div className="container">
                <div className="auth-container">
                    {user && <p>Logged in as {user.email}</p>}
                    <button onClick={() => logout()}>Logout</button>
                    <h1 className="page-title">{mode === 'signup' ? 'Sign Up' : 'Login'}</h1>
                    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
                        {error && <div className="error-message">{error}</div>}
                        <div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="email">Email</label>
                                <input type="email" className="form-input" id='email' {...register('email', {required: 'Email is required'})}/>
                                {errors.email && <span className="form-error">{errors.email.message}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="password">Password</label>
                                <input type="password" className="form-input" id='password' {...register('password', {required: 'Password is required', 
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters'
                                    },
                                    maxLength: {
                                        value: 12,
                                        message: 'Password must be less than 12 characters'
                                    }
                                })}/>
                                {errors.password && <span className="form-error">{errors.password.message}</span>}
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-large">{mode === 'signup' ? 'Sign Up' : 'Login'}</button>
                    </form>

                    <div className="auth-switch">
                        <p>{mode === 'signup' ? (
                            <p>
                                Already have an account? <span className="auth-link" onClick={() => setMode('login')}>Login</span>
                            </p>
                        ) : (
                            <p>
                                Don't have an account? <span className="auth-link" onClick={() => setMode('signup')}>Sign Up</span>
                            </p>
                        )}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}