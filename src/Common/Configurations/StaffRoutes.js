import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

export const StaffRoutes = ({ component: Component, ...rest }) => {
    const navigate = useNavigate();
    return (
        <Routes><Route{...rest}
            render={(props) => {
                console.log("ok")
                if (localStorage.getItem('userToken') !== null) {
                    return <Component{...props} />
                }
                else {
                    navigate('/');
                }
            }
            } /></Routes>
    )
}