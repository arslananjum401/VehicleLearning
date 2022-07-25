import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { LoginUser } from '../../Actions/UserA.js';
import './Login.css';
const Login = () => {
    const location = useLocation()
    const Navigate = useNavigate()
    const dispatch = useDispatch();

    const [Login, setLogin] = useState({});
    const [PrePageURL, setPrePageURL] = useState({
        url: "",
        check: false
    })

    const { isAuthenticated, error, loading } = useSelector((state) => state.UserReducer);

    const SubmitStudentLogin = (e) => {
        e.preventDefault();

        dispatch(LoginUser(Login))

    }
    useEffect(() => {
        if (location?.state?.path !== undefined && location?.state?.path !== '/login') {
            console.log("url")
            setPrePageURL({ url: location?.state?.path, check: true })
        } 
    }, [location])


    useEffect(() => {
        if (isAuthenticated && PrePageURL?.check === false) {
            Navigate('/')
        }
        else if (isAuthenticated && PrePageURL?.check === true) {
          
            Navigate(`${PrePageURL.url}`)
        }
    }, [isAuthenticated, Navigate, PrePageURL])
    return (
        !loading ?
            <>
                <div>
                    <form
                        onSubmit={SubmitStudentLogin}
                        className='LoginForm'>
                        <span className='errorSpan'>{error ? error : null}</span>
                        <input
                            type="email"
                            placeholder="E-mail"
                            required
                            onChange={(e) => { setLogin({ ...Login, Email: e.target.value }) }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            onChange={(e) => { setLogin({ ...Login, Password: e.target.value }) }}
                        />
                        <button action="submit">Login</button>
                        <Link to={'/signup'} className='SignupLogBtn'>New here? <span> Then Signup</span></Link>
                        <Link to={'/forgot/password'} className='SignupLogBtn'><span>Forgot Password?</span></Link>
                    </form>
                </div>
            </>
            : <h1>Loading</h1>
    )
}

export default Login