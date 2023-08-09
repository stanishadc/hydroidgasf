import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {APIConfig} from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
import moment from "moment";
const initialValues = {
  transactionId: "00000000-0000-0000-0000-000000000000",
  amount: 0,
  transactionType: "CREDIT",
  status: "",
  referenceNo: "",
  paymentGatewayNo: "",
  createdDate: new Date(),
  userId: localStorage.getItem("userId"),
  gasQuantity: 0,
};
const initialUserValues = {
  userId: "00000000-0000-0000-0000-000000000000",
  name: "",
  email: "",
  phoneNo: "",
  city: "",
  country: "",
};
export default function Recharge() {
  const [values, setValues] = useState(initialValues);
  const [pricePerKG, setPricePerKG] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [userDetails, setUserDetails] = useState(initialUserValues);
  const [errors, setErrors] = useState({});
  const [transactions, setTransactions] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    CalculateTotalPrice(e.target.value);
  };
  function CalculateTotalPrice(value) {
    var total = pricePerKG * value;
    setTotalAmount(total);
  }
  const headerconfig = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("userToken"),
      "Content-Type": "application/json",
    },
  };
  const validate = () => {
    let temp = {};
    temp.amount = values.amount === 0 ? false : true;
    temp.gasQuantity = values.gasQuantity === 0 ? false : true;
    setErrors(temp);
    return Object.values(temp).every((x) => x === true);
  };
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }
  async function displayRazorpay(e) {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }
    // creating a new order
    const result = await axios.post(
      APIConfig.APIACTIVATEURL +
      APIConfig.PROCESSPAYMENTORDER +
        "?UserId=" +
        localStorage.getItem("userId") +
        "&Amount=" +
        totalAmount
    );

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }
    // Getting the order details back
    const { amount, id: order_id, currency } = result.data.data;

    const options = {
      key: APIConfig.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
      amount: amount,
      currency: currency,
      name: "ino-fi solutions pvt ltd.",
      description: "Gas Bill Recharge",
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        initialValues.transactionId = values.transactionId;
        initialValues.amount = totalAmount;
        initialValues.gasQuantity = values.gasQuantity;
        initialValues.transactionType = values.transactionType;
        initialValues.userId = values.userId;
        initialValues.status = "SUCCESS";
        initialValues.referenceNo = values.referenceNo;
        initialValues.paymentGatewayNo = response.razorpay_payment_id;
        initialValues.createdDate = values.createdDate;
        InsertTransaction(initialValues);
      },
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.phoneNo,
      },
      notes: {
        address: userDetails.city,
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }
  const InsertTransaction = (data) => {
    applicationAPI()
      .create(data)
      .then((res) => {
        if (res.data.statusCode === 200) {
          handleSuccess(res.data.data);
          clearForm();
          GetTransactions();
          GetUserDetails();
        }
      });
  };
  const applicationAPI = () => {
    return {
      create: (newrecord) =>
        axios.post(
          APIConfig.APIACTIVATEURL + APIConfig.CREATETRANSACTION,
          JSON.stringify(newrecord),
          { ...headerconfig }
        ),
    };
  };
  const clearForm = () => {
    values.amount = 0;
    values.gasQuantity = 0;
    setTotalAmount(0);
  };
  const GetLatestGasPrice = () => {
    axios
      .get(APIConfig.APIACTIVATEURL + APIConfig.GETLATESTGASPRICE, {
        ...headerconfig,
      })
      .then((response) => {
        setPricePerKG(response.data);
      });
  };
  const GetUserDetails = () => {
    axios
      .get(
        APIConfig.APIACTIVATEURL +
        APIConfig.GETUSERBYID +
          "?Id=" +
          localStorage.getItem("userId"),
        { ...headerconfig }
      )
      .then((response) => {
        setUserDetails(response.data.data);
      });
  };
  const GetTransactions = () => {
    axios
      .get(
        APIConfig.APIACTIVATEURL +
        APIConfig.GETTRANSACTIONBYUSERID +
          "?userId=" +
          localStorage.getItem("userId"),
        { ...headerconfig }
      )
      .then((response) => {
        setTransactions(response.data.data.data);
      });
  };
  const applyErrorClass = (field) =>
    field in errors && errors[field] === false ? " form-control-danger" : "";
  useEffect(() => {
    GetLatestGasPrice();
    GetUserDetails();
    GetTransactions();
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
                  <h4 className="mb-sm-0">Recharge GAS</h4>
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <Link>Home</Link>
                      </li>
                      <li className="breadcrumb-item active">Recharge</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="alert alert-success">
              <div className="row">
                <div className="col-lg-3">
                  <div className="mb-3">
                    <label htmlFor="gasWallet" className="form-label">
                      Available Gas Quantity(KG) : {userDetails.gasWallet}
                    </label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3">
                  <div className="mb-3">
                    <label htmlFor="gasQuantity" className="form-label">
                      Gas Quantity(KG)
                    </label>
                    <input
                      type="number"
                      value={values.gasQuantity}
                      name="gasQuantity"
                      onChange={handleInputChange}
                      className={
                        "form-control" + applyErrorClass("gasQuantity")
                      }
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="mb-3">
                    <label htmlFor="pricePerKG" className="form-label">
                      Price Per KG
                    </label>
                    <input
                      disabled
                      type="number"
                      value={pricePerKG}
                      name="pricePerKG"
                      className={"form-control" + applyErrorClass("pricePerKG")}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="mb-3">
                    <label htmlFor="amount" className="form-label">
                      Total Amount
                    </label>
                    <input
                      type="number"
                      disabled
                      value={totalAmount}
                      name="totalAmount"
                      className={
                        "form-control" + applyErrorClass("totalAmount")
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="col-lg-1">
                  <div className="hstack gap-2 justify-content-end mb-3 mt-4">
                    <button
                      onClick={(e) => displayRazorpay(e)}
                      className="btn btn-primary"
                    >
                      Recharge
                    </button>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Transactions List</h5>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive table-card">
                        <table
                          id="example"
                          className="table table-bordered dt-responsive nowrap table-striped align-middle"
                          style={{ width: "100%" }}
                        >
                          <thead>
                            <tr>
                              <th data-ordering="false">Reference No</th>
                              <th data-ordering="false">Amount</th>
                              <th data-ordering="false">Gas Quantity</th>
                              <th data-ordering="false">Payment Date</th>
                              <th data-ordering="false">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.length > 0 &&
                              transactions.map((p, index) => (
                                <tr key={p.transactionId}>
                                  <td>{p.referenceNo}</td>
                                  <td>{p.amount}</td>
                                  <td>{p.gasQuantity}</td>
                                  <td>
                                    {moment(p.paymentDate).format(
                                      "MMM Do YYYY, h:mm a"
                                    )}
                                  </td>
                                  <td>
                                    {p.status === "SUCCESS" ? (
                                      <span className="badge bg-success">
                                        SUCCESS
                                      </span>
                                    ) : (
                                      <span className="badge bg-warning">
                                        PENDING
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                {/*end col*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
