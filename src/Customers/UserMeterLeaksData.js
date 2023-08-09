import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import moment from "moment";
import {APIConfig} from "../Common/Configurations/APIConfig";
export default function UserMeterLeaksData() {
    const [leaks, setLeaks] = useState([]);
    
    const headerconfig = {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("userToken"),
            'Content-Type': 'application/json'
        }
    }
    const GetLeakData = () => {
        axios
            .post(APIConfig.APIACTIVATEURL + APIConfig.GETLEAKDATA + "?userId=" + localStorage.getItem("userId"), { ...headerconfig })
            .then((response) => {
                    setLeaks(response.data.data);
            });
    };
    useEffect(() => {
        GetLeakData();
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
                                    <h4 className="mb-sm-0">Leaks Information Data</h4>
                                    <div className="page-title-right">
                                        <ol className="breadcrumb m-0">
                                            <li className="breadcrumb-item"><Link>Home</Link></li>
                                            <li className="breadcrumb-item active">Leaks Data</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="card-title mb-0">Leaks Information</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive table-card">
                                            <table id="example" className="table table-bordered dt-responsive nowrap table-striped align-middle" style={{ width: '100%' }}>
                                                <thead>
                                                    <tr>
                                                        <th data-ordering="false">Id</th>
                                                        <th data-ordering="false">Date and Time</th>
                                                        <th data-ordering="false">Device ID</th>
                                                        <th data-ordering="false">Application ID</th>
                                                        <th data-ordering="false">Reading</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {leaks.length > 0 && leaks.map((mr, index) =>
                                                        <tr key={mr.id}>
                                                            <td>{index + 1}</td>
                                                            <td>{moment(mr.time).format('MMM Do YYYY hh:mm a')}</td>
                                                            <td>{mr.deviceId}</td>
                                                            <td>{mr.applicationId}</td>
                                                            <td>{mr.payLoad_ASCII}</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}