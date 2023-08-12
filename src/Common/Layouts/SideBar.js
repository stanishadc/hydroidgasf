import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div className="app-menu navbar-menu">
      {/* LOGO */}
      <div className="navbar-brand-box">
        {/* Dark Logo*/}
        <Link to="/" className="logo logo-dark">
          <span className="logo-sm">
            <img src="/assets/images/logo-sm.png" alt height={22} />
          </span>
          <span className="logo-lg">
            <img src="/assets/images/logo-dark.png" alt height={17} />
          </span>
        </Link>
        {/* Light Logo*/}
        <Link to="/" className="logo logo-light">
          <span className="logo-sm">
            <img src="/assets/images/logo-sm.png" alt height={22} />
          </span>
          <span className="logo-lg">
            <img src="/assets/images/logo-light.png" alt height={17} />
          </span>
        </Link>
        <button
          type="button"
          className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
          id="vertical-hover"
        >
          <i className="ri-record-circle-line" />
        </button>
      </div>
      <div id="scrollbar">
        <div className="container-fluid">
          <div id="two-column-menu"></div>
          {localStorage.getItem('roleName') === 'Customer' ? (
            <ul className="navbar-nav" id="navbar-nav">
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links"
                  to={'/customer/dashboard'}
                >
                  <i className="ri-dashboard-fill" />{' '}
                  <span data-key="t-dashboards">Dashboard</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links"
                  to={'/user/meterreading'}
                >
                  <i className="ri-dashboard-2-line" />{' '}
                  <span data-key="t-dashboards">Gas Usage</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links"
                  to={'/newticket'}
                >
                  <span className="material-symbols-outlined googleIcons">
                    local_activity
                  </span>
                  <span data-key="t-dashboards">New Ticket</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links"
                  to={'/recharge'}
                >
                  <i className="ri-money-dollar-box-line" />{' '}
                  <span data-key="t-dashboards">Recharge Gas</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links"
                  to={'/notifications'}
                >
                  <i className="ri-notification-2-fill" />{' '}
                  <span data-key="t-dashboards">Notifications</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links"
                  to={'/user/leaks'}
                >
                  <span className="material-symbols-outlined googleIcons">
                    emergency_home
                  </span>
                  <span data-key="t-dashboards">Leaks</span>
                </Link>
              </li>
            </ul>
          ) : localStorage.getItem('roleName') === 'Super Admin' ? (
            <ul className="navbar-nav" id="navbar-nav">
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links"
                  to={'/superadmin/dashboard'}
                >
                  <i className="ri-dashboard-fill" />{' '}
                  <span data-key="t-dashboards">Dashboard</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links"
                  to={'/meterreading'}
                >
                  <span className="material-symbols-outlined googleIcons">
                    trending_up
                  </span>
                  <span data-key="t-dashboards">Gas Usage Data</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links"
                  to={'/gasprices'}
                >
                  <i className="ri-dashboard-2-line" />{' '}
                  <span data-key="t-dashboards">GasPrices</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links"
                  to={'/devices'}
                >
                  <i className="ri-tv-2-line" />{' '}
                  <span data-key="t-dashboards">Devices</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links"
                  to={'/organisations'}
                >
                  <span className="material-symbols-outlined googleIcons">
                    water_damage
                  </span>
                  <span data-key="t-dashboards">Organisations</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links"
                  to={'/apartments'}
                >
                  <span className="material-symbols-outlined googleIcons">
                    apartment
                  </span>
                  <span data-key="t-dashboards">Apartments</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links"
                  to={'/blocks'}
                >
                  <span className="material-symbols-outlined googleIcons">
                    crop_square
                  </span>
                  <span data-key="t-dashboards">Blocks</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links"
                  to={'/floors'}
                >
                  <span className="material-symbols-outlined googleIcons">
                    segment
                  </span>
                  <span data-key="t-dashboards">Floors</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links"
                  to={'/units'}
                >
                  <span className="material-symbols-outlined googleIcons">
                    grid_view
                  </span>
                  <span data-key="t-dashboards">Units</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links"
                  to={'/tickets'}
                >
                  <span className="material-symbols-outlined googleIcons">
                    local_activity
                  </span>
                  <span data-key="t-dashboards">Tickets</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links"
                  to={'/transactions'}
                >
                  <i className="ri-money-dollar-box-line" />{' '}
                  <span data-key="t-dashboards">Transactions</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links"
                  to={'/notifications'}
                >
                  <i className="ri-notification-2-fill" />{' '}
                  <span data-key="t-dashboards">Notifications</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links"
                  to={'/leaks'}
                >
                  <i className="ri-notification-2-fill" />{' '}
                  <span data-key="t-dashboards">Leaks</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links"
                  to={'/messages'}
                >
                  <i className="ri-building-4-fill" />{' '}
                  <span data-key="t-dashboards">Messages</span>
                </Link>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav" id="navbar-nav">
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links ovr-nav-links"
                  to={'/admin/dashboard'}
                >
                  <i className="ri-dashboard-fill" />{' '}
                  <span data-key="t-dashboards">Dashboard</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links ovr-nav-links"
                  to={'/meterreading'}
                >
                  <i className="ri-dashboard-2-line" />{' '}
                  <span data-key="t-dashboards">Gas Usage Data</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links ovr-nav-links"
                  to={'/gasprices'}
                >
                  <span className="material-symbols-outlined googleIcons">
                    finance_chip
                  </span>
                  <span data-key="t-dashboards">GasPrices</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links ovr-nav-links"
                  to={'/users'}
                >
                  <span className="material-symbols-outlined googleIcons">
                    group
                  </span>
                  <span data-key="t-dashboards">Users</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links ovr-nav-links"
                  to={'/roles'}
                >
                  <span className="material-symbols-outlined googleIcons">
                    diversity_3
                  </span>
                  <span data-key="t-dashboards">Roles</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links ovr-nav-links"
                  to={'/tickets'}
                >
                  <span className="material-symbols-outlined googleIcons">
                    local_activity
                  </span>
                  <span data-key="t-dashboards">Tickets</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links ovr-nav-links"
                  to={'/transactions'}
                >
                  <i className="ri-money-dollar-box-line" />{' '}
                  <span data-key="t-dashboards">Transactions</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links ovr-nav-links"
                  to={'/notifications'}
                >
                  <i className="ri-notification-2-fill" />{' '}
                  <span data-key="t-dashboards">Notifications</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links ovr-nav-links"
                  to={'/leaks'}
                >
                  <span className="material-symbols-outlined googleIcons">
                    emergency_home
                  </span>
                  <span data-key="t-dashboards">Leaks</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links ovr-nav-links"
                  to={'/units'}
                >
                  <span className="material-symbols-outlined googleIcons">
                    grid_view
                  </span>
                  <span data-key="t-dashboards">Units</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link menu-link ovr-nav-links ovr-nav-links"
                  to={'/messages'}
                >
                  <span className="material-symbols-outlined googleIcons">
                    sms
                  </span>
                  <span data-key="t-dashboards">Messages</span>
                </Link>
              </li>
            </ul>
          )}
        </div>
        {/* Sidebar */}
      </div>
      <div className="sidebar-background" />
    </div>
  );
}
