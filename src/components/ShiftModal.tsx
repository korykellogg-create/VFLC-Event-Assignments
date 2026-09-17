import React, { useState, useEffect } from 'react';
import { Shift, Volunteer } from '../types';
import { X, Clock, MapPin, Tag, Users, Calendar, Sparkles } from 'lucide-react';

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shiftData: Shift) => void;
  shiftToEdit: Shift | null;
  volunteers: Volunteer[];
  locations: string[];
  allShifts: Shift[];
}

export const ShiftModal: React.FC<ShiftModalProps> = ({
  isOpen,
  onClose,
  onSave,
  shiftToEdit,
  volunteers,
  locations,
}) => {
  const [day, setDay] = useState('Saturday');
  const [sessionName, setSessionName] = useState('Morning Session');
  const [timeSlot, setTimeSlot] = useState('9:30am - 10:00am');
  const [area, setArea] = useState('Merch Tables');
  const [neededCount, setNeededCount] = useState(2);
  const [notes, setNotes] = useState('');
  const [assignedNames, setAssignedNames] = useState<string[]>(['', '']);

  useEffect(() => {
    if (shiftToEdit) {
      setDay(shiftToEdit.day || 'Saturday');
      setSessionName(shiftToEdit.sessionName || 'Session');
      setTimeSlot(shiftToEdit.timeSlot || '9:30am - 10:00am');
      setArea(shiftToEdit.area || shiftToEdit.location || 'Merch Tables');
      setNeededCount(shiftToEdit.neededCount || 2);
      setNotes(shiftToEdit.notes || shiftToEdit.details || '');

      const currentAssignments = Array.from({ length: shiftToEdit.neededCount || 2 }).map(
        (_, i) => shiftToEdit.assignments?.[i]?.volunteerName || ''
      );
      setAssignedNames(currentAssignments);
    } else {
      setDay('Saturday');
      setSessionName('General Session');
      setTimeSlot('10:00am - 11:00am');
      setArea('Station Area');
      setNeededCount(2);
      setNotes('');
      setAssignedNames(['', '']);
    }
  }, [shiftToEdit, isOpen]);

  const handleNeededCountChange = (newCount: number) => {
    const validCount = Math.max(1, Math.min(20, newCount));
    setNeededCount(validCount);
    setAssignedNames((prev) => {
      const updated = [...prev];
      while (updated.length < validCount) updated.push('');
      return updated.slice(0, validCount);
    });
  };

  const handleSpotNameChange = (index: number, val: string) => {
    setAssignedNames((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const assignments = assignedNames.map((name, idx) => {
      const trimmed = name.trim();
      const matched = volunteers.find((v) => v.name.toLowerCase() === trimmed.toLowerCase());
      return {
        spotIndex: idx + 1,
        volunteerId: matched?.id,
        volunteerName: trimmed || undefined,
      };
    });

    const filledCount = assignments.filter((a) => Boolean(a.volunteerName)).length;

    const saved: Shift = {
      id: shiftToEdit?.id || `shift-${Date.now()}`,
      day,
      sessionName,
      timeSlot,
      startTime: shiftToEdit?.startTime || '09:00',
      endTime: shiftToEdit?.endTime || '10:00',
      area,
      neededCount,
      notes,
      assignments,
      status: filledCount >= neededCount ? 'confirmed' : 'needs_coverage',

      // Backward compatibility aliases
      location: area,
      title: `${sessionName} - ${area}`,
      category: sessionName,
      details: notes,
      date: day,
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

    onSave(saved);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {shiftToEdit ? 'Edit Schedule Area & Spots' : 'Add New Schedule Area'}
            </h3>
            <p className="text-xs text-slate-500">
              Configure station coverage needs, time window, and spot assignments.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl p-1 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Day</label>
              <input
                type="text"
                required
                value={day}
                onChange={(e) => setDay(e.target.value)}
                placeholder="Friday / Saturday"
                className="w-full px-3 py-2 text-sm sm:text-xs border border-slate-300 rounded-xl min-h-[42px]"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Session Block</label>
              <input
                type="text"
                required
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="e.g. Morning Session"
                className="w-full px-3 py-2 text-sm sm:text-xs border border-slate-300 rounded-xl min-h-[42px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">Time Slot</label>
              <input
                type="text"
                required
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                placeholder="e.g. 9:30am - 10:00am"
                className="w-full px-3 py-2 text-sm sm:text-xs border border-slate-300 rounded-xl font-mono min-h-[42px]"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Spots Needed</label>
              <input
                type="number"
                min={1}
                max={20}
                value={neededCount}
                onChange={(e) => handleNeededCountChange(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2 text-sm sm:text-xs border border-slate-300 rounded-xl font-bold text-center text-blue-700 min-h-[42px]"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Area / Station Name</label>
            <input
              type="text"
              required
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Merch Tables, Breakout Room Hosts, Entrance Greeters"
              className="w-full px-3 py-2 text-sm sm:text-xs border border-slate-300 rounded-xl font-medium min-h-[42px]"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Notes & Instructions from Schedule
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. (Two students on merch tables, the rest can be greeting at the entrance)"
              className="w-full px-3 py-2 text-sm sm:text-xs border border-slate-300 rounded-xl"
            />
          </div>

          {/* Assigned Spots Preview */}
          <div className="pt-2 border-t border-slate-100">
            <label className="font-semibold text-slate-700 block mb-2">
              Assigned Students ({neededCount} spots):
            </label>
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {assignedNames.map((name, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-16 text-slate-500 font-mono text-[11px] shrink-0">Spot #{idx + 1}:</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleSpotNameChange(idx, e.target.value)}
                    placeholder="Student name or leave open..."
                    className="flex-1 px-3 py-2 text-sm sm:text-xs border border-slate-300 rounded-xl min-h-[40px]"
                  />
                  {name && (
                    <button
                      type="button"
                      onClick={() => handleSpotNameChange(idx, '')}
                      className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg text-xs transition-colors shrink-0"
                      aria-label="Clear spot name"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
