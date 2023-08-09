import { Link } from "react-router-dom";
import moment from 'moment';
export default function Header() {
    return (
        <div className="app-menu navbar-menu">
            {/* LOGO */}
            <div className="navbar-brand-box">
                {/* Dark Logo*/}
                <Link to="/" className="logo logo-dark">                    
                    <span className="logo-lg">
                        <img src="/assets/images/logo-dark.png" alt height={17} />
                    </span>
                </Link>
                <br/>
                {moment(new Date()).format("Do MMM YYYY, h:mm a")}
            </div>
            <div id="scrollbar">
                <div className="container-fluid">
                    <div id="two-column-menu">
                    </div>
                    {localStorage.getItem('roleName') === "Customer" ?
                        <ul className="navbar-nav" id="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/customer/dashboard"}>
                                    <i className="ri-dashboard-fill" /> <span data-key="t-dashboards">Dashboard</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/user/meterreading"}>
                                    <i className="ri-dashboard-2-line" /> <span data-key="t-dashboards">Gas Usage</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/newticket"}>
                                    <i className="ri-ticket-fill" /> <span data-key="t-dashboards">New Ticket</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/recharge"}>
                                    <i className="ri-money-dollar-box-line" /> <span data-key="t-dashboards">Recharge Gas</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/notifications"}>
                                    <i className="ri-notification-2-fill" /> <span data-key="t-dashboards">Notifications</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/user/leaks"}>
                                    <i className="ri-notification-2-fill" /> <span data-key="t-dashboards">Leaks</span>
                                </Link>
                            </li>
                        </ul>
                        :
                        localStorage.getItem('roleName') === "Super Admin" ?
                        <ul className="navbar-nav" id="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/superadmin/dashboard"}>
                                    <i className="ri-dashboard-fill" /> <span data-key="t-dashboards">Dashboard</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/meterreading"}>
                                    <i className="ri-dashboard-2-line" /> <span data-key="t-dashboards">Gas Usage Data</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/gasprices"}>
                                    <i className="ri-dashboard-2-line" /> <span data-key="t-dashboards">GasPrices</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/devices"}>
                                    <i className="ri-tv-2-line" /> <span data-key="t-dashboards">Devices</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/organisations"}>
                                    <i className="ri-building-4-fill" /> <span data-key="t-dashboards">Organisations</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/apartments"}>
                                    <i className="ri-building-4-fill" /> <span data-key="t-dashboards">Apartments</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/blocks"}>
                                    <i className="ri-building-4-fill" /> <span data-key="t-dashboards">Blocks</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/floors"}>
                                    <i className="ri-building-4-fill" /> <span data-key="t-dashboards">Floors</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/units"}>
                                    <i className="ri-building-4-fill" /> <span data-key="t-dashboards">Units</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/tickets"}>
                                    <i className="ri-ticket-fill" /> <span data-key="t-dashboards">Tickets</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/transactions"}>
                                    <i className="ri-money-dollar-box-line" /> <span data-key="t-dashboards">Transactions</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/notifications"}>
                                    <i className="ri-notification-2-fill" /> <span data-key="t-dashboards">Notifications</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/leaks"}>
                                    <i className="ri-notification-2-fill" /> <span data-key="t-dashboards">Leaks</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/messages"}>
                                    <i className="ri-building-4-fill" /> <span data-key="t-dashboards">Messages</span>
                                </Link>
                            </li>
                            </ul>
                            :
                            <ul className="navbar-nav" id="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/admin/dashboard"}>
                                    <i className="ri-dashboard-fill" /> <span data-key="t-dashboards">Dashboard</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/meterreading"}>
                                    <i className="ri-dashboard-2-line" /> <span data-key="t-dashboards">Gas Usage Data</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/gasprices"}>
                                    <i className="ri-dashboard-2-line" /> <span data-key="t-dashboards">GasPrices</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/users"}>
                                    <i className="ri-folder-user-fill" /> <span data-key="t-dashboards">Users</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/roles"}>
                                    <i className="ri-folder-user-fill" /> <span data-key="t-dashboards">Roles</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/tickets"}>
                                    <i className="ri-ticket-fill" /> <span data-key="t-dashboards">Tickets</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/transactions"}>
                                    <i className="ri-money-dollar-box-line" /> <span data-key="t-dashboards">Transactions</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/notifications"}>
                                    <i className="ri-notification-2-fill" /> <span data-key="t-dashboards">Notifications</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/leaks"}>
                                    <i className="ri-notification-2-fill" /> <span data-key="t-dashboards">Leaks</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/units"}>
                                    <i className="ri-building-4-fill" /> <span data-key="t-dashboards">Units</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to={"/messages"}>
                                    <i className="ri-building-4-fill" /> <span data-key="t-dashboards">Messages</span>
                                </Link>
                            </li>
                        </ul>
                    }
                </div>
                {/* Sidebar */}
            </div>
            <div className="sidebar-background" />
        </div>
    );
}