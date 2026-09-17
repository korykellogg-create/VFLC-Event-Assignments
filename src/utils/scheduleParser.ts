import { EventScheduleFormData, Shift, Volunteer, OverlapConflict } from '../types';

export const EMPTY_SCHEDULE_FORM: EventScheduleFormData = {
  eventName: '',
  venueName: '',
  venueAddress: '',
  coordinatorContact: '',
  notes: '',
  studentVolunteerPool: '',
  items: [],
};

export const DEFAULT_VFLC_SCHEDULE: EventScheduleFormData = {
  eventName: '2026 Called Rally VFLC Schedule',
  venueName: 'Owasso First',
  venueAddress: '9341 N 129th E Ave, Owasso, OK, 74055',
  coordinatorContact: 'Feel free to give VFLC students my number while at the event! 405.538.8474',
  notes: 'VFLC Student Volunteer Roster & Area Coverage Sheet',
  studentVolunteerPool: `Sarah Jenkins
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
  items: [
    {
      id: 'item-1',
      day: 'Friday',
      sessionName: 'Evening Session',
      timeSlot: '6:30pm - 7:30pm',
      area: 'Doors & Welcome Greeting',
      neededCount: 3,
      notes: 'Open Doors – 6:30pm, Session Starts - 7:30pm',
    },
    {
      id: 'item-2',
      day: 'Saturday',
      sessionName: 'Morning Session',
      timeSlot: '8:30am - 9:30am',
      area: 'Green Room & Student Support',
      neededCount: 2,
      notes: 'VFLC Arrival - 8:30 (Restock green room, meet with Mikaela for additional needs)',
    },
    {
      id: 'item-3',
      day: 'Saturday',
      sessionName: 'Morning Session',
      timeSlot: '9:30am - 10:00am',
      area: 'Merch Tables',
      neededCount: 2,
      notes: 'Open Doors – 9:30am (Two students on merch tables)',
    },
    {
      id: 'item-4',
      day: 'Saturday',
      sessionName: 'Morning Session',
      timeSlot: '9:30am - 10:00am',
      area: 'Entrance Greeters',
      neededCount: 4,
      notes: 'The rest can be greeting at the entrance (Session Starts 10am)',
    },
    {
      id: 'item-5',
      day: 'Saturday',
      sessionName: 'Breakouts AM',
      timeSlot: '11:00am - 11:45am',
      area: 'Breakout Room Hosts',
      neededCount: 5,
      notes: 'Five students - breakout room hosts',
    },
    {
      id: 'item-6',
      day: 'Saturday',
      sessionName: 'Off-Site Lunch',
      timeSlot: '12:00pm - 12:50pm',
      area: 'Merch Tables (Post-Breakouts)',
      neededCount: 2,
      notes: 'Two students on merch tables after breakouts dismiss',
    },
    {
      id: 'item-7',
      day: 'Saturday',
      sessionName: 'Off-Site Lunch',
      timeSlot: '12:00pm - 12:50pm',
      area: 'Volunteer Lunch Setup',
      neededCount: 3,
      notes: 'Others helping set up volunteer lunches',
    },
    {
      id: 'item-8',
      day: 'Saturday',
      sessionName: 'Afternoon Session',
      timeSlot: '12:50pm - 1:00pm',
      area: 'Merch Tables',
      neededCount: 2,
      notes: 'Open Doors - 12:50pm (Two students on merch tables)',
    },
    {
      id: 'item-9',
      day: 'Saturday',
      sessionName: 'Afternoon Session',
      timeSlot: '12:50pm - 1:00pm',
      area: 'Entrance Greeters',
      neededCount: 3,
      notes: 'Session Starts - 1:00pm',
    },
    {
      id: 'item-10',
      day: 'Saturday',
      sessionName: 'Breakouts PM',
      timeSlot: '2:00pm - 2:45pm',
      area: 'Breakout Room Hosts',
      neededCount: 5,
      notes: 'Five students - breakout room hosts',
    },
    {
      id: 'item-11',
      day: 'Saturday',
      sessionName: 'Closing Session',
      timeSlot: '2:55pm - 3:30pm',
      area: 'Closing Session Doors & Ushers',
      neededCount: 3,
      notes: 'Open Doors - 2:55pm, Session Starts - 3:00pm',
    },
  ],
};

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

export function parseVolunteersList(rawText: string): Volunteer[] {
  const lines = rawText
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const uniqueNames = Array.from(new Set(lines));

  return uniqueNames.map((name, index) => ({
    id: `vol-${index + 1}`,
    name,
    email: `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@vfc.church`,
    phone: `(555) ${Math.floor(100 + Math.random() * 899)}-${Math.floor(1000 + Math.random() * 8999)}`,
    avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
  }));
}

/**
 * Standardize time strings like "6:30pm" or "11am - 11:45am" into HH:mm
 */
export function extractStartAndEndTime(timeStr: string): { start: string; end: string } {
  // Normalize
  const cleaned = timeStr.toLowerCase().replace(/–/g, '-');
  const parts = cleaned.split('-');

  const parseTimePart = (p: string, defaultHour: number): string => {
    const trimmed = p.trim();
    const isPM = trimmed.includes('pm') || trimmed.includes('p');
    const isAM = trimmed.includes('am') || trimmed.includes('a');
    const numPart = trimmed.replace(/[^\d:]/g, '');
    if (!numPart) {
      return `${defaultHour.toString().padStart(2, '0')}:00`;
    }

    let [hoursStr, minutesStr] = numPart.split(':');
    let h = parseInt(hoursStr, 10);
    const m = minutesStr ? parseInt(minutesStr, 10) : 0;

    if (isPM && h < 12) h += 12;
    if (isAM && h === 12) h = 0;

    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const start = parseTimePart(parts[0] || '09:00', 9);
  const end = parts[1] ? parseTimePart(parts[1], 10) : start;

  return { start, end };
}

/**
 * Generate full role shifts from EventScheduleFormData
 */
export function generateRosterFromScheduleForm(
  formData: EventScheduleFormData,
  existingAssignments?: Record<string, string[]> // preserve manual assignments if id matches
): {
  shifts: Shift[];
  volunteers: Volunteer[];
  areasList: string[];
} {
  const volunteers = parseVolunteersList(formData.studentVolunteerPool);
  const areasSet = new Set<string>();

  const shifts: Shift[] = formData.items.map((item, index) => {
    areasSet.add(item.area);
    const { start, end } = extractStartAndEndTime(item.timeSlot);

    // Initialize spot assignments for the needed count
    const existingForShift = existingAssignments?.[item.id] || [];
    const assignments = Array.from({ length: item.neededCount }).map((_, spotIdx) => {
      const assignedName = existingForShift[spotIdx];
      const matchedVol = assignedName
        ? volunteers.find((v) => v.name.toLowerCase() === assignedName.toLowerCase())
        : undefined;

      return {
        spotIndex: spotIdx + 1,
        volunteerId: matchedVol?.id,
        volunteerName: assignedName || undefined,
      };
    });

    const filledCount = assignments.filter((a) => Boolean(a.volunteerName)).length;
    const isFullyCovered = filledCount >= item.neededCount;

    return {
      id: item.id || `shift-${index + 1}`,
      day: item.day || 'Event Day',
      sessionName: item.sessionName || 'Session',
      timeSlot: item.timeSlot,
      startTime: start,
      endTime: end,
      area: item.area,
      neededCount: item.neededCount,
      notes: item.notes,
      assignments,
      status: isFullyCovered ? 'confirmed' : 'needs_coverage',

      // Backward compatibility aliases for table rendering
      location: item.area,
      title: `${item.sessionName} - ${item.area}`,
      category: item.sessionName,
      details: item.notes,
      date: item.day,
      mc: {
        status: assignments[0]?.volunteerName ? 'assigned' : 'unassigned',
        volunteerName: assignments[0]?.volunteerName,
        volunteerId: assignments[0]?.volunteerId,
      },
      doorMonitor: {
        status: assignments[1]?.volunteerName ? 'assigned' : 'unassigned',
        volunteerName: assignments[1]?.volunteerName,
        volunteerId: assignments[1]?.volunteerId,
      },
    };
  });

  return {
    shifts,
    volunteers,
    areasList: Array.from(areasSet),
  };
}

/**
 * Intelligent text parser for raw schedules (like the screenshot text)
 */
export function parseScheduleTextToFormData(text: string): Partial<EventScheduleFormData> {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const items: EventScheduleFormData['items'] = [];
  let currentDay = 'Friday';
  let currentSession = 'General Session';
  let eventTitle = '';
  let venue = '';
  let coordinatorPhone = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect title
    if (i === 0 && line.toLowerCase().includes('schedule')) {
      eventTitle = line;
      continue;
    }

    // Detect day
    if (line.toLowerCase() === 'friday') {
      currentDay = 'Friday';
      continue;
    }
    if (line.toLowerCase() === 'saturday') {
      currentDay = 'Saturday';
      continue;
    }
    if (line.toLowerCase() === 'sunday') {
      currentDay = 'Sunday';
      continue;
    }

    // Detect session headers
    if (line.toLowerCase().includes('session') && !line.includes(':')) {
      currentSession = line;
      continue;
    }

    // Detect phone/coordinator
    if (line.includes('405.') || line.toLowerCase().includes('number') || line.toLowerCase().includes('phone')) {
      coordinatorPhone = line;
      continue;
    }

    // Detect Location
    if (line.toLowerCase().startsWith('location:')) {
      venue = lines[i + 1] || 'Owasso First';
      continue;
    }

    // Detect schedule items with times
    if (line.includes('–') || line.includes('-') || line.includes(':') || line.toLowerCase().includes('open doors') || line.toLowerCase().includes('arrival') || line.toLowerCase().includes('breakouts') || line.toLowerCase().includes('lunch')) {
      // Try to parse headcount like "(Two students...", "(Five students...", "(Restock..."
      let neededCount = 2; // sensible default
      let area = 'General Team Area';
      let timeSlot = 'TBD';

      // Check for time
      const timeMatch = line.match(/\d{1,2}(?::\d{2})?\s*(?:am|pm)?\s*(?:-|–)?\s*(?:\d{1,2}(?::\d{2})?\s*(?:am|pm)?)?/i);
      if (timeMatch) {
        timeSlot = timeMatch[0];
      }

      // Check for area & count
      const lower = line.toLowerCase();
      if (lower.includes('merch')) {
        area = 'Merch Tables';
        neededCount = 2;
      } else if (lower.includes('breakout')) {
        area = 'Breakout Room Hosts';
        neededCount = 5;
      } else if (lower.includes('green room') || lower.includes('arrival')) {
        area = 'Green Room & Student Support';
        neededCount = 2;
      } else if (lower.includes('lunch')) {
        area = 'Volunteer Lunch Setup';
        neededCount = 3;
      } else if (lower.includes('greeting') || lower.includes('greeter') || lower.includes('doors')) {
        area = 'Entrance Greeters & Doors';
        neededCount = 3;
      }

      // Check numbers in parentheses
      if (lower.includes('two') || lower.includes('2 students')) neededCount = 2;
      if (lower.includes('five') || lower.includes('5 students')) neededCount = 5;
      if (lower.includes('three') || lower.includes('3 students')) neededCount = 3;
      if (lower.includes('four') || lower.includes('4 students')) neededCount = 4;

      items.push({
        id: `parsed-${Date.now()}-${items.length + 1}`,
        day: currentDay,
        sessionName: currentSession,
        timeSlot: timeSlot || 'Scheduled Time',
        area,
        neededCount,
        notes: line,
      });
    }
  }

  return {
    eventName: eventTitle || undefined,
    venueName: venue || undefined,
    coordinatorContact: coordinatorPhone || undefined,
    items: items.length > 0 ? items : undefined,
  };
}

/**
 * Detect overlaps where the same student is assigned to 2 areas during overlapping times
 */
export function detectStudentDoubleBookings(shifts: Shift[]): OverlapConflict[] {
  const conflicts: OverlapConflict[] = [];

  // Flatten assignments by volunteer
  interface AssignmentEntry {
    volunteerName: string;
    volunteerId: string;
    shift: Shift;
    startMin: number;
    endMin: number;
    day: string;
  }

  const entries: AssignmentEntry[] = [];

  shifts.forEach((shift) => {
    const { start, end } = extractStartAndEndTime(shift.timeSlot);
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    const startMin = sH * 60 + sM;
    const endMin = Math.max(startMin + 30, eH * 60 + eM);

    shift.assignments.forEach((assign) => {
      if (assign.volunteerName?.trim()) {
        entries.push({
          volunteerName: assign.volunteerName.trim(),
          volunteerId: assign.volunteerId || assign.volunteerName.toLowerCase().replace(/\s+/g, '-'),
          shift,
          startMin,
          endMin,
          day: shift.day,
        });
      }
    });
  });

  // Check pairs
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i];
      const b = entries[j];

      if (
        a.volunteerName.toLowerCase() === b.volunteerName.toLowerCase() &&
        a.day === b.day &&
        a.shift.id !== b.shift.id
      ) {
        // Check if times overlap
        const overlapStart = Math.max(a.startMin, b.startMin);
        const overlapEnd = Math.min(a.endMin, b.endMin);

        if (overlapStart < overlapEnd) {
          conflicts.push({
            volunteerId: a.volunteerId,
            volunteerName: a.volunteerName,
            shift1: a.shift,
            shift2: b.shift,
            overlapTime: `${a.day} ${a.shift.timeSlot} & ${b.shift.timeSlot}`,
          });
        }
      }
    }
  }

  return conflicts;
}
