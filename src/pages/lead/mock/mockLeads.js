export const mockLeads = [
  {
    id: '20',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Corporation',
    status: 'new',
    source: 'Website',
    notes: 'Interested in enterprise plan',
    createdAt: '2024-01-15',
    assignee: 'Sarah Johnson',
    score: 85,
    activities: [
      {
        id: 'a1',
        type: 'email',
        description: 'Sent welcome email',
        timestamp: '2024-01-15T10:30:00Z',
        user: 'Sarah Johnson'
      },
      {
        id: 'a2',
        type: 'call',
        description: 'Initial discovery call - 30 minutes',
        timestamp: '2024-01-16T14:00:00Z',
        user: 'Sarah Johnson'
      },
      {
        id: 'a3',
        type: 'note',
        description: 'Client showed strong interest in premium features',
        timestamp: '2024-01-16T14:35:00Z',
        user: 'Sarah Johnson'
      }
    ]
  },
  {
    id: '22',
    name: 'Jane Smith',
    email: 'jane.smith@techcorp.com',
    phone: '+1 (555) 234-5678',
    company: 'TechCorp Solutions',
    status: 'contacted',
    source: 'Referral',
    notes: 'Referred by existing client',
    createdAt: '2024-01-10',
    assignee: 'Michael Chen',
    score: 92,
    activities: [
      {
        id: 'a4',
        type: 'meeting',
        description: 'Product demo scheduled',
        timestamp: '2024-01-12T09:00:00Z',
        user: 'Michael Chen'
      },
      {
        id: 'a5',
        type: 'email',
        description: 'Sent product documentation',
        timestamp: '2024-01-13T11:20:00Z',
        user: 'Michael Chen'
      },
      {
        id: 'a6',
        type: 'call',
        description: 'Follow-up call - discussed pricing',
        timestamp: '2024-01-14T15:30:00Z',
        user: 'Michael Chen'
      }
    ]
  },
  {
    id: '23',
    name: 'Robert Johnson',
    email: 'robert.j@innovate.io',
    phone: '+1 (555) 345-6789',
    company: 'Innovate Inc',
    status: 'qualified',
    source: 'LinkedIn',
    notes: 'Budget approved, decision maker identified',
    createdAt: '2024-01-05',
    assignee: 'Sarah Johnson',
    score: 95,
    activities: [
      {
        id: 'a7',
        type: 'meeting',
        description: 'Needs assessment meeting',
        timestamp: '2024-01-06T10:00:00Z',
        user: 'Sarah Johnson'
      },
      {
        id: 'a8',
        type: 'email',
        description: 'Sent proposal',
        timestamp: '2024-01-08T13:45:00Z',
        user: 'Sarah Johnson'
      },
      {
        id: 'a9',
        type: 'call',
        description: 'Proposal review call',
        timestamp: '2024-01-10T16:00:00Z',
        user: 'Sarah Johnson'
      },
      {
        id: 'a10',
        type: 'note',
        description: 'Ready to move forward, waiting for contract review',
        timestamp: '2024-01-11T09:15:00Z',
        user: 'Sarah Johnson'
      }
    ]
  },
  {
    id: '24',
    name: 'Emily Davis',
    email: 'emily.davis@startup.com',
    phone: '+1 (555) 456-7890',
    company: 'Startup Ventures',
    status: 'new',
    source: 'Cold Call',
    notes: 'Initial contact made',
    createdAt: '2024-01-18',
    assignee: 'David Rodriguez',
    score: 65,
    activities: [
      {
        id: 'a11',
        type: 'call',
        description: 'Cold call - left voicemail',
        timestamp: '2024-01-18T11:00:00Z',
        user: 'David Rodriguez'
      },
      {
        id: 'a12',
        type: 'email',
        description: 'Follow-up email sent',
        timestamp: '2024-01-18T11:30:00Z',
        user: 'David Rodriguez'
      }
    ]
  },
  {
    id: '25',
    name: 'Michael Brown',
    email: 'mbrown@enterprise.com',
    phone: '+1 (555) 567-8901',
    company: 'Enterprise Global',
    status: 'contacted',
    source: 'Trade Show',
    notes: 'Met at industry conference',
    createdAt: '2024-01-12',
    assignee: 'Michael Chen',
    score: 78,
    activities: [
      {
        id: 'a13',
        type: 'meeting',
        description: 'Met at Tech Summit 2024',
        timestamp: '2024-01-12T14:00:00Z',
        user: 'Michael Chen'
      },
      {
        id: 'a14',
        type: 'email',
        description: 'Sent conference follow-up',
        timestamp: '2024-01-13T09:00:00Z',
        user: 'Michael Chen'
      },
      {
        id: 'a15',
        type: 'note',
        description: 'Interested in Q2 implementation',
        timestamp: '2024-01-14T10:30:00Z',
        user: 'Michael Chen'
      }
    ]
  },
  {
    id: '26',
    name: 'Sarah Wilson',
    email: 'sarah.w@digital.com',
    phone: '+1 (555) 678-9012',
    company: 'Digital Marketing Co',
    status: 'lost',
    source: 'Website',
    notes: 'Chose competitor solution',
    createdAt: '2024-01-08',
    assignee: 'David Rodriguez',
    score: 45,
    activities: [
      {
        id: 'a16',
        type: 'email',
        description: 'Initial outreach',
        timestamp: '2024-01-08T10:00:00Z',
        user: 'David Rodriguez'
      },
      {
        id: 'a17',
        type: 'call',
        description: 'Discovery call completed',
        timestamp: '2024-01-09T15:00:00Z',
        user: 'David Rodriguez'
      },
      {
        id: 'a18',
        type: 'note',
        description: 'Went with competitor due to pricing',
        timestamp: '2024-01-11T11:00:00Z',
        user: 'David Rodriguez'
      }
    ]
  }
];

export const salesRepresentatives = [
  { id: 'sr1', name: 'Sarah Johnson', email: 'sarah.j@company.com' },
  { id: 'sr2', name: 'Michael Chen', email: 'michael.c@company.com' },
  { id: 'sr3', name: 'David Rodriguez', email: 'david.r@company.com' },
  { id: 'sr4', name: 'Emma Williams', email: 'emma.w@company.com' }
];