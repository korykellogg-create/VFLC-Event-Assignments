import { Shift, Volunteer, EventFormData, AssignedRole } from '../types';
import { minutesToTime, timeToMinutes } from './timeUtils';

const AVATAR_COLORS = [
  'bg-blue-600',
  'bg-emerald-600',
  'bg-indigo-600',
  'bg-slate-700',
  'bg-violet-600',
  'bg-teal-600',
  'bg-sky-600',
  'bg-cyan-700',
  'bg-rose-600',
  'bg-amber-600',
];

export const PRESET_TEMPLATES: Record<string, EventFormData> = {
  church_service: {
    eventName: 'Sunday Morning Worship Services & Ministries',
    eventDate: '2026-09-20',
    venueName: 'Valley Family Church & Campus',
    templateType: 'church_service',
    rooms: [
      'Main Sanctuary',
      'Welcome Foyer & Connect Hub',
      'Kids Ministry Wing',
      'Hospitality & Coffee Cafe',
      'East & West Parking Grounds',
    ],
    volunteerNamesRaw: `Sarah Jenkins
Marcus Chen
Devon Vance
Elena Rostova
Amina Diallo
Liam O'Connor
Priya Sharma
Jackson Reed
Chloe Bennett
Mateo Morales
Hannah Miller
David Kim`,
    generationMode: 'custom_sessions',
    autoSchedule: {
      startTime: '08:00',
      endTime: '13:00',
      intervalMinutes: 90,
      requireMC: true,
      requireDoorMonitor: true,
      autoAssignStrategy: 'smart_balanced',
    },
    customSessions: [
      {
        id: 'cs-1',
        location: 'East & West Parking Grounds',
        startTime: '08:00',
        endTime: '09:30',
        title: 'Morning Arrival Parking & Traffic Direction',
        category: 'Parking & Safety',
        details: 'Direct arriving families, keep handicap drop-off clear, wave & greet attendees.',
        requireMC: false,
        requireDoorMonitor: true,
      },
      {
        id: 'cs-2',
        location: 'Welcome Foyer & Connect Hub',
        startTime: '08:15',
        endTime: '09:45',
        title: 'First Service Greeters & Welcome Desk',
        category: 'Hospitality & Greeters',
        details: 'Hand out service bulletins, guide first-time visitors, manage prayer cards.',
        requireMC: false,
        requireDoorMonitor: true,
      },
      {
        id: 'cs-3',
        location: 'Main Sanctuary',
        startTime: '08:45',
        endTime: '10:30',
        title: 'Service 1: Morning Worship & Community Announcements',
        category: 'Sanctuary Service',
        details: 'Stage host for announcements and offering, sanctuary doors open at 8:45 AM.',
        requireMC: true,
        requireDoorMonitor: true,
      },
      {
        id: 'cs-4',
        location: 'Kids Ministry Wing',
        startTime: '08:30',
        endTime: '10:30',
        title: 'Early Service Children Check-in & Classroom Staffing',
        category: 'Kids & Family',
        details: 'Verify parent security tags, supervise nursery and elementary activity rooms.',
        requireMC: false,
        requireDoorMonitor: true,
      },
      {
        id: 'cs-5',
        location: 'Hospitality & Coffee Cafe',
        startTime: '09:45',
        endTime: '11:15',
        title: 'Between-Service Fellowship & Coffee Service',
        category: 'Hospitality & Greeters',
        details: 'Refresh coffee stations, replenish communion elements, welcome connecting guests.',
        requireMC: false,
        requireDoorMonitor: true,
      },
      {
        id: 'cs-6',
        location: 'Main Sanctuary',
        startTime: '10:45',
        endTime: '12:30',
        title: 'Service 2: Mid-Day Worship & Celebration',
        category: 'Sanctuary Service',
        details: 'Service announcements, seating ushering for capacity crowd, door greeting.',
        requireMC: true,
        requireDoorMonitor: true,
      },
      {
        id: 'cs-7',
        location: 'Kids Ministry Wing',
        startTime: '10:30',
        endTime: '12:30',
        title: 'Late Service Children Check-in & Security',
        category: 'Kids & Family',
        details: 'Secure hallway doors, ensure authorized pickup tags, preschool crafts lead.',
        requireMC: false,
        requireDoorMonitor: true,
      },
      {
        id: 'cs-8',
        location: 'Welcome Foyer & Connect Hub',
        startTime: '11:00',
        endTime: '12:45',
        title: 'Second Service Greeters & New Visitor Info',
        category: 'Hospitality & Greeters',
        details: 'Welcome late arrivals, assist new families at the Connect Center.',
        requireMC: false,
        requireDoorMonitor: true,
      },
    ],
  },

  tech_conference: {
    eventName: 'TechNext Global Developer Summit 2026',
    eventDate: '2026-09-18',
    venueName: 'San Francisco Convention Center',
    templateType: 'tech_conference',
    rooms: [
      'Main Auditorium',
      'Workshop Hall A',
      'Workshop Hall B',
      'Expo Foyer',
      'VIP Lounge',
      'Registration Desk',
    ],
    volunteerNamesRaw: `Sarah Jenkins
Marcus Chen
Elena Rostova
Devon Vance
Amina Diallo
Liam O'Connor
Priya Sharma
Jackson Reed
Chloe Bennett
Mateo Morales`,
    generationMode: 'custom_sessions',
    autoSchedule: {
      startTime: '08:00',
      endTime: '18:00',
      intervalMinutes: 90,
      requireMC: true,
      requireDoorMonitor: true,
      autoAssignStrategy: 'smart_with_demo_conflict',
    },
    customSessions: [
      {
        id: 'tc-1',
        location: 'Registration Desk',
        startTime: '07:30',
        endTime: '09:30',
        title: 'Attendee Badge Distribution & Fast-Track Check-in',
        category: 'Registration & Welcome',
        details: 'Scan QR tickets, verify VIP badges, distribute speaker lanyards.',
        requireMC: false,
        requireDoorMonitor: true,
      },
      {
        id: 'tc-2',
        location: 'Main Auditorium',
        startTime: '08:30',
        endTime: '10:00',
        title: 'Opening Keynote: The Frontier of Intelligent Systems',
        category: 'Keynote & Mainstage',
        details: 'Stage emcee introduction, coordinate cue cards, monitor door capacity.',
        requireMC: true,
        requireDoorMonitor: true,
      },
      {
        id: 'tc-3',
        location: 'Workshop Hall A',
        startTime: '10:30',
        endTime: '12:00',
        title: 'Deep Dive: Autonomous Agent Architecture & Tooling',
        category: 'Technical Workshop',
        details: 'Verify workshop tickets, distribute hardware kits, manage room entry.',
        requireMC: true,
        requireDoorMonitor: true,
      },
      {
        id: 'tc-4',
        location: 'Workshop Hall B',
        startTime: '10:30',
        endTime: '12:00',
        title: 'Product Design Systems: Micro-Interactions at Scale',
        category: 'Interactive Lab',
        details: 'Ensure aisle clear for wheelchairs, assist speaker with lavalier mic check.',
        requireMC: true,
        requireDoorMonitor: true,
      },
      {
        id: 'tc-5',
        location: 'Expo Foyer',
        startTime: '10:00',
        endTime: '12:30',
        title: 'Sponsor Showcase & Morning Coffee Networking',
        category: 'Expo & Networking',
        details: 'Manage flow of crowds heading from keynote toward coffee pavilions.',
        requireMC: false,
        requireDoorMonitor: true,
      },
      {
        id: 'tc-6',
        location: 'Main Auditorium',
        startTime: '13:00',
        endTime: '14:30',
        title: 'Plenary Panel: Scalable Cloud Architecture in 2027',
        category: 'Panel Discussion',
        details: 'Coordinate roving mics for audience Q&A, introduce panel moderator.',
        requireMC: true,
        requireDoorMonitor: true,
      },
      {
        id: 'tc-7',
        location: 'Workshop Hall A',
        startTime: '13:30',
        endTime: '15:00',
        title: 'Hands-on Lab: Real-time Multi-agent Orchestration',
        category: 'Technical Workshop',
        details: 'Manage seating overflow. Coordinate with technical track lead.',
        requireMC: false,
        requireDoorMonitor: true,
      },
      {
        id: 'tc-8',
        location: 'VIP Lounge',
        startTime: '15:00',
        endTime: '17:00',
        title: 'Investor & Speaker Afternoon High Tea',
        category: 'VIP & Executive',
        details: 'Verify credentials at door, restock catering requests with hospitality lead.',
        requireMC: false,
        requireDoorMonitor: true,
      },
      {
        id: 'tc-9',
        location: 'Expo Foyer',
        startTime: '17:30',
        endTime: '20:00',
        title: 'Summit Closing Reception & Demo Showcase Awards',
        category: 'Closing & Awards',
        details: 'Stage presentation of hackathon winners, sponsor appreciation toast.',
        requireMC: true,
        requireDoorMonitor: true,
      },
    ],
  },

  charity_gala: {
    eventName: 'Annual Hope Foundation Charity Gala & Auction',
    eventDate: '2026-10-15',
    venueName: 'The Grand Metropolitan Ballroom',
    templateType: 'charity_gala',
    rooms: [
      'Grand Ballroom',
      'Silent Auction Gallery',
      'VIP Reception Suite',
      'Main Registration Foyer',
    ],
    volunteerNamesRaw: `Victoria Sterling
Arthur Brooks
Camila Mendez
Julian Hayes
Grace Washington
Owen Gallagher
Maya Patel
Liam Taylor`,
    generationMode: 'custom_sessions',
    autoSchedule: {
      startTime: '17:00',
      endTime: '22:00',
      intervalMinutes: 120,
      requireMC: true,
      requireDoorMonitor: true,
      autoAssignStrategy: 'smart_balanced',
    },
    customSessions: [
      {
        id: 'cg-1',
        location: 'Main Registration Foyer',
        startTime: '17:00',
        endTime: '18:30',
        title: 'Guest Check-in & Table Placement Cards',
        category: 'Guest Reception',
        details: 'Hand out program booklet, verify auction bidding paddles, coat check.',
        requireMC: false,
        requireDoorMonitor: true,
      },
      {
        id: 'cg-2',
        location: 'VIP Reception Suite',
        startTime: '17:30',
        endTime: '19:00',
        title: 'Major Donors Champagne Reception',
        category: 'VIP & Executive',
        details: 'Door monitor to check VIP invitations, assist photographer with step-and-repeat.',
        requireMC: false,
        requireDoorMonitor: true,
      },
      {
        id: 'cg-3',
        location: 'Silent Auction Gallery',
        startTime: '17:30',
        endTime: '20:30',
        title: 'Silent Auction Floor Monitor & Bid Assistance',
        category: 'Auction Operations',
        details: 'Answer item questions, monitor mobile bidding tablets, guard high-value lot items.',
        requireMC: false,
        requireDoorMonitor: true,
      },
      {
        id: 'cg-4',
        location: 'Grand Ballroom',
        startTime: '18:45',
        endTime: '21:30',
        title: 'Gala Dinner, Keynote & Live Charity Auction',
        category: 'Stage & Program',
        details: 'Stage MC announcements, introduce guest speakers, coordinate live auction spotters.',
        requireMC: true,
        requireDoorMonitor: true,
      },
      {
        id: 'cg-5',
        location: 'Main Registration Foyer',
        startTime: '21:00',
        endTime: '22:30',
        title: 'Auction Checkout & Gift Bag Distribution',
        category: 'Check-out & Logistics',
        details: 'Assist guests with item pickup receipts and donor commemorative gift boxes.',
        requireMC: false,
        requireDoorMonitor: true,
      },
    ],
  },
};

