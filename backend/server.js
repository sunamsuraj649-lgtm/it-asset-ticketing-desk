const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5055;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const assets = [
  {
    id: 1,
    name: 'Dell Latitude 7440',
    category: 'Laptop',
    department: 'Finance',
    status: 'Healthy',
    serialNumber: 'DL7440-201',
    assignedTo: 'Nisha R.',
    lastService: '2026-09-21',
  },
  {
    id: 2,
    name: 'HP LaserJet Pro M404n',
    category: 'Printer',
    department: 'Administration',
    status: 'Needs Service',
    serialNumber: 'HP404-118',
    assignedTo: 'Front Desk',
    lastService: '2026-08-10',
  },
  {
    id: 3,
    name: 'Cisco Catalyst 9300',
    category: 'Network Device',
    department: 'IT Infrastructure',
    status: 'Healthy',
    serialNumber: 'CC9300-77',
    assignedTo: 'Network Team',
    lastService: '2026-10-03',
  },
  {
    id: 4,
    name: 'Dell 24" Monitor',
    category: 'Display',
    department: 'HR',
    status: 'Maintenance',
    serialNumber: 'DM24-309',
    assignedTo: 'Rohit',
    lastService: '2026-07-15',
  },
  {
    id: 5,
    name: 'Logitech USB Webcam',
    category: 'Peripheral',
    department: 'Operations',
    status: 'Healthy',
    serialNumber: 'LW-506',
    assignedTo: 'Operations Team',
    lastService: '2026-09-12',
  },
];

const tickets = [
  {
    id: 101,
    assetId: 2,
    title: 'Printer keeps jamming during large jobs',
    description: 'The printer frequently stops mid-job and displays a paper jam error on the network queue.',
    requester: 'Meera K.',
    department: 'Administration',
    priority: 'High',
    status: 'Open',
    createdAt: '2026-10-12T09:20:00.000Z',
    updatedAt: '2026-10-12T09:20:00.000Z',
    assignedTo: 'Hardware Support',
  },
  {
    id: 102,
    assetId: 4,
    title: 'Monitor flickering in HR floor',
    description: 'The display flickers intermittently and occasionally goes black for a few seconds.',
    requester: 'Anand S.',
    department: 'HR',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: '2026-10-11T14:05:00.000Z',
    updatedAt: '2026-10-12T08:10:00.000Z',
    assignedTo: 'Display Team',
  },
  {
    id: 103,
    assetId: 1,
    title: 'Laptop battery drains too fast',
    description: 'Battery percentage drops from 80% to 30% in less than 2 hours during regular work.',
    requester: 'Priya D.',
    department: 'Finance',
    priority: 'Low',
    status: 'Resolved',
    createdAt: '2026-10-08T11:30:00.000Z',
    updatedAt: '2026-10-09T16:20:00.000Z',
    assignedTo: 'Laptop Support',
  },
];

app.get('/api/dashboard', (req, res) => {
  const openTickets = tickets.filter((ticket) => ticket.status !== 'Resolved').length;
  const resolvedToday = tickets.filter((ticket) => ticket.status === 'Resolved').length;
  const assetsInMaintenance = assets.filter((asset) => asset.status === 'Maintenance' || asset.status === 'Needs Service').length;
  const avgResponse = 2.4;

  res.json({
    totalAssets: assets.length,
    openTickets,
    resolvedToday,
    assetsInMaintenance,
    avgResponse,
  });
});

app.get('/api/assets', (req, res) => {
  res.json(assets);
});

app.get('/api/tickets', (req, res) => {
  const sorted = [...tickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sorted);
});

app.post('/api/tickets', (req, res) => {
  const { assetId, title, description, requester, department, priority } = req.body;

  if (!assetId || !title || !requester || !department || !priority) {
    return res.status(400).json({ message: 'Required ticket fields are missing.' });
  }

  const newTicket = {
    id: Date.now(),
    assetId: Number(assetId),
    title,
    description: description || 'No additional details provided.',
    requester,
    department,
    priority,
    status: 'Open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignedTo: 'IT Help Desk',
  };

  tickets.unshift(newTicket);
  res.status(201).json(newTicket);
});

app.put('/api/tickets/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const ticket = tickets.find((item) => item.id === Number(id));
  if (!ticket) {
    return res.status(404).json({ message: 'Ticket not found.' });
  }

  ticket.status = status;
  ticket.updatedAt = new Date().toISOString();

  res.json(ticket);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'IT ticketing API is running.' });
});

app.listen(PORT, () => {
  console.log(`IT ticketing API running on http://localhost:${PORT}`);
});
