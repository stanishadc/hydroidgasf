import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import { APIConfig } from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
const initialFieldValues = {
    blockId: "00000000-0000-0000-0000-000000000000",
    blockName: "",
    apartmentId: "00000000-0000-0000-0000-000000000000"
};
export default function Blocks() {
    const [values, setValues] = useState(initialFieldValues);
    const [recordForEdit, setRecordForEdit] = useState(null);
    const [errors, setErrors] = useState({});
    const [apartments, setApartments] = useState([]);
    const [blocks, setBlocks] = useState([]);
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
        temp.blockName = values.blockName === "" ? false : true;
        temp.apartmentId = values.apartmentId === "00000000-0000-0000-0000-000000000000" ? false : true;
        setErrors(temp);
        return Object.values(temp).every((x) => x === true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const formData = {
                "blockId": values.blockId,
                "blockName": values.blockName,
                "apartmentId": values.apartmentId
            }
            addOrEdit(formData);
        }
    };
    const applicationAPI = () => {
        return {
            create: (newrecord) =>
                axios.post(APIConfig.APIACTIVATEURL + APIConfig.CREATEBLOCK, JSON.stringify(newrecord), { ...headerconfig }),
            update: (updateRecord) =>
                axios.put(APIConfig.APIACTIVATEURL + APIConfig.UPDATEBLOCK, updateRecord),
            delete: (id) => axios.delete(APIConfig.APIACTIVATEURL + APIConfig.DELETEBLOCK + "/" + id, { ...headerconfig })
        };
    };
    const addOrEdit = (formData) => {
        console.log(formData)
        if (formData.blockId === "00000000-0000-0000-0000-000000000000") {
            applicationAPI()
                .create(formData)
                .then((res) => {
                    if (res.data.statusCode === 201) {
                        handleSuccess(res.data.message);
                        resetForm();
                        GetBlocks();
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
                    if (res.data.statusCode === 201) {
                        handleSuccess(res.data.message);
                        resetForm();
                        GetBlocks();
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
    const GetApartments = () => {
        axios
            .get(APIConfig.APIACTIVATEURL + APIConfig.GETALLAPARTMENTS, { ...headerconfig })
            .then((response) => {
                if (response.data.data.succeeded === true) {
                    setApartments(response.data.data.data);
                }
            });
    };
    const GetBlocks = () => {
        axios
            .get(APIConfig.APIACTIVATEURL + APIConfig.GETALLBLOCKS, { ...headerconfig })
            .then((response) => {
                if (response.data.data.succeeded === true) {
                    setBlocks(response.data.data.data);
                }
            });
    };
    const onDelete = (e, id) => {
        if (window.confirm('Are you sure to delete this record?'))
            applicationAPI().delete(id)
                .then(res => {
                    handleSuccess("Record Deleted Succesfully");
                    GetBlocks();
                })
    }
    const showEditDetails = (data) => {
        setRecordForEdit(data);
    };
    const applyErrorClass = (field) =>
        field in errors && errors[field] === false ? " form-control-danger" : "";
    useEffect(() => {
        GetApartments();
        GetBlocks();
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
                                    <h4 className="mb-sm-0">Blocks</h4>
                                    <div className="page-title-right">
                                        <ol className="breadcrumb m-0">
                                            <li className="breadcrumb-item"><Link>Home</Link></li>
                                            <li className="breadcrumb-item active">Blocks</li>
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
                                            <label htmlFor="apartmentId" className="form-label">Apartment</label>
                                            <select name="apartmentId" value={values.apartmentId} onChange={handleInputChange} className={"form-control" + applyErrorClass('apartmentId')}>
                                                <option value="00000000-0000-0000-0000-000000000000">Please Select</option>
                                                {apartments.length > 0 && apartments.map(apartment =>
                                                    <option value={apartment.apartmentId}>{apartment.apartmentName}</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-4">
                                            <label htmlFor="blockName" className="form-label">Block Name</label>
                                            <input type="text" value={values.blockName} name="blockName" onChange={handleInputChange} className={"form-control" + applyErrorClass('blockName')} placeholder="Block Name" />
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
                                        <h5 className="card-title mb-0">Apartments List</h5>
                                    </div>
                                    <div className="card-body">
                                        <table id="example" className="table table-bordered dt-responsive nowrap table-striped align-middle" style={{ width: '100%' }}>
                                            <thead>
                                                <tr>
                                                    <th data-ordering="false">Block Name</th>
                                                    <th data-ordering="false">Apartment</th>
                                                    <th data-ordering="false">Organisation</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {blocks.length > 0 && blocks.map(block =>
                                                    <tr key={block.blockId}>
                                                        <td>{block.blockName}</td>
                                                        <td>{block.apartmentName}</td>
                                                        <td>{block.organisationName}</td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <div className="edit">
                                                                    <Link className="dropdown-item edit-item-btn" onClick={() => { showEditDetails(block); }}><i className="ri-pencil-fill align-bottom me-2 text-muted" /></Link>
                                                                </div>
                                                                <div class="remove">
                                                                    <Link className="dropdown-item remove-item-btn" onClick={e => onDelete(e, block.blockId)}>
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
                                </div>
                            </div>{/*end col*/}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}