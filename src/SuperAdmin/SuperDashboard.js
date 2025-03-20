import Footer from "../Common/Layouts/Footer";
import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import Flatpickr from "react-flatpickr";
import CountUp from 'react-countup';
import ReactApexChart from "react-apexcharts";
import { useState, useEffect,useRef } from "react";
import axios from 'axios';
import moment from "moment";
import config from "../Common/Configurations/APIConfig";
import { Link } from "react-router-dom";
import Select from 'react-select';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
export default function SuperDashboard() {
    const date = new Date();
    const [meterReading, setMeterReading] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0)
    const [totalTickets, setTotalTickets] = useState(0)
    const [totalDevices, setTotalDevices] = useState(0)
    const [totalOrganisations, setTotalOrganisations] = useState(0)
    const [fromDate, setFromDate] = useState(new Date(date.getTime() - (7 * 24 * 60 * 60 * 1000)))
    const [toDate, setToDate] = useState(new Date())
    const [users, setUsers] = useState([])
    const [userId, setUserId] = useState('00000000-0000-0000-0000-000000000000');
    const [barGraphLabels, setBarGraphLabels] = useState([])
    const [barGraphSeries, setBarGraphSeries] = useState([])
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
        var series = barGraphSeries;
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
    const GetDashboardCount = () => {
        axios
            .get(config.APIACTIVATEURL + config.SUPERDASHBOARDCOUNT, { ...headerconfig })
            .then((response) => {
                setTotalDevices(response.data.devices);
                setTotalOrganisations(response.data.organisations);
                setTotalUsers(response.data.users);
                setTotalTickets(response.data.tickets);
            });
    };
    const GetUsers = () => {
        axios
            .get(config.APIACTIVATEURL + config.GETALLUSERS, { ...headerconfig })
            .then((response) => {
                if (response.data.statusCode === 200) {
                    setUsers(response.data.data);
                }
            });
    };
    const GetBarGraphData = () => {
        axios
            .get(config.APIACTIVATEURL + config.GETUSERBARGRAPH + "?DateFrom=" + moment(fromDate).format('YYYY-MM-DD') + "&DateTo=" + moment(toDate).format('YYYY-MM-DD') + "&UserId=" + userId.value, { ...headerconfig })
            .then((response) => {
               setBarGraphLabels(response.data.data.categories);
               setBarGraphSeries(response.data.data.seriesList);
         });
    };
    const GetDevicesData = (number) => {
        axios
            .get(config.APIACTIVATEURL + config.GETUSERMETERREADING + "?DateFrom=" + moment(fromDate).format('YYYY-MM-DD') + "&DateTo=" + moment(toDate).format('YYYY-MM-DD') + "&UserId=" + userId.value + "&pageNumber=" + number + "&pageSize=" + pageSize + "", { ...headerconfig })
            .then((response) => {
                if (response.data.statusCode == "200") {
                    setMeterReading(response.data.data);
                    setPageNumber(response.data.pageNumber);
                    setPageSize(response.data.pageSize);
                    setTotalPages(response.data.totalPages);
                    setData(response.data.data);
                    setTotalRecords(response.data.totalRecords);
                }
                else {
                    setMeterReading([]);
                }
            });
    };
    const GetLastPageData = () => {
        GetDevicesData(totalPages)
    }
    const GetFirstPageData = () => {
        GetDevicesData("1")
    }
    const GetPageData = (number) => {
        setPageNumber(number);
        if (pageNumber !== number)
            GetDevicesData(number)
    }
    const GetReports = () => {
        GetBarGraphData();
        GetDevicesData(pageNumber);
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
    const contentRef = useRef();
    const downloadPDF = () => {
        const input = contentRef.current;

        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('meterreading.pdf');
        });
    };
    const exportToExcel = () => {
        var fileName = "MeterReading-" + moment(fromDate).format('DDMMYYYY') + "-" + moment(toDate).format('DDMMYYYY');
        // Create a new workbook
        const wb = XLSX.utils.book_new();
        // Convert the JSON data to a worksheet
        const ws = XLSX.utils.json_to_sheet(meterReading);
        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        // Save the workbook as an Excel file
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    };
    useEffect(() => {
        GetDashboardCount();
        GetUsers();
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
                                                    <p className="text-muted mb-0">Here's gas consumption details .</p>
                                                </div>
                                                <div className="mt-3 mt-lg-0">
                                                    <div className="row g-3 mb-0 align-items-center">
                                                        <div className="col-auto">
                                                            <Link to={"/users"} type="button" className="btn btn-soft-success"><i className="ri-add-circle-line align-middle me-1" /> Add User</Link>
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
                                            <div className="card card-animate">
                                                <div className="card-body">
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-grow-1 overflow-hidden">
                                                            <p className="text-uppercase fw-medium text-muted text-truncate mb-0">Organisations</p>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-end justify-content-between mt-4">
                                                        <div>
                                                            <h4 className="fs-22 fw-semibold ff-secondary mb-4"><CountUp end={totalOrganisations} /></h4>

                                                        </div>
                                                        <div className="avatar-sm flex-shrink-0">
                                                            <span className="avatar-title bg-soft-info rounded fs-3">
                                                                <i className="ri-building-fill text-success" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>{/* end card body */}
                                            </div>{/* end card */}
                                        </div>{/* end col */}
                                        <div className="col-xl-3 col-md-6">
                                            {/* card */}
                                            <div className="card card-animate">
                                                <div className="card-body">
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-grow-1 overflow-hidden">
                                                            <p className="text-uppercase fw-medium text-muted text-truncate mb-0">Tickets</p>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-end justify-content-between mt-4">
                                                        <div>
                                                            <h4 className="fs-22 fw-semibold ff-secondary mb-4"><CountUp end={totalTickets} /></h4>

                                                        </div>
                                                        <div className="avatar-sm flex-shrink-0">
                                                            <span className="avatar-title bg-soft-warning rounded fs-3">
                                                                <i className="ri-ticket-fill text-primary" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>{/* end card body */}
                                            </div>{/* end card */}
                                        </div>{/* end col */}
                                        <div className="col-xl-3 col-md-6">
                                            {/* card */}
                                            <div className="card card-animate">
                                                <div className="card-body">
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-grow-1 overflow-hidden">
                                                            <p className="text-uppercase fw-medium text-muted text-truncate mb-0">Users</p>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-end justify-content-between mt-4">
                                                        <div>
                                                            <h4 className="fs-22 fw-semibold ff-secondary mb-4"><CountUp end={totalUsers} /></h4>

                                                        </div>
                                                        <div className="avatar-sm flex-shrink-0">
                                                            <span className="avatar-title bg-soft-primary rounded fs-3">
                                                                <i className="ri-group-fill text-primary" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>{/* end card body */}
                                            </div>{/* end card */}
                                        </div>{/* end col */}
                                        <div className="col-xl-3 col-md-6">
                                            {/* card */}
                                            <div className="card card-animate">
                                                <div className="card-body">
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-grow-1 overflow-hidden">
                                                            <p className="text-uppercase fw-medium text-muted text-truncate mb-0">Devices</p>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-end justify-content-between mt-4">
                                                        <div>
                                                            <h4 className="fs-22 fw-semibold ff-secondary mb-4"><CountUp end={totalDevices} /></h4>

                                                        </div>
                                                        <div className="avatar-sm flex-shrink-0">
                                                            <span className="avatar-title bg-soft-primary rounded fs-3">
                                                                <i className="bx bx-wallet text-primary" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>{/* end card body */}
                                            </div>{/* end card */}
                                        </div>{/* end col */}
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-lg-4">
                                            <div className="input-group">
                                                <Flatpickr
                                                    className="form-control border-0 dash-filter-picker shadow"
                                                    options={{
                                                        dateFormat: "d-m-Y"
                                                    }}
                                                    value={fromDate}
                                                    onChange={(selectedDates, dateStr) => {
                                                        const firstDate = selectedDates[0];
                                                        setFromDate(firstDate);
                                                    }}
                                                />

                                                <div className="input-group-text bg-primary border-primary text-white">
                                                    <i className="ri-calendar-2-line" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="input-group">
                                                <Flatpickr
                                                    className="form-control border-0 dash-filter-picker shadow"
                                                    options={{
                                                        dateFormat: "d-m-Y"
                                                    }}
                                                    value={toDate}
                                                    onChange={(selectedDates, dateStr) => {
                                                        setToDate(selectedDates[0]);
                                                    }}
                                                />
                                                <div className="input-group-text bg-primary border-primary text-white">
                                                    <i className="ri-calendar-2-line" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-2">
                                        <div className="mb-4">
                                            <Select
                                                value={userId}
                                                onChange={setUserId}
                                                options={users}
                                                isSearchable
                                            />
                                        </div>
                                    </div>
                                        {/*end col*/}
                                        <div className="col-lg-2">
                                            <button onClick={GetReports} type="button" className="btn btn-success"><i className="ri-search-line align-middle me-1" /> Search</button>
                                        </div>
                                        {/*end col*/}
                                    </div>
                                    <div className="row">
                                        <div className="col-xl-12">
                                            <div className="card">
                                                <div className="card-header border-0 align-items-center d-flex">
                                                    <h4 className="card-title mb-0 flex-grow-1">Gas Consumption - Last Updated {moment(new Date()).format('Do MMM YYYY, h:mm a')}</h4>
                                                </div>
                                                <div className="card-body p-0 pb-2">
                                                    <div className="w-100">
                                                        <WaterConsumptionHourly type="bar" id="Market_chart" data-colors="[&quot;--vz-success&quot;, &quot;--vz-danger&quot;]" />
                                                    </div>
                                                </div>{/* end card body */}
                                            </div>{/* end card */}
                                        </div>
                                    </div>
                                    <div className="row">
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-header align-items-center d-flex">
                                        <h5 className="card-title mb-0 flex-grow-1">Meter Reading</h5>
                                        <div className="flex-shrink-0">
                                            <button className="btn btn-success btn-sm" onClick={downloadPDF}>PDF</button>
                                        </div>
                                        <div className="flex-shrink-0 ms-2">
                                            <button className="btn btn-primary btn-sm" onClick={exportToExcel}>Excel</button>
                                        </div>
                                    </div>                                    
                                    <div className="card-body">
                                        <div className="table-responsive table-card">
                                        <div ref={contentRef}>
                                            <table id="example" className="table table-bordered dt-responsive nowrap table-striped align-middle" style={{ width: '100%' }}>
                                                <thead>
                                                    <tr>
                                                        <th data-ordering="false">Id</th>
                                                        <th data-ordering="false">Date and Time</th>
                                                        <th data-ordering="false">Meter For</th>
                                                        <th data-ordering="false">Reading</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {meterReading.length > 0 ? meterReading.map((mr, index) =>
                                                        <tr key={mr.id}>
                                                            <td>{index + 1}</td>
                                                            <td>{moment(mr.createdDate).format('MMM Do YYYY hh:mm a')}</td>
                                                            <td>{mr.deviceName}</td>
                                                            <td>{mr.payLoad_ASCII}</td>
                                                        </tr>
                                                    )
                                                        :
                                                        <tr><td colSpan={6}>No Records</td></tr>
                                                    }
                                                </tbody>
                                            </table>
                                            </div>
                                        </div>
                                        <div className="align-items-center mt-4 pt-2 justify-content-between d-flex">
                                            <div className="flex-shrink-0">
                                                <div className="text-muted">
                                                    Showing <span className="fw-semibold">{meterReading.length}</span> of <span className="fw-semibold">{totalRecords}</span> Results
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