import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import {APIConfig} from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
import moment from "moment";
export default function PaymentDetails() {
    let {paymentId} = useParams();
    const [paymentData, setPaymentData] = useState([]);
    const headerconfig = {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("userToken"),
            'Content-Type': 'application/json'
        }
    }
    const GetPaymentDetails = () => {
        axios
            .get(APIConfig.APIACTIVATEURL + APIConfig.GETNPAYMENTREQUESTBYID + "/" + paymentId, { ...headerconfig })
            .then((response) => {
                setPaymentData(response.data);
            });
    };
    useEffect(() => {
        GetPaymentDetails();
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
                                    <h4 className="mb-sm-0">Payment Details</h4>
                                    <div className="page-title-right">
                                        <ol className="breadcrumb m-0">
                                            <li className="breadcrumb-item"><Link>Home</Link></li>
                                            <li className="breadcrumb-item active">Payment</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xxl-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="card-title mb-0">Payment Details</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive table-card">
                                            <table className="table table-borderless align-middle mb-0">
                                                <tbody>
                                                    <tr>
                                                        <td className="fw-medium">Description</td>
                                                        <td><span>{paymentData.description}</span> </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="fw-medium">Amount</td>
                                                        <td id="t-client">{paymentData.amount}</td>
                                                    </tr>                                                   
                                                    <tr>
                                                        <td className="fw-medium">Reference No</td>
                                                        <td>
                                                            {paymentData.referenceNo}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="fw-medium">Status</td>
                                                        <td>
                                                            {paymentData.status=="SUCCESS"?
                                                            <span className="badge bg-success" id="t-priority">{paymentData.status}</span>
                                                            :
                                                            <span className="badge bg-danger" id="t-priority">{paymentData.status}</span>
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="fw-medium">Payment Date</td>
                                                        <td id="c-date">{moment(paymentData.paymentDate).format('MMM Do YYYY, h:mm a')}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="fw-medium">Requested Date</td>
                                                        <td id="c-date">{moment(paymentData.createdDate).format('MMM Do YYYY, h:mm a')}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    {/*end card-body*/}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}