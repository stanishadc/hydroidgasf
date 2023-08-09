import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import {APIConfig} from "../Common/Configurations/APIConfig";
import ReactApexChart from "react-apexcharts";
import Flatpickr from "react-flatpickr";
export default function MeterReading() {
  var date = new Date();
  const [meterReading, setMeterReading] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [fromDate, setFromDate] = useState(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  const [toDate, setToDate] = useState(new Date());
  const [barGraphLabels, setBarGraphLabels] = useState([]);
  const [barGraphSeries, setBarGraphSeries] = useState([]);
  const GasConsumptionHourly = () => {
    var options = {
      chart: {
        id: "Gas-Usage",
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
            customIcons: [],
          },
          export: {
            csv: {
              filename: undefined,
              columnDelimiter: ",",
              headerCategory: "Date and Time",
              headerValue: "Usage",
              dateFormatter(timestamp) {
                return new Date(timestamp).toDateString();
              },
            },
            png: {
              filename: "Gas-Usage-Daily",
            },
          },
          autoSelected: "zoom",
        },
      },
      xaxis: {
        categories: barGraphLabels, //["8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM"]
      },
    };
    var series = [
      {
        name: "gas usage",
        data: barGraphSeries, //[30, 40, 35, 50, 49, 60, 70, 91, 125]
      },
    ];
    return (
      <ReactApexChart
        className="apex-charts"
        series={series}
        options={options}
        type="bar"
        height={267.7}
      />
    );
  };
  const headerconfig = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("userToken"),
      "Content-Type": "application/json",
    },
  };
  const GetDevicesData = (number) => {
    axios
      .get(
        APIConfig.APIACTIVATEURL +
        APIConfig.GETALLGASUSAGE +
          "?DateFrom=" +
          moment(fromDate).format("YYYY-MM-DD") +
          "&DateTo=" +
          moment(toDate).format("YYYY-MM-DD") +
          "&pageNumber=" +
          number +
          "&pageSize=" +
          pageSize +
          "",
        { ...headerconfig }
      )
      .then((response) => {
        setMeterReading(response.data.data.data);
        setPageNumber(response.data.data.pageNumber);
        setPageSize(response.data.data.pageSize);
        setTotalPages(response.data.data.totalPages);
        setData(response.data.data);
        setTotalRecords(response.data.data.totalRecords);
      });
  };
  const GetLastPageData = () => {
    GetDevicesData(totalPages);
  };
  const GetFirstPageData = () => {
    GetDevicesData("1");
  };
  const GetPageData = (number) => {
    setPageNumber(number);
    if (pageNumber !== number) GetDevicesData(number);
  };
  const GetReports = () => {
    GetDevicesData(pageNumber);
    GetBarGraphData();
  };
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  const renderPageNumbers = pageNumbers.map((number) => {
    return (
      <li
        className="page-item"
        key={number}
        id={number}
        onClick={() => GetPageData(number)}
      >
        <Link className="page-link">{number}</Link>
      </li>
    );
  });
  const GetBarGraphData = (data) => {
    axios
      .get(
        APIConfig.APIACTIVATEURL +
        APIConfig.GETBARGRAPHDATEWISE +
          "?DateFrom=" +
          moment(fromDate).format("YYYY-MM-DD") +
          "&DateTo=" +
          moment(toDate).format("YYYY-MM-DD"),
        { ...headerconfig }
      )
      .then((response) => {
        setBarGraphLabels(response.data.labels);
        setBarGraphSeries(response.data.series);
      });
  };
  useEffect(() => {
    GetDevicesData(pageNumber);
    GetBarGraphData();
  }, []);
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
                  <h4 className="mb-sm-0">MeterReading</h4>
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <Link>Home</Link>
                      </li>
                      <li className="breadcrumb-item active">MeterReading</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-3 pb-1">
              <div className="col-12">
                <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                  <div className="flex-grow-1">
                    <h4 className="fs-16 mb-1"></h4>
                  </div>
                  <div className="mt-3 mt-lg-0">
                    <form action="javascript:void(0);">
                      <div className="row g-3 mb-0 align-items-center">
                        <div className="col-sm-auto">
                          <div className="input-group">
                            <Flatpickr
                              className="form-control border-0 dash-filter-picker shadow"
                              options={{
                                dateFormat: "d-m-Y",
                              }}
                              value={fromDate}
                              onChange={(selectedDates, dateStr) => {
                                const firstDate = selectedDates[0];
                                setFromDate(firstDate);
                                //console.log({ firstDate, dateStr });
                              }}
                            />

                            <div className="input-group-text bg-primary border-primary text-white">
                              <i className="ri-calendar-2-line" />
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-auto">
                          <div className="input-group">
                            <Flatpickr
                              className="form-control border-0 dash-filter-picker shadow"
                              options={{
                                dateFormat: "d-m-Y",
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
                        {/*end col*/}
                        <div className="col-auto">
                          <button
                            onClick={GetReports}
                            type="button"
                            className="btn btn-success"
                          >
                            <i className="ri-add-circle-line align-middle me-1" />{" "}
                            Search
                          </button>
                        </div>
                        {/*end col*/}
                      </div>
                      {/*end row*/}
                    </form>
                  </div>
                </div>
                {/* end card header */}
              </div>
              {/*end col*/}
            </div>
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">MeterReading List</h5>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive table-card">
                      <table
                        className="table table-bordered dt-responsive nowrap table-striped align-middle"
                        style={{ width: "100%" }}
                      >
                        <thead>
                          <tr>
                            <th data-ordering="false">Id</th>
                            <th data-ordering="false">Date and Time</th>
                            <th data-ordering="false">Device ID</th>
                            <th data-ordering="false">Application ID</th>
                            <th data-ordering="false">Reading</th>
                            <th data-ordering="false">Usage (litres)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {meterReading?.length === 0 ? (
                            <tr>
                              <td>No Records Found</td>
                            </tr>
                          ) : (
                            meterReading.map((mr, index) => (
                              <tr key={mr.id}>
                                <td>{index + 1}</td>
                                <td>{moment(mr.time).format("MMM Do YYYY")}</td>
                                <td>{mr.deviceId}</td>
                                <td>{mr.applicationId}</td>
                                <td>{mr.payLoad_ASCII}</td>
                                <td>{mr.usage}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="align-items-center mt-4 pt-2 justify-content-between d-flex">
                      <div className="flex-shrink-0">
                        <div className="text-muted">
                          Showing{" "}
                          <span className="fw-semibold">
                            {meterReading.length}
                          </span>{" "}
                          of <span className="fw-semibold">{totalRecords}</span>{" "}
                          Results
                        </div>
                      </div>
                      <ul className="pagination pagination-separated pagination-sm mb-0">
                        <li
                          className={
                            "page-item" + data.previousPage === null
                              ? "disabled"
                              : ""
                          }
                          onClick={() => GetFirstPageData()}
                        >
                          <Link className="page-link">Previous</Link>
                        </li>
                        {renderPageNumbers}
                        <li
                          className={
                            "page-item" + data.nextPage === null
                              ? "disabled"
                              : ""
                          }
                          onClick={() => GetLastPageData()}
                        >
                          <Link className="page-link">Next</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">MeterReading List</h5>
                  </div>
                  <div className="card-body p-0 pb-2">
                    <div className="w-100">
                      <GasConsumptionHourly
                        type="bar"
                        id="Market_chart"
                        data-colors='["--vz-success", "--vz-danger"]'
                      />
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
