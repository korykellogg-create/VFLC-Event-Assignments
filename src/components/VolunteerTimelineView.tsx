import React, { useState } from 'react';
import { Shift, Volunteer, OverlapConflict } from '../types';
import {
  Clock,
  MapPin,
  AlertTriangle,
  Calendar,
  ChevronRight,
  UserCheck,
  Tag,
} from 'lucide-react';
import { getTimeBlockTheme } from '../utils/timeBlockColors';

interface VolunteerTimelineViewProps {
  volunteers: Volunteer[];
  shifts: Shift[];
  conflicts: OverlapConflict[];
  onEditShift: (shift: Shift) => void;
  selectedVolunteerId?: string | null;
}

export const VolunteerTimelineView: React.FC<VolunteerTimelineViewProps> = ({
  volunteers,
  shifts,
  conflicts,
  onEditShift,
  selectedVolunteerId,
}) => {
  const [filterConflictsOnly, setFilterConflictsOnly] = useState(false);
  const [activeVolunteerFilter, setActiveVolunteerFilter] = useState<string>(
    selectedVolunteerId || 'all'
  );

  // Collect all unique volunteers: both registered in pool and typed onto spots
  const allVolunteersMap = new Map<string, Volunteer>();

  volunteers.forEach((v) => allVolunteersMap.set(v.name.toLowerCase(), v));

  shifts.forEach((shift) => {
    shift.assignments.forEach((assign) => {
      if (assign.volunteerName?.trim()) {
        const lower = assign.volunteerName.trim().toLowerCase();
        if (!allVolunteersMap.has(lower)) {
          allVolunteersMap.set(lower, {
            id: assign.volunteerId || `vol-${lower.replace(/\s+/g, '-')}`,
            name: assign.volunteerName.trim(),
            avatarColor: 'bg-slate-700',
            email: `${lower.replace(/[^a-z0-9]/g, '.')}@vfc.church`,
          });
        }
      }
    });
  });

  const allVolunteersList = Array.from(allVolunteersMap.values());

  // Map each volunteer to their assigned shifts (chronologically sorted)
  const volunteerSchedules = allVolunteersList.map((vol) => {
    const assignedShifts = shifts.filter((shift) => {
      return shift.assignments.some(
        (a) =>
          (a.volunteerId && a.volunteerId === vol.id) ||
          (a.volunteerName && a.volunteerName.toLowerCase() === vol.name.toLowerCase())
      );
    });

    // Get conflicts specifically involving this volunteer
    const volConflicts = conflicts.filter(
      (c) => c.volunteerName.toLowerCase() === vol.name.toLowerCase()
    );

    return {
      volunteer: vol,
      shifts: assignedShifts,
      conflicts: volConflicts,
      totalSpots: assignedShifts.length,
    };
  });

  // Apply filters
  const filteredList = volunteerSchedules.filter((item) => {
    if (filterConflictsOnly && item.conflicts.length === 0) return false;
    if (activeVolunteerFilter !== 'all' && item.volunteer.name.toLowerCase() !== activeVolunteerFilter.toLowerCase())
      return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Timeline Controls & Quick Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">VFLC Student Schedules</h2>
            <p className="text-xs text-slate-500">
              Chronological day run-down for each student with automatic double-booking detection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Volunteer Selector */}
          <select
            id="select-timeline-volunteer"
            value={activeVolunteerFilter}
            onChange={(e) => setActiveVolunteerFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm sm:text-xs text-slate-700 focus:outline-hidden cursor-pointer font-medium min-h-[40px] w-full sm:w-auto"
          >
            <option value="all">All Students ({allVolunteersList.length})</option>
            {allVolunteersList.map((v) => (
              <option key={v.id} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>

          {/* Toggle Conflicts Only */}
          <button
            id="btn-toggle-timeline-conflicts"
            type="button"
            onClick={() => setFilterConflictsOnly((prev) => !prev)}
            className={`min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer w-full sm:w-auto justify-center ${
              filterConflictsOnly
                ? 'bg-rose-50 text-rose-800 border-rose-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Show Only Double Bookings</span>
            {conflicts.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-700 font-bold">
                {conflicts.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Overlap Summary Banner if any conflicts exist */}
      {conflicts.length > 0 && !filterConflictsOnly && (
        <div className="p-4 rounded-xl bg-rose-50/90 border border-rose-200 flex items-start gap-3 text-rose-950 text-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-rose-900 text-xs">
              Double-Booking Conflict Detected ({conflicts.length} active overlap{conflicts.length > 1 ? 's' : ''})
            </h3>
            <p className="text-rose-800/90 mt-0.5">
              One or more students are assigned to multiple areas during the same time window. Highlighted in red below.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFilterConflictsOnly(true)}
            className="px-2.5 py-1 rounded bg-rose-600 text-white font-semibold text-[11px] hover:bg-rose-700 transition-colors shrink-0 cursor-pointer"
          >
            Filter to Conflicts
          </button>
        </div>
      )}

      {/* Volunteer Grid/List */}
      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center my-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">No student assignments found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add students to your roster or assign them to spots on the Master Room Sheet to view their individual schedules here.
            </p>
          </div>
        ) : (
          filteredList.map(({ volunteer, shifts: volShifts, conflicts: volConflicts, totalSpots }) => {
          const hasConflict = volConflicts.length > 0;

          return (
            <div
              key={volunteer.id}
              id={`volunteer-card-${volunteer.id}`}
              className={`bg-white rounded-xl border transition-all ${
                hasConflict
                  ? 'border-rose-300 ring-1 ring-rose-200 shadow-xs'
                  : 'border-slate-200 shadow-2xs hover:border-slate-300'
              } p-5`}
            >
              {/* Student Header - Only their name, badge, and spot counts */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-2.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {volunteer.name}
                  </h3>
                  {hasConflict && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
                      <AlertTriangle className="w-3 h-3" />
                      Double Booked ({volConflicts.length})
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-700 font-medium">
                    <span className="font-bold text-slate-900">{totalSpots}</span> Area Shift{totalSpots === 1 ? '' : 's'}
                  </div>
                </div>
              </div>

              {/* Conflict Warnings Box if specific to this volunteer */}
              {hasConflict && (
                <div className="my-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-2">
                  <div className="font-semibold text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Time Overlap Warning for {volunteer.name}:</span>
                  </div>
                  {volConflicts.map((c, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/90 p-2.5 rounded border border-rose-200 gap-2"
                    >
                      <div className="text-rose-900 text-xs leading-relaxed">
                        Assigned to <span className="font-bold">"{c.shift1.area}"</span> ({c.shift1.timeSlot}) and{' '}
                        <span className="font-bold">"{c.shift2.area}"</span> ({c.shift2.timeSlot}) at the same time!
                      </div>
                      <button
                        type="button"
                        onClick={() => onEditShift(c.shift2)}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-semibold transition-colors cursor-pointer shrink-0"
                      >
                        Adjust Assignment
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Chronological Shifts Timeline Cards */}
              <div className="mt-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                  Assigned Stations & Schedule
                </h4>

                {volShifts.length === 0 ? (
                  <div className="p-6 text-center rounded-lg border border-dashed border-slate-200 text-xs text-slate-400">
                    Not assigned to any areas yet. Available for assignment.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {volShifts.map((shift) => {
                      // Find which spot(s)
                      const mySpots = shift.assignments
                        .filter(
                          (a) =>
                            a.volunteerName?.toLowerCase() === volunteer.name.toLowerCase() ||
                            a.volunteerId === volunteer.id
                        )
                        .map((a) => `Spot ${a.spotIndex}`)
                        .join(', ');

                      // Check if THIS shift has an overlap for this volunteer
                      const isOverlapping = volConflicts.some(
                        (c) => c.shift1.id === shift.id || c.shift2.id === shift.id
                      );

                      const theme = getTimeBlockTheme(shift.timeSlot, shift.day);

                      return (
                        <div
                          key={shift.id}
                          id={`timeline-shift-${shift.id}`}
                          onClick={() => onEditShift(shift)}
                          className={`p-3.5 rounded-lg border text-xs transition-all cursor-pointer relative group ${
                            isOverlapping
                              ? 'bg-rose-50/80 border-rose-300 text-rose-950 hover:bg-rose-100 ring-1 ring-rose-200 border-l-4 border-l-rose-600'
                              : `bg-white ${theme.borderLeftClass} border-slate-200 text-slate-800 hover:border-slate-300 hover:shadow-xs`
                          }`}
                        >
                          {/* Day & Time with highlighted time block theme */}
                          <div className="flex items-center justify-between mb-2 gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                              {shift.day} • {shift.sessionName}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${theme.badgeClass}`}>
                              {shift.timeSlot}
                            </span>
                          </div>

                          {/* Station Name */}
                          <h5 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
                            <MapPin className={`w-3.5 h-3.5 ${theme.textClass} shrink-0`} />
                            {shift.area}
                          </h5>

                          {/* Spot details */}
                          <div className="text-[11px] text-slate-500 font-medium mb-1">
                            Assigned as: <span className="font-semibold text-slate-800">{mySpots}</span> (out of {shift.neededCount} needed)
                          </div>

                          {/* Notes */}
                          {shift.notes && (
                            <p className="text-[11px] text-slate-600 bg-white/80 p-1.5 rounded border border-slate-200/80 italic mt-1.5">
                              "{shift.notes}"
                            </p>
                          )}

                          {/* Overlap indicator badge */}
                          {isOverlapping && (
                            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-200/60 px-2 py-0.5 rounded">
                              <AlertTriangle className="w-3 h-3 shrink-0" />
                              <span>Overlaps with another assigned area!</span>
                            </div>
                          )}

                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
      </div>
    </div>
  );
};
