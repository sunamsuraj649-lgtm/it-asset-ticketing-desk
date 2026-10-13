import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5055/api';

function AssetsPage() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/assets`)
      .then((response) => response.json())
      .then((data) => setAssets(data))
      .catch((error) => console.error('Failed to load assets:', error));
  }, []);

  return (
    <div className="panel page-panel">
      <div className="panel-header">
        <h3>Asset Inventory</h3>
        <span>{assets.length} items</span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Department</th>
              <th>Status</th>
              <th>Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td>{asset.name}</td>
                <td>{asset.category}</td>
                <td>{asset.department}</td>
                <td>
                  <span className={`status-pill ${asset.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {asset.status}
                  </span>
                </td>
                <td>{asset.assignedTo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AssetsPage;
