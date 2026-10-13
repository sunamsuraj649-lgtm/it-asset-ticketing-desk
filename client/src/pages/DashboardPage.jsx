import { useEffect, useMemo, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5055/api';

function DashboardPage() {
  const [dashboard, setDashboard] = useState({
    totalAssets: 0,
    openTickets: 0,
    resolvedToday: 0,
    assetsInMaintenance: 0,
    avgResponse: 0,
  });
  const [assets, setAssets] = useState([]);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, assetsRes, ticketsRes] = await Promise.all([
          fetch(`${API_URL}/dashboard`),
          fetch(`${API_URL}/assets`),
          fetch(`${API_URL}/tickets`),
        ]);

        const dashboardData = await dashboardRes.json();
        setDashboard(dashboardData);
        setAssets(await assetsRes.json());
        setTickets(await ticketsRes.json());
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const assetMap = useMemo(
    () => Object.fromEntries(assets.map((asset) => [asset.id, asset])),
    [assets],
  );

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">Operations dashboard</p>
          <h1>IT Asset & Hardware Ticketing Desk</h1>
        </div>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <span>Total Assets</span>
          <strong>{dashboard.totalAssets}</strong>
          <small>Tracked devices</small>
        </div>
        <div className="stat-card accent">
          <span>Open Tickets</span>
          <strong>{dashboard.openTickets}</strong>
          <small>Needs attention</small>
        </div>
        <div className="stat-card">
          <span>Resolved</span>
          <strong>{dashboard.resolvedToday}</strong>
          <small>Today</small>
        </div>
        <div className="stat-card warn">
          <span>Maintenance</span>
          <strong>{dashboard.assetsInMaintenance}</strong>
          <small>Repair queue</small>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel assets-panel">
          <div className="panel-header">
            <h3>Asset Inventory</h3>
            <span>{assets.length} devices</span>
          </div>

          <div className="asset-list">
            {assets.map((asset) => (
              <div key={asset.id} className="asset-item">
                <div>
                  <h4>{asset.name}</h4>
                  <p>{asset.category} • {asset.department}</p>
                </div>
                <div className="asset-meta">
                  <span className={`status-pill ${asset.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {asset.status}
                  </span>
                  <small>{asset.assignedTo}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel summary-panel">
          <div className="panel-header">
            <h3>Service Metrics</h3>
            <span>Live</span>
          </div>

          <ul className="metric-list">
            <li>
              <span>Avg. response</span>
              <strong>{dashboard.avgResponse}h</strong>
            </li>
            <li>
              <span>Escalation risk</span>
              <strong>12%</strong>
            </li>
            <li>
              <span>Pending renewals</span>
              <strong>4</strong>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}

export default DashboardPage;
