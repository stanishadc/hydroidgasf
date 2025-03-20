import Footer from "../Common/Layouts/Footer";
import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import Flatpickr from "react-flatpickr";
import CountUp from 'react-countup';
import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from "react";
import axios from 'axios';
import moment from "moment";
import config from "../Common/Configurations/APIConfig";
import { Link } from "react-router-dom";
import Select from 'react-select';
export default function CustomerDashboard() {
    const [crmdate, setCRMDate] = useState(new Date())
    const [barGraphLabels, setBarGraphLabels] = useState([])
    const [barGraphBy, setBarGraphBy] = useState("DAILY")
    const [barGraphSeries, setBarGraphSeries] = useState([])
    const [totalTickets, setTotalTickets] = useState(0)
    const [last24hours, setLast24Hours] = useState(0)
    const [leak, setLeak] = useState(0)
    const [pendingPayment, setPendingPayments] = useState(0)
    const [lastUpdated, setLastUpdated] = useState(new Date())
    const [weeklyUsage, setWeeklyUsage] = useState(0)
    const [monthlyUsage, setMonthlyUsage] = useState(0)
    const [deviceIds, setDeviceIds] = useState([])
    const [deviceId, setDeviceId] = useState(null)
    const [totalDevices, setTotalDevices] = useState(0)
    const WaterConsumptionHourly = () => {
        var options = {
            chart: {
                id: 'Water-Usage',
                toolbar: {
                    show: false,
                    offsetX: 0,
                    offsetY: 0,
                    tools: {
                      download: true,
                      selection: true,
                      zoom: true,
                      zoomin: true,
                      zoomout: true,
                      pan: true,
                      reset: true | '<img src="/static/icons/reset.png" width="20">',
                      customIcons: []
                    },
                    export: {
                      csv: {
                        filename: undefined,
                        columnDelimiter: ',',
                        headerCategory: 'Date and Time',
                        headerValue: 'Usage',
                        dateFormatter(timestamp) {
                          return new Date(timestamp).toDateString()
                        }
                      },
                      png: {
                        filename: "Water-Usage-Daily",
                      }
                    },
                    autoSelected: 'zoom' 
                  },
            },
            xaxis: {
                categories: barGraphLabels//["8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM"]
            }
        };
        var series = [{
            name: 'water usage',
            data: barGraphSeries//[30, 40, 35, 50, 49, 60, 70, 91, 125]
        }]
        return (
            <ReactApexChart
                className="apex-charts"
                series={series}
                options={options}
                type="bar"
                height={267.7}
            />
        )
    }
    const headerconfig = {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("userToken"),
            'Content-Type': 'application/json'
        }
    }
    const GetBarGraphData = (data) => {
        var date = new Date();
        var fromDate = new Date();
        var toDate = new Date();
        if (data === "MONTHLY") {
            fromDate = new Date(date.getFullYear(), date.getMonth(), 1);
        }
        else if (data === "WEEKLY") {
            fromDate = new Date(date.getFullYear(),date.getMonth(),date.getDate() - 6);
        }
        if (deviceId !== null) {
            axios
                .get(config.APIACTIVATEURL + config.GETDEVICEDATABYDEVICE + "?DateFrom=" + moment(fromDate).format('YYYY-MM-DD') + "&DateTo=" + moment(toDate).format('YYYY-MM-DD') + "&DeviceId=" + deviceId.value, { ...headerconfig })
                .then((response) => {
                    setBarGraphLabels(response.data.labels);
                    setBarGraphSeries(response.data.series);
                });
            }
};
    const GetWaterUsageCount = () => {
        axios
            .get(config.APIACTIVATEURL + config.GETWATERUSAGECOUNT + "?UserId=" + localStorage.getItem("userId"), { ...headerconfig })
            .then((response) => {
                //setLast10Minutes(response.data.last10Minutes);
                setLast24Hours(response.data.last24hours);
                setWeeklyUsage(response.data.weeklyUsage);
                setMonthlyUsage(response.data.monthlyUsage);
                setLastUpdated(response.data.lastUpdated);
            });
    };
    const GetLeakData = () => {
        axios
            .post(config.APIACTIVATEURL + config.GETLEAKDATA+ "?UserId=" + localStorage.getItem("userId"), { ...headerconfig })
            .then((response) => {
                setLeak(response.data.data.length);
            });
    };
    const GetDevices = () => {
        axios
            .get(config.APIACTIVATEURL + config.GETUSERACTIVEDEVICE+ "?UserId=" + localStorage.getItem("userId"), { ...headerconfig })
            .then((response) => {
                setDeviceIds(response.data.data);
                setTotalDevices(response.data.data.length);
            });
    };
    const handleBarGraph = (data) => {
        setBarGraphBy(data);
        GetBarGraphData(data);
    };
    useEffect(() => {
        GetDevices();
        GetWaterUsageCount();
        GetBarGraphData(barGraphBy);
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
                            <div className="col">
                                <div className="h-100">
                                    <div className="row mb-3 pb-1">
                                        <div className="col-12">
                                            <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                                                <div className="flex-grow-1">
                                                    <h4 className="fs-16 mb-1">Hello, {localStorage.getItem("name")}!</h4>
                                                    <p className="text-muted mb-0">Here's Gas consumption details .</p>
                                                </div>
                                                <div className="mt-3 mt-lg-0">
                                                    <div className="row g-3 mb-0 align-items-center">
                                                        <div className="col-auto">
                                                            <Link to={"/newticket"} type="button" className="btn btn-soft-success"><i className="ri-add-circle-line align-middle me-1" /> Raise Ticket</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>{/* end card header */}
                                        </div>
                                        {/*end col*/}
                                    </div>
                                    <div className="row">                                       
                                        <div className="col-xl-3 col-md-6">
                                            {/* card */}
                                            <div className="card card-animate" style={{backgroundColor:'#1e8275'}}>
                                                <div className="card-body">
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-grow-1 overflow-hidden">
                                                            <p className="text-uppercase fw-medium text-truncate mb-0" style={{color:'#fff'}}>Today's Usage</p>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-end justify-content-between mt-4">
                                                        <div>
                                                            <h4 className="fs-22 fw-semibold ff-secondary mb-4" style={{color:'#fff'}}><CountUp end={last24hours} /> Kgs</h4>
                                                        </div>
                                                        <div className="avatar-sm flex-shrink-0">
                                                            <span className="avatar-title rounded fs-3" style={{backgroundColor:"#fff"}}>
                                                                <i className="ri-water-flash-fill text-success" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>{/* end card body */}
                                            </div>{/* end card */}
                                        </div>{/* end col */}
                                        <div className="col-xl-3 col-md-6">
                                            {/* card */}
                                            <div className="card card-animate" style={{backgroundColor:'#b49f0f'}}>
                                                <div className="card-body">
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-grow-1 overflow-hidden">
                                                            <p className="text-uppercase fw-medium text-truncate mb-0" style={{color:'#fff'}}>Current Week Usage</p>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-end justify-content-between mt-4">
                                                        <div>
                                                            <h4 className="fs-22 fw-semibold ff-secondary mb-4" style={{color:'#fff'}}><CountUp end={weeklyUsage} /> Kgs</h4>
                                                        </div>
                                                        <div className="avatar-sm flex-shrink-0">
                                                            <span className="avatar-title rounded fs-3" style={{backgroundColor:"#fff"}}>
                                                                <i className="ri-water-flash-fill text-primary" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>{/* end card body */}
                                            </div>{/* end card */}
                                        </div>{/* end col */}
                                        <div className="col-xl-3 col-md-6">
                                            {/* card */}
                                            <div className="card card-animate" style={{backgroundColor:'#c15622'}}>
                                                <div className="card-body">
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-grow-1 overflow-hidden">
                                                            <p className="text-uppercase fw-medium text-truncate mb-0" style={{color:'#fff'}}>Current Month Usage</p>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-end justify-content-between mt-4">
                                                        <div>
                                                            <h4 className="fs-22 fw-semibold ff-secondary mb-4" style={{color:'#fff'}}><CountUp end={monthlyUsage} /> Kgs</h4>
                                                        </div>
                                                        <div className="avatar-sm flex-shrink-0">
                                                            <span className="avatar-title rounded fs-3" style={{backgroundColor:"#fff"}}>
                                                                <i className="ri-water-flash-fill text-primary" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>{/* end card body */}
                                            </div>{/* end card */}
                                        </div>
                                        <div className="col-xl-3 col-md-6">
                                            {/* card */}
                                            <div className="card card-animate" style={{backgroundColor:'#346a3f'}}>
                                                <div className="card-body">
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-grow-1 overflow-hidden">
                                                            <p className="text-uppercase fw-medium text-truncate mb-0" style={{color:'#fff'}}>No of Leaks</p>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-end justify-content-between mt-4">
                                                        <div>
                                                            <h4 className="fs-22 fw-semibold ff-secondary mb-4" style={{color:'#fff'}}>{leak}</h4>
                                                        </div>
                                                        <div className="avatar-sm flex-shrink-0">
                                                            <span className="avatar-title rounded fs-3" style={{backgroundColor:"#fff"}}>
                                                                <i className="ri-water-flash-line text-primary" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>{/* end card body */}
                                            </div>{/* end card */}
                                        </div>
                                    </div>                                  
                                    <div className="row">
                                        <div className="col-xl-12">
                                            <div className="card">
                                                <div className="card-header border-0 align-items-center d-flex">
                                                <h4 className="card-title mb-0 flex-grow-1">Water Consumption - Last Updated {moment(lastUpdated).format('Do MMM YYYY, h:mm a')}</h4>
                                                <div className="col-lg-3">
                                                    <Select
                                                        value={deviceId}
                                                        onChange={setDeviceId}
                                                        options={deviceIds}
                                                        isSearchable
                                                    />
                                                </div>
                                                    <div>
                                                    <button type="button" className={barGraphBy === "DAILY" ? "btn btn-soft-secondary btn-sm active" : "btn btn-soft-secondary btn-sm pr-2"} onClick={() => handleBarGraph("DAILY")}>
                                                            Today
                                                        </button>
                                                        <button type="button" className={barGraphBy === "WEEKLY" ? "btn btn-soft-secondary btn-sm active" : "btn btn-soft-secondary btn-sm"} onClick={() => handleBarGraph("WEEKLY")}>
                                                            Weekly
                                                        </button>
                                                        <button type="button" className={barGraphBy === "MONTHLY" ? "btn btn-soft-secondary btn-sm active" : "btn btn-soft-secondary btn-sm"} onClick={() => handleBarGraph("MONTHLY")}>
                                                            Monthly
                                                        </button>
                                                    </div>
                                                </div>{/* end card header */}

                                                <div className="card-body p-0 pb-2">
                                                    <div className="w-100">
                                                        <WaterConsumptionHourly type="bar" id="Market_chart" data-colors="[&quot;--vz-success&quot;, &quot;--vz-danger&quot;]" />
                                                    </div>
                                                </div>{/* end card body */}
                                            </div>{/* end card */}
                                        </div>                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer></Footer>
            </div>
        </div>
    );
}