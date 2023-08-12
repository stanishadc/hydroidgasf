import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import auth from '../Configurations/Auth';
import NotificationsUI from './NotificationsUI';
import moment from 'moment';
import axios from 'axios';
import { APIConfig } from '../Configurations/APIConfig';
import NoticeBar from '../../Pages/NoticeBar';
export default function Header(props) {
  const [username, setUserName] = useState(localStorage.getItem('name'));
  const navigate = useNavigate();
  function CheckExpirationTime() {
    if (localStorage.getItem('tokenexpiration') !== '') {
      const expiredate = new Date(localStorage.getItem('tokenexpiration'));
      const localdate = new Date();
      if (expiredate > localdate) {
        return true;
      }
    }
    return false;
  }
  const [messageData, setMessageData] = useState([]);
  const headerconfig = {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('userToken'),
      'Content-Type': 'application/json',
    },
  };
  const GetPaymentDetails = () => {
    axios
      .get(APIConfig.APIACTIVATEURL + APIConfig.GETDISPLAYMESSAGE, {
        ...headerconfig,
      })
      .then((response) => {
        setMessageData(response.data.data);
      });
  };
  useEffect(() => {
    GetPaymentDetails();
  }, []);
  useEffect(() => {
    if (localStorage.getItem('userId') !== '') {
      setUserName(localStorage.getItem('name'));
      if (CheckExpirationTime()) {
        auth.uulogin();
      } else {
        navigate('/login');
      }
    }
  }, []);
  return (
    <header id="page-topbar">
      <NoticeBar></NoticeBar>
      <div className="layout-width">
        <div className="navbar-header">
          <div className="d-flex"></div>
          <div className="d-flex align-items-center">
            <div className="dropdown ms-sm-3 header-item topbar-user headerLogin">
              <button
                type="button"
                className="btn"
                id="page-header-user-dropdown"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span className="d-flex align-items-center">
                  <span className="text-start ms-xl-2">
                    <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                      Hello, {username}
                    </span>
                  </span>
                </span>
              </button>
              <NotificationsUI></NotificationsUI>
              <div className="dropdown-menu dropdown-menu-end">
                <Link className="dropdown-item" to={'/profile'}>
                  <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1" />{' '}
                  <span className="align-middle">Profile</span>
                </Link>
                {/* <Link className="dropdown-item" to={"/changepassword"}><i className="mdi mdi-lock text-muted fs-16 align-middle me-1" /> <span className="align-middle">Change Password</span></Link> */}
                <Link className="dropdown-item" to={'/logout'}>
                  <i className="mdi mdi-logout text-muted fs-16 align-middle me-1" />{' '}
                  <span className="align-middle" data-key="t-logout">
                    Logout
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
