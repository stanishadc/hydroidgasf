import {APIConfig} from '../Common/Configurations/APIConfig';
import axios from 'axios';
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import auth from "../Common/Configurations/Auth";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
const initialLoginValues = {
    username: '',
    password: ''
}
export default function Login() {
    const navigate = useNavigate();
    const [values, setValues] = useState(initialLoginValues)
    const [errors, setErrors] = useState({})

    const applicationAPI = (url = APIConfig.APIACTIVATEURL + APIConfig.LOGINUSER) => {
        return {
            userlogin: newRecord => axios.post(url, newRecord)
        }
    }
    const handleInputChange = e => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        })
    }
    const validate = () => {
        let temp = {}
        temp.username = values.username == "" ? false : true;
        temp.password = values.password == "" ? false : true;
        setErrors(temp)
        return Object.values(temp).every(x => x == true)
    }
    const handleSubmit = e => {
        e.preventDefault();
        if (validate()) {
            try {
                initialLoginValues.username = values.username
                initialLoginValues.password = values.password
                checkUser(initialLoginValues)
            } catch (err) {
                handleError("Error" + err);
            }
        }
        else {
            handleError("Please check the mandatory fields");
        }
    }
    const checkUser = (loginData) => {
        applicationAPI().userlogin(loginData)
            .then(res => {
                if (res.data.succeeded !== false) {
                    handleSuccess("Login Success");
                    clearForm();
                    auth.ulogin(() => {
                        localStorage.setItem('userId', res.data.userId);
                        localStorage.setItem('userToken', res.data.token);
                        localStorage.setItem('tokenexpiration', res.data.expiration);
                        localStorage.setItem('roleName', res.data.roleName);
                        localStorage.setItem('name', res.data.name);
                        {
                            if (res.data.roleName === "Super Admin") {
                                navigate('/superadmin/dashboard');
                            }
                            else if (res.data.roleName === "Admin") {
                                navigate('/admin/dashboard');
                            }
                            else if (res.data.roleName === "Customer") {
                                navigate('/customer/dashboard');
                            }
                        }
                    });
                }
            })
            .catch
            (function (e) {
                handleError("Please check the credentials");
            })
    }
    function clearForm() {
        values.username = "";
        values.password = "";
    }
    useEffect(() => {
        if (localStorage.getItem('userToken') !== "") {
            if (CheckExpirationTime()) {
                if (localStorage.getItem('roleName') === "Super Admin") {
                    navigate('/superadmin/dashboard');
                }
                else if (localStorage.getItem('roleName') === "Admin") {
                    navigate('/admin/dashboard');
                }
                else if (localStorage.getItem('roleName') === "Customer") {
                    navigate('/customer/dashboard');
                }
            }
            else {
                navigate('/login');
            }
        }
        else {
            console.log("test")
            navigate('/login');
        }
    }, []);
    function CheckExpirationTime() {
        if (localStorage.getItem('tokenexpiration') !== "") {
            const expiredate = new Date(localStorage.getItem('tokenexpiration'));
            const localdate = new Date();
            if (expiredate > localdate) {
                return true;
            }
        }
        return false;
    }
    const applyErrorClass = field => ((field in errors && errors[field] == false) ? ' form-control-danger' : '')
    return (

        <div className="auth-page-wrapper pt-5">
            <div className="auth-one-bg-position">
                <div className="bg-overlay" style={{backgroundColor:"#274171"}} />
                <div className="shape">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 1440 120">
                        <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z" />
                    </svg>
                </div>
            </div>
            <div className="auth-page-content">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="text-center mt-sm-5 mb-4 text-white-50">
                                <div>
                                  <h1 style={{color:"#fff"}}> HYDROID </h1>
                                </div>
                                <p className="mt-3 fs-15 fw-medium" style={{color:"#fff"}}>SMART METERING SOLUTIONS</p>
                            </div>
                        </div>
                    </div>
                    {/* end row */}
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6 col-xl-5">
                            <div className="card mt-4">
                                <div className="card-body p-4">
                                    <div className="text-center mt-2">
                                        <h5 className="text-primary">Welcome Back !</h5>
                                        <p className="text-muted">Sign in to continue.</p>
                                    </div>
                                    <div className="p-2 mt-4">
                                        <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                                            <div className="mb-3">
                                                <label htmlFor="username" className="form-label">Username*</label>
                                                <input className={"form-control" + applyErrorClass('username')} name="username" type="text" value={values.username} onChange={handleInputChange} placeholder="Enter username" />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label" htmlFor="password">Password</label>
                                                <div className="position-relative auth-pass-inputgroup mb-3">
                                                    <input className={"form-control" + applyErrorClass('password')} name="password" type="password" value={values.password} onChange={handleInputChange} placeholder="Password" />
                                                    <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon" type="button" id="password-addon"><i className="ri-eye-fill align-middle" /></button>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <button className="btn btn-success w-100" type="submit">Sign In</button>
                                            </div>
                                            <div className="mt-4 text-center">
                                                <div className="signin-other-title">
                                                    <p className="mb-0">Not able to login? <Link onClick={() => window.location = 'mailto:support@hydroid.in'} className="fw-semibold text-primary text-decoration-underline"> Contact Administrator</Link></p>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                {/* end card body */}
                            </div>
                        </div>
                    </div>
                    {/* end row */}
                </div>
                {/* end container */}
            </div>
            {/* end auth page content */}
            {/* footer */}
            <footer className="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="text-center">
                                <p className="mb-0 text-muted">
                                2023 © ino-fi solutions pvt ltd.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>

    );
}