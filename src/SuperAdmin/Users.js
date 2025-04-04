import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { UserStatus } from "../Common/Enums";
import { useState, useEffect } from "react";
import axios from 'axios';
import config from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
const initialFieldValues = {
    name: "",
    userName: "",
    email: "",
    password: "",
    isActive: true,
    phoneNumber: "",
    block: "",
    wing: "",
    block: "",
    roleName: "CUSTOMER",
    organisationId: "00000000-0000-0000-0000-000000000000"
};
export default function Users() {
    const [values, setValues] = useState(initialFieldValues);
    const [errors, setErrors] = useState({});
    const [users, setUsers] = useState([]);
    const [organisations, setOrganisations] = useState([]);
    const [floors, setFloors] = useState([]);
    const [wings, setWings] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [organisationId, setOrganisationId] = useState('00000000-0000-0000-0000-000000000000');
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(50);
    const [pageNumber, setPageNumber] = useState(1);
    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchFloor, setSearchFloor] = useState("");
    const [searchBlock, setSearchBlock] = useState("");
    const [searchWing, setSearchWing] = useState("");
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
        temp.organisationId = organisationId === "00000000-0000-0000-0000-000000000000" ? false : true;
        setErrors(temp);
        return Object.values(temp).every((x) => x === true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const formData = {
                "name": values.name,
                "userName": values.userName,
                "email": values.email,
                "password": values.password,
                "isActive": values.isActive,
                "phoneNumber": values.phoneNumber,
                "roleName": values.roleName,
                "block": values.block,
                "wing": values.wing,
                "floor": values.floor,
                "organisationId": organisationId
            }
            addOrEdit(formData);
        }
    };
    const applicationAPI = () => {
        return {
            create: (newrecord) =>
                axios.post(config.APIACTIVATEURL + config.CREATEUSER, JSON.stringify(newrecord), { ...headerconfig }),
            userstatus: (id, ustatus) => axios.post(config.APIACTIVATEURL + config.USERSTATUS + "?userId=" + id + "&isActive=" + ustatus, { ...headerconfig })
        };
    };
    const addOrEdit = (formData) => {
        applicationAPI()
            .create(formData)
            .then((res) => {
                if (res.data.statusCode === 200) {
                    handleSuccess(res.data.data);
                    resetForm();
                    GetUsers(organisationId, pageNumber);
                }
                else {
                    handleError(res.data.data);
                }
            });
    };
    const resetForm = () => {
        setValues(initialFieldValues);
        setSearchBlock(0)
    };
    const handleorganisationChange = (organisationId) => {
        setOrganisationId(organisationId);
        GetFloorsWingsBlocks(organisationId);
        GetUsers(organisationId, pageNumber);
    }
    const GetUsers = (organisationId, number) => {
        axios
            .get(config.APIACTIVATEURL + config.GETCUSTOMERS + "?OrganisationId=" + organisationId + "&Block=" + searchBlock + "&Wing=" + searchWing + "&Floor=" + searchFloor + "&pageNumber=" + number + "&pageSize=" + pageSize + "", { ...headerconfig })
            .then((response) => {
                if (response.data.statusCode === 200) {
                    setUsers(response.data.data.data);
                    setPageNumber(response.data.data.pageNumber);
                    setPageSize(response.data.data.pageSize);
                    setTotalPages(response.data.data.totalPages);
                    setData(response.data.data);
                    setTotalRecords(response.data.data.totalRecords);
                }
            });
    };
    const onStatus = (e, id, ustatus, message) => {
        if (window.confirm(message))
            applicationAPI().userstatus(id, ustatus)
                .then(res => {
                    handleSuccess("User status changed succesfully");
                    GetUsers(organisationId,pageNumber);
                })
    }
    const GetLastPageData = () => {
        GetUsers(organisationId, totalPages)
    }
    const GetFirstPageData = () => {
        GetUsers(organisationId, pageNumber)
    }
    const GetPageData = (number) => {
        setPageNumber(number);
        if (pageNumber !== number)
            GetUsers(organisationId, number)
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
    const GetOrganisations = () => {
        axios
            .get(config.APIACTIVATEURL + config.GETALLORGANISATIONS, { ...headerconfig })
            .then((response) => {
                setOrganisations(response.data.data)
            });
    };
    const GetFloorsWingsBlocks = (id) => {
        axios
            .get(config.APIACTIVATEURL + config.GETDASHBOARDORGANISATION + "?OrganisationId=" + id, { ...headerconfig })
            .then((response) => {
                setBlocks(response.data.blocks)
                setWings(response.data.wings)
                setFloors(response.data.floors)
            });
    };
    const handleSearch = (e) => {
        e.preventDefault();
        GetUsers(organisationId, pageNumber);
    }
    const applyErrorClass = (field) =>
        field in errors && errors[field] === false ? " form-control-danger" : "";
    useEffect(() => {
        GetUsers(organisationId, pageNumber);
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
                                    <h4 className="mb-sm-0">Customers</h4>
                                    <div className="page-title-right">
                                        <ol className="breadcrumb m-0">
                                            <li className="breadcrumb-item"><Link>Home</Link></li>
                                            <li className="breadcrumb-item active">Customers</li>
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
                                            <label htmlFor="status" className="form-label">Organisation</label>
                                            <select value={organisationId} onChange={e => handleorganisationChange(e.target.value)} placeholder="organisation" name="organisationId" className={"form-select" + applyErrorClass('organisationId')}>
                                                <option value={0}>Please select</option>
                                                {organisations.map(sv =>
                                                    <option value={sv.organisationId}>{sv.organisationName}</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-4">
                                            <label htmlFor="userName" className="form-label">Block</label>
                                            <input type="text" value={values.block} name="block" onChange={handleInputChange} className={"form-control" + applyErrorClass('block')} placeholder="Block" />
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-4">
                                            <label htmlFor="userName" className="form-label">Wing</label>
                                            <input type="text" value={values.wing} name="wing" onChange={handleInputChange} className={"form-control" + applyErrorClass('wing')} placeholder="Wing" />
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-4">
                                            <label htmlFor="userName" className="form-label">Floor</label>
                                            <input type="text" value={values.floor} name="floor" onChange={handleInputChange} className={"form-control" + applyErrorClass('floor')} placeholder="Floor" />
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
                                            <select value={values.isActive} onChange={handleInputChange} placeholder="User Status" name="isActive" className={"form-select" + applyErrorClass('status')}>
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
                                            <input type="text" value={values.phoneNumber} name="phoneNumber" onChange={handleInputChange} className={"form-control" + applyErrorClass('phoneNo')} placeholder="Phone No" />
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
                                        <div className="row g-3">
                                            <div className="col-md-2">
                                                <select value={searchBlock} onChange={e => setSearchBlock(e.target.value)} placeholder="Block" name="Block" className={"form-select" + applyErrorClass('Block')}>
                                                    <option value="">Block</option>
                                                    {blocks.map(sv =>
                                                        <option value={sv.block}>{sv.block}</option>
                                                    )}
                                                </select>
                                            </div>
                                            <div className="col-md-2">
                                                <select value={searchWing} onChange={e => setSearchWing(e.target.value)} placeholder="Wing" name="Wing" className={"form-select" + applyErrorClass('Block')}>
                                                    <option value="">Wing</option>
                                                    {wings.map(sv =>
                                                        <option value={sv.wing}>{sv.wing}</option>
                                                    )}
                                                </select>
                                            </div>
                                            <div className="col-md-2">
                                                <select value={searchFloor} onChange={e => setSearchFloor(e.target.value)} placeholder="Floor" name="Floor" className={"form-select" + applyErrorClass('Floor')}>
                                                    <option value="">Floor</option>
                                                    {floors.map(sv =>
                                                        <option value={sv.floor}>{sv.floor}</option>
                                                    )}
                                                </select>
                                            </div>
                                            <div className="col-md-2">
                                                <div className="hstack gap-2 justify-content-end mb-3">
                                                    <button type="button" onClick={e => handleSearch(e)} className="btn btn-primary">Search</button>
                                                    <button type="button" className="btn btn-danger" onClick={resetForm}>Clear</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-body">
                                        <div className="table-responsive table-card">
                                            <table id="example" className="table table-bordered dt-responsive nowrap table-striped align-middle" style={{ width: '100%' }}>
                                                <thead>
                                                    <tr>
                                                        <th data-ordering="false">Name</th>
                                                        <th data-ordering="false">UserName</th>
                                                        <th data-ordering="false">Email</th>
                                                        <th data-ordering="false">PhoneNo</th>
                                                        <th data-ordering="false">Block</th>
                                                        <th data-ordering="false">Floor</th>
                                                        <th data-ordering="false">Organisation</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {users.length > 0 && users.map(user =>
                                                        <tr key={user.Id}>
                                                            <td>{user.name}</td>
                                                            <td>{user.userName}</td>
                                                            <td>{user.email}</td>
                                                            <td>{user.phoneNumber}</td>
                                                            <td>{user.block}</td>
                                                            <td>{user.floor}</td>
                                                            <td>{user.organisationName}</td>
                                                            <td>
                                                                {user.isActive === true ? <span className="badge bg-success">{UserStatus.ACTIVE}</span> : <span className="badge bg-warning">{UserStatus.INACTIVE}</span>}
                                                            </td>
                                                            <td>
                                                                <ul className="list-inline hstack gap-2 mb-0">
                                                                    <li className="list-inline-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Active or InActive User">
                                                                        {user.isActive === true ?
                                                                            <Link className="dropdown-item remove-item-btn" onClick={e => onStatus(e, user.id, false, "Are you sure to want inactive the user ?")}>
                                                                                <i className="ri-eye-fill align-bottom me-2 text-muted" />
                                                                            </Link>
                                                                            :
                                                                            <Link className="dropdown-item remove-item-btn" onClick={e => onStatus(e, user.id, true, "Are you sure to want active the user ?")}>
                                                                                <i className="ri-eye-off-fill align-bottom me-2 text-muted" />
                                                                            </Link>
                                                                        }
                                                                    </li>
                                                                </ul>
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