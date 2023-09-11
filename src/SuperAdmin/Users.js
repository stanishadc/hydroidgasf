import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { UserStatus } from "../Common/Enums";
import { useState, useEffect } from "react";
import axios from 'axios';
import { APIConfig } from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
const initialFieldValues = {
    userId: "00000000-0000-0000-0000-000000000000",
    userName: "",
    password: "",
    roleId: "00000000-0000-0000-0000-000000000000",
    status: true,
    name: "",
    email: "",
    phoneNo: "",
    city: "",
    country: ""
};
export default function Users() {
    const [values, setValues] = useState(initialFieldValues);
    const [errors, setErrors] = useState({});
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const statusvalues = [
        { label: 'Active', value: true },
        { label: 'InActive', value: false }
    ]
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
        temp.userName = values.userName === "" ? false : true;
        temp.password = values.password === "" ? false : true;
        temp.name = values.name === "" ? false : true;
        temp.email = values.email === "" ? false : true;
        temp.phoneNo = values.phoneNo === "" ? false : true;
        setErrors(temp);
        return Object.values(temp).every((x) => x === true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const formData = {
                "userId": values.userId,
                "userName": values.userName,
                "password": values.password,
                "roleId": values.roleId,
                "status": values.status,
                "name": values.name,
                "email": values.email,
                "phoneNo": values.phoneNo,
                "city": values.city,
                "country": values.country
            }
            addOrEdit(formData);
        }
    };
    const applicationAPI = () => {
        return {
            create: (newrecord) =>
                axios.post(APIConfig.APIACTIVATEURL + APIConfig.CREATEUSER, JSON.stringify(newrecord), { ...headerconfig }),
            delete: (id) => axios.delete(APIConfig.APIACTIVATEURL + APIConfig.DELETEUSER + "/" + id, { ...headerconfig }),
            userstatus: (id, ustatus) => axios.post(APIConfig.APIACTIVATEURL + APIConfig.USERSTATUS + "?userId=" + id + "&status=" + ustatus, { ...headerconfig })
        };
    };
    const addOrEdit = (formData) => {
        if (formData.userId === "00000000-0000-0000-0000-000000000000") {
            applicationAPI()
                .create(formData)
                .then((res) => {
                    if (res.data.statusCode === 200) {
                        handleSuccess(res.data.message);
                        resetForm();
                        GetUsers(pageNumber);
                    }
                    else {
                        handleError(res.data.message);
                    }
                });
        }
    };
    const resetForm = () => {
        setValues(initialFieldValues);
    };
    const GetUsers = (number) => {
        axios
            .get(APIConfig.APIACTIVATEURL + APIConfig.GETALLCUSTOMERS + "?pageNumber=" + number + "&pageSize=" + pageSize + "", { ...headerconfig })
            .then((response) => {
                if (response.data.data.succeeded === true) {
                    setUsers(response.data.data.data);
                    setPageNumber(response.data.data.pageNumber);
                    setPageSize(response.data.data.pageSize);
                    setTotalPages(response.data.data.totalPages);
                    setData(response.data.data);
                    setTotalRecords(response.data.data.totalRecords);
                }
            });
    };
    const GetRoles = () => {
        axios
            .get(APIConfig.APIACTIVATEURL + APIConfig.GETALLROLES, { ...headerconfig })
            .then((response) => {
                setRoles(response.data.data.data);
            });
    };
    const onDelete = (e, id) => {
        if (window.confirm('Are you sure to delete this record?'))
            applicationAPI().delete(id)
                .then(res => {
                    handleSuccess("User Deleted Succesfully");
                    GetUsers(pageNumber);
                })
    }
    const onStatus = (e, id, ustatus) => {
        if (window.confirm('Are you sure to update this record?'))
            applicationAPI().userstatus(id, ustatus)
                .then(res => {
                    handleSuccess("User status changed succesfully");
                    GetUsers(pageNumber);
                })
    }
    const GetLastPageData = () => {
        GetUsers(totalPages)
    }
    const GetFirstPageData = () => {
        GetUsers("1")
    }
    const GetPageData = (number) => {
        setPageNumber(number);
        if (pageNumber !== number)
            GetUsers(number)
    }
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }
    const renderPageNumbers = pageNumbers.map((number) => {
        return (
            <li className="page-item" key={number} id={number} onClick={() => GetPageData(number)}>
                <Link className="page-link">{number}</Link>
            </li>
        );
    });
    const applyErrorClass = (field) =>
        field in errors && errors[field] === false ? " form-control-danger" : "";
    useEffect(() => {
        GetUsers(pageNumber);
        GetRoles();
    }, [])
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
                                    <h4 className="mb-sm-0">Users</h4>
                                </div>
                            </div>
                        </div>
                        <div className="alert alert-success">
                            <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                                <div className="row">
                                    <div className="col-lg-3">
                                        <div className="mb-4">
                                            <label htmlFor="userName" className="form-label">Role</label>
                                            <select name="roleId" value={values.roleId} onChange={handleInputChange} className={"form-control" + applyErrorClass('roleId')}>
                                                <option value="00000000-0000-0000-0000-000000000000">Please Select</option>
                                                {roles.length > 0 && roles.map(role =>
                                                    <option value={role.roleId}>{role.roleName}</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-4">
                                            <label htmlFor="userName" className="form-label">UserName</label>
                                            <input type="text" value={values.userName} name="userName" onChange={handleInputChange} className={"form-control" + applyErrorClass('userName')} placeholder="User Name" />
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-4">
                                            <label htmlFor="password" className="form-label">Password</label>
                                            <input type="password" value={values.password} name="password" onChange={handleInputChange} className={"form-control" + applyErrorClass('password')} placeholder="Password" />
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-4">
                                            <label htmlFor="status" className="form-label">Status</label>
                                            <select value={values.status} onChange={handleInputChange} placeholder="User Status" name="status" className={"form-control" + applyErrorClass('status')}>
                                                {statusvalues.map(sv =>
                                                    <option value={sv.value}>{sv.label}</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Name</label>
                                            <input type="text" value={values.name} name="name" onChange={handleInputChange} className={"form-control" + applyErrorClass('name')} placeholder="Name" />
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input type="text" value={values.email} name="email" onChange={handleInputChange} className={"form-control" + applyErrorClass('email')} placeholder="Email" />
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-3">
                                            <label htmlFor="phoneNo" className="form-label">Phone No</label>
                                            <input type="text" value={values.phoneNo} name="phoneNo" onChange={handleInputChange} className={"form-control" + applyErrorClass('phoneNo')} placeholder="Phone No" />
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-3">
                                            <label htmlFor="city" className="form-label">City</label>
                                            <input type="text" value={values.city} name="city" onChange={handleInputChange} className={"form-control" + applyErrorClass('city')} placeholder="City" />
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-3">
                                            <label htmlFor="country" className="form-label">Country</label>
                                            <input type="text" value={values.country} name="country" onChange={handleInputChange} className={"form-control" + applyErrorClass('country')} placeholder="Country" />
                                        </div>
                                    </div>
                                    <div className="col-lg-2">
                                        <div className="hstack gap-2 justify-content-end mb-3 mt-4">
                                            <button type="submit" className="btn btn-primary">Submit</button>
                                            <button type="button" className="btn btn-danger" onClick={resetForm}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="card-title mb-0">Users List</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive table-card">
                                            <table id="example" className="table table-bordered dt-responsive nowrap table-striped align-middle" style={{ width: '100%' }}>
                                                <thead>
                                                    <tr>
                                                        <th data-ordering="false">UserName</th>
                                                        <th data-ordering="false">Email</th>
                                                        <th data-ordering="false">PhoneNo</th>
                                                        <th data-ordering="false">FlatNo</th>
                                                        <th data-ordering="false">RoleName</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {users.length > 0 && users.map(user =>
                                                        <tr key={user.userId}>
                                                            <td>{user.userName}</td>
                                                            <td>{user.email}</td>
                                                            <td>{user.phoneNo}</td>
                                                            <td>{user.unitName}</td>
                                                            <td>{user.roleName}</td>
                                                            <td>
                                                                {user.status === true ? <span className="badge bg-success">{UserStatus.ACTIVE}</span> : <span className="badge bg-warning">{UserStatus.INACTIVE}</span>}
                                                            </td>
                                                            <td>
                                                                <div className="d-flex gap-2">
                                                                    <div className="edit">
                                                                        {user.status === true ?
                                                                            <Link className="dropdown-item remove-item-btn" onClick={e => onStatus(e, user.userId, false)}>
                                                                                <i className="ri-user-2-fill align-bottom me-2" />
                                                                            </Link>
                                                                            :
                                                                            <Link className="dropdown-item remove-item-btn" onClick={e => onStatus(e, user.userId, true)}>
                                                                                <i className="ri-user-2-fill align-bottom me-2 text-muted" />
                                                                            </Link>
                                                                        }
                                                                    </div>
                                                                    <div class="remove">
                                                                        <Link className="dropdown-item remove-item-btn" onClick={e => onDelete(e, user.userId)}>
                                                                            <i className="ri-delete-bin-fill align-bottom me-2 text-muted" />
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="align-items-center mt-4 pt-2 justify-content-between d-flex">
                                            <div className="flex-shrink-0">
                                                <div className="text-muted">
                                                    Showing <span className="fw-semibold">{users.length}</span> of <span className="fw-semibold">{totalRecords}</span> Results
                                                </div>
                                            </div>
                                            <ul className="pagination pagination-separated pagination-sm mb-0">
                                                <li className={"page-item" + data.previousPage === null ? 'disabled' : ''} onClick={() => GetFirstPageData()}>
                                                    <Link className="page-link">Previous</Link>
                                                </li>
                                                {renderPageNumbers}
                                                <li className={"page-item" + data.nextPage === null ? 'disabled' : ''} onClick={() => GetLastPageData()}>
                                                    <Link className="page-link">Next</Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>{/*end col*/}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}