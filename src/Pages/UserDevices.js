import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import config from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
import Select from 'react-select';
const initialFieldValues = {
    userDeviceId: "00000000-0000-0000-0000-000000000000",
    userId: "00000000-0000-0000-0000-000000000000",
    deviceId: "",
    status: true
};
export default function UserDevices() {
    const [values, setValues] = useState(initialFieldValues);
    const [recordForEdit, setRecordForEdit] = useState(null);
    const [errors, setErrors] = useState({});
    const [userDevices, setUserDevices] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(50);
    const [pageNumber, setPageNumber] = useState(1);
    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchDevices, setSearchDevices] = useState([]);
    const [users, setUsers] = useState([]);
    const [devices, setDevices] = useState([]);
    const [deviceId, setDeviceId] = useState('00000000-0000-0000-0000-000000000000');
    const [userId, setUserId] = useState('00000000-0000-0000-0000-000000000000');
    const [userDeviceId, setUserDeviceId] = useState('00000000-0000-0000-0000-000000000000');
    useEffect(() => {
        if (recordForEdit !== null) setValues(recordForEdit);
    }, [recordForEdit]);
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
        temp.deviceId = deviceId === "00000000-0000-0000-0000-000000000000" ? false : true;
        temp.userId = userId === "00000000-0000-0000-0000-000000000000" ? false : true;
        setErrors(temp);
        return Object.values(temp).every((x) => x === true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const formData = {
                "userDeviceId": values.userDeviceId,
                "userId": userId.value,
                "deviceId": deviceId.value,
            }
            addOrEdit(formData);
        }
    };
    const applicationAPI = () => {
        return {
            create: (newrecord) =>
                axios.post(config.APIACTIVATEURL + config.CREATEUSERDEVICE, JSON.stringify(newrecord), { ...headerconfig }),
            update: (updateRecord) =>
                axios.put(config.APIACTIVATEURL + config.UPDATEUSERDEVICE, updateRecord),
            delete: (id) => axios.delete(config.APIACTIVATEURL + config.DELETEUSERDEVICE + "/" + id, { ...headerconfig })
        };
    };
    const addOrEdit = (formData) => {
        applicationAPI()
            .create(formData)
            .then((res) => {
                if (res.data.statusCode === 200) {
                    handleSuccess(res.data.data);
                    resetForm();
                    GetUserDevices(userDeviceId, pageNumber);
                }
                else {
                    handleError(res.data.data);
                }
            });

    };
    const resetForm = () => {
        setValues(initialFieldValues);
        setDeviceId('00000000-0000-0000-0000-000000000000');
        setUserId('00000000-0000-0000-0000-000000000000');
    };
    const handleUserSearch = (e) => {
        e.preventDefault();
        GetUserDevices(userDeviceId.value, pageNumber)
    };
    const GetUserDevices = (userDeviceId, number) => {
        axios
            .get(config.APIACTIVATEURL + config.GETUSERDEVICES + "?UserDeviceId=" + userDeviceId + "&pageNumber=" + number + "&pageSize=" + pageSize + "", { ...headerconfig })
            .then((response) => {
                setUserDevices(response.data.data.data);
                setPageNumber(response.data.data.pageNumber);
                setPageSize(response.data.data.pageSize);
                setTotalPages(response.data.data.totalPages);
                setData(response.data.data);
                setTotalRecords(response.data.data.totalRecords);
            });
    };
    const GetLastPageData = () => {
        GetUserDevices(userDeviceId, totalPages)
    }
    const GetFirstPageData = () => {
        GetUserDevices(userDeviceId, pageNumber)
    }
    const GetPageData = (number) => {
        setPageNumber(number);
        if (pageNumber !== number)
            GetUserDevices(userDeviceId, number)
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
    const GetAllUserDevices = () => {
        axios
            .get(config.APIACTIVATEURL + config.GETALLUSERDEVICES, { ...headerconfig })
            .then((response) => {
                setSearchDevices(response.data.data);
            });
    };
    const GetUsers = () => {
        axios
            .get(config.APIACTIVATEURL + config.GETALLUSERS, { ...headerconfig })
            .then((response) => {
                setUsers(response.data.data);
            });
    };
    const GetDevices = () => {
        axios
            .get(config.APIACTIVATEURL + config.GETALLDEVICES, { ...headerconfig })
            .then((response) => {
                setDevices(response.data.data);
            });
    };
    const onDelete = (e, id) => {
        e.preventDefault();
        if (window.confirm('Are you sure to delete this record?'))
            applicationAPI().delete(id)
                .then(res => {
                    handleSuccess("Device Deleted Succesfully");
                    GetUserDevices(userDeviceId, pageNumber);
                })
    }
    const showEditDetails = (data) => {
        setRecordForEdit(data);
    };
    const applyErrorClass = (field) =>
        field in errors && errors[field] === false ? " form-select-danger" : "";
    useEffect(() => {
        GetDevices();
        GetUsers();
        GetUserDevices(userDeviceId, pageNumber);
        GetAllUserDevices();
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
                                    <h4 className="mb-sm-0">Assign User Devices</h4>
                                    <div className="page-title-right">
                                        <ol className="breadcrumb m-0">
                                            <li className="breadcrumb-item"><Link>Home</Link></li>
                                            <li className="breadcrumb-item active">User Devices</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="alert alert-success">
                            <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                                <div className="row">
                                    <div className="col-lg-3">
                                        <div className="mb-4">
                                            <label htmlFor="userId" className="form-label">Users</label>
                                            <Select
                                                value={userId}
                                                onChange={setUserId}
                                                options={users}
                                                isSearchable
                                            />
                                            {/* <select name="userId" value={values.userId} onChange={handleInputChange} className={"form-select" + applyErrorClass('userId')}>
                                                <option value="00000000-0000-0000-0000-000000000000">Please Select</option>
                                                {users.length > 0 && users.map(user =>
                                                    <option value={user.userId}>{user.name}</option>
                                                )}
                                            </select> */}
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="mb-4">
                                            <label htmlFor="blockId" className="form-label">Devices</label>
                                            <Select
                                                value={deviceId}
                                                onChange={setDeviceId}
                                                options={devices}
                                                isSearchable
                                            />
                                            {/* <select name="deviceId" value={values.deviceId} onChange={handleInputChange} className={"form-select" + applyErrorClass('deviceId')}>
                                                <option value="00000000-0000-0000-0000-000000000000">Please Select</option>
                                                {devices.length > 0 && devices.map(device =>
                                                    <option value={device.value}>{device.label}</option>
                                                )}
                                            </select> */}
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
                                        <div className="row">
                                            <div className="col-lg-5">
                                                <div className="mb-4">
                                                    <label>Search User Devices</label>
                                                    <Select
                                                        value={userDeviceId}
                                                        onChange={setUserDeviceId}
                                                        options={searchDevices}
                                                        isSearchable
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-2">
                                                <div className="hstack gap-2 justify-content-end mb-3 mt-4">
                                                    <button type="button" onClick={(e) => handleUserSearch(e)} className="btn btn-success">Search</button>
                                                    <button type="button" className="btn btn-danger" onClick={resetForm}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive table-card">
                                            <table id="example" className="table table-bordered dt-responsive nowrap table-striped align-middle" style={{ width: '100%' }}>
                                                <thead>
                                                    <tr>
                                                        <th data-ordering="false">Device Name</th>
                                                        <th data-ordering="false">End DeviceId</th>
                                                        <th data-ordering="false">User</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {userDevices.length > 0 && userDevices.map(ud =>
                                                        <tr key={ud.userDeviceId}>
                                                            <td>{ud.deviceName}</td>
                                                            <td>{ud.endDeviceId}</td>
                                                            <td>{ud.name}</td>
                                                            <td>
                                                                <div className="dropdown d-inline-block">
                                                                    <Link className="dropdown-item remove-item-btn" onClick={e => onDelete(e, ud.userDeviceId)}>
                                                                        <i className="ri-delete-bin-fill align-bottom me-2 text-muted" />
                                                                    </Link>
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