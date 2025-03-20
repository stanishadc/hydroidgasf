import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { UserStatus } from "../Common/Enums";
import { useState, useEffect } from "react";
import axios from 'axios';
import config from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
import Select from 'react-select';
const initialFieldValues = {
    unitId: "00000000-0000-0000-0000-000000000000",
    unitName: "",
    organisationId: "00000000-0000-0000-0000-000000000000",
    blockId: "00000000-0000-0000-0000-000000000000",
    floorId: "00000000-0000-0000-0000-000000000000",
    userName: "",
    password: "",
    name: "",
    email: "",
    phoneNo: "",
    city: "Bangalore",
    country: "India",
    deviceId: null,
    userId: "00000000-0000-0000-0000-000000000000",
    status: "true"
};
export default function Units() {
    const [values, setValues] = useState(initialFieldValues);
    const [recordForEdit, setRecordForEdit] = useState(null);
    const [errors, setErrors] = useState({});
    const [units, setUnits] = useState([]);
    const [floors, setFloors] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [organisations, setOrganisations] = useState([]);
    const [deviceIds, setDeviceIds] = useState([]);
    const [deviceId, setDeviceId] = useState([]);
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
        //temp.deviceId = values.deviceId === "" ? false : true;
        //temp.applicationId = values.applicationId === "" ? false : true;
        temp.floorId = values.floorId === "00000000-0000-0000-0000-000000000000" ? false : true;
        //temp.userId = values.userId === "00000000-0000-0000-0000-000000000000" ? false : true;
        setErrors(temp);
        return Object.values(temp).every((x) => x === true);
    };
    const onDevicesChange = (selectedOptions) => {
        setDeviceId([]);
        selectedOptions.forEach(element => {
            setDeviceId(deviceId => [...deviceId, element.value]);
        });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const formData = {
                "unitId": values.unitId,
                "unitName": values.unitName,
                "floorId": values.floorId,
                "deviceId": deviceId,
                "userName": values.userName,
                "password": values.password,
                "name": values.name,
                "email": values.email,
                "phoneNo": values.phoneNo,
                "city": values.city,
                "country": values.country,
                "status": values.status === "true" ? true : false
            }
            addOrEdit(formData);
        }
    };
    const applicationAPI = () => {
        return {
            create: (newrecord) =>
                axios.post(config.APIACTIVATEURL + config.CREATEUNIT, JSON.stringify(newrecord), { ...headerconfig }),
            update: (updateRecord) =>
                axios.put(config.APIACTIVATEURL + config.UPDATEUNIT, updateRecord),
            delete: (id) => axios.delete(config.APIACTIVATEURL + config.DELETEUNIT + "/" + id, { ...headerconfig })
        };
    };
    const addOrEdit = (formData) => {
        if (formData.unitId === "00000000-0000-0000-0000-000000000000") {
            applicationAPI()
                .create(formData)
                .then((res) => {
                    if (res.data.statusCode === 200) {
                        handleSuccess(res.data.message);
                        resetForm();
                        GetUnits('1');
                    }
                    else {
                        handleError(res.data.message);
                    }
                });
        } else {
            applicationAPI()
                .update(formData)
                .then((res) => {
                    if (res.data.statusCode === 200) {
                        handleSuccess(res.data.message);
                        resetForm();
                        GetUnits('1');
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
            .get(config.APIACTIVATEURL + config.GETALLUNITS, { ...headerconfig })
            .then((response) => {
                setUnits(response.data.data.data);
            });
    };
    const GetOrganisations = () => {
        axios
            .get(config.APIACTIVATEURL + config.GETALLORGANISATIONS, { ...headerconfig })
            .then((response) => {
                setOrganisations(response.data.data.data);
            });
    };
    const GetDevices = () => {
        axios
            .get(config.APIACTIVATEURL + config.GETACTIVEDEVICE, { ...headerconfig })
            .then((response) => {
                setDeviceIds(response.data.data);
            });
    };
    const handleOrganisationChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
        GetBlocksByOrganisation(e.target.value);
    };
    const GetBlocksByOrganisation = (Id) => {
        axios
            .get(config.APIACTIVATEURL + config.GETBLOCKBYORGANISATION + "/" + Id, { ...headerconfig })
            .then((response) => {
                setBlocks(response.data.data.data);
            });
    };
    const handleBlocksChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
        GetFloorsByBlock(e.target.value);
    };
    const GetFloorsByBlock = (Id) => {
        axios
            .get(config.APIACTIVATEURL + config.GETFlOORBYBLOCK + "/" + Id, { ...headerconfig })
            .then((response) => {
                setFloors(response.data.data.data);
            });
    };
    const onDelete = (e, id) => {
        if (window.confirm('Are you sure to delete this record?'))
            applicationAPI().delete(id)
                .then(res => {
                    handleSuccess("Record Deleted Succesfully");
                    GetUnits('1');
                })
    }    
    const applyErrorClass = (field) =>
        field in errors && errors[field] === false ? " form-control-danger" : "";
    const applySelectErrorClass = (field) =>
        field in errors && errors[field] === false ? " form-select-danger" : "";
    useEffect(() => {
        GetUnits();
        GetDevices();
        GetOrganisations();
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
                                        <div className="mb-4">
                                            <label htmlFor="organisationId" className="form-label">Organisation</label>
                                            <select name="organisationId" value={values.organisationId} onChange={handleOrganisationChange} className={"form-select" + applySelectErrorClass('organisationId')}>
                                                <option value="00000000-0000-0000-0000-000000000000">Please Select</option>
                                                {organisations.length > 0 && organisations.map(floor =>
                                                    <option value={floor.organisationId}>{floor.organisationName}</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-4">
                                            <label htmlFor="blockId" className="form-label">Blocks</label>
                                            <select name="blockId" value={values.blockId} onChange={handleBlocksChange} className={"form-select" + applySelectErrorClass('blockId')}>
                                                <option value="00000000-0000-0000-0000-000000000000">Please Select</option>
                                                {blocks.length > 0 && blocks.map(block =>
                                                    <option value={block.blockId}>{block.blockName}</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-4">
                                            <label htmlFor="floorId" className="form-label">Floors</label>
                                            <select name="floorId" value={values.floorId} onChange={handleInputChange} className={"form-select" + applySelectErrorClass('floorId')}>
                                                <option value="00000000-0000-0000-0000-000000000000">Please Select</option>
                                                {floors.length > 0 && floors.map(floor =>
                                                    <option value={floor.floorId}>{floor.floorName}</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-3">
                                            <label htmlFor="unitName" className="form-label">Unit Name</label>
                                            <input type="text" value={values.unitName} name="unitName" onChange={handleInputChange} className={"form-control" + applyErrorClass('unitName')} placeholder="Unit Name" />
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-3">
                                            <label htmlFor="userName" className="form-label">User Name</label>
                                            <input type="text" value={values.userName} name="userName" onChange={handleInputChange} className={"form-control" + applyErrorClass('userName')} placeholder="User Name" />
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label">Password</label>
                                            <input type="password" value={values.password} name="password" onChange={handleInputChange} className={"form-control" + applyErrorClass('password')} placeholder="Password" />
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
                                            <label htmlFor="phoneNo" className="form-label">PhoneNo</label>
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
                                    <div className="col-lg-3">
                                        <div className="mb-3">
                                            <label htmlFor="status" className="form-label">Status</label>
                                            <select value={values.status} onChange={handleInputChange} placeholder="Role Status" name="status" className={"form-control" + applyErrorClass('status')}>
                                                <option value="true">{UserStatus.ACTIVE}</option>
                                                <option value="false">{UserStatus.INACTIVE}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="status" className="form-label">Devices</label>
                                            <Select
                                                isMulti
                                                name="choices"
                                                options={deviceIds}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                onChange={onDevicesChange}
                                            />
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
                                                    <th data-ordering="false">User</th>
                                                    <th data-ordering="false">Email</th>
                                                    <th data-ordering="false">PhoneNo</th>
                                                    <th data-ordering="false">Unit or Flat</th>
                                                    <th data-ordering="false">Block</th>
                                                    <th data-ordering="false">Organisation</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {units.length > 0 && units.map(unit =>
                                                    <tr key={unit.unitId}>
                                                        <td>{unit.name}</td>
                                                        <td>{unit.email}</td>
                                                        <td>{unit.phoneNo}</td>
                                                        <td>{unit.unitName}</td>
                                                        <td>{unit.blockName}</td>
                                                        <td>{unit.organisationName}</td>
                                                        <td>
                                                            {unit.status === true ? <span className="badge bg-success">{UserStatus.ACTIVE}</span> : <span className="badge bg-warning">{UserStatus.INACTIVE}</span>}
                                                        </td>
                                                        <td>
                                                            <ul className="list-inline hstack gap-2 mb-0">
                                                                <li className="list-inline-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Edit">
                                                                    <Link className="edit-item-btn" onClick={e => showEditDetails(unit)}><i className="ri-pencil-fill align-bottom text-muted" /></Link>
                                                                </li>
                                                                <li className="list-inline-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Delete">
                                                                    <Link className="remove-item-btn" onClick={e => onDelete(e, unit.unitId)}>
                                                                        <i className="ri-delete-bin-fill align-bottom text-muted" />
                                                                    </Link>
                                                                </li>
                                                            </ul>
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