import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { UserStatus } from "../Common/Enums";
import { useState, useEffect } from "react";
import axios from 'axios';
import { APIConfig } from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
const initialFieldValues = {
    id: 0,
    deviceId: "",
    applicationId: "",
    userId: localStorage.getItem("userId"),
    status: true
};
export default function Devices() {
    const [values, setValues] = useState(initialFieldValues);
    const [recordForEdit, setRecordForEdit] = useState(null);
    const [errors, setErrors] = useState({});
    const [devices, setDevices] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const statusvalues = [
        { label: 'Active', value: true },
        { label: 'InActive', value: false }
    ]
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
        temp.deviceId = values.deviceId === "" ? false : true;
        temp.applicationId = values.applicationId === "" ? false : true;
        setErrors(temp);
        return Object.values(temp).every((x) => x === true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const formData = {
                "id": values.id,
                "userId": values.userId,
                "deviceId": values.deviceId,
                "applicationId": values.applicationId,
                "status": values.status === "true" ? true : false
            }
            addOrEdit(formData);
        }
    };
    const applicationAPI = () => {
        return {
            create: (newrecord) =>
                axios.post(APIConfig.APIACTIVATEURL + APIConfig.CREATEDEVICE, JSON.stringify(newrecord), { ...headerconfig }),
            update: (updateRecord) =>
                axios.put(APIConfig.APIACTIVATEURL + APIConfig.UPDATEDEVICE, updateRecord),
            delete: (id) => axios.delete(APIConfig.APIACTIVATEURL + APIConfig.DELETEDEVICE + "/" + id, { ...headerconfig })
        };
    };
    const addOrEdit = (formData) => {
        if (formData.id === 0) {
            applicationAPI()
                .create(formData)
                .then((res) => {
                    if (res.data.statusCode === 200) {
                        handleSuccess(res.data.message);
                        resetForm();
                        GetDevices(pageNumber);
                    }
                    else {
                        handleError(res.data.message);
                    }
                });
        }
        else {
            applicationAPI()
                .update(formData)
                .then((res) => {
                    if (res.data.statusCode === 200) {
                        handleSuccess(res.data.message);
                        resetForm();
                        GetDevices(pageNumber);
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
    const GetDevices = (number) => {
        axios
            .get(APIConfig.APIACTIVATEURL + APIConfig.GETALLDEVICES + "?pageNumber=" + number + "&pageSize=" + pageSize + "", { ...headerconfig })
            .then((response) => {
                if (response.data.data.succeeded === true) {
                    setDevices(response.data.data.data);
                    setPageNumber(response.data.data.pageNumber);
                    setPageSize(response.data.data.pageSize);
                    setTotalPages(response.data.data.totalPages);
                    setData(response.data.data);
                    setTotalRecords(response.data.data.totalRecords);
                }
            });
    };
    const onDelete = (e, id) => {
        if (window.confirm('Are you sure to delete this record?'))
            applicationAPI().delete(id)
                .then(res => {
                    handleSuccess("Device Deleted Succesfully");
                    GetDevices(pageNumber);
                })
    }
    const showEditDetails = (data) => {
        setRecordForEdit(data);
    };
    const GetLastPageData = () => {
        GetDevices(totalPages)
    }
    const GetFirstPageData = () => {
        GetDevices("1")
    }
    const GetPageData = (number) => {
        setPageNumber(number);
        if (pageNumber !== number)
            GetDevices(number)
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
        GetDevices(pageNumber);
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
                                    <h4 className="mb-sm-0">Devices</h4>
                                </div>
                            </div>
                        </div>
                        <div className="alert alert-success">
                            <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                                <div className="row">
                                    <div className="col-lg-3">
                                        <div className="mb-4">
                                            <label htmlFor="deviceId" className="form-label">Device ID</label>
                                            <input type="text" value={values.deviceId} name="deviceId" onChange={handleInputChange} className={"form-control" + applyErrorClass('deviceId')} placeholder="Device ID" />
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-4">
                                            <label htmlFor="applicationId" className="form-label">Application ID</label>
                                            <input type="text" value={values.applicationId} name="applicationId" onChange={handleInputChange} className={"form-control" + applyErrorClass('applicationId')} placeholder="Application ID" />
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-4">
                                            <label htmlFor="status" className="form-label">Status</label>
                                            <select value={values.status} onChange={handleInputChange} placeholder="Device Status" name="status" className={"form-control" + applyErrorClass('status')}>
                                                {statusvalues.map(sv =>
                                                    <option value={sv.value}>{sv.label}</option>
                                                )}
                                            </select>
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
                                        <h5 className="card-title mb-0">Devices List</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive table-card">
                                            <table id="example" className="table table-bordered dt-responsive nowrap table-striped align-middle" style={{ width: '100%' }}>
                                                <thead>
                                                    <tr>
                                                        <th data-ordering="false">Device ID</th>
                                                        <th data-ordering="false">Application ID</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {devices.length > 0 && devices.map(device =>
                                                        <tr key={device.id}>
                                                            <td>{device.deviceId}</td>
                                                            <td>{device.applicationId}</td>
                                                            <td>
                                                                {device.status === true ? <span className="badge bg-success">{UserStatus.ACTIVE}</span> : <span className="badge bg-warning">{UserStatus.INACTIVE}</span>}
                                                            </td>
                                                            <td>
                                                                <div className="d-flex gap-2">
                                                                    <div className="edit">
                                                                        <Link className="dropdown-item edit-item-btn" onClick={() => { showEditDetails(device); }}><i className="ri-pencil-fill align-bottom me-2 text-muted" /></Link>
                                                                    </div>
                                                                    <div class="remove">
                                                                        <Link className="dropdown-item remove-item-btn" onClick={e => onDelete(e, device.id)}>
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
                                                    Showing <span className="fw-semibold">{devices.length}</span> of <span className="fw-semibold">{totalRecords}</span> Results
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