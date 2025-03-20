import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import moment from "moment";
import config from "../Common/Configurations/APIConfig";
import Flatpickr from "react-flatpickr";
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useDownloadExcel } from 'react-export-table-to-excel';
export default function MeterReading() {
    var date = new Date();
    const [meterReading, setMeterReading] = useState([]);
    const [devices, setDevices] = useState([]);
    const [deviceId, setDeviceId] = useState('00000000-0000-0000-0000-000000000000');
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [fromDate, setFromDate] = useState(new Date(date.getTime() - (7 * 24 * 60 * 60 * 1000)))
    const [toDate, setToDate] = useState(new Date())
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const headerconfig = {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("userToken"),
            'Content-Type': 'application/json'
        }
    }
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
    const { onDownload } = useDownloadExcel({
        currentTableRef: contentRef.current,
        filename: "MeterReading-" + moment(fromDate).format('DDMMYYYY') + "-" + moment(toDate).format('DDMMYYYY'),
        sheet: 'Reading'
    })
    const GetDevicesData = (number) => {
        axios
            .get(config.APIACTIVATEURL + config.GETUSERMETERREADING + "?DeviceId=" + deviceId + "&DateFrom=" + moment(fromDate).format('YYYY-MM-DD') + "&DateTo=" + moment(toDate).format('YYYY-MM-DD') + "&UserId=" + localStorage.getItem('userId') + "&pageNumber=" + number + "&pageSize=" + pageSize + "", { ...headerconfig })
            .then((response) => {
                if (response.data.statusCode == "200") {
                    setMeterReading(response.data.data);
                    setPageNumber(response.data.pageNumber);
                    setPageSize(response.data.pageSize);
                    setTotalPages(response.data.totalPages);
                    setData(response.data.data);
                    setTotalRecords(response.data.totalRecords);
                    setLoading(false);
                    var usageData = response.data.data;
                    const totalUsage = usageData.reduce((sum, item) => sum + item.litres, 0);
                    setTotal(totalUsage);
                }
                else {
                    setMeterReading([]);
                }
            });
        setLoading(false)
    };
    const GetUserDevices = () => {
        axios
            .get(config.APIACTIVATEURL + config.GETCUSTOMERDEVICES + "?UserId=" + localStorage.getItem('userId'), { ...headerconfig })
            .then((response) => {
                if (response.data.statusCode == "200") {
                    setDevices(response.data.data);
                }
                else {
                    setMeterReading([]);
                }
            });
        setLoading(false)
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
        setLoading(true);
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
    useEffect(() => {
        GetDevicesData(pageNumber);
        GetUserDevices();
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
                                    <h4 className="mb-sm-0">Meter Reading</h4>
                                    <div className="page-title-right">
                                        <ol className="breadcrumb m-0">
                                            <li className="breadcrumb-item"><Link>Home</Link></li>
                                            <li className="breadcrumb-item active">MeterReading</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
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
                                <div className="input-group">
                                    <select className="form-select" value={deviceId} onChange={e => setDeviceId(e.target.value)} name="deviceId">
                                        <option value={'00000000-0000-0000-0000-000000000000'}>All Devices</option>
                                        {devices.length > 0 && devices.map(d =>
                                            <option value={d.deviceId}>{d.deviceName}</option>
                                        )}
                                    </select>
                                </div>
                            </div>
                            {/*end col*/}
                            <div className="col-lg-2">
                                {loading === false ?
                                    <button onClick={GetReports} type="button" className="btn btn-success"><i className="ri-search-line align-middle me-1" /> Search</button>
                                    :
                                    <button disabled type="button" className="btn btn-success"><i className="ri-search-line align-middle me-1" /> Please wait...</button>
                                }
                            </div>
                            {/*end col*/}
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-header align-items-center d-flex">
                                        <h5 className="card-title mb-0 flex-grow-1">Gas Usage Data</h5>
                                        <div className="flex-shrink-0">
                                            <button className="btn btn-success btn-sm" onClick={downloadPDF}>PDF</button>
                                        </div>
                                        <div className="flex-shrink-0 ms-2">
                                            <button className="btn btn-primary btn-sm" onClick={onDownload}>Excel</button>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive table-card">
                                            <div ref={contentRef}>
                                                <div className="row mt-10 mb-2 p-5">
                                                    <div className="col-lg-12">
                                                        <label>Organisation : {localStorage.getItem('organisationName')}</label>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <label>Date : {moment(fromDate).format('DD-MM-YYYY')} to {moment(toDate).format('DD-MM-YYYY')}</label>
                                                    </div>
                                                </div>
                                                <table id="example" className="table table-bordered dt-responsive nowrap table-striped align-middle" style={{ width: '100%' }}>
                                                    <thead>
                                                        <tr>
                                                            <th data-ordering="false">Id</th>
                                                            <th data-ordering="false">Date and Time</th>
                                                            <th data-ordering="false">Meter For</th>
                                                            <th data-ordering="false">Meter No</th>
                                                            <th data-ordering="false">Reading</th>
                                                            <th data-ordering="false">Usage</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {meterReading.length > 0 ? meterReading.map((mr, index) =>
                                                            <tr key={mr.id}>
                                                                <td>{index + 1}</td>
                                                                <td>{moment(mr.createdDate).format('MMM Do YYYY hh:mm a')}</td>
                                                                <td>{mr.deviceName}</td>
                                                                <td>{mr.meterNo}</td>
                                                                <td>{mr.payLoad_ASCII}</td>
                                                                <td>{mr.litres} Kgs</td>
                                                            </tr>
                                                        )
                                                            :
                                                            <tr><td colSpan={6}>No Records</td></tr>
                                                        }
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <td colSpan={4}></td>
                                                            <td>Total</td>
                                                            <td>{total} Litres</td>
                                                        </tr>
                                                    </tfoot>
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
    );
}