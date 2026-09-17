export type RoleStatus = 'assigned' | 'unassigned' | 'not_needed';

export interface SpotAssignment {
  spotIndex: number;
  volunteerId?: string;
  volunteerName?: string;
}

export interface AssignedRole {
  status: RoleStatus;
  volunteerId?: string;
  volunteerName?: string;
}

export type ShiftStatus = 'confirmed' | 'needs_coverage' | 'in_progress' | 'completed' | 'scheduled';

export interface Shift {
  id: string;
  startTime: string;
  endTime: string;
  status: ShiftStatus;

  // Role coverage & schedule fields
  day: string;
  sessionName: string;
  timeSlot: string;
  area: string;
  neededCount: number;
  notes?: string;
  assignments: SpotAssignment[];

  // Compatibility fields
  location: string;
  title: string;
  category: string;
  details?: string;
  date: string;
  mc: AssignedRole;
  doorMonitor: AssignedRole;
  capacity?: number;
  headcountTarget?: number;
}

export interface Volunteer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarColor: string;
  rolesPreferred?: string[];
}

export interface OverlapConflict {
  volunteerId: string;
  volunteerName: string;
  shift1: Shift;
  shift2: Shift;
  overlapTime: string;
  overlapStart?: string;
  overlapEnd?: string;
  role1?: string;
  role2?: string;
}

export type TimeBlockFilter = 'all' | 'morning' | 'afternoon' | 'evening';
export type CoverageStatusFilter = 'all' | 'needs_coverage' | 'fully_staffed' | 'conflicts_only';

export interface FilterState {
  searchQuery: string;
  day: string;
  location: string;
  timeBlock: TimeBlockFilter;
  coverageStatus: CoverageStatusFilter;
  date?: string;
}

export interface EventScheduleFormData {
  eventName: string;
  venueName: string;
  venueAddress: string;
  coordinatorContact: string;
  notes: string;
  studentVolunteerPool: string;
  items: Array<{
    id: string;
    day: string;
    sessionName: string;
    timeSlot: string;
    area: string;
    neededCount: number;
    notes: string;
  }>;
}

export interface EventFormData {
  eventName: string;
  eventDate: string;
  venueName: string;
  templateType: 'custom' | 'church_service' | 'tech_conference' | 'charity_gala';
  rooms: string[];
  volunteerNamesRaw: string;
  generationMode: 'auto_time_blocks' | 'custom_sessions';
  autoSchedule: {
    startTime: string;
    endTime: string;
    intervalMinutes: number;
    requireMC: boolean;
    requireDoorMonitor: boolean;
    autoAssignStrategy: 'smart_balanced' | 'unassigned_open' | 'smart_with_demo_conflict';
  };
  customSessions: Array<{
    id: string;
    location: string;
    startTime: string;
    endTime: string;
    title: string;
    category: string;
    details: string;
    requireMC: boolean;
    requireDoorMonitor: boolean;
  }>;
}

export type ActiveView = 'master_room' | 'volunteer_timeline' | 'print_roster' | 'generator_form';
