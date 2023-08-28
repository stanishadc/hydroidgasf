import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import { APIConfig } from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
const initialChangePasswordValues = {
    userId: localStorage.getItem('userId'),
    oldPassword: "",
    newPassword: ""
};
export default function ChangePassword() {
    const [values, setValues] = useState(initialChangePasswordValues);
    const [errors, setErrors] = useState({});
    const [confirmPassword, setConfirmPassword] = useState("")
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
    };
    const headerconfig = {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("userToken"),
            'Content-Type': 'application/json'
        }
    }
    const validate = () => {
        let temp = {};
        temp.oldPassword = values.oldPassword === "" ? false : true;
        temp.newPassword = values.newPassword === "" ? false : true;
        temp.confirmPassword = values.confirmPassword === "" ? false : true;
        setErrors(temp);
        return Object.values(temp).every((x) => x === true);
    };
    const handlEPasswordChange = e => {
        setConfirmPassword(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            if (comparePassword(values.newPassword, confirmPassword)) {
                initialChangePasswordValues.agentId = values.agentId
                initialChangePasswordValues.oldPassword = values.oldPassword
                initialChangePasswordValues.newPassword = values.newPassword
                changePassword();
                clearForm();
            }
        }
    };
    const changePassword = (changePasswordData) => {
        applicationAPI().postchangepassword(changePasswordData)
            .then(res => {
                if (res.data.statusCode === 200) {
                    handleSuccess(res.data.response.message);
                    clearForm();
                }
                else {
                    handleError(res.data.response.message);
                }
            })
    }
    const applicationAPI = () => {
        return {
            postchangepassword: () =>
                axios.post(APIConfig.APIACTIVATEURL + APIConfig.CHANGEPASSWORD + "?UserId=" + localStorage.getItem("userId") + "&OldPassword=" + initialChangePasswordValues.oldPassword + "&NewPassword=" + initialChangePasswordValues.newPassword, { ...headerconfig })
        };
    };
    const comparePassword = (newPassword, confirmPassword) => {
        if (newPassword !== confirmPassword) {
            handleError("New and Confirm Passwords should be same");
            return false;
        }
        return true;
    }
    const clearForm = () => {
        values.oldPassword = "";
        values.newPassword = "";
        setConfirmPassword("");
        values.confirmPassword = "";
        
    };
    const applyErrorClass = (field) =>
        field in errors && errors[field] === false ? " form-control-danger" : "";
    return (
        <div id="layout-wrapper">
            <Header></Header>
            <SideBar></SideBar>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                    <h4 className="mb-sm-0">Change Password</h4>
                                </div>
                            </div>
                        </div>
                        <div className="alert alert-success">
                            <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                                <div className="row">
                                    <div className="col-lg-3">
                                        <div className="mb-3">
                                            <label htmlFor="oldPassword" className="form-label">OldPassword</label>
                                            <input type="password" value={values.oldPassword} name="oldPassword" onChange={handleInputChange} className={"form-control" + applyErrorClass('oldPassword')} placeholder="Old Password" />
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-3">
                                            <label htmlFor="newPassword" className="form-label">New Password</label>
                                            <input type="password" value={values.newPassword} name="newPassword" onChange={handleInputChange} className={"form-control" + applyErrorClass('newPassword')} placeholder="New Password" />
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-3">
                                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                            <input type="password" value={values.confirmPassword} name="confirmPassword" onChange={handlEPasswordChange} className={"form-control" + applyErrorClass('confirmPassword')} placeholder="Confirm Password" />
                                        </div>
                                    </div>
                                    <div className="col-lg-2">
                                        <div className="hstack gap-2 justify-content-end mb-3 mt-4">
                                            <button type="submit" className="btn btn-primary">Change Password</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}