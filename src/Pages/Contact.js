import Footer from '../Common/Layouts/Footer';
import Header from '../Common/Layouts/Header';
import SideBar from '../Common/Layouts/SideBar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { APIConfig } from '../Common/Configurations/APIConfig';
import { Link } from 'react-router-dom';

export default function Contact() {
  const [address, setAddress] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [email, setEmail] = useState('');
  const [dealerName, setDealerName] = useState('');
  const headerconfig = {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('userToken'),
      'Content-Type': 'application/json',
    },
  };
  const GetContactData = () => {
    axios
      .get(APIConfig.APIACTIVATEURL + APIConfig.GETALLCONTACT, { ...headerconfig })
      .then((response) => {
        setDealerName(response.data.data[0].dealerName);
        setEmail(response.data.data[0].email);
        setPhoneNo(response.data.data[0].phoneNo);
        setAddress(response.data.data[0].address);
      });
  };
  useEffect(() => {
    GetContactData();
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
                  <h4 className="mb-sm-0">Dealer Contact Details</h4>
                </div>
              </div>
            </div>
            <div className="alert alert-success">
              <div className="row">
                <div className="col-lg-2">
                  <div className="mb-4">
                    <label htmlFor="ticketCategoryId" className="form-label">
                      Dealer Name : 
                    </label>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="mb-4">
                    <label htmlFor="ticketCategoryId" className="form-label">
                      {dealerName}
                    </label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-2">
                  <div className="mb-4">
                    <label htmlFor="ticketCategoryId" className="form-label">
                      Email : 
                    </label>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="mb-4">
                    <label htmlFor="ticketCategoryId" className="form-label">
                      {email}
                    </label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-2">
                  <div className="mb-4">
                    <label htmlFor="ticketCategoryId" className="form-label">
                      Phone No : 
                    </label>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="mb-4">
                    <label htmlFor="ticketCategoryId" className="form-label">
                      {phoneNo}
                    </label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-2">
                  <div className="mb-4">
                    <label htmlFor="ticketCategoryId" className="form-label">
                      Address : 
                    </label>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="mb-4">
                    <label htmlFor="ticketCategoryId" className="form-label">
                      {address}
                    </label>
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
