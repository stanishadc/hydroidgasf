import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { Link } from "react-router-dom";
import { UserStatus } from "../Common/Enums";
import { useState, useEffect } from "react";
import axios from 'axios';
import config from "../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../Common/Layouts/CustomAlerts";
import readXlsxFile from 'read-excel-file';
export default function BulkUpload() {
    const [organisations, setOrganisations] = useState([]);
    const [organisationId, setOrganisationId] = useState('00000000-0000-0000-0000-000000000000');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const headerconfig = {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("userToken"),
            'Content-Type': 'application/json'
        }
    }
    const applicationAPI = () => {
        return {
            create: (newrecord) =>
                axios.post(config.APIACTIVATEURL + config.BULKUPLOADUSERDEVICES, JSON.stringify(newrecord), { ...headerconfig })
        };
    };
    const uploadData = (formData) => {
        applicationAPI()
            .create(formData)
            .then((res) => {
                if (res.data.statusCode === 200) {
                    handleSuccess(res.data.message);
                }
                else {
                    handleError(res.data.message);
                }
            });
    };
    const validateFile = () => {
        let temp = {};
        const inputBD = document.getElementById('inputBD')
        temp.inputBD = inputBD.value === "" ? false : true;
        temp.organisationId = organisationId === "00000000-0000-0000-0000-000000000000" ? false : true;
        setErrors(temp);
        return Object.values(temp).every((x) => x === true);
    };
    const UploadBulk = (e) => {
        if (validateFile()) {
            setLoading(true);
            var deviceinfos = [];
            const input = document.getElementById('inputBD')
            readXlsxFile(input.files[0]).then((rows) => {
                for (var i = 0; i < rows.length; i++) {
                    if (i != 0) {
                        var data = rows[i];
                        var applicationId = data[1];
                        var block = data[2];
                        var wing = data[3];
                        var floor = data[4];
                        var userName = data[5];
                        var deviceName = data[6];
                        var meterNo = data[7];
                        var endDeviceId = data[8];
                        const formData = {
                            "organisationId": organisationId,
                            "applicationId": applicationId,
                            "block": block,
                            "wing": wing,
                            "floor": floor,
                            "userName": userName,
                            "deviceName": deviceName,
                            "meterNo": meterNo,
                            "endDeviceId": endDeviceId
                        }
                        deviceinfos = [...deviceinfos, formData];
                    }
                }
                input.value = '';
                uploadData(deviceinfos)
            })
            setLoading(false);
        }
    };
    const GetOrganisations = () => {
        axios
            .get(config.APIACTIVATEURL + config.GETALLORGANISATIONS, { ...headerconfig })
            .then((response) => {
                setOrganisations(response.data.data)
            });
    };
    const applyErrorClass = (field) =>
        field in errors && errors[field] === false ? " form-control-danger" : "";
    useEffect(() => {
        GetOrganisations();
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
                                    <h4 className="mb-sm-0">Bulk Devices and Users</h4>
                                    <div className="page-title-right">
                                        <ol className="breadcrumb m-0">
                                            <li className="breadcrumb-item"><Link>Home</Link></li>
                                            <li className="breadcrumb-item active">Bulk Devices and Users</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="alert alert-success">
                            <form autoComplete="off" noValidate>
                                <div className="row">
                                    <div className="col-lg-3">
                                        <div className="mb-4">
                                            <label htmlFor="status" className="form-label">Organisation</label>
                                            <select value={organisationId} onChange={e => setOrganisationId(e.target.value)} placeholder="organisation" name="organisationId" className={"form-select" + applyErrorClass('organisationId')}>
                                                <option value={0}>Please select</option>
                                                {organisations.map(sv =>
                                                    <option value={sv.organisationId}>{sv.organisationName}</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-4">
                                            <label htmlFor="deviceId" className="form-label">Upload Bulk Devices</label>
                                            <input type="file" id="inputBD" className={"form-control" + applyErrorClass('inputBD')} />
                                        </div>
                                    </div>
                                    <div className="col-lg-1">
                                        <div className="hstack gap-2 justify-content-end mb-3 mt-4">
                                            {loading === false ?
                                                <button type="button" onClick={e => UploadBulk(e)} className="btn btn-primary">Upload</button>
                                                :
                                                <button type="button" disabled className="btn btn-primary">Please wait...</button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}