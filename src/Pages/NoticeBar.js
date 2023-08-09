import React, { useEffect, useState } from "react";
import axios from "axios";
import {APIConfig} from "../Common/Configurations/APIConfig";
export default function NoticeBar() {
    const [messageData, setMessageData] = useState([]);
  const headerconfig = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("userToken"),
      "Content-Type": "application/json",
    },
  };
    const GetNoticeDetails = () => {
        axios
          .get(APIConfig.APIACTIVATEURL + APIConfig.GETDISPLAYMESSAGE, {
            ...headerconfig,
          })
          .then((response) => {
            setMessageData(response.data.data);
          });
      };
      useEffect(() => {
        GetNoticeDetails();
      }, []);
  return (
    <div
      className="alert alert-danger alert-dismissible fade show"
      role="alert" style={{"minWidth":'500px'}}
    >
      <strong> Note : </strong><b>{messageData.description}</b>
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
      />
    </div>
  );
}