/**
 * Parse raw volunteer names string (separated by newlines or commas) into Volunteer objects
 */
export function parseVolunteersFromRawText(rawText: string): Volunteer[] {
  const lines = rawText
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // Deduplicate names
  const uniqueNames = Array.from(new Set(lines));

  return uniqueNames.map((name, index) => {
    const cleanId = `vol-${index + 1}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '.');
    const color = AVATAR_COLORS[index % AVATAR_COLORS.length];

    return {
      id: cleanId,
      name,
      email: `${slug}@eventteam.org`,
      phone: `(555) ${Math.floor(100 + Math.random() * 899)}-${Math.floor(1000 + Math.random() * 8999)}`,
      avatarColor: color,
      rolesPreferred: ['MC', 'Door Monitor', 'Staff'],
    };
  });
}

/**
 * Generate full roster shifts from EventFormData
 */
export function generateRosterFromFormData(formData: EventFormData): {
  shifts: Shift[];
  volunteers: Volunteer[];
  locations: string[];
} {
  const volunteers = parseVolunteersFromRawText(formData.volunteerNamesRaw);
  const locations = formData.rooms.length > 0 ? formData.rooms : ['Main Space'];
  const shifts: Shift[] = [];

  // Helper tracking volunteer busy times for smart scheduling
  interface VolScheduleTrack {
    id: string;
    name: string;
    busySlots: Array<{ start: number; end: number }>;
    assignmentCount: number;
  }

  const volTrackers: VolScheduleTrack[] = volunteers.map((v) => ({
    id: v.id,
    name: v.name,
    busySlots: [],
    assignmentCount: 0,
  }));

  const getAvailableVolunteer = (
    startMin: number,
    endMin: number,
    allowConflict = false,
    excludedVolunteerId?: string
  ): { id: string; name: string } | null => {
    if (volTrackers.length === 0) return null;

    if (allowConflict) {
      // Intentionally pick a volunteer who is already busy to demonstrate conflict detection
      const busyVol = volTrackers.find(
        (v) =>
          v.id !== excludedVolunteerId &&
          v.busySlots.some((s) => Math.max(s.start, startMin) < Math.min(s.end, endMin))
      );
      if (busyVol) {
        busyVol.busySlots.push({ start: startMin, end: endMin });
        busyVol.assignmentCount++;
        return { id: busyVol.id, name: busyVol.name };
      }
    }

    // Filter available volunteers who don't overlap with this time window
    const available = volTrackers.filter((v) => {
      if (excludedVolunteerId && v.id === excludedVolunteerId) return false;
      const overlaps = v.busySlots.some(
        (slot) => Math.max(slot.start, startMin) < Math.min(slot.end, endMin)
      );
      return !overlaps;
    });

    if (available.length > 0) {
      // Pick the one with the fewest assignments for balanced distribution
      available.sort((a, b) => a.assignmentCount - b.assignmentCount);
      const chosen = available[0];
      chosen.busySlots.push({ start: startMin, end: endMin });
      chosen.assignmentCount++;
      return { id: chosen.id, name: chosen.name };
    }

    // Fallback: If no conflict-free volunteer available, pick least loaded
    const fallback = [...volTrackers]
      .filter((v) => v.id !== excludedVolunteerId)
      .sort((a, b) => a.assignmentCount - b.assignmentCount)[0];

    if (fallback) {
      fallback.busySlots.push({ start: startMin, end: endMin });
      fallback.assignmentCount++;
      return { id: fallback.id, name: fallback.name };
    }

    return null;
  };

  const strategy = formData.autoSchedule.autoAssignStrategy;

  if (formData.generationMode === 'custom_sessions' && formData.customSessions.length > 0) {
    // Generate from custom sessions list
    formData.customSessions.forEach((cs, idx) => {
      const startMin = timeToMinutes(cs.startTime);
      const endMin = timeToMinutes(cs.endTime);

      let mcRole: AssignedRole = { status: 'not_needed' };
      let doorRole: AssignedRole = { status: 'not_needed' };

      if (strategy === 'unassigned_open') {
        if (cs.requireMC) mcRole = { status: 'unassigned' };
        if (cs.requireDoorMonitor) doorRole = { status: 'unassigned' };
      } else {
        // Smart assignment
        let mcVol: { id: string; name: string } | null = null;
        if (cs.requireMC) {
          mcVol = getAvailableVolunteer(startMin, endMin);
          if (mcVol) {
            mcRole = {
              status: 'assigned',
              volunteerId: mcVol.id,
              volunteerName: mcVol.name,
            };
          } else {
            mcRole = { status: 'unassigned' };
          }
        }

        if (cs.requireDoorMonitor) {
          // If demo conflict mode, make session #7 overlap intentionally if requested
          const triggerConflict = strategy === 'smart_with_demo_conflict' && idx === 6;
          const doorVol = getAvailableVolunteer(startMin, endMin, triggerConflict, mcVol?.id);
          if (doorVol) {
            doorRole = {
              status: 'assigned',
              volunteerId: doorVol.id,
              volunteerName: doorVol.name,
            };
          } else {
            doorRole = { status: 'unassigned' };
          }
        }
      }

      const needsCoverage = mcRole.status === 'unassigned' || doorRole.status === 'unassigned';

      shifts.push({
        id: `shift-${idx + 1}`,
        day: 'Friday',
        sessionName: cs.title,
        timeSlot: `${cs.startTime} - ${cs.endTime}`,
        area: cs.location,
        neededCount: 2,
        notes: cs.details,
        assignments: [
          { spotIndex: 1, volunteerName: mcRole.volunteerName, volunteerId: mcRole.volunteerId },
          { spotIndex: 2, volunteerName: doorRole.volunteerName, volunteerId: doorRole.volunteerId },
        ],
        date: formData.eventDate,
        location: cs.location,
        startTime: cs.startTime,
        endTime: cs.endTime,
        title: cs.title,
        category: cs.category || 'General Operations',
        details: cs.details,
        mc: mcRole,
        doorMonitor: doorRole,
        status: needsCoverage ? 'needs_coverage' : 'confirmed',
      });
    });
  } else {
    // Auto Time Blocks Mode: generate interval shifts for all rooms
    const startMin = timeToMinutes(formData.autoSchedule.startTime);
    const endMin = timeToMinutes(formData.autoSchedule.endTime);
    const interval = formData.autoSchedule.intervalMinutes || 90;

    let shiftCounter = 1;

    for (let cur = startMin; cur < endMin; cur += interval) {
      const slotStart = cur;
      const slotEnd = Math.min(cur + interval, endMin);
      const startStr = minutesToTime(slotStart);
      const endStr = minutesToTime(slotEnd);

      for (const loc of locations) {
        let mcRole: AssignedRole = { status: 'not_needed' };
        let doorRole: AssignedRole = { status: 'not_needed' };

        const requireMC = formData.autoSchedule.requireMC && !loc.toLowerCase().includes('parking');
        const requireDoor = formData.autoSchedule.requireDoorMonitor;

        if (strategy === 'unassigned_open') {
          if (requireMC) mcRole = { status: 'unassigned' };
          if (requireDoor) doorRole = { status: 'unassigned' };
        } else {
          let mcVol: { id: string; name: string } | null = null;
          if (requireMC) {
            mcVol = getAvailableVolunteer(slotStart, slotEnd);
            if (mcVol) {
              mcRole = {
                status: 'assigned',
                volunteerId: mcVol.id,
                volunteerName: mcVol.name,
              };
            } else {
              mcRole = { status: 'unassigned' };
            }
          }

          if (requireDoor) {
            const triggerConflict = strategy === 'smart_with_demo_conflict' && shiftCounter === 4;
            const doorVol = getAvailableVolunteer(slotStart, slotEnd, triggerConflict, mcVol?.id);
            if (doorVol) {
              doorRole = {
                status: 'assigned',
                volunteerId: doorVol.id,
                volunteerName: doorVol.name,
              };
            } else {
              doorRole = { status: 'unassigned' };
            }
          }
        }

        const needsCoverage = mcRole.status === 'unassigned' || doorRole.status === 'unassigned';

        shifts.push({
          id: `shift-auto-${shiftCounter++}`,
          day: 'Friday',
          sessionName: `${loc} Session`,
          timeSlot: `${startStr} - ${endStr}`,
          area: loc,
          neededCount: 2,
          notes: `Room host and access management for ${loc}.`,
          assignments: [
            { spotIndex: 1, volunteerName: mcRole.volunteerName, volunteerId: mcRole.volunteerId },
            { spotIndex: 2, volunteerName: doorRole.volunteerName, volunteerId: doorRole.volunteerId },
          ],
          date: formData.eventDate,
          location: loc,
          startTime: startStr,
          endTime: endStr,
          title: `${loc} Coverage Shift`,
          category: 'Event Operations',
          details: `Room host and access management for ${loc}.`,
          mc: mcRole,
          doorMonitor: doorRole,
          status: needsCoverage ? 'needs_coverage' : 'confirmed',
        });
      }
    }
  }

  return { shifts, volunteers, locations };
}
