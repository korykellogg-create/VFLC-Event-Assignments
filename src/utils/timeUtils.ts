import { Shift, OverlapConflict } from '../types';

/**
 * Convert HH:mm 24-hour string to minutes from midnight
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

/**
 * Convert minutes from midnight to HH:mm
 */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Format 24h HH:mm to 12h AM/PM string (e.g. 08:30 -> 8:30 AM, 13:00 -> 1:00 PM)
 */
export function formatTime12Hour(timeStr: string): string {
  if (!timeStr) return '';
  const [hoursStr, minutesStr] = timeStr.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr || '00';
  if (isNaN(hours)) return timeStr;

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  return `${hours}:${minutes} ${ampm}`;
}

/**
 * Format time range, e.g. "8:30 AM – 10:00 AM"
 */
export function formatTimeRange(start: string, end: string): string {
  if (!start || !end) return '';
  return `${formatTime12Hour(start)} – ${formatTime12Hour(end)}`;
}

/**
 * Calculate duration in hours, rounded to 1 decimal place
 */
export function calculateDurationHours(start: string, end: string): number {
  const startMin = timeToMinutes(start);
  const endMin = timeToMinutes(end);
  const diff = Math.max(0, endMin - startMin);
  return Math.round((diff / 60) * 10) / 10;
}

/**
 * Detect all overlapping / double-booked shifts for every volunteer
 */
export function detectVolunteerConflicts(shifts: Shift[]): OverlapConflict[] {
  const conflicts: OverlapConflict[] = [];

  // Extract all volunteer assignments: (volunteerId, shift, roleName)
  interface Assignment {
    volunteerId: string;
    volunteerName: string;
    shift: Shift;
    roleName: string;
  }

  const assignments: Assignment[] = [];

  for (const shift of shifts) {
    if (shift.mc.status === 'assigned' && shift.mc.volunteerId && shift.mc.volunteerName) {
      assignments.push({
        volunteerId: shift.mc.volunteerId,
        volunteerName: shift.mc.volunteerName,
        shift,
        roleName: 'MC',
      });
    }
    if (shift.doorMonitor.status === 'assigned' && shift.doorMonitor.volunteerId && shift.doorMonitor.volunteerName) {
      assignments.push({
        volunteerId: shift.doorMonitor.volunteerId,
        volunteerName: shift.doorMonitor.volunteerName,
        shift,
        roleName: 'Door Monitor / Staff',
      });
    }
  }

  // Compare every pair of assignments for the same volunteer on the same date
  for (let i = 0; i < assignments.length; i++) {
    for (let j = i + 1; j < assignments.length; j++) {
      const a1 = assignments[i];
      const a2 = assignments[j];

      if (a1.volunteerId === a2.volunteerId && a1.shift.id !== a2.shift.id) {
        if (a1.shift.date === a2.shift.date) {
          const startA = timeToMinutes(a1.shift.startTime);
          const endA = timeToMinutes(a1.shift.endTime);
          const startB = timeToMinutes(a2.shift.startTime);
          const endB = timeToMinutes(a2.shift.endTime);

          const maxStart = Math.max(startA, startB);
          const minEnd = Math.min(endA, endB);

          // Overlap condition: max(starts) < min(ends)
          if (maxStart < minEnd) {
            conflicts.push({
              volunteerId: a1.volunteerId,
              volunteerName: a1.volunteerName,
              shift1: a1.shift,
              shift2: a2.shift,
              role1: a1.roleName,
              role2: a2.roleName,
              overlapStart: minutesToTime(maxStart),
              overlapEnd: minutesToTime(minEnd),
              overlapTime: `${minutesToTime(maxStart)} - ${minutesToTime(minEnd)}`,
            });
          }
        }
      }
    }
  }

  return conflicts;
}

/**
 * Determine time block categorization
 */
export function getTimeBlock(startTime: string): 'morning' | 'afternoon' | 'evening' {
  const min = timeToMinutes(startTime);
  if (min < 720) return 'morning'; // before 12:00 PM
  if (min < 1020) return 'afternoon'; // 12:00 PM - 5:00 PM
  return 'evening'; // 5:00 PM onwards
}

/**
 * Formats a volunteer role string for export (e.g. "Sarah Jenkins" or "Not Needed" or "Unassigned")
 */
function formatRoleForExport(role: { status: string; volunteerName?: string }): string {
  if (role.status === 'assigned' && role.volunteerName) {
    return role.volunteerName;
  }
  if (role.status === 'not_needed') {
    return 'Not Needed';
  }
  return 'Unassigned';
}

/**
 * Generate standardized Markdown Table from shifts
 */
export function generateMarkdownRoster(shifts: Shift[], eventName = 'Event Shift & Volunteer Roster'): string {
  const dateStr = shifts.length > 0 ? shifts[0].date : '2026-09-18';
  
  // Sort shifts chronologically, then by location
  const sorted = [...shifts].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    const timeDiff = timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
    if (timeDiff !== 0) return timeDiff;
    return a.location.localeCompare(b.location);
  });

  const lines: string[] = [
    `# ${eventName}`,
    `**Date:** ${dateStr} | **Total Shifts:** ${sorted.length}`,
    '',
    '| Location | Time Slot | MC | Door Monitor / Staff | Category / Details | Status |',
    '| :--- | :--- | :--- | :--- | :--- | :--- |',
  ];

  for (const s of sorted) {
    const timeSlot = formatTimeRange(s.startTime, s.endTime);
    const mc = formatRoleForExport(s.mc);
    const door = formatRoleForExport(s.doorMonitor);
    const details = s.title + (s.details ? ` - ${s.details}` : '');
    const cleanDetails = details.replace(/\|/g, '-');
    const statusText = s.status === 'needs_coverage' ? '⚠️ Needs Coverage' : '✅ Confirmed';

    lines.push(`| ${s.location} | ${timeSlot} | ${mc} | ${door} | ${cleanDetails} | ${statusText} |`);
  }

  lines.push('');
  lines.push(`*Generated from Event Shift & Volunteer Roster Dashboard on ${new Date().toLocaleDateString()}*`);
  return lines.join('\n');
}

/**
 * Generate CSV text from shifts
 */
export function generateCSV(shifts: Shift[]): string {
  const headers = ['Location', 'Date', 'Start Time', 'End Time', 'Time Slot', 'MC', 'Door Monitor / Staff', 'Category', 'Title', 'Details', 'Status'];
  const rows = shifts.map(s => [
    `"${s.location.replace(/"/g, '""')}"`,
    `"${s.date}"`,
    `"${s.startTime}"`,
    `"${s.endTime}"`,
    `"${formatTimeRange(s.startTime, s.endTime)}"`,
    `"${formatRoleForExport(s.mc)}"`,
    `"${formatRoleForExport(s.doorMonitor)}"`,
    `"${s.category.replace(/"/g, '""')}"`,
    `"${s.title.replace(/"/g, '""')}"`,
    `"${(s.details || '').replace(/"/g, '""')}"`,
    `"${s.status}"`,
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
