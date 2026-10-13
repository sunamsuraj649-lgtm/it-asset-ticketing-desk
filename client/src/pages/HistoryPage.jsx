import { useEffect, useMemo, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5055/api';

function HistoryPage() {
  const [tickets, setTickets] = useState([]);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/tickets`)
      .then((response) => response.json())
      .then((data) => setTickets(data))
      .catch((error) => console.error('Failed to load ticket history:', error));
  }, []);

  const report = useMemo(() => {
    const active = tickets.filter((ticket) => ticket.status !== 'Resolved');
    const resolved = tickets.filter((ticket) => ticket.status === 'Resolved');

    const ticketCost = (ticket) => {
      const base = ticket.priority === 'High' ? 1800 : ticket.priority === 'Medium' ? 1200 : 700;
      return base + (ticket.status === 'Resolved' ? 250 : 0);
    };

    const total = tickets.reduce((sum, ticket) => sum + ticketCost(ticket), 0);

    return {
      activeCount: active.length,
      resolvedCount: resolved.length,
      total,
      details: tickets.map((ticket) => ({
        ...ticket,
        cost: ticketCost(ticket),
      })),
    };
  }, [tickets]);

  return (
    <div className="panel page-panel">
      <div className="panel-header">
        <h3>Ticket History</h3>
        <button className="primary-btn small-btn" onClick={() => setShowReport((prev) => !prev)}>
          {showReport ? 'Hide Report' : 'Generate Report'}
        </button>
      </div>

      {!tickets.length ? (
        <div className="empty-state">
          <p>No ticket history yet. Create a new ticket to see the service record and billing report.</p>
        </div>
      ) : (
        <>
          <div className="history-summary">
            <div>
              <span>Open records</span>
              <strong>{report.activeCount}</strong>
            </div>
            <div>
              <span>Resolved records</span>
              <strong>{report.resolvedCount}</strong>
            </div>
            <div>
              <span>Total value</span>
              <strong>₹{report.total}</strong>
            </div>
          </div>

          {showReport && (
            <div className="report-card">
              <h4>Service Bill</h4>
              <div className="report-table">
                {report.details.map((ticket) => (
                  <div key={ticket.id} className="report-row">
                    <span>{ticket.title}</span>
                    <strong>₹{ticket.cost}</strong>
                  </div>
                ))}
              </div>
              <div className="report-total">
                <span>Total Bill</span>
                <strong>₹{report.total}</strong>
              </div>
            </div>
          )}

          <div className="ticket-list history-list">
            {tickets.map((ticket) => (
              <article key={ticket.id} className="ticket-card history-card">
                <div className="ticket-heading">
                  <div>
                    <h4>{ticket.title}</h4>
                    <p>{ticket.requester} • {ticket.department}</p>
                  </div>
                  <span className={`priority-badge ${ticket.priority.toLowerCase()}`}>
                    {ticket.priority}
                  </span>
                </div>

                <div className="ticket-body">
                  <p>{ticket.description}</p>
                  <div className="ticket-detail-row">
                    <span>Status: {ticket.status}</span>
                    <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default HistoryPage;
