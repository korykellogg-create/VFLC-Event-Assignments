import { Shift, Volunteer } from '../types';

export const INITIAL_LOCATIONS: string[] = [
  'Main Auditorium',
  'Workshop Hall A',
  'Workshop Hall B',
  'Expo Foyer',
  'VIP Lounge',
  'Registration Desk',
];

export const INITIAL_VOLUNTEERS: Volunteer[] = [
  {
    id: 'vol-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@eventvolunteers.org',
    phone: '(555) 234-5678',
    avatarColor: 'bg-blue-600',
    rolesPreferred: ['MC', 'Host', 'Stage Lead'],
  },
  {
    id: 'vol-2',
    name: 'Marcus Chen',
    email: 'marcus.chen@techsummit.io',
    phone: '(555) 345-6789',
    avatarColor: 'bg-emerald-600',
    rolesPreferred: ['Door Monitor', 'Access Control'],
  },
  {
    id: 'vol-3',
    name: 'Elena Rostova',
    email: 'elena.rostova@summitops.com',
    phone: '(555) 456-7890',
    avatarColor: 'bg-indigo-600',
    rolesPreferred: ['MC', 'Moderator'],
  },
  {
    id: 'vol-4',
    name: 'Devon Vance',
    email: 'devon.vance@soundstage.net',
    phone: '(555) 567-8901',
    avatarColor: 'bg-slate-700',
    rolesPreferred: ['Door Monitor', 'Student Lead'],
  },
  {
    id: 'vol-5',
    name: 'Amina Diallo',
    email: 'amina.diallo@futurebuilders.org',
    phone: '(555) 678-9012',
    avatarColor: 'bg-violet-600',
    rolesPreferred: ['Registration', 'MC'],
  },
  {
    id: 'vol-6',
    name: 'Liam O\'Connor',
    email: 'liam.oc@corkevents.com',
    phone: '(555) 789-0123',
    avatarColor: 'bg-teal-600',
    rolesPreferred: ['Door Monitor', 'Logistics'],
  },
  {
    id: 'vol-7',
    name: 'Priya Sharma',
    email: 'priya.s@summithelpers.com',
    phone: '(555) 890-1234',
    avatarColor: 'bg-sky-600',
    rolesPreferred: ['Door Monitor', 'Host'],
  },
  {
    id: 'vol-8',
    name: 'Jackson Reed',
    email: 'j.reed@audiolead.org',
    phone: '(555) 901-2345',
    avatarColor: 'bg-cyan-700',
    rolesPreferred: ['Door Monitor', 'VIP Host'],
  },
  {
    id: 'vol-9',
    name: 'Chloe Bennett',
    email: 'chloe.b@creativemind.io',
    phone: '(555) 012-3456',
    avatarColor: 'bg-rose-600',
    rolesPreferred: ['MC', 'Panel Facilitator'],
  },
  {
    id: 'vol-10',
    name: 'Mateo Morales',
    email: 'mateo.m@designcode.org',
    phone: '(555) 123-4567',
    avatarColor: 'bg-amber-600',
    rolesPreferred: ['Door Monitor', 'General Student Team'],
  }
];

