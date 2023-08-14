import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { TicketStatus, TicketPriority } from "../Common/Enums";
import { useState, useEffect } from "react";
import axios from 'axios';
import {APIConfig} from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
import moment from "moment";
const initialFieldValues = {
    paymentId: "00000000-0000-0000-0000-000000000000",
    transactionNo: "",
    orderId: "",
    senderUserId: "00000000-0000-0000-0000-000000000000",
    receiverUserId: "00000000-0000-0000-0000-000000000000",
    amount: 0,
    status: "",
    paymentType: "",
    description: ""
};
export default function Payments() {
    const [values, setValues] = useState(initialFieldValues);
    const [recordForEdit, setRecordForEdit] = useState(null);
    const [errors, setErrors] = useState({});
    const [users, setUsers] = useState([]);
    const [payments, setPayments] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
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
        temp.receiverUserId = values.receiverUserId === "00000000-0000-0000-0000-000000000000" ? false : true;
        setErrors(temp);
        return Object.values(temp).every((x) => x === true);
    };
    const handleSubmit = (ticket) => {
        const formData = {
            "paymentId": ticket.paymentId,
            "transactionNo": ticket.transactionNo,
            "orderId": ticket.orderId,
            "senderUserId": localStorage.getItem("userId"),
            "receiverUserId": ticket.receiverUserId,
            "amount": ticket.amount,
            "status": ticket.status,
            "paymentType": ticket.paymentType,
            "description": ticket.description
        }
        addOrEdit(formData);
    };
    const applicationAPI = () => {
        return {
            update: (updateRecord) => axios.put(APIConfig.APIACTIVATEURL + APIConfig.UPDATEPAYMENTREQUEST, updateRecord)
        };
    };
    const addOrEdit = (formData) => {
        console.log(formData)
        applicationAPI()
            .update(formData)
            .then((res) => {
                if (res.data.statusCode === 201) {
                    handleSuccess("Payment Successfully Received");
                    resetForm();
                    GetPaymentByUser("1");
                }
                else {
                    handleError("Transaction failed. Please contact administrator");
                }
            });

    };
    const resetForm = () => {
        setValues(initialFieldValues);
    };
    const GetPaymentByUser = (number) => {
        axios
            .get(APIConfig.APIACTIVATEURL + APIConfig.GETPAYMENTREQUESTBYUSER + "?Id=" + localStorage.getItem('userId') + "&pageNumber=" + number + "&pageSize=" + pageSize + "", { ...headerconfig })
            .then((response) => {
                setPayments(response.data.data.data);
                setPageNumber(response.data.data.pageNumber);
                setPageSize(response.data.data.pageSize);
                setTotalPages(response.data.data.totalPages);
                setData(response.data.data);
                setTotalRecords(response.data.data.totalRecords);
            });
    };
    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }
    async function displayRazorpay(e, ticket) {
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        // creating a new order
        const result = await axios.post(APIConfig.APIACTIVATEURL + APIConfig.PROCESSPAYMENTORDER + "?UserId=" + localStorage.getItem('userId') + "&Amount=" + ticket.amount);

        if (!result) {
            alert("Server error. Are you online?");
            return;
        }
        // Getting the order details back
        const { amount, id: order_id, currency } = result.data.data;

        const options = {
            key: APIConfig.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
            amount: amount,
            currency: currency,
            name: "ino-fi solutions pvt ltd.",
            description: "Water Bill Payment",
            order_id: order_id,
            handler: async function (response) {
                const data = {
                    orderCreationId: order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                };
                console.log(response)
                console.log(response.razorpay_payment_id);
                ticket.transactionNo = response.razorpay_payment_id;
                ticket.orderId = response.razorpay_order_id
                ticket.status = "SUCCESS";
                handleSubmit(ticket);
            },
            prefill: {
                name: ticket.name,
                email: ticket.email,
                contact: ticket.phoneNo,
            },
            notes: {
                address: ticket.city,
            },
            theme: {
                color: "#61dafb",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }
    const GetLastPageData = () => {
        GetPaymentByUser(totalPages)
    }
    const GetFirstPageData = () => {
        GetPaymentByUser("1")
    }
    const GetPageData = (number) => {
        setPageNumber(number);
        if (pageNumber !== number)
            GetPaymentByUser(number)
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
        GetPaymentByUser(pageNumber);
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
                                    <h4 className="mb-sm-0">Payments</h4>
                                    <div className="page-title-right">
                                        <ol className="breadcrumb m-0">
                                            <li className="breadcrumb-item"><Link>Home</Link></li>
                                            <li className="breadcrumb-item active">Payments</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
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
                                                    {payments.length > 0 && payments.map((p, index) =>
                                                        <tr key={p.ticketId}>
                                                            <td>{index + 1}</td>
                                                            <td>{p.name}</td>
                                                            <td>{p.amount}</td>
                                                            <td>{moment.utc(p.createdDate).local().format('MMM Do YYYY')}</td>
                                                            <td>{p.description}</td>
                                                            <td>
                                                                {p.status === 'SUCCESS' ? <span className="badge bg-success">PAID</span> : <span className="badge bg-warning">PENDING</span>}
                                                            </td>
                                                            <td>
                                                                {p.status === 'PENDING' ?
                                                                    <div class="hstack gap-3 flex-wrap">
                                                                        <button onClick={e => displayRazorpay(e, p)} class="btn btn-sm btn-success">PAY NOW</button>
                                                                    </div>
                                                                    :
                                                                    <div class="hstack gap-3 flex-wrap">
                                                                        <Link to={"/paymentdetails/" + p.paymentId} class="btn btn-sm btn-success">VIEW</Link>
                                                                    </div>}
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