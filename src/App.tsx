import React, { useState, useEffect, useMemo } from 'react';
import { Shift, Volunteer, ActiveView, FilterState, OverlapConflict, EventScheduleFormData } from './types';
import {
  DEFAULT_VFLC_SCHEDULE,
  EMPTY_SCHEDULE_FORM,
  generateRosterFromScheduleForm,
  detectStudentDoubleBookings,
} from './utils/scheduleParser';
import { generateMarkdownRoster } from './utils/timeUtils';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { MasterRoomTable } from './components/MasterRoomTable';
import { VolunteerTimelineView } from './components/VolunteerTimelineView';
import { ShiftModal } from './components/ShiftModal';
import { PrintRosterView } from './components/PrintRosterView';
import { RosterGeneratorForm } from './components/RosterGeneratorForm';
import { Toast } from './components/Toast';
import { Sparkles, ArrowRight, RefreshCw } from 'lucide-react';

const STORAGE_KEY_FORM = 'vflc_schedule_clean_form_v1';
const STORAGE_KEY_SHIFTS = 'vflc_schedule_clean_shifts_v1';
const STORAGE_KEY_VOLS = 'vflc_schedule_clean_vols_v1';

export default function App() {
  // Form configuration state — initialized empty and fresh by default
  const [formData, setFormData] = useState<EventScheduleFormData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_FORM);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved form data', e);
      }
    }
    return EMPTY_SCHEDULE_FORM;
  });

  // Shifts state — empty by default for fresh preview
  const [shifts, setShifts] = useState<Shift[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SHIFTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved shifts', e);
      }
    }
    return [];
  });

  // Volunteers pool state — empty by default
  const [volunteers, setVolunteers] = useState<Volunteer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_VOLS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved volunteers', e);
      }
    }
    return [];
  });

  // Active view: start on generator form as requested
  const [activeView, setActiveView] = useState<ActiveView>('generator_form');
  const [selectedVolunteerForTimeline, setSelectedVolunteerForTimeline] = useState<string | null>(null);

  // Filter state
  const [filter, setFilter] = useState<FilterState>({
    searchQuery: '',
    day: 'all',
    location: 'all',
    timeBlock: 'all',
    coverageStatus: 'all',
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shiftToEdit, setShiftToEdit] = useState<Shift | null>(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FORM, JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SHIFTS, JSON.stringify(shifts));
  }, [shifts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_VOLS, JSON.stringify(volunteers));
  }, [volunteers]);

  // Compute double-booking conflicts across students
  const conflicts: OverlapConflict[] = useMemo(() => {
    return detectStudentDoubleBookings(shifts);
  }, [shifts]);

  // Distinct locations & days
  const availableLocations = useMemo(() => {
    return Array.from(new Set(shifts.map((s) => s.area))).filter(Boolean);
  }, [shifts]);

  const availableDays = useMemo(() => {
    return Array.from(new Set(shifts.map((s) => s.day))).filter(Boolean);
  }, [shifts]);

  // Handler to generate roster from the form answers
  const handleGenerateFromForm = (newFormData: EventScheduleFormData) => {
    // Preserve any existing assignments for items that still exist by id
    const existingAssignments: Record<string, string[]> = {};
    shifts.forEach((s) => {
      existingAssignments[s.id] = s.assignments.map((a) => a.volunteerName || '');
    });

    const generated = generateRosterFromScheduleForm(newFormData, existingAssignments);
    setFormData(newFormData);
    setShifts(generated.shifts);
    setVolunteers(generated.volunteers);
    setActiveView('master_room');

    const totalSpots = generated.shifts.reduce((sum, s) => sum + s.neededCount, 0);
    setToastMessage(`Generated ${generated.shifts.length} schedule areas with ${totalSpots} student spots!`);
  };

  // Spot assignment handler (click spot to assign or clear)
  const handleAssignSpot = (
    shiftId: string,
    spotIndex: number,
    volunteerName?: string,
    volunteerId?: string
  ) => {
    setShifts((prevShifts) =>
      prevShifts.map((shift) => {
        if (shift.id !== shiftId) return shift;

        const updatedAssignments = shift.assignments.map((spot) => {
          if (spot.spotIndex !== spotIndex) return spot;
          return {
            ...spot,
            volunteerName,
            volunteerId,
          };
        });

        const filledCount = updatedAssignments.filter((a) => Boolean(a.volunteerName)).length;
        const isFullyStaffed = filledCount >= shift.neededCount;

        return {
          ...shift,
          assignments: updatedAssignments,
          status: isFullyStaffed ? 'confirmed' : 'needs_coverage',
          mc: {
            status: updatedAssignments[0]?.volunteerName ? 'assigned' : 'unassigned',
            volunteerName: updatedAssignments[0]?.volunteerName,
            volunteerId: updatedAssignments[0]?.volunteerId,
          },
          doorMonitor: {
            status: updatedAssignments[1]?.volunteerName ? 'assigned' : 'unassigned',
            volunteerName: updatedAssignments[1]?.volunteerName,
            volunteerId: updatedAssignments[1]?.volunteerId,
          },
        };
      })
    );

    if (volunteerName) {
      setToastMessage(`Assigned ${volunteerName} to Spot #${spotIndex}`);
    } else {
      setToastMessage(`Cleared Spot #${spotIndex}`);
    }
  };

  // Filtered shifts based on search, day, area, and coverage status
  const filteredShifts = useMemo(() => {
    return shifts.filter((shift) => {
      // Search query
      if (filter.searchQuery.trim()) {
        const q = filter.searchQuery.toLowerCase();
        const matchesArea = shift.area.toLowerCase().includes(q);
        const matchesSession = shift.sessionName.toLowerCase().includes(q);
        const matchesNotes = shift.notes?.toLowerCase().includes(q) || false;
        const matchesDay = shift.day.toLowerCase().includes(q);
        const matchesVolunteer = shift.assignments.some((a) =>
          a.volunteerName?.toLowerCase().includes(q)
        );

        if (!matchesArea && !matchesSession && !matchesNotes && !matchesDay && !matchesVolunteer) {
          return false;
        }
      }

      // Day filter
      if (filter.day !== 'all' && shift.day !== filter.day) {
        return false;
      }

      // Area filter
      if (filter.location !== 'all' && shift.area !== filter.location) {
        return false;
      }

      // Coverage status filter
      const filledCount = shift.assignments.filter((a) => Boolean(a.volunteerName)).length;
      const isFull = filledCount >= shift.neededCount;

      if (filter.coverageStatus === 'needs_coverage' && isFull) {
        return false;
      }
      if (filter.coverageStatus === 'fully_staffed' && !isFull) {
        return false;
      }
      if (filter.coverageStatus === 'conflicts_only') {
        const hasConflict = shift.assignments.some((a) =>
          a.volunteerName && conflicts.some((c) => c.volunteerName.toLowerCase() === a.volunteerName!.toLowerCase())
        );
        if (!hasConflict) return false;
      }

      return true;
    });
  }, [shifts, filter, conflicts]);

  // Shift CRUD
  const handleOpenAddShift = () => {
    setShiftToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditShift = (shift: Shift) => {
    setShiftToEdit(shift);
    setIsModalOpen(true);
  };

  const handleDuplicateShift = (shift: Shift) => {
    const duplicated: Shift = {
      ...shift,
      id: `shift-${Date.now()}`,
      sessionName: `${shift.sessionName} (Copy)`,
      assignments: shift.assignments.map((a) => ({ ...a, volunteerName: undefined, volunteerId: undefined })),
      status: 'needs_coverage',
    };
    setShifts((prev) => [...prev, duplicated]);
    setToastMessage(`Duplicated area: "${duplicated.area}"`);
  };

  const handleDeleteShift = (shiftId: string) => {
    const toDelete = shifts.find((s) => s.id === shiftId);
    if (!toDelete) return;
    setShifts((prev) => prev.filter((s) => s.id !== shiftId));
    setToastMessage(`Removed "${toDelete.area}"`);
  };

  const handleSaveShift = (savedShift: Shift) => {
    setShifts((prev) => {
      const exists = prev.some((s) => s.id === savedShift.id);
      if (exists) {
        return prev.map((s) => (s.id === savedShift.id ? savedShift : s));
      }
      return [...prev, savedShift];
    });
    setToastMessage(`Saved "${savedShift.area}" successfully`);
  };

  const handleSelectVolunteer = (volunteerId: string) => {
    setSelectedVolunteerForTimeline(volunteerId);
    setActiveView('volunteer_timeline');
  };

  const handleCopyMarkdown = async () => {
    const md = generateMarkdownRoster(filteredShifts, `${formData.eventName} - Role Sheet`);
    try {
      await navigator.clipboard.writeText(md);
      setToastMessage('Role sheet copied as formatted Markdown to clipboard!');
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
      setToastMessage('Role sheet copied to clipboard!');
    }
  };

  const handleStartFresh = () => {
    setFormData(EMPTY_SCHEDULE_FORM);
    setShifts([]);
    setVolunteers([]);
    localStorage.removeItem(STORAGE_KEY_FORM);
    localStorage.removeItem(STORAGE_KEY_SHIFTS);
    localStorage.removeItem(STORAGE_KEY_VOLS);
    setActiveView('generator_form');
    setToastMessage('Started fresh! All form fields and assignments cleared.');
  };

  const handleLoadSampleSchedule = () => {
    setFormData(DEFAULT_VFLC_SCHEDULE);
    const generated = generateRosterFromScheduleForm(DEFAULT_VFLC_SCHEDULE);
    setShifts(generated.shifts);
    setVolunteers(generated.volunteers);
    setToastMessage('Loaded 2026 Called Rally sample schedule!');
  };

  const handleResetSchedule = () => {
    handleStartFresh();
  };

  if (activeView === 'print_roster') {
    return (
      <PrintRosterView
        shifts={filteredShifts}
        formData={formData}
        onBack={() => setActiveView('master_room')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        shifts={shifts}
        conflicts={conflicts}
        eventTitle={formData.eventName}
        eventDate={formData.venueName ? `${formData.venueName} • ${formData.venueAddress || ''}` : ''}
        venueName={formData.coordinatorContact || ''}
        onOpenAddShift={handleOpenAddShift}
        onCopyMarkdown={handleCopyMarkdown}
        onResetDemoData={handleResetSchedule}
        onFilterConflicts={() => setActiveView('volunteer_timeline')}
        onStartFresh={handleStartFresh}
        onLoadExample={handleLoadSampleSchedule}
      />

      {/* Main Content Area */}
      {activeView === 'generator_form' ? (
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          <RosterGeneratorForm
            initialFormData={formData}
            onGenerate={handleGenerateFromForm}
            onCancelPreview={shifts.length > 0 ? () => setActiveView('master_room') : undefined}
            hasExistingRoster={shifts.length > 0}
            onStartFresh={handleStartFresh}
            onLoadExample={handleLoadSampleSchedule}
          />
        </main>
      ) : (
        <>
          {/* Banner connecting sheet back to generator */}
          {shifts.length > 0 && (
            <div className="bg-blue-50/60 border-b border-blue-100/80 py-2 px-3 sm:px-6 lg:px-8 print:hidden">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-blue-900">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>
                    Generated sheet for <strong className="font-semibold">{formData.eventName || 'Event'}</strong> ({shifts.length} areas, {shifts.reduce((s, i) => s + i.neededCount, 0)} spots to fill{formData.venueName ? ` at ${formData.venueName}` : ''}).
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveView('generator_form')}
                  className="min-h-[36px] inline-flex items-center gap-1 font-semibold text-blue-700 hover:text-blue-900 underline underline-offset-2 transition-colors self-start sm:self-auto cursor-pointer"
                >
                  Modify schedule info & areas
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Filter and Search Bar */}
          <FilterBar
            filter={filter}
            setFilter={setFilter}
            availableLocations={availableLocations}
            availableDays={availableDays}
            totalMatches={filteredShifts.length}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
            {activeView === 'master_room' ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900">
                      Area Coverage & Role Roster Sheet
                    </h2>
                    <p className="text-xs text-slate-500">
                      Standardized table showing required stations, number of spots needed, assigned students, and schedule instructions.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setActiveView('generator_form')}
                      className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                      Edit Schedule & Needs
                    </button>
                  </div>
                </div>

                <MasterRoomTable
                  shifts={filteredShifts}
                  conflicts={conflicts}
                  volunteers={volunteers}
                  onEditShift={handleEditShift}
                  onDuplicateShift={handleDuplicateShift}
                  onDeleteShift={handleDeleteShift}
                  onAssignSpot={handleAssignSpot}
                  onSelectVolunteer={handleSelectVolunteer}
                />
              </div>
            ) : (
              <VolunteerTimelineView
                volunteers={volunteers}
                shifts={shifts}
                conflicts={conflicts}
                onEditShift={handleEditShift}
                selectedVolunteerId={selectedVolunteerForTimeline}
              />
            )}
          </main>
        </>
      )}

      {/* Shift Edit/Add Slide-over Modal */}
      <ShiftModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveShift}
        shiftToEdit={shiftToEdit}
        volunteers={volunteers}
        locations={availableLocations}
        allShifts={shifts}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
