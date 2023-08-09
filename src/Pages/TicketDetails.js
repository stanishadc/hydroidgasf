import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { APIConfig } from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
import moment from "moment";
const initialFieldValues = {
  ticketId: "00000000-0000-0000-0000-000000000000",
  ticketResponseId: "00000000-0000-0000-0000-000000000000",
  ticketResponseData: "",
  userId: "00000000-0000-0000-0000-000000000000",
};
export default function TicketDetails() {
  let { ticketId } = useParams();
  const [values, setValues] = useState(initialFieldValues);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [ticketReplies, setTicketReplies] = useState([]);
  const [ticketData, setTicketData] = useState([]);
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
      "Content-Type": "application/json",
    },
  };
  const validate = () => {
    let temp = {};
    temp.ticketResponseData = values.ticketResponseData === "" ? false : true;
    setErrors(temp);
    return Object.values(temp).every((x) => x === true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const formData = {
        ticketResponseId: values.ticketResponseId,
        ticketId: ticketId,
        ticketResponseData: values.ticketResponseData,
        userId: localStorage.getItem("userId"),
      };
      addOrEdit(formData);
    }
  };
  const applicationAPI = () => {
    return {
      create: (newrecord) =>
        axios.post(
          APIConfig.APIACTIVATEURL + APIConfig.CREATETICKETRESPONSE,
          JSON.stringify(newrecord),
          { ...headerconfig }
        ),
      update: (updateRecord) =>
        axios.put(
          APIConfig.APIACTIVATEURL + APIConfig.UPDATEDEVICE,
          updateRecord
        ),
      delete: (id) =>
        axios.delete(
          APIConfig.APIACTIVATEURL + APIConfig.DELETETICKETRESPONSE + "/" + id,
          { ...headerconfig }
        ),
    };
  };
  const addOrEdit = (formData) => {
    if (formData.ticketResponseId === "00000000-0000-0000-0000-000000000000") {
      applicationAPI()
        .create(formData)
        .then((res) => {
          if (res.data.statusCode === 201) {
            handleSuccess(res.data.message);
            resetForm();
            GetTicketReplies();
          } else {
            handleError(res.data.message);
          }
        });
    } else {
      applicationAPI()
        .update(formData)
        .then((res) => {
          if (res.data.statusCode === 201) {
            handleSuccess(res.data.message);
            resetForm();
            GetTicketReplies();
          } else {
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
  const GetTicketReplies = () => {
    axios
      .get(
        APIConfig.APIACTIVATEURL +
          APIConfig.GETTICKETRESPONSEBYID +
          "?TicketId=" +
          ticketId,
        { ...headerconfig }
      )
      .then((response) => {
        setTicketReplies(response.data.data.data);
      });
  };
  const GetTicketDetails = () => {
    axios
      .get(
        APIConfig.APIACTIVATEURL + APIConfig.GETTICKETBYID + "/" + ticketId,
        { ...headerconfig }
      )
      .then((response) => {
        setTicketData(response.data);
      });
  };
  const onDelete = (e, id) => {
    if (window.confirm("Are you sure to delete this record?"))
      applicationAPI()
        .delete(id)
        .then((res) => {
          handleSuccess("Ticket Deleted Succesfully");
          GetTicketReplies();
        });
  };
  const applyErrorClass = (field) =>
    field in errors && errors[field] === false ? " form-control-danger" : "";
  useEffect(() => {
    GetTicketDetails();
    GetTicketReplies();
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
                  <h4 className="mb-sm-0">Ticket Details</h4>
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <Link>Home</Link>
                      </li>
                      <li className="breadcrumb-item active">Ticket</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xxl-9">
                <div className="card">
                  <div className="card-body p-4">
                    <h6 className="fw-semibold text-uppercase mb-3">
                      Ticket Description
                    </h6>
                    <p className="text-muted">{ticketData.ticketQuery}</p>
                  </div>
                  {/*end card-body*/}
                  <div className="card-body p-4">
                    <h5 className="card-title mb-4">Comments</h5>
                    <div style={{ height: 300 }} className="px-3 mx-n3">
                      {ticketReplies.length > 0 &&
                        ticketReplies.map((tr) => (
                          <div
                            className="d-flex mb-4"
                            key={tr.ticketResponseId}
                          >
                            <div className="flex-shrink-0">
                              <img
                                src="/assets/images/default_male_avatar.jpg"
                                alt
                                className="avatar-xs rounded-circle"
                              />
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <h5 className="fs-13">
                                {tr.name}{" "}
                                <small className="text-muted">
                                  {moment(tr.createdDate).format(
                                    "MMM Do YYYY, h:mm a"
                                  )}
                                </small>
                              </h5>
                              <p className="text-muted">
                                {tr.ticketResponseData}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                    {ticketData.ticketStatus === "CLOSED" ? (
                      ""
                    ) : (
                      <form
                        onSubmit={handleSubmit}
                        autoComplete="off"
                        noValidate
                      >
                        <div className="row g-3">
                          <div className="col-lg-12">
                            <label
                              htmlFor="exampleFormControlTextarea1"
                              className="form-label"
                            >
                              Leave a Comments
                            </label>
                            <textarea
                              onChange={handleInputChange}
                              className={
                                "form-control" +
                                applyErrorClass("ticketResponseData")
                              }
                              rows={3}
                              placeholder="Enter comments"
                              value={values.ticketResponseData}
                              name="ticketResponseData"
                            />
                          </div>
                          <div className="col-lg-12 text-end">
                            <button type="submit" className="btn btn-success">
                              Post Comments
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                  {/* end card body */}
                </div>
                {/*end card*/}
              </div>
              {/*end col*/}
              <div className="col-xxl-3">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Ticket Details</h5>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive table-card">
                      <table className="table table-borderless align-middle mb-0">
                        <tbody>
                          <tr>
                            <td className="fw-medium">Ticket</td>
                            <td>
                              <span>{ticketData.ticketNo}</span>{" "}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Raised By</td>
                            <td id="t-client">{ticketData.name}</td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Status:</td>
                            <td>
                              {ticketData.ticketStatus === "CLOSED" ? (
                                <span
                                  className="badge bg-danger"
                                  id="t-priority"
                                >
                                  {ticketData.ticketStatus}
                                </span>
                              ) : (
                                <span
                                  className="badge bg-warning"
                                  id="t-priority"
                                >
                                  {ticketData.ticketStatus}
                                </span>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Priority</td>
                            <td>
                                {ticketData.ticketPriority === "HIGH" ? (
                                  <span
                                    className="badge bg-danger"
                                    id="t-priority"
                                  >
                                    {ticketData.ticketPriority}
                                  </span>
                                ) : (
                                  <span
                                    className="badge bg-warning"
                                    id="t-priority"
                                  >
                                    {ticketData.ticketPriority}
                                  </span>
                                )}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Created Date</td>
                            <td id="c-date">
                              {moment(ticketData.createdDate).format(
                                "MMM Do YYYY, h:mm a"
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Last Activity</td>
                            <td>
                              {moment(ticketData.updatedDate).format(
                                "MMM Do YYYY, h:mm a"
                              )}
                            </td>
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
