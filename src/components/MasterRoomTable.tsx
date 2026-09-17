import React, { useState, useMemo } from 'react';
import { Shift, OverlapConflict, Volunteer } from '../types';
import {
  MapPin,
  Clock,
  Users,
  Tag,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Copy,
  Trash2,
  Plus,
  UserPlus,
  X,
  Calendar,
  Sparkles,
  LayoutGrid,
  Table as TableIcon,
} from 'lucide-react';
import { getTimeBlockTheme } from '../utils/timeBlockColors';

interface MasterRoomTableProps {
  shifts: Shift[];
  conflicts: OverlapConflict[];
  volunteers: Volunteer[];
  onEditShift: (shift: Shift) => void;
  onDuplicateShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string) => void;
  onAssignSpot: (shiftId: string, spotIndex: number, volunteerName?: string, volunteerId?: string) => void;
  onSelectVolunteer: (volunteerId: string) => void;
}

export const MasterRoomTable: React.FC<MasterRoomTableProps> = ({
  shifts,
  conflicts,
  volunteers,
  onEditShift,
  onDuplicateShift,
  onDeleteShift,
  onAssignSpot,
  onSelectVolunteer,
}) => {
  // Popover state for quick assigning a spot
  const [activeAssignPopover, setActiveAssignPopover] = useState<{
    shiftId: string;
    spotIndex: number;
    currentName?: string;
  } | null>(null);

  const [customTypedName, setCustomTypedName] = useState('');

  // Mobile/Tablet display mode: 'auto' (cards on mobile, table on desktop), 'cards', or 'table'
  const [viewMode, setViewMode] = useState<'auto' | 'cards' | 'table'>('auto');

  // Track conflicting volunteer names
  const conflictingNames = new Set(conflicts.map((c) => c.volunteerName.toLowerCase()));

  // Unique time blocks with counts and day info for effortless scanning
  const uniqueTimeBlocks = useMemo(() => {
    const map = new Map<string, { day: string; timeSlot: string; count: number }>();
    for (const shift of shifts) {
      const key = `${shift.day}_${shift.timeSlot}`;
      if (!map.has(key)) {
        map.set(key, { day: shift.day, timeSlot: shift.timeSlot, count: 0 });
      }
      map.get(key)!.count += 1;
    }
    return Array.from(map.values());
  }, [shifts]);

  const handleOpenAssign = (shiftId: string, spotIndex: number, currentName?: string) => {
    setActiveAssignPopover({ shiftId, spotIndex, currentName });
    setCustomTypedName(currentName || '');
  };

  const handleSelectVolunteerFromList = (vol: Volunteer) => {
    if (!activeAssignPopover) return;
    onAssignSpot(activeAssignPopover.shiftId, activeAssignPopover.spotIndex, vol.name, vol.id);
    setActiveAssignPopover(null);
  };

  const handleSaveCustomName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignPopover) return;
    const trimmed = customTypedName.trim();
    if (trimmed) {
      const matched = volunteers.find((v) => v.name.toLowerCase() === trimmed.toLowerCase());
      onAssignSpot(activeAssignPopover.shiftId, activeAssignPopover.spotIndex, trimmed, matched?.id);
    } else {
      onAssignSpot(activeAssignPopover.shiftId, activeAssignPopover.spotIndex, undefined, undefined);
    }
    setActiveAssignPopover(null);
  };

  const handleClearSpot = (shiftId: string, spotIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onAssignSpot(shiftId, spotIndex, undefined, undefined);
  };

  if (shifts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center my-6">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
          <Users className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 mb-1">No matching schedule areas found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Adjust your filters or switch to the Generator Form to add more areas and roles.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      {/* Header & Controls Bar with Time Blocks and View Mode Toggle */}
      <div className="px-4 py-2.5 bg-slate-50/90 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        {/* Time Blocks Scannability Strip */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1 sm:pb-0 scrollbar-none">
          {uniqueTimeBlocks.length > 0 && (
            <>
              <div className="flex items-center gap-1.5 text-slate-500 font-semibold uppercase tracking-wider text-[10.5px] shrink-0 pr-2 border-r border-slate-200">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Time Blocks:</span>
              </div>
              <div className="flex items-center gap-2 flex-nowrap">
                {uniqueTimeBlocks.map((tb) => {
                  const theme = getTimeBlockTheme(tb.timeSlot, tb.day);
                  return (
                    <div
                      key={`${tb.day}-${tb.timeSlot}`}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border shadow-2xs shrink-0 ${theme.badgeClass}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${theme.dotClass}`} />
                      <span className="font-bold">{tb.day}</span>
                      <span>{tb.timeSlot}</span>
                      <span className="opacity-80 text-[10px] font-semibold bg-white/70 px-1 py-0.2 rounded border border-black/5">
                        {tb.count} area{tb.count === 1 ? '' : 's'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* View Mode Switcher (Cards for Phones/Tablets, Table for Spreadsheet) */}
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
          <span className="text-[11px] text-slate-500 font-medium sm:hidden">Display:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
            <button
              id="btn-viewmode-cards"
              type="button"
              onClick={() => setViewMode('cards')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer min-h-[32px] sm:min-h-0 ${
                viewMode === 'cards' || (viewMode === 'auto')
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Mobile Card Layout (ideal for phones and tablets)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              id="btn-viewmode-table"
              type="button"
              onClick={() => setViewMode('table')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer min-h-[32px] sm:min-h-0 ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Full Master Room Table"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE / TABLET CARDS VIEW (Shown on small screens or when Cards is selected) */}
      <div
        className={`p-3.5 sm:p-4 space-y-3 bg-slate-50/50 ${
          viewMode === 'cards' ? 'block' : viewMode === 'table' ? 'hidden' : 'block md:hidden'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {shifts.map((shift) => {
            const filledCount = shift.assignments.filter((a) => Boolean(a.volunteerName)).length;
            const isFullyFilled = filledCount >= shift.neededCount;
            const isPartiallyFilled = filledCount > 0 && !isFullyFilled;
            const shiftHasConflict = shift.assignments.some(
              (a) => a.volunteerName && conflictingNames.has(a.volunteerName.toLowerCase())
            );
            const theme = getTimeBlockTheme(shift.timeSlot, shift.day);

            return (
              <div
                key={`card-shift-${shift.id}`}
                id={`card-shift-${shift.id}`}
                className={`bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 space-y-3 relative transition-all hover:border-slate-300 ${
                  theme.borderLeftClass
                } ${shiftHasConflict ? 'bg-rose-50/20 ring-1 ring-rose-300' : ''}`}
              >
                {/* Header line: Time & Session & Status */}
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-slate-900 text-xs">{shift.day}</span>
                    <span className={`font-mono text-[11px] font-semibold border px-2 py-0.5 rounded-md shadow-2xs ${theme.badgeClass}`}>
                      {shift.timeSlot}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200/60">
                      {shift.sessionName}
                    </span>
                  </div>

                  {/* Coverage Status Badge */}
                  <div>
                    {isFullyFilled ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Full ({filledCount}/{shift.neededCount})
                      </span>
                    ) : isPartiallyFilled ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Needs {shift.neededCount - filledCount} ({filledCount}/{shift.neededCount})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        Open (0/{shift.neededCount})
                      </span>
                    )}
                  </div>
                </div>

                {/* Area & Spots Needed Title */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${theme.dotClass} shrink-0`} />
                    <h3 className="font-bold text-slate-900 text-sm">{shift.area}</h3>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 shrink-0">
                    {shift.neededCount} {shift.neededCount === 1 ? 'Spot' : 'Spots'} Needed
                  </span>
                </div>

                {/* Notes if available */}
                {shift.notes && (
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 text-xs text-slate-600 leading-relaxed">
                    <span className="font-semibold text-slate-700">Notes: </span>
                    {shift.notes}
                  </div>
                )}

                {/* Interactive Student Spot Assignments */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Student Assignments</span>
                    <span className="text-slate-400 font-normal lowercase">tap to assign / edit</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {shift.assignments.map((spot, idx) => {
                      const isAssigned = Boolean(spot.volunteerName);
                      const hasConflict =
                        isAssigned && conflictingNames.has(spot.volunteerName!.toLowerCase());

                      return (
                        <div key={`card-${shift.id}-spot-${spot.spotIndex || idx}`}>
                          {isAssigned ? (
                            <div
                              onClick={() =>
                                handleOpenAssign(shift.id, spot.spotIndex, spot.volunteerName)
                              }
                              className={`w-full min-h-[44px] flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
                                hasConflict
                                  ? 'bg-rose-50 text-rose-800 border-rose-300 ring-1 ring-rose-400'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {hasConflict ? (
                                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                                ) : (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                )}
                                <div className="truncate">
                                  <span className="text-[10px] text-slate-500 font-normal block font-mono">
                                    Spot {spot.spotIndex}
                                  </span>
                                  <span className="font-bold truncate">{spot.volunteerName}</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => handleClearSpot(shift.id, spot.spotIndex, e)}
                                className="min-h-[38px] min-w-[38px] flex items-center justify-center text-slate-400 hover:text-rose-700 rounded-md transition-colors shrink-0 ml-1"
                                title="Unassign this spot"
                                aria-label="Unassign this spot"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenAssign(shift.id, spot.spotIndex)}
                              className="w-full min-h-[44px] flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-dashed border-slate-300 transition-colors cursor-pointer text-center"
                            >
                              <UserPlus className="w-4 h-4 text-slate-400" />
                              <span>Assign Spot {spot.spotIndex} (Open)</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Card Action Row */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEditShift(shift)}
                    className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDuplicateShift(shift)}
                    className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Duplicate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteShift(shift.id)}
                    className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                    aria-label="Delete area"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="sm:hidden">Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FULL SPREADSHEET TABLE VIEW (Desktop default or when Table is selected) */}
      <div
        className={`overflow-x-auto ${
          viewMode === 'table' ? 'block' : viewMode === 'cards' ? 'hidden' : 'hidden md:block'
        }`}
      >
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-600 font-semibold uppercase tracking-wider text-[10.5px]">
              <th scope="col" className="py-3 px-4 min-w-[130px]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Day & Time</span>
                </div>
              </th>

              <th scope="col" className="py-3 px-4 min-w-[150px]">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <span>Session Block</span>
                </div>
              </th>

              <th scope="col" className="py-3 px-4 min-w-[160px]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Area / Station</span>
                </div>
              </th>

              <th scope="col" className="py-3 px-4 min-w-[90px] text-center">
                <span>Needed</span>
              </th>

              <th scope="col" className="py-3 px-4 min-w-[300px]">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Student Role Slots (Click to Assign)</span>
                </div>
              </th>

              <th scope="col" className="py-3 px-4 min-w-[240px]">
                <span>Schedule Notes & Instructions</span>
              </th>

              <th scope="col" className="py-3 px-4 min-w-[110px]">
                <span>Coverage</span>
              </th>

              <th scope="col" className="py-3 px-3 text-right min-w-[80px] print:hidden">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700">
            {shifts.map((shift) => {
              const filledCount = shift.assignments.filter((a) => Boolean(a.volunteerName)).length;
              const isFullyFilled = filledCount >= shift.neededCount;
              const isPartiallyFilled = filledCount > 0 && filledCount < shift.neededCount;
              const isUnfilled = filledCount === 0;

              // Check if any volunteer in this shift has an overlap conflict
              const shiftHasConflict = shift.assignments.some(
                (a) => a.volunteerName && conflictingNames.has(a.volunteerName.toLowerCase())
              );

              const theme = getTimeBlockTheme(shift.timeSlot, shift.day);

              return (
                <tr
                  key={shift.id}
                  id={`row-shift-${shift.id}`}
                  className={`hover:bg-slate-50/80 transition-colors group ${theme.borderLeftClass} ${
                    shiftHasConflict ? 'bg-rose-50/20' : ''
                  }`}
                >
                  {/* Day & Time Slot */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="font-bold text-slate-900 text-xs">
                        {shift.day}
                      </span>
                      <span className={`font-mono text-[11px] font-semibold border px-2 py-0.5 rounded-md shadow-2xs ${theme.badgeClass}`}>
                        {shift.timeSlot}
                      </span>
                    </div>
                  </td>

                  {/* Session Block */}
                  <td className="py-3.5 px-4 align-top">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-medium text-xs border border-slate-200/60">
                      {shift.sessionName}
                    </span>
                  </td>

                  {/* Area / Station */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${theme.dotClass} shrink-0`} />
                      <span className="font-bold text-slate-900 text-xs">
                        {shift.area}
                      </span>
                    </div>
                  </td>

                  {/* Spots Needed */}
                  <td className="py-3.5 px-4 align-top text-center">
                    <span className="inline-flex items-center justify-center font-bold text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                      {shift.neededCount}
                    </span>
                  </td>

                  {/* Student Role Slots (Interactive Badges) */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {shift.assignments.map((spot, idx) => {
                        const isAssigned = Boolean(spot.volunteerName);
                        const hasConflict =
                          isAssigned && conflictingNames.has(spot.volunteerName!.toLowerCase());

                        return (
                          <div key={`${shift.id}-spot-${spot.spotIndex || idx}`}>
                            {isAssigned ? (
                              <div
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
                                  hasConflict
                                    ? 'bg-rose-50 text-rose-800 border-rose-300 ring-1 ring-rose-400'
                                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                }`}
                                onClick={() =>
                                  handleOpenAssign(shift.id, spot.spotIndex, spot.volunteerName)
                                }
                                title={
                                  hasConflict
                                    ? `Double-booking conflict! ${spot.volunteerName} is assigned to another area at this time.`
                                    : `Spot ${spot.spotIndex}: ${spot.volunteerName}. Click to change.`
                                }
                              >
                                {hasConflict ? (
                                  <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                                ) : (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                )}
                                <span>{spot.volunteerName}</span>
                                <button
                                  type="button"
                                  onClick={(e) => handleClearSpot(shift.id, spot.spotIndex, e)}
                                  className="hover:text-rose-700 p-0.5 rounded-full"
                                  title="Unassign this spot"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenAssign(shift.id, spot.spotIndex)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-dashed border-slate-300 transition-colors cursor-pointer"
                                title={`Spot ${spot.spotIndex} is unassigned. Click to assign student.`}
                              >
                                <UserPlus className="w-3 h-3 text-slate-400" />
                                <span>Spot {spot.spotIndex} (Open)</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </td>

                  {/* Schedule Notes / Instructions */}
                  <td className="py-3.5 px-4 align-top">
                    {shift.notes ? (
                      <p className="text-xs text-slate-600 font-normal leading-relaxed">
                        {shift.notes}
                      </p>
                    ) : (
                      <span className="text-slate-400 text-xs italic">—</span>
                    )}
                  </td>

                  {/* Coverage Status */}
                  <td className="py-3.5 px-4 align-top">
                    {isFullyFilled ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Full ({filledCount}/{shift.neededCount})
                      </span>
                    ) : isPartiallyFilled ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Needs {shift.neededCount - filledCount} ({filledCount}/{shift.neededCount})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        Open (0/{shift.neededCount})
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-3 align-top text-right print:hidden">
                    <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => onEditShift(shift)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Edit Area Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDuplicateShift(shift)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Duplicate Area Need"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteShift(shift.id)}
                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100 transition-colors"
                        title="Delete Area"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Quick Assign Dropdown / Popover Modal */}
      {activeAssignPopover && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveAssignPopover(null)}
        >
          <div
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-4 sm:p-5 space-y-3.5 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-600" />
                Assign Spot #{activeAssignPopover.spotIndex}
              </span>
              <button
                type="button"
                onClick={() => setActiveAssignPopover(null)}
                className="min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg p-1 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Type custom name */}
            <form onSubmit={handleSaveCustomName} className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Type Student Name:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  autoFocus
                  value={customTypedName}
                  onChange={(e) => setCustomTypedName(e.target.value)}
                  placeholder="e.g. Rachel Adams"
                  className="flex-1 px-3 py-2 text-sm sm:text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[42px]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold min-h-[42px] cursor-pointer shadow-xs"
                >
                  Save
                </button>
              </div>
            </form>

            {/* Pick from volunteer pool if available */}
            {volunteers.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Or select from VFLC Student Pool ({volunteers.length}):
                </span>
                <div className="max-h-52 overflow-y-auto space-y-1.5 pr-0.5">
                  {volunteers.map((vol) => (
                    <button
                      key={vol.id}
                      type="button"
                      onClick={() => handleSelectVolunteerFromList(vol)}
                      className="w-full text-left px-3 py-2.5 min-h-[44px] text-xs font-medium rounded-xl hover:bg-slate-100 flex items-center justify-between text-slate-800 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${vol.avatarColor} shrink-0`} />
                        <span className="font-semibold">{vol.name}</span>
                      </div>
                      {conflictingNames.has(vol.name.toLowerCase()) && (
                        <span className="text-[11px] text-rose-600 font-bold flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                          <AlertTriangle className="w-3 h-3" />
                          Double-Booked
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
