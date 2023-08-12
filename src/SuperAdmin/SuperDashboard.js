import Footer from '../Common/Layouts/Footer';
import Header from '../Common/Layouts/Header';
import SideBar from '../Common/Layouts/SideBar';
import Flatpickr from 'react-flatpickr';
import CountUp from 'react-countup';
import ReactApexChart from 'react-apexcharts';
import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { APIConfig } from '../Common/Configurations/APIConfig';
import { Link } from 'react-router-dom';
export default function SuperDashboard() {
  const [barGraphLabels, setBarGraphLabels] = useState([]);
  const [barGraphSeries, setBarGraphSeries] = useState([]);
  const [barGraphBy, setBarGraphBy] = useState('DAILY');
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalDevices, setTotalDevices] = useState(0);
  const [last24hours, setLast24Hours] = useState(0);
  const [last10minutes, setLast10Minutes] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [weeklyUsage, setWeeklyUsage] = useState(0);
  const [monthlyUsage, setMonthlyUsage] = useState(0);
  const GasConsumptionHourly = () => {
    var options = {
      chart: {
        id: 'Gas-Usage',
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
              columnDelimiter: ',',
              headerCategory: 'Date and Time',
              headerValue: 'Usage',
              dateFormatter(timestamp) {
                return new Date(timestamp).toDateString();
              },
            },
            png: {
              filename: 'Gas-Usage-Daily',
            },
          },
          autoSelected: 'zoom',
        },
      },
      xaxis: {
        categories: barGraphLabels, //["8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM"]
      },
    };
    var series = [
      {
        name: 'Gas usage',
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
      Authorization: 'Bearer ' + localStorage.getItem('userToken'),
      'Content-Type': 'application/json',
    },
  };
  const GetBarGraphData = (data) => {
    axios
      .get(
        APIConfig.APIACTIVATEURL +
          APIConfig.GETBARGRAPHDATA +
          '?DayFilter=' +
          data,
        { ...headerconfig }
      )
      .then((response) => {
        setBarGraphLabels(response.data.labels);
        setBarGraphSeries(response.data.series);
      });
  };
  const GetGasUsageCount = () => {
    axios
      .get(APIConfig.APIACTIVATEURL + APIConfig.GETGASUSAGECOUNT, {
        ...headerconfig,
      })
      .then((response) => {
        setLast10Minutes(response.data.last10Minutes);
        setLast24Hours(response.data.last24hours);
        setWeeklyUsage(response.data.weeklyUsage);
        setMonthlyUsage(response.data.monthlyUsage);
        setLastUpdated(response.data.lastUpdated);
      });
  };
  const GetDataCounts = () => {
    axios
      .get(APIConfig.APIACTIVATEURL + APIConfig.GETCOUNTSDEVICEDATA, {
        ...headerconfig,
      })
      .then((response) => {
        setTotalUsers(response.data.data.totalUsers);
        setTotalTickets(response.data.data.totalTickets);
        setTotalDevices(response.data.data.totalDevices);
      });
  };
  const handleBarGraph = (data) => {
    setBarGraphBy(data);
    GetBarGraphData(data);
  };
  useEffect(() => {
    GetBarGraphData(barGraphBy);
    GetGasUsageCount();
    GetDataCounts();
  }, []);
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
                          <h4 className="fs-16 mb-1">
                            Hello, {localStorage.getItem('name')}!
                          </h4>
                          <p className="text-muted mb-0">
                            Here's Gas consumption details .
                          </p>
                        </div>
                        <div className="mt-3 mt-lg-0">
                          <div className="row g-3 mb-0 align-items-center">
                            <div className="col-auto">
                              <Link
                                to={'/users'}
                                type="button"
                                className="btn btn-soft-success"
                              >
                                <i className="ri-add-circle-line align-middle me-1" />{' '}
                                Add User
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* end card header */}
                    </div>
                    {/*end col*/}
                  </div>
                  <div className="row">
                    <div className="col-xl-3 col-md-6">
                      {/* card */}
                      <div className="card card-animate Last-24-Hours-Usage">
                        <div className="card-body">
                          <div className="d-flex align-items-center">
                            <div className="flex-grow-1 overflow-hidden">
                              <p className="text-uppercase fw-medium text-truncate mb-0 ovr-admin-card-caption">
                                Last 24 Hours Usage
                              </p>
                            </div>
                          </div>
                          <div className="d-flex align-items-end justify-content-between mt-4">
                            <div>
                              <h4 className="fs-22 fw-semibold ff-secondary mb-4 card-data-color card-data-color">
                                <CountUp end={last24hours} /> Kgs
                              </h4>
                            </div>
                            <div className="avatar-sm flex-shrink-0">
                              <span className="avatar-title bg-soft-info rounded fs-3">
                                <div className="ovr-dashboard-icons_box">
                                  <img
                                    src="/assets/icons/24-hour.png"
                                    alt="icon"
                                    className="ovr-dashboard-icons"
                                  ></img>
                                </div>
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* end card body */}
                      </div>
                      {/* end card */}
                    </div>
                    {/* end col */}
                    <div className="col-xl-3 col-md-6">
                      {/* card */}
                      <div className="card card-animate Current-Week-Usage">
                        <div className="card-body">
                          <div className="d-flex align-items-center">
                            <div className="flex-grow-1 overflow-hidden">
                              <p className="text-uppercase fw-medium  text-truncate mb-0 ovr-admin-card-caption">
                                Current Week Usage
                              </p>
                            </div>
                          </div>
                          <div className="d-flex align-items-end justify-content-between mt-4">
                            <div>
                              <h4 className="fs-22 fw-semibold ff-secondary mb-4 card-data-color">
                                <CountUp end={weeklyUsage} /> Kgs
                              </h4>
                            </div>
                            <div className="avatar-sm flex-shrink-0">
                              <span className="avatar-title bg-soft-warning rounded fs-3">
                                <div className="ovr-dashboard-icons_box">
                                  <img
                                    src="/assets/icons/week.png"
                                    alt="icon"
                                    className="ovr-dashboard-icons"
                                  ></img>
                                </div>
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* end card body */}
                      </div>
                      {/* end card */}
                    </div>
                    {/* end col */}
                    <div className="col-xl-3 col-md-6">
                      {/* card */}
                      <div className="card card-animate Curren-Month-Usage ">
                        <div className="card-body">
                          <div className="d-flex align-items-center">
                            <div className="flex-grow-1 overflow-hidden">
                              <p className="text-uppercase fw-medium text-truncate mb-0 ovr-admin-card-caption">
                                Current Month Usage
                              </p>
                            </div>
                          </div>
                          <div className="d-flex align-items-end justify-content-between mt-4">
                            <div>
                              <h4 className="fs-22 fw-semibold ff-secondary mb-4 card-data-color">
                                <CountUp end={monthlyUsage} /> Kgs
                              </h4>
                            </div>
                            <div className="avatar-sm flex-shrink-0">
                              <span className="avatar-title bg-soft-primary rounded fs-3">
                                <div className="ovr-dashboard-icons_box">
                                  <img
                                    src="/assets/icons/month.png"
                                    alt="icon"
                                    className="ovr-dashboard-icons"
                                  ></img>
                                </div>
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* end card body */}
                      </div>
                      {/* end card */}
                    </div>
                    {/* end col */}
                    <div className="col-xl-3 col-md-6">
                      {/* card */}
                      <div className="card card-animate Active-Devices">
                        <div className="card-body">
                          <div className="d-flex align-items-center">
                            <div className="flex-grow-1 overflow-hidden">
                              <p className="text-uppercase fw-medium  text-truncate mb-0 ovr-admin-card-caption">
                                Active Devices
                              </p>
                            </div>
                          </div>
                          <div className="d-flex align-items-end justify-content-between mt-4">
                            <div>
                              <h4 className="fs-22 fw-semibold ff-secondary mb-4 card-data-color">
                                <CountUp end={totalDevices} />
                              </h4>
                            </div>
                            <div className="avatar-sm flex-shrink-0">
                              <span className="avatar-title bg-soft-primary rounded fs-3">
                                <div className="ovr-dashboard-icons_box">
                                  <img
                                    src="/assets/icons/devices.png"
                                    alt="icon"
                                    className="ovr-dashboard-icons"
                                  ></img>
                                </div>
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* end card body */}
                      </div>
                      {/* end card */}
                    </div>
                    {/* end col */}
                  </div>
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="card">
                        <div className="card-header border-0 align-items-center d-flex">
                          <h4 className="card-title mb-0 flex-grow-1">
                            Gas Consumption - Last Updated{' '}
                            {moment(lastUpdated).format('Do MMM YYYY, h:mm a')}
                          </h4>
                          <div>
                            <button
                              type="button"
                              className={
                                barGraphBy === 'DAILY'
                                  ? 'btn btn-soft-secondary btn-sm active'
                                  : 'btn btn-soft-secondary btn-sm'
                              }
                              onClick={() => handleBarGraph('DAILY')}
                            >
                              TODAY
                            </button>
                            <button
                              type="button"
                              className={
                                barGraphBy === 'WEEKLY'
                                  ? 'btn btn-soft-secondary btn-sm active'
                                  : 'btn btn-soft-secondary btn-sm'
                              }
                              onClick={() => handleBarGraph('WEEKLY')}
                            >
                              WEEKLY
                            </button>
                            <button
                              type="button"
                              className={
                                barGraphBy === 'MONTHLY'
                                  ? 'btn btn-soft-secondary btn-sm active'
                                  : 'btn btn-soft-secondary btn-sm'
                              }
                              onClick={() => handleBarGraph('MONTHLY')}
                            >
                              MONTHLY
                            </button>
                          </div>
                        </div>
                        {/* end card header */}

                        <div className="card-body p-0 pb-2">
                          <div className="w-100">
                            <GasConsumptionHourly
                              type="bar"
                              id="Market_chart"
                              data-colors='["--vz-success", "--vz-danger"]'
                            />
                          </div>
                        </div>
                        {/* end card body */}
                      </div>
                      {/* end card */}
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
