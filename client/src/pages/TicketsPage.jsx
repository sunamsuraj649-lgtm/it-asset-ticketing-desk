import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5055/api';

function TicketsPage() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/tickets`)
      .then((response) => response.json())
      .then((data) => setTickets(data))
      .catch((error) => console.error('Failed to load tickets:', error));
  }, []);

  const visibleTickets = tickets.filter((ticket) => ticket.status !== 'Resolved');

  const handleStatusUpdate = async (ticketId, status) => {
    const response = await fetch(`${API_URL}/tickets/${ticketId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      const updated = await response.json();
      setTickets((prev) =>
        prev.map((ticket) => (ticket.id === updated.id ? updated : ticket)),
      );
    }
  };

  return (
    <div className="panel page-panel">
      <div className="panel-header">
        <h3>Ticket Management</h3>
        <span>{visibleTickets.length} active tickets</span>
      </div>

      <div className="ticket-list">
        {visibleTickets.map((ticket) => (
          <article key={ticket.id} className="ticket-card">
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
                <span>Assigned to: {ticket.assignedTo}</span>
              </div>
            </div>

            <div className="ticket-actions">
              <button onClick={() => handleStatusUpdate(ticket.id, 'In Progress')}>In Progress</button>
              <button onClick={() => handleStatusUpdate(ticket.id, 'Resolved')}>Resolve</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default TicketsPage;