const RAW_INITIAL_SHIFTS: any[] = [
  // Morning Block (08:00 - 10:00)
  {
    id: 'shift-1',
    date: '2026-09-18',
    location: 'Registration Desk',
    startTime: '07:30',
    endTime: '09:30',
    title: 'Attendee Check-in & Badge Distribution',
    category: 'Registration & Welcome',
    details: 'Verify QR codes, hand out conference lanyards, and manage fast-track queue.',
    mc: {
      status: 'not_needed',
    },
    doorMonitor: {
      status: 'assigned',
      volunteerId: 'vol-5',
      volunteerName: 'Amina Diallo',
    },
    status: 'confirmed',
    headcountTarget: 500,
  },
  {
    id: 'shift-2',
    date: '2026-09-18',
    location: 'Main Auditorium',
    startTime: '08:30',
    endTime: '10:00',
    title: 'Opening Keynote: The Frontier of Intelligent Systems',
    category: 'Keynote & Mainstage',
    details: 'Mic checks with keynote speaker, timekeeper cue cards, introduce opening speaker.',
    mc: {
      status: 'assigned',
      volunteerId: 'vol-1',
      volunteerName: 'Sarah Jenkins',
    },
    doorMonitor: {
      status: 'assigned',
      volunteerId: 'vol-2',
      volunteerName: 'Marcus Chen',
    },
    status: 'confirmed',
    capacity: 650,
  },
  {
    id: 'shift-3',
    date: '2026-09-18',
    location: 'VIP Lounge',
    startTime: '08:00',
    endTime: '10:30',
    title: 'Executive Breakfast & Speaker Green Room Access',
    category: 'VIP & Executive',
    details: 'Control credential check at door, guide speakers to AV tech check station.',
    mc: {
      status: 'not_needed',
    },
    doorMonitor: {
      status: 'assigned',
      volunteerId: 'vol-8',
      volunteerName: 'Jackson Reed',
    },
    status: 'confirmed',
    capacity: 40,
  },

  // Mid-Morning Block (10:30 - 12:00)
  {
    id: 'shift-4',
    date: '2026-09-18',
    location: 'Workshop Hall A',
    startTime: '10:30',
    endTime: '12:00',
    title: 'Deep Dive: Autonomous Agent Architecture & Tooling',
    category: 'Technical Workshop',
    details: 'Verify workshop preregistration seats, distribute lab USB drives, monitor door capacity.',
    mc: {
      status: 'assigned',
      volunteerId: 'vol-3',
      volunteerName: 'Elena Rostova',
    },
    doorMonitor: {
      status: 'assigned',
      volunteerId: 'vol-4',
      volunteerName: 'Devon Vance',
    },
    status: 'confirmed',
    capacity: 120,
  },
  {
    id: 'shift-5',
    date: '2026-09-18',
    location: 'Workshop Hall B',
    startTime: '10:30',
    endTime: '12:00',
    title: 'Product Design Systems: Micro-Interactions at Scale',
    category: 'Interactive Lab',
    details: 'Room has high expected walk-ins. Keep aisle clear and monitor door capacity.',
    mc: {
      status: 'assigned',
      volunteerId: 'vol-9',
      volunteerName: 'Chloe Bennett',
    },
    doorMonitor: {
      status: 'unassigned', // Open spot to demonstrate Unassigned badge
    },
    status: 'needs_coverage',
    capacity: 90,
  },
  {
    id: 'shift-6',
    date: '2026-09-18',
    location: 'Expo Foyer',
    startTime: '10:00',
    endTime: '12:30',
    title: 'Sponsor Showcase & Morning Coffee Networking',
    category: 'Expo & Networking',
    details: 'Direct traffic flow from Main Auditorium toward the coffee pavilions and booths.',
    mc: {
      status: 'not_needed',
    },
    doorMonitor: {
      status: 'assigned',
      volunteerId: 'vol-6',
      volunteerName: 'Liam O\'Connor',
    },
    status: 'confirmed',
  },

  // Afternoon Block 1 (13:00 - 15:00) - INCLUDES A CONFLICT FOR DEMO
  {
    id: 'shift-7',
    date: '2026-09-18',
    location: 'Main Auditorium',
    startTime: '13:00',
    endTime: '14:30',
    title: 'Plenary Panel: Scalable Cloud Architecture in 2027',
    category: 'Panel Discussion',
    details: 'Coordinate roving microphones during audience Q&A, run speaker introductions.',
    mc: {
      status: 'assigned',
      volunteerId: 'vol-1',
      volunteerName: 'Sarah Jenkins', // Sarah Jenkins is booked here (13:00 - 14:30)
    },
    doorMonitor: {
      status: 'assigned',
      volunteerId: 'vol-7',
      volunteerName: 'Priya Sharma',
    },
    status: 'confirmed',
    capacity: 650,
  },
  {
    id: 'shift-8',
    date: '2026-09-18',
    location: 'Workshop Hall A',
    startTime: '13:30',
    endTime: '15:00',
    title: 'Hands-on Lab: Real-time Multi-agent Orchestration',
    category: 'Technical Workshop',
    details: 'Manage seating for overflow attendees. Distribute credentials.',
    mc: {
      status: 'not_needed',
    },
    doorMonitor: {
      status: 'assigned',
      volunteerId: 'vol-1', // OVERLAP CONFLICT WITH SHIFT-7! Sarah Jenkins double-booked between 13:30 and 14:30!
      volunteerName: 'Sarah Jenkins',
    },
    status: 'needs_coverage',
    capacity: 100,
  },
  {
    id: 'shift-9',
    date: '2026-09-18',
    location: 'Workshop Hall B',
    startTime: '13:00',
    endTime: '14:30',
    title: 'Founders Round Table: Bootstrapping to Series B',
    category: 'Interactive Lab',
    details: 'Chatham House rules apply. Ensure recording devices are strictly powered down.',
    mc: {
      status: 'assigned',
      volunteerId: 'vol-3',
      volunteerName: 'Elena Rostova',
    },
    doorMonitor: {
      status: 'assigned',
      volunteerId: 'vol-10',
      volunteerName: 'Mateo Morales',
    },
    status: 'confirmed',
    capacity: 60,
  },

  // Afternoon Block 2 (15:00 - 17:00)
  {
    id: 'shift-10',
    date: '2026-09-18',
    location: 'Main Auditorium',
    startTime: '15:15',
    endTime: '16:45',
    title: 'Afternoon Fireside: Ethics & Security in Frontier AI',
    category: 'Keynote & Mainstage',
    details: 'Introduce special guest speakers, coordinate stage water and stage timers.',
    mc: {
      status: 'assigned',
      volunteerId: 'vol-9',
      volunteerName: 'Chloe Bennett',
    },
    doorMonitor: {
      status: 'assigned',
      volunteerId: 'vol-2',
      volunteerName: 'Marcus Chen',
    },
    status: 'confirmed',
    capacity: 650,
  },
  {
    id: 'shift-11',
    date: '2026-09-18',
    location: 'VIP Lounge',
    startTime: '15:00',
    endTime: '17:00',
    title: 'Investor & Speaker Afternoon High Tea',
    category: 'VIP & Executive',
    details: 'Ensure only badge-holders enter. Restock catering requests with hospitality lead.',
    mc: {
      status: 'not_needed',
    },
    doorMonitor: {
      status: 'unassigned', // Unassigned Door Monitor spot
    },
    status: 'needs_coverage',
    capacity: 50,
  },

  // Evening Block (17:30 - 20:30)
  {
    id: 'shift-12',
    date: '2026-09-18',
    location: 'Expo Foyer',
    startTime: '17:30',
    endTime: '20:00',
    title: 'Summit Closing Reception & Demo Showcase Awards',
    category: 'Closing & Awards',
    details: 'Stage presentation of community demo winners, toast announcement, crowd safety.',
    mc: {
      status: 'assigned',
      volunteerId: 'vol-5',
      volunteerName: 'Amina Diallo',
    },
    doorMonitor: {
      status: 'assigned',
      volunteerId: 'vol-6',
      volunteerName: 'Liam O\'Connor',
    },
    status: 'confirmed',
    capacity: 800,
  },
  {
    id: 'shift-13',
    date: '2026-09-18',
    location: 'Registration Desk',
    startTime: '17:00',
    endTime: '19:30',
    title: 'Swag Bag Distribution & Evening Information Desk',
    category: 'Registration & Welcome',
    details: 'Hand out speaker gifts and summit attendee commemorative hoodies.',
    mc: {
      status: 'not_needed',
    },
    doorMonitor: {
      status: 'assigned',
      volunteerId: 'vol-7',
      volunteerName: 'Priya Sharma',
    },
    status: 'confirmed',
  }
];

export const INITIAL_SHIFTS: Shift[] = RAW_INITIAL_SHIFTS.map((s) => ({
  ...s,
  day: 'Friday',
  sessionName: s.category || s.title,
  timeSlot: `${s.startTime} - ${s.endTime}`,
  area: s.location,
  neededCount: 2,
  notes: s.details,
  assignments: [
    { spotIndex: 1, volunteerName: s.mc?.volunteerName, volunteerId: s.mc?.volunteerId },
    { spotIndex: 2, volunteerName: s.doorMonitor?.volunteerName, volunteerId: s.doorMonitor?.volunteerId },
  ],
}));
