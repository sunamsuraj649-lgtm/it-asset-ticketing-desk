import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5055/api';

function NewTicketPage() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [formData, setFormData] = useState({
    assetId: '1',
    requester: '',
    department: 'IT Infrastructure',
    priority: 'Medium',
    title: '',
    description: '',
  });

  useEffect(() => {
    fetch(`${API_URL}/assets`)
      .then((response) => response.json())
      .then((data) => setAssets(data))
      .catch((error) => console.error('Failed to load assets:', error));
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(`${API_URL}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        assetId: Number(formData.assetId),
      }),
    });

    if (response.ok) {
      navigate('/tickets');
    } else {
      alert('Ticket could not be submitted.');
    }
  };

  return (
    <div className="panel page-panel">
      <div className="panel-header">
        <h3>Log New Ticket</h3>
        <span>IT Help Desk</span>
      </div>

      <form onSubmit={handleSubmit} className="ticket-form">
        <div className="field-grid">
          <label>
            Asset
            <select name="assetId" value={formData.assetId} onChange={handleInputChange}>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>{asset.name}</option>
              ))}
            </select>
          </label>

          <label>
            Requester
            <input
              type="text"
              name="requester"
              value={formData.requester}
              onChange={handleInputChange}
              placeholder="Enter employee name"
              required
            />
          </label>

          <label>
            Department
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Priority
            <select name="priority" value={formData.priority} onChange={handleInputChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>

          <label className="full-width">
            Title
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Brief issue summary"
              required
            />
          </label>

          <label className="full-width">
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the problem"
              rows="4"
            />
          </label>
        </div>

        <button type="submit" className="primary-btn submit-btn">Submit Ticket</button>
      </form>
    </div>
  );
}

export default NewTicketPage;
