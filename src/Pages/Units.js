import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { UserStatus } from "../Common/Enums";
import { useState, useEffect } from "react";
import axios from 'axios';
import {APIConfig} from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
const initialFieldValues = {
    unitId: "00000000-0000-0000-0000-000000000000",
    unitName: "",
    deviceId: "",
    applicationId: "",
    userId: "00000000-0000-0000-0000-000000000000",
    floorId: "00000000-0000-0000-0000-000000000000",
    status: "true"
};
export default function Units() {
    const [values, setValues] = useState(initialFieldValues);
    const [recordForEdit, setRecordForEdit] = useState(null);
    const [errors, setErrors] = useState({});
    const [units, setUnits] = useState([]);
    const [users, setUsers] = useState([]);
    const [floors, setFloors] = useState([]);
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
        temp.unitName = values.unitName === "" ? false : true;
        temp.deviceId = values.deviceId === "" ? false : true;
        temp.applicationId = values.applicationId === "" ? false : true;
        temp.floorId = values.floorId === "00000000-0000-0000-0000-000000000000" ? false : true;
        temp.userId = values.userId === "00000000-0000-0000-0000-000000000000" ? false : true;
        setErrors(temp);
        return Object.values(temp).every((x) => x === true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const formData = {
                "unitId": values.unitId,
                "unitName": values.unitName,
                "floorId": values.floorId,
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
                axios.post(APIConfig.APIACTIVATEURL + APIConfig.CREATEUNIT, JSON.stringify(newrecord), { ...headerconfig }),
            update: (updateRecord) =>
                axios.put(APIConfig.APIACTIVATEURL + APIConfig.UPDATEUNIT, updateRecord),
            delete: (id) => axios.delete(APIConfig.APIACTIVATEURL + APIConfig.DELETEUNIT + "/" + id, { ...headerconfig })
        };
    };
    const addOrEdit = (formData) => {
        console.log(formData)
        if (formData.unitId === "00000000-0000-0000-0000-000000000000") {
            applicationAPI()
                .create(formData)
                .then((res) => {
                    if (res.data.statusCode === 201) {
                        handleSuccess(res.data.message);
                        resetForm();
                        GetUnits();
                    }
                    else {
                        handleError(res.data.message);
                    }
                });
        } else {
            applicationAPI()
                .update(formData)
                .then((res) => {
                    if (res.data.statusCode === 202) {
                        handleSuccess(res.data.message);
                        resetForm();
                        GetUnits();
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
    const showEditDetails = (data) => {
        setRecordForEdit(data);
    };
    const GetUnits = () => {
        axios
            .get(APIConfig.APIACTIVATEURL + APIConfig.GETALLUNITS, { ...headerconfig })
            .then((response) => {
                setUnits(response.data.data.data);
            });
    };
    const GetFloors = () => {
        axios
            .get(APIConfig.APIACTIVATEURL + APIConfig.GETALLFLOORS, { ...headerconfig })
            .then((response) => {
                setFloors(response.data.data.data);
            });
    };
    const GetUsers = () => {
        axios
            .get(APIConfig.APIACTIVATEURL + APIConfig.GETALLUSERS, { ...headerconfig })
            .then((response) => {
                setUsers(response.data.data.data);
            });
    };
    const onDelete = (e, id) => {
        if (window.confirm('Are you sure to delete this record?'))
            applicationAPI().delete(id)
                .then(res => {
                    handleSuccess("Record Deleted Succesfully");
                    GetUnits();
                })
    }
    const applyErrorClass = (field) =>
        field in errors && errors[field] === false ? " form-control-danger" : "";
    useEffect(() => {
        GetUnits();
        GetFloors();
        GetUsers();
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
                                    <h4 className="mb-sm-0">Units</h4>
                                    <div className="page-title-right">
                                        <ol className="breadcrumb m-0">
                                            <li className="breadcrumb-item"><Link>Home</Link></li>
                                            <li className="breadcrumb-item active">Units</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="alert alert-success">
                            <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                                <div className="row">
                                    <div className="col-lg-3">
                                        <div className="mb-3">
                                            <label htmlFor="unitName" className="form-label">Unit Name</label>
                                            <input type="text" value={values.unitName} name="unitName" onChange={handleInputChange} className={"form-control" + applyErrorClass('unitName')} placeholder="Unit Name" />
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-3">
                                            <label htmlFor="deviceId" className="form-label">DeviceID</label>
                                            <input type="text" value={values.deviceId} name="deviceId" onChange={handleInputChange} className={"form-control" + applyErrorClass('deviceId')} placeholder="DeviceId" />
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-3">
                                            <label htmlFor="applicationId" className="form-label">ApplicationID</label>
                                            <input type="text" value={values.applicationId} name="applicationId" onChange={handleInputChange} className={"form-control" + applyErrorClass('applicationId')} placeholder="ApplicationId" />
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-4">
                                            <label htmlFor="floorId" className="form-label">Floor</label>
                                            <select name="floorId" value={values.floorId} onChange={handleInputChange} className={"form-control" + applyErrorClass('floorId')}>
                                                <option value="00000000-0000-0000-0000-000000000000">Please Select</option>
                                                {floors.length > 0 && floors.map(floor =>
                                                    <option value={floor.floorId}>{floor.floorName}</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-4">
                                            <label htmlFor="userId" className="form-label">User</label>
                                            <select name="userId" value={values.userId} onChange={handleInputChange} className={"form-control" + applyErrorClass('userId')}>
                                                <option value="00000000-0000-0000-0000-000000000000">Please Select</option>
                                                {users.length > 0 && users.map(user =>
                                                    <option value={user.userId}>{user.name}</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-3">
                                            <label htmlFor="status" className="form-label">Status</label>
                                            <select value={values.status} onChange={handleInputChange} placeholder="Role Status" name="status" className={"form-control" + applyErrorClass('status')}>
                                                <option value="true">{UserStatus.ACTIVE}</option>
                                                <option value="false">{UserStatus.INACTIVE}</option>
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
                                        <h5 className="card-title mb-0">Units List</h5>
                                    </div>
                                    <div className="card-body">
                                        <table id="example" className="table table-bordered dt-responsive nowrap table-striped align-middle" style={{ width: '100%' }}>
                                            <thead>
                                                <tr>
                                                    <th data-ordering="false">FlatNo</th>
                                                    <th data-ordering="false">User</th>
                                                    <th data-ordering="false">Email</th>
                                                    <th data-ordering="false">PhoneNo</th>
                                                    <th data-ordering="false">DeviceID</th>
                                                    <th data-ordering="false">ApplicationID</th>                                                    
                                                    <th data-ordering="false">Apartment</th>                                                    
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {units.length > 0 && units.map(unit =>
                                                    <tr key={unit.unitId}>
                                                        <td>{unit.unitName}</td>
                                                        <td>{unit.name}</td>
                                                        <td>{unit.email}</td>
                                                        <td>{unit.phoneNo}</td>
                                                        <td>{unit.deviceId}</td>
                                                        <td>{unit.applicationId}</td>                                                        
                                                        <td>{unit.apartmentName}</td>
                                                        <td>
                                                            {unit.status === true ? <span className="badge bg-success">{UserStatus.ACTIVE}</span> : <span className="badge bg-warning">{UserStatus.INACTIVE}</span>}
                                                        </td>
                                                        <td>
                                                            <div className="dropdown d-inline-block">
                                                                <button className="btn btn-soft-secondary btn-sm dropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    <i className="ri-more-fill align-middle" />
                                                                </button>
                                                                <ul className="dropdown-menu dropdown-menu-end">
                                                                    <li><Link className="dropdown-item edit-item-btn" onClick={() => { showEditDetails(unit); }}><i className="ri-pencil-fill align-bottom me-2 text-muted" /> Edit</Link></li>
                                                                    <li>
                                                                        <Link className="dropdown-item remove-item-btn" onClick={e => onDelete(e, unit.unitId)}>
                                                                            <i className="ri-delete-bin-fill align-bottom me-2 text-muted" /> Delete
                                                                        </Link>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
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