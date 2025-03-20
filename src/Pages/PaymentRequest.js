import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { TicketStatus, TicketPriority } from "../Common/Enums";
import { useState, useEffect } from "react";
import axios from 'axios';
import config from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
import moment from "moment";
import Select from 'react-select';
const initialFieldValues = {
    paymentId: "00000000-0000-0000-0000-000000000000",
    transactionNo: "",
    orderId: "",
    payedUser: "00000000-0000-0000-0000-000000000000",
    paymentRequestedUser: "00000000-0000-0000-0000-000000000000",
    amount: 0,
    status: "",
    paymentType: "",
    description: ""
};
export default function PaymentRequest() {
    const [values, setValues] = useState(initialFieldValues);
    const [recordForEdit, setRecordForEdit] = useState(null);
    const [errors, setErrors] = useState({});
    const [users, setUsers] = useState([]);
    const [tempUsers, setTempUsers] = useState([]);
    const [payments, setPayments] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [userId, setUserId] = useState('00000000-0000-0000-0000-000000000000');
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
        temp.amount = values.amount === 0 ? false : true;
        temp.payedUser = userId === "00000000-0000-0000-0000-000000000000" ? false : true;
        setErrors(temp);
        return Object.values(temp).every((x) => x === true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const formData = {
                "paymentId": values.paymentId,
                "transactionNo": values.transactionNo,
                "orderId": values.orderId,
                "paymentRequestedUser": localStorage.getItem("userId"),
                "payedUser": userId.value,//values.payedUser,
                "amount": values.amount,
                "status": "PENDING",
                "paymentType": values.paymentType,
                "description": values.description,
                "organisationId": localStorage.getItem("organisationId")
            }
            addOrEdit(formData);
        }
    };
    const applicationAPI = () => {
        return {
            create: (newrecord) =>
                axios.post(config.APIACTIVATEURL + config.CREATEPAYMENTREQUEST, JSON.stringify(newrecord), { ...headerconfig }),
            update: (updateRecord) =>
                axios.put(config.APIACTIVATEURL + config.UPDATEPAYMENTREQUEST, updateRecord),
            cancel: (id) => axios.delete(config.APIACTIVATEURL + config.CANCELPAYMENTREQUEST + "/" + id, { ...headerconfig })
        };
    };
    const addOrEdit = (formData) => {
        if (formData.paymentId === "00000000-0000-0000-0000-000000000000") {
            applicationAPI()
                .create(formData)
                .then((res) => {
                    if (res.data.statusCode === 200) {
                        handleSuccess(res.data.message);
                        resetForm();
                        GetPayments("1");
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
                        GetPayments("1");
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
    const GetUsers = () => {
        axios
            .get(config.APIACTIVATEURL + config.GETALLORGANISATIONUSERS + "?OrganisationId=" + localStorage.getItem('organisationId'), { ...headerconfig })
            .then((response) => {
                if (response.data.statusCode === 200) {
                    setUsers(response.data.data);
                    setTempUsers(response.data.data);
                }
            });
    };
    const GetPayments = (number) => {
        axios
            .get(config.APIACTIVATEURL + config.GETALLPAYMENTREQUESTS + "?OrganisationId=" + localStorage.getItem('organisationId') + "&pageNumber=" + number + "&pageSize=" + pageSize + "", { ...headerconfig })
            .then((response) => {
                setPayments(response.data.data.data);
                setPageNumber(response.data.data.pageNumber);
                setPageSize(response.data.data.pageSize);
                setTotalPages(response.data.data.totalPages);
                setData(response.data.data);
                setTotalRecords(response.data.data.totalRecords);
            });
    };
    const GetPaymentByUser = (number) => {
        axios
            .get(config.APIACTIVATEURL + config.GETPAYMENTREQUESTBYUSER + "?Id=" + values.payedUser + "?pageNumber=" + number + "&pageSize=" + pageSize + "", { ...headerconfig })
            .then((response) => {
                setPayments(response.data.data.data);
                setPageNumber(response.data.data.pageNumber);
                setPageSize(response.data.data.pageSize);
                setTotalPages(response.data.data.totalPages);
                setData(response.data.data);
                setTotalRecords(response.data.data.totalRecords);
            });
    };
    const onCancel = (e, id) => {
        if (window.confirm('Are you sure to cancel this payment?'))
            applicationAPI().delete(id)
                .then(res => {
                    handleSuccess("Payment Request Cancelled");
                    GetPayments("1");
                })
    }
    const applyErrorClass = (field) =>
        field in errors && errors[field] === false ? " form-control-danger" : "";
    const GetLastPageData = () => {
        GetPayments(totalPages)
    }
    const GetFirstPageData = () => {
        GetPayments("1")
    }
    const GetPageData = (number) => {
        setPageNumber(number);
        if (pageNumber !== number)
            GetPayments(number)
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
    useEffect(() => {
        GetUsers();
        GetPayments(pageNumber);
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
                                    <h4 className="mb-sm-0">Raise New Payment Request</h4>
                                    <div className="page-title-right">
                                        <ol className="breadcrumb m-0">
                                            <li className="breadcrumb-item"><Link>Home</Link></li>
                                            <li className="breadcrumb-item active">Payment Requests</li>
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
                                            <label htmlFor="payedUser" className="form-label">Customer</label>
                                            <Select
                                                value={userId}
                                                onChange={setUserId}
                                                options={users}
                                                isSearchable
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-4">
                                            <label htmlFor="amount" className="form-label">Amount</label>
                                            <input type="number" value={values.amount} name="amount" onChange={handleInputChange} className={"form-control" + applyErrorClass('amount')} placeholder="Amount" />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <label htmlFor="description" className="form-label">Payment Description</label>
                                            <textarea type="text" value={values.description} name="description" onChange={handleInputChange} className={"form-control" + applyErrorClass('description')} placeholder="Description" />
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
                                        <h5 className="card-title mb-0">Payments List</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive table-card">
                                            <table id="example" className="table table-bordered dt-responsive nowrap table-striped align-middle" style={{ width: '100%' }}>
                                                <thead>
                                                    <tr>
                                                        <th data-ordering="false">ID</th>
                                                        <th data-ordering="false">Name</th>
                                                        <th data-ordering="false">Amount</th>
                                                        <th data-ordering="false">Created Date</th>
                                                        <th data-ordering="false">Description</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {payments.length > 0 && payments.map((ticket, index) =>
                                                        <tr key={ticket.ticketId}>
                                                            <td>{index + 1}</td>
                                                            <td>{ticket.name}</td>
                                                            <td>{ticket.amount}</td>
                                                            <td>{moment(ticket.createdDate).format('MMM Do YYYY')}</td>
                                                            <td>{ticket.description}</td>
                                                            <td>
                                                                {ticket.status === 'SUCCESS' ? <span className="badge bg-success">SUCCESS</span> : <span className="badge bg-warning">PENDING</span>}
                                                            </td>
                                                            <td>
                                                                {ticket.status === 'SUCCESS' ? "" :
                                                                    <div class="hstack gap-3 flex-wrap">
                                                                        <Link onClick={e => onCancel(e, ticket.paymentId)} class="link-danger fs-15"><i class="ri-delete-bin-line"></i></Link>
                                                                    </div>
                                                                }
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="align-items-center mt-4 pt-2 justify-content-between d-flex">
                                            <div className="flex-shrink-0">
                                                <div className="text-muted">
                                                    Showing <span className="fw-semibold">{payments.length}</span> of <span className="fw-semibold">{totalRecords}</span> Results
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