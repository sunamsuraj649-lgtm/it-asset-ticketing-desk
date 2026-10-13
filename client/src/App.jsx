import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import DashboardPage from './pages/DashboardPage';
import AssetsPage from './pages/AssetsPage';
import TicketsPage from './pages/TicketsPage';
import NewTicketPage from './pages/NewTicketPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <BrowserRouter>
      <div className="page-shell">
        <aside className="sidebar">
          <div className="brand-block">
            <div className="brand-mark">IT</div>
            <div>
              <p className="eyebrow">Support Desk</p>
              <h2>AssetFlow</h2>
            </div>
          </div>

          <nav className="nav-menu">
            <NavLink to="/" end>Overview</NavLink>
            <NavLink to="/assets">Assets</NavLink>
            <NavLink to="/tickets">Tickets</NavLink>
            <NavLink to="/history">History</NavLink>
            <NavLink to="/new-ticket">New Ticket</NavLink>
          </nav>

          <div className="sidebar-card">
            <p>Uptime</p>
            <strong>99.8%</strong>
            <span>System stable this month</span>
          </div>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/assets" element={<AssetsPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/new-ticket" element={<NewTicketPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
