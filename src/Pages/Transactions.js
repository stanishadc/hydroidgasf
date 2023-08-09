import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { TicketStatus, TicketPriority } from "../Common/Enums";
import { useState, useEffect } from "react";
import axios from 'axios';
import {APIConfig} from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
import moment from "moment";

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const headerconfig = {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("userToken"),
            'Content-Type': 'application/json'
        }
    }
    const GetTransactions = (number) => {
        axios
            .get(APIConfig.APIACTIVATEURL + APIConfig.GETALLTRANSACTIONS+ "?pageNumber=" + number + "&pageSize=" + pageSize + "", { ...headerconfig })
            .then((response) => {
                setTransactions(response.data.data.data);
                setPageNumber(response.data.data.pageNumber);
                setPageSize(response.data.data.pageSize);
                setTotalPages(response.data.data.totalPages);
                setData(response.data.data);
                setTotalRecords(response.data.data.totalRecords);
            });
    };
    const GetLastPageData = () => {
        GetTransactions(totalPages)
    }
    const GetFirstPageData = () => {
        GetTransactions("1")
    }
    const GetPageData = (number) => {
        setPageNumber(number);
        if (pageNumber !== number)
        GetTransactions(number)
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
        GetTransactions(pageNumber);
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
                                        <h5 className="card-title mb-0">Transaction List</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive table-card">
                                            <table id="example" className="table table-bordered dt-responsive nowrap table-striped align-middle" style={{ width: '100%' }}>
                                                <thead>
                                                    <tr>
                                                    <th data-ordering="false">SNo</th>
                                                        <th data-ordering="false">Transaction No</th>
                                                        <th data-ordering="false">Reference No</th>
                                                        <th data-ordering="false">Gas Quantity</th>
                                                        <th data-ordering="false">Amount</th>
                                                        <th data-ordering="false">Payment Date</th>
                                                        <th data-ordering="false">Customer</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {transactions.length > 0 && transactions.map((p, index) =>
                                                        <tr key={p.transactionId}>
                                                            <td>{index + 1}</td>
                                                            <td>{p.paymentGatewatNo}</td>
                                                            <td>{p.referenceNo}</td>
                                                            <td>{p.gasQuantity}</td>                                                            
                                                            <td>{p.amount}</td>
                                                            <td>{moment(p.paymentDate).format('MMM Do YYYY hh:mm a')}</td>
                                                            <td>{p.customer}</td>
                                                            <td>
                                                                {p.status === 'SUCCESS' ? <span className="badge bg-success">PAID</span> : <span className="badge bg-warning">PENDING</span>}
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="align-items-center mt-4 pt-2 justify-content-between d-flex">
                                            <div className="flex-shrink-0">
                                                <div className="text-muted">
                                                    Showing <span className="fw-semibold">{transactions.length}</span> of <span className="fw-semibold">{totalRecords}</span> Results
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