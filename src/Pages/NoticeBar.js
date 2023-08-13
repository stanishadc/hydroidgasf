import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { APIConfig } from '../Common/Configurations/APIConfig';
export default function NoticeBar() {
  const [messageData, setMessageData] = useState([]);
  const headerconfig = {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('userToken'),
      'Content-Type': 'application/json',
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
    <div>
      {messageData === "No Records" ? "" :
        <div
          class="alert alert-danger alert-dismissible border-2 bg-body-secondary shadow fade show"
          role="alert"
        >
          <strong> Note : </strong>
          <b>{messageData.description}</b>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
      }
    </div>
  );
}
