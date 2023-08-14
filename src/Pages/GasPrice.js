import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { UserStatus } from "../Common/Enums";
import { useState, useEffect } from "react";
import axios from 'axios';
import { APIConfig } from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
import moment from 'moment';
const initialFieldValues = {
    gasPriceId: "00000000-0000-0000-0000-000000000000",
    quantity: 0,
    price: 0,
    status: "true"
};
export default function GasPrice() {
    const [values, setValues] = useState(initialFieldValues);
    const [recordForEdit, setRecordForEdit] = useState(null);
    const [errors, setErrors] = useState({});
    const [gasPrices, setGasPrices] = useState([]);
    const [gasList, setGasList] = useState(0);
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
        temp.quantity = values.quantity === 0 ? false : true;
        temp.price = values.price === 0 ? false : true;
        setErrors(temp);
        return Object.values(temp).every((x) => x === true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            var status = false;
            if (values.status === "true" || values.status === true) {
                status = true;
            }
            const formData = {
                "gasPriceId": values.gasPriceId,
                "quantity": values.quantity,
                "price": values.price,
                "status": status
            }
            addOrEdit(formData);
        }
    };
    const applicationAPI = () => {
        return {
            create: (newrecord) =>
                axios.post(APIConfig.APIACTIVATEURL + APIConfig.CREATEGASPRICE, JSON.stringify(newrecord), { ...headerconfig }),
            update: (updateRecord) =>
                axios.put(APIConfig.APIACTIVATEURL + APIConfig.UPDATEGASPRICE, updateRecord),
            delete: (id) => axios.delete(APIConfig.APIACTIVATEURL + APIConfig.DELETEGASPRICE + "?id=" + id, { ...headerconfig })
        };
    };
    const addOrEdit = (formData) => {
        if (formData.gasPriceId === "00000000-0000-0000-0000-000000000000") {
            applicationAPI()
                .create(formData)
                .then((res) => {
                    if (res.data.statusCode === 200) {
                        handleSuccess(res.data.message);
                        resetForm();
                        GetGasPrice();
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
                        GetGasPrice();
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
    const GetGasPrice = () => {
        axios
            .get(APIConfig.APIACTIVATEURL + APIConfig.GETALLGASPRICE, { ...headerconfig })
            .then((response) => {
                setGasPrices(response.data.data.data);
                setGasList(response.data.data.data.length)
            });
    };
    const onDelete = (e, id) => {
        if (window.confirm('Are you sure to delete this record?')) {
            if (gasList > 1) {
                applicationAPI().delete(id)
                    .then(res => {
                        handleSuccess("Record Deleted Succesfully");
                        GetGasPrice();
                    })
            }
            else {
                handleError("Minimum one Gas price is mandatory");
            }
        }
    }
    const applyErrorClass = (field) =>
        field in errors && errors[field] === false ? " form-control-danger" : "";
    useEffect(() => {
        GetGasPrice();
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
                                    <h4 className="mb-sm-0">Gas Prices</h4>
                                </div>
                            </div>
                        </div>
                        <div className="alert alert-success">
                            <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                                <div className="row">
                                    <div className="col-lg-3">
                                        <div className="mb-3">
                                            <label htmlFor="quantity" className="form-label">Quantity</label>
                                            <input type="text" value={values.quantity} name="quantity" onChange={handleInputChange} className={"form-control" + applyErrorClass('quantity')} placeholder="Quantity" />
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-3">
                                            <label htmlFor="price" className="form-label">Price</label>
                                            <input type="text" value={values.price} name="price" onChange={handleInputChange} className={"form-control" + applyErrorClass('price')} placeholder="Price Per KG" />
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-3">
                                            <label htmlFor="status" className="form-label">Status</label>
                                            <select value={values.status} onChange={handleInputChange} placeholder="Status" name="status" className={"form-control" + applyErrorClass('status')}>
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
                                        <h5 className="card-title mb-0">Gas Prices List</h5>
                                    </div>
                                    <div className="card-body">
                                        <table id="example" className="table table-bordered dt-responsive nowrap table-striped align-middle" style={{ width: '100%' }}>
                                            <thead>
                                                <tr>
                                                    <th data-ordering="false">Quantity</th>
                                                    <th data-ordering="false">Price</th>
                                                    <th data-ordering="false">Date</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {gasPrices.length > 0 && gasPrices.map(gp =>
                                                    <tr key={gp.gasPriceId}>
                                                        <td>{gp.quantity} KG</td>
                                                        <td>{gp.price} INR</td>
                                                        <td>{moment(gp.createdDate).format("YYYY-MM-DD hh:mm a")}</td>
                                                        <td>
                                                            {gp.status === true ? <span className="badge bg-success">{UserStatus.ACTIVE}</span> : <span className="badge bg-warning">{UserStatus.INACTIVE}</span>}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <div className="edit">
                                                                    <Link className="dropdown-item edit-item-btn" onClick={() => { showEditDetails(gp); }}><i className="ri-pencil-fill align-bottom me-2 text-muted" /></Link>
                                                                </div>
                                                                <div class="remove">
                                                                    <Link className="dropdown-item remove-item-btn" onClick={e => onDelete(e, gp.gasPriceId)}>
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