import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { UserStatus } from "../Common/Enums";
import { useState, useEffect } from "react";
import axios from "axios";
import {APIConfig} from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
import Flatpickr from "react-flatpickr";
const initialFieldValues = {
  messageId: "00000000-0000-0000-0000-000000000000",
  description: "",
  displayDate: new Date(),
  closingDate: new Date(),
  status: "true",
  createdUser: "00000000-0000-0000-0000-000000000000",
};
export default function Messages() {
  const [values, setValues] = useState(initialFieldValues);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessages] = useState([]);
  const [displayDate, setDisplayDate] = useState(new Date());
  const [closingDate, setClosingDate] = useState(new Date());
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
    temp.description = values.description === "" ? false : true;
    setErrors(temp);
    return Object.values(temp).every((x) => x === true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const formData = {
        messageId: values.messageId,
        description: values.description,
        displayDate: displayDate,
        closingDate: closingDate,
        status: values.status === "true" ? true : false,
        createdUser: localStorage.getItem("userId"),
      };
      addOrEdit(formData);
    }
  };
  const applicationAPI = () => {
    return {
      create: (newrecord) =>
        axios.post(
          APIConfig.APIACTIVATEURL + APIConfig.CREATEMESSAGE,
          JSON.stringify(newrecord),
          { ...headerconfig }
        ),
      update: (updateRecord) =>
        axios.put(APIConfig.APIACTIVATEURL + APIConfig.UPDATEMESSAGE, updateRecord),
      delete: (id) =>
        axios.delete(
          APIConfig.APIACTIVATEURL + APIConfig.DELETEMESSAGE + "?messageId=" + id,
          {
            ...headerconfig,
          }
        ),
    };
  };
  const addOrEdit = (formData) => {
    if (formData.messageId === "00000000-0000-0000-0000-000000000000") {
      applicationAPI()
        .create(formData)
        .then((res) => {
          handleSuccess("Message Created");
          resetForm();
          GetMessages();
        });
    } else {
      applicationAPI()
        .update(formData)
        .then((res) => {
          handleSuccess("Message Updated");
          resetForm();
          GetMessages();
        });
    }
  };
  const resetForm = () => {
    setValues(initialFieldValues);
  };
  const showEditDetails = (data) => {
    setRecordForEdit(data);
  };
  const GetMessages = () => {
    axios
      .get(APIConfig.APIACTIVATEURL + APIConfig.GETALLMESSAGES, { ...headerconfig })
      .then((response) => {
        setMessages(response.data.data.data);
      });
  };
  const onDelete = (e, id) => {
    if (window.confirm("Are you sure to delete this record?"))
      applicationAPI()
        .delete(id)
        .then((res) => {
          handleSuccess("Message Deleted Succesfully");
          GetMessages();
        });
  };
  const applyErrorClass = (field) =>
    field in errors && errors[field] === false ? " form-control-danger" : "";
  useEffect(() => {
    GetMessages();
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
                  <h4 className="mb-sm-0">Messages</h4>
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <Link>Home</Link>
                      </li>
                      <li className="breadcrumb-item active">Messages</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="alert alert-success">
              <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        Message
                      </label>
                      <input
                        type="text"
                        value={values.description}
                        name="description"
                        onChange={handleInputChange}
                        className={
                          "form-control" + applyErrorClass("description")
                        }
                        placeholder="Enter the message"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-3">
                      <label htmlFor="status" className="form-label">
                        Status
                      </label>
                      <select
                        value={values.status}
                        onChange={handleInputChange}
                        placeholder="Status"
                        name="status"
                        className={"form-control" + applyErrorClass("status")}
                      >
                        <option value="true">{UserStatus.ACTIVE}</option>
                        <option value="false">{UserStatus.INACTIVE}</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-3">
                      <label htmlFor="status" className="form-label">
                        Start Date
                      </label>
                      <Flatpickr
                        className="form-control border-0 dash-filter-picker shadow"
                        options={{
                          dateFormat: "d-m-Y",
                        }}
                        value={displayDate}
                        onChange={(selectedDates, dateStr) => {
                          const firstDate = selectedDates[0];
                          setDisplayDate(firstDate);
                        }}
                        minDate="today"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-3">
                      <label htmlFor="status" className="form-label">
                        End Date
                      </label>
                      <Flatpickr
                        className="form-control border-0 dash-filter-picker shadow"
                        options={{
                          dateFormat: "d-m-Y",
                        }}
                        value={closingDate}
                        onChange={(selectedDates, dateStr) => {
                          const firstDate = selectedDates[0];
                          setClosingDate(firstDate);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="hstack gap-2 justify-content-end mb-3 mt-4">
                      <button type="submit" className="btn btn-primary">
                        Submit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={resetForm}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Messages List</h5>
                  </div>
                  <div className="card-body">
                    <table
                      id="example"
                      className="table table-bordered dt-responsive nowrap table-striped align-middle"
                      style={{ width: "100%" }}
                    >
                      <thead>
                        <tr>
                          <th data-ordering="false">Description</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {message.length > 0 &&
                          message.map((m) => (
                            <tr key={m.messageId}>
                              <td>{m.description}</td>
                              <td>
                                {m.status === true ? (
                                  <span className="badge bg-success">
                                    {UserStatus.ACTIVE}
                                  </span>
                                ) : (
                                  <span className="badge bg-warning">
                                    {UserStatus.INACTIVE}
                                  </span>
                                )}
                              </td>
                              <td>
                                <div className="dropdown d-inline-block">
                                  <button
                                    className="btn btn-soft-secondary btn-sm dropdown"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="ri-more-fill align-middle" />
                                  </button>
                                  <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                      <Link
                                        className="dropdown-item edit-item-btn"
                                        onClick={() => {
                                          showEditDetails(m);
                                        }}
                                      >
                                        <i className="ri-pencil-fill align-bottom me-2 text-muted" />{" "}
                                        Edit
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item remove-item-btn"
                                        onClick={(e) =>
                                          onDelete(e, m.messageId)
                                        }
                                      >
                                        <i className="ri-delete-bin-fill align-bottom me-2 text-muted" />{" "}
                                        Delete
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/*end col*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
