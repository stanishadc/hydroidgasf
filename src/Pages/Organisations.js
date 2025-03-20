import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import config from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
const initialFieldValues = {
    organisationId: "00000000-0000-0000-0000-000000000000",
    organisationName: "",
    city: "",
    country: "India",
    contactNumber: "",
    address: ""
};
export default function Organisations() {
    const [values, setValues] = useState(initialFieldValues);
    const [recordForEdit, setRecordForEdit] = useState(null);
    const [errors, setErrors] = useState({});
    const [organisations, setOrganisations] = useState([]);
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
        temp.organisationName = values.organisationName === "" ? false : true;
        temp.city = values.city === "" ? false : true;
        setErrors(temp);
        return Object.values(temp).every((x) => x === true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const formData = {
                "organisationId": values.organisationId,
                "organisationName": values.organisationName,
                "city": values.city,
                "country": values.country,
                "address": values.address
            }
            addOrEdit(formData);
        }
    };
    const applicationAPI = () => {
        return {
            create: (newrecord) =>
                axios.post(config.APIACTIVATEURL + config.CREATEORGANISATION, JSON.stringify(newrecord), { ...headerconfig }),
            update: (updateRecord) =>
                axios.put(config.APIACTIVATEURL + config.UPDATEORGANISATION, updateRecord),
            delete: (id) => axios.delete(config.APIACTIVATEURL + config.DELETEORGANISATION + "/" + id, { ...headerconfig })
        };
    };
    const addOrEdit = (formData) => {
        if (formData.organisationId === "00000000-0000-0000-0000-000000000000") {
            applicationAPI()
                .create(formData)
                .then((res) => {
                    if (res.data.statusCode === 200) {
                        handleSuccess(res.data.message);
                        resetForm();
                        GETORGANISATIONS();
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
                        GETORGANISATIONS();
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
    const GETORGANISATIONS = () => {
        axios
            .get(config.APIACTIVATEURL + config.GETORGANISATIONS, { ...headerconfig })
            .then((response) => {
                    setOrganisations(response.data.data.data);
            });
    };
    const onDelete = (e, id) => {
        if (window.confirm('Are you sure to delete this record?'))
            applicationAPI().delete(id)
                .then(res => {
                    handleSuccess("Record Deleted Succesfully");
                    GETORGANISATIONS();
                })
    }
    const showEditDetails = (data) => {
        setRecordForEdit(data);
    };
    const applyErrorClass = (field) =>
        field in errors && errors[field] === false ? " form-control-danger" : "";
    useEffect(() => {
        GETORGANISATIONS();
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
                                    <h4 className="mb-sm-0">Organisations</h4>
                                    <div className="page-title-right">
                                        <ol className="breadcrumb m-0">
                                            <li className="breadcrumb-item"><Link>Home</Link></li>
                                            <li className="breadcrumb-item active">Organisations</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="alert alert-success">
                            <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                                <div className="row">
                                    <div className="col-lg-2">
                                        <div className="mb-4">
                                            <label htmlFor="organisationName" className="form-label">Organisation Name</label>
                                            <input type="text" value={values.organisationName} name="organisationName" onChange={handleInputChange} className={"form-control" + applyErrorClass('organisationName')} placeholder="Organisation Name" />
                                        </div>
                                    </div>
                                    <div className="col-lg-2">
                                        <div className="mb-4">
                                            <label htmlFor="city" className="form-label">City</label>
                                            <input type="text" value={values.city} name="city" onChange={handleInputChange} className={"form-control" + applyErrorClass('city')} placeholder="City" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="mb-4">
                                            <label htmlFor="address" className="form-label">Address</label>
                                            <input type="text" value={values.address} name="address" onChange={handleInputChange} className={"form-control" + applyErrorClass('address')} placeholder="Address" />
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
                                        <h5 className="card-title mb-0">Organisations List</h5>
                                    </div>
                                    <div className="card-body">
                                        <table id="example" className="table table-bordered dt-responsive nowrap table-striped align-middle" style={{ width: '100%' }}>
                                            <thead>
                                                <tr>
                                                    <th data-ordering="false">Name</th>
                                                    <th data-ordering="false">City</th>
                                                    <th>Address</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {organisations.length > 0 && organisations.map(organisation =>
                                                    <tr key={organisation.organisationId}>
                                                        <td>{organisation.organisationName}</td>
                                                        <td>{organisation.city}</td>
                                                        <td>{organisation.address}</td>
                                                        <td>
                                                            <ul className="list-inline hstack gap-2 mb-0">
                                                                <li className="list-inline-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Edit">
                                                                    <Link className="edit-item-btn" onClick={e => showEditDetails(organisation)}><i className="ri-pencil-fill align-bottom text-muted" /></Link>
                                                                </li>
                                                                <li className="list-inline-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Delete">
                                                                    <Link className="remove-item-btn" onClick={e => onDelete(e, organisation.organisationId)}>
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