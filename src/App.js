import { Routes, Route } from "react-router-dom";
import Login from "./Authentication/Login";
import Logout from "./Authentication/Logout";
import Roles from "./SuperAdmin/Roles";
import Users from "./SuperAdmin/Users";
import SuperDashboard from "./SuperAdmin/SuperDashboard";
import CustomerDashboard from "./Customers/CustomerDashboard";
import AdminDashboard from "./Admin/AdminDashboard";
import UserProfile from "./Pages/Profile";
import ChangePassword from "./Pages/ChangePassword";
import Devices from "./SuperAdmin/Devices";
import Organisations from "./Pages/Organisations";
import Payments from "./Pages/Payments";
import Tickets from "./Pages/Tickets";
import Notifications from "./Pages/Notifications";
import MeterReading from "./Pages/MeterReading";
import NewTicket from "./Pages/NewTicket";
import TicketDetails from "./Pages/TicketDetails";
import PaymentDetails from "./Pages/PaymentDetails";
import Apartments from "./Pages/Apartments";
import Floors from "./Pages/Floors";
import Blocks from "./Pages/Blocks";
import Units from "./Pages/Units";
import UserMeterReading from "./Pages/UserMeterReading";
import PaymentRequest from "./Pages/PaymentRequest";
import Payment from "./Pages/Payment";
import UserMeterLeaksData from "./Customers/UserMeterLeaksData";
import LeaksData from "./SuperAdmin/LeaksData";
import Messages from "./SuperAdmin/Messages";
import UserDevices from "./Pages/UserDevices";
import BulkUpload from "./Pages/BulkUpload";
import NewDashboard from "./Customers/NewDashboard";
import AdminUsers from "./SuperAdmin/AdminUsers";
import AdminMeterReading from "./Admin/AdminMeterReading";
import AdminWaterUsage from "./Admin/AdminWaterUsage";
import AdminUsageReport from "./Admin/UsageReport";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import ResetPassword from "./Authentication/ResetPassword";
import GasPrice from "./Pages/GasPrice";
import Transactions from "./Pages/Transactions";
import Recharge from "./Pages/Recharge";
function App() {
  return (
      <Routes>
        <Route path="/" element={ <Login/> } />
        <Route path="/login" element={ <Login/> } />
        <Route path="/logout" element={ <Logout/> } />
        
        <Route path="/superadmin/dashboard" element={ <SuperDashboard/> } />
        <Route path="/admin/dashboard" element={ <AdminDashboard/> } />
        <Route path="/admin/meterreading" element={ <AdminMeterReading/> } />
        <Route path="/admin/usagereport" element={ <AdminUsageReport/> } />
        <Route path="/admin/gasusage" element={ <AdminWaterUsage/> } />
        <Route path="/customer/olddashboard" element={ <CustomerDashboard/> } />
        <Route path="/customer/dashboard" element={ <NewDashboard/> } />

        <Route path="/users" element={ <Users/> } />
        <Route path="/admin/users" element={ <AdminUsers/> } />
        <Route path="/profile" element={ <UserProfile/> } />
        <Route path="/changepassword" element={ <ChangePassword/> } />
        <Route path="/resetpassword" element={ <ResetPassword/> } />

        <Route path="/devices" element={ <Devices/> } />
        <Route path="/upload" element={ <BulkUpload/> } />
        <Route path="/organisations" element={ <Organisations/> } />
        <Route path="/apartments" element={ <Apartments/> } />
        <Route path="/blocks" element={ <Blocks/> } />
        <Route path="/floors" element={ <Floors/> } />
        <Route path="/units" element={ <Units/> } />
        <Route path="/payments" element={ <Payments/> } />
        <Route path="/tickets" element={ <Tickets/> } />
        <Route path="/notifications" element={ <Notifications/> } />
        <Route path="/meterreading" element={ <MeterReading/> } />
        <Route path="/user/meterreading" element={ <UserMeterReading/> } />
        <Route path="/messages" element={ <Messages/> } />
        <Route path="/userdevices" element={ <UserDevices/> } />
        <Route path="/gasprices" element={ <GasPrice/> } />
        <Route path="/transactions" element={ <Transactions/> } />
        <Route path="/recharge" element={ <Recharge/> } />

        <Route path="/tickets" element={ <Tickets/> } />
        <Route path="/newticket" element={ <NewTicket/> } />
        <Route path="/ticketdetails/:ticketId" element={ <TicketDetails/> } />
        <Route path="/paymentdetails/:paymentId" element={ <PaymentDetails/> } />

        <Route path="/paymentrequests" element={ <PaymentRequest/> } />
        <Route path="/payment" element={ <Payment/> } />
        <Route path="/user/leaks" element={ <UserMeterLeaksData/> } />
        <Route path="/leaks" element={ <LeaksData/> } />
        <Route path="/privacypolicy" element={ <PrivacyPolicy/> } />
      </Routes>
  );
}

export default App;
