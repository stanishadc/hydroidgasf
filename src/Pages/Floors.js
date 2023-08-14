import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import { APIConfig } from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
const initialFieldValues = {
    floorId: "00000000-0000-0000-0000-000000000000",
    floorName: "",
    blockId: "00000000-0000-0000-0000-000000000000"
};
export default function Floors() {
    const [values, setValues] = useState(initialFieldValues);
    const [recordForEdit, setRecordForEdit] = useState(null);
    const [errors, setErrors] = useState({});
    const [blocks, setBlocks] = useState([]);
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
        temp.floorName = values.floorName === "" ? false : true;
        temp.blockId = values.blockId === "00000000-0000-0000-0000-000000000000" ? false : true;
        setErrors(temp);
        return Object.values(temp).every((x) => x === true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const formData = {
                "floorId": values.floorId,
                "floorName": values.floorName,
                "blockId": values.blockId
            }
            addOrEdit(formData);
        }
    };
    const applicationAPI = () => {
        return {
            create: (newrecord) =>
                axios.post(APIConfig.APIACTIVATEURL + APIConfig.CREATEFLOOR, JSON.stringify(newrecord), { ...headerconfig }),
            update: (updateRecord) =>
                axios.put(APIConfig.APIACTIVATEURL + APIConfig.UPDATEFLOOR, updateRecord),
            delete: (id) => axios.delete(APIConfig.APIACTIVATEURL + APIConfig.DELETEFLOOR + "/" + id, { ...headerconfig })
        };
    };
    const addOrEdit = (formData) => {
        if (formData.floorId === "00000000-0000-0000-0000-000000000000") {
            applicationAPI()
                .create(formData)
                .then((res) => {
                    console.log(res)
                    if (res.data.statusCode === 200) {
                        handleSuccess(res.data.message);
                        resetForm();
                        GetFloors();
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
                        GetFloors();
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
    const GetBlocks = () => {
        axios
            .get(APIConfig.APIACTIVATEURL + APIConfig.GETALLBLOCKS, { ...headerconfig })
            .then((response) => {
                if (response.data.data.succeeded === true) {
                    setBlocks(response.data.data.data);
                }
            });
    };
    const GetFloors = () => {
        axios
            .get(APIConfig.APIACTIVATEURL + APIConfig.GETALLFLOORS, { ...headerconfig })
            .then((response) => {
                if (response.data.data.succeeded === true) {
                    setFloors(response.data.data.data);
                }
            });
    };
    const onDelete = (e, id) => {
        if (window.confirm('Are you sure to delete this record?'))
            applicationAPI().delete(id)
                .then(res => {
                    handleSuccess("Record Deleted Succesfully");
                    GetFloors();
                })
    }
    const showEditDetails = (data) => {
        setRecordForEdit(data);
    };
    const applyErrorClass = (field) =>
        field in errors && errors[field] === false ? " form-control-danger" : "";
    useEffect(() => {
        GetBlocks();
        GetFloors();
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
                                    <h4 className="mb-sm-0">Floors</h4>
                                </div>
                            </div>
                        </div>
                        <div className="alert alert-success">
                            <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                                <div className="row">
                                    <div className="col-lg-3">
                                        <div className="mb-4">
                                            <label htmlFor="blockId" className="form-label">Block</label>
                                            <select name="blockId" value={values.blockId} onChange={handleInputChange} className={"form-control" + applyErrorClass('blockId')}>
                                                <option value="00000000-0000-0000-0000-000000000000">Please Select</option>
                                                {blocks.length > 0 && blocks.map(block =>
                                                    <option value={block.blockId}>{block.blockName}</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-4">
                                            <label htmlFor="floorName" className="form-label">Floor Name</label>
                                            <input type="text" value={values.floorName} name="floorName" onChange={handleInputChange} className={"form-control" + applyErrorClass('floorName')} placeholder="Floor Name" />
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
                                        <h5 className="card-title mb-0">Floors List</h5>
                                    </div>
                                    <div className="card-body">
                                        <table id="example" className="table table-bordered dt-responsive nowrap table-striped align-middle" style={{ width: '100%' }}>
                                            <thead>
                                                <tr>
                                                    <th data-ordering="false">Floor</th>
                                                    <th data-ordering="false">Block</th>
                                                    <th data-ordering="false">Apartment</th>
                                                    <th data-ordering="false">Organisation</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {floors.length > 0 && floors.map(floor =>
                                                    <tr key={floor.floorId}>
                                                        <td>{floor.floorName}</td>
                                                        <td>{floor.blockName}</td>
                                                        <td>{floor.apartmentName}</td>
                                                        <td>{floor.organisationName}</td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <div className="edit">
                                                                    <Link className="dropdown-item edit-item-btn" onClick={() => { showEditDetails(floor); }}><i className="ri-pencil-fill align-bottom me-2 text-muted" /></Link>
                                                                </div>
                                                                <div class="remove">
                                                                    <Link className="dropdown-item remove-item-btn" onClick={e => onDelete(e, floor.floorId)}>
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