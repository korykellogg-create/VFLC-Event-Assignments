import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Plus,
  Trash2,
  Phone,
  FileSpreadsheet,
  ChevronRight,
  ClipboardPaste,
  Building2,
  Users,
  Info,
  CheckCircle2,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { EventScheduleFormData } from '../types';
import {
  parseScheduleTextToFormData,
  DEFAULT_VFLC_SCHEDULE,
  EMPTY_SCHEDULE_FORM,
} from '../utils/scheduleParser';

interface RosterGeneratorFormProps {
  initialFormData: EventScheduleFormData;
  onGenerate: (data: EventScheduleFormData) => void;
  onCancelPreview?: () => void;
  hasExistingRoster: boolean;
  onStartFresh?: () => void;
  onLoadExample?: () => void;
}

export const RosterGeneratorForm: React.FC<RosterGeneratorFormProps> = ({
  initialFormData,
  onGenerate,
  onCancelPreview,
  hasExistingRoster,
  onStartFresh,
  onLoadExample,
}) => {
  const [formData, setFormData] = useState<EventScheduleFormData>(initialFormData);
  const [showRawPaste, setShowRawPaste] = useState(false);
  const [rawPastedText, setRawPastedText] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Sync state if initialFormData changes from outside
  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  // Total spots calculation
  const totalSpotsNeeded = formData.items.reduce((sum, item) => sum + (Number(item.neededCount) || 1), 0);
  const distinctDays = Array.from(new Set(formData.items.map((i) => i.day).filter(Boolean)));

  const handleAddItem = () => {
    setFormError(null);
    const newItem = {
      id: `item-${Date.now()}`,
      day: formData.items[formData.items.length - 1]?.day || 'Saturday',
      sessionName: 'Morning Session',
      timeSlot: '9:00am - 10:00am',
      area: 'Station / Area Name',
      neededCount: 2,
      notes: '',
    };
    setFormData({
      ...formData,
      items: [...formData.items, newItem],
    });
  };

  const handleRemoveItem = (id: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter((i) => i.id !== id),
    });
  };

  const handleUpdateItem = (
    id: string,
    field: keyof EventScheduleFormData['items'][0],
    value: string | number
  ) => {
    setFormData({
      ...formData,
      items: formData.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const handleParsePastedText = () => {
    if (!rawPastedText.trim()) return;
    setFormError(null);
    const parsed = parseScheduleTextToFormData(rawPastedText);
    setFormData((prev) => ({
      ...prev,
      eventName: parsed.eventName || prev.eventName,
      venueName: parsed.venueName || prev.venueName,
      coordinatorContact: parsed.coordinatorContact || prev.coordinatorContact,
      items: parsed.items && parsed.items.length > 0 ? parsed.items : prev.items,
    }));
    setShowRawPaste(false);
    setRawPastedText('');
  };

  const handleStartFreshLocal = () => {
    setFormError(null);
    setFormData(EMPTY_SCHEDULE_FORM);
    if (onStartFresh) {
      onStartFresh();
    }
  };

  const handleLoadExampleLocal = () => {
    setFormError(null);
    setFormData(DEFAULT_VFLC_SCHEDULE);
    if (onLoadExample) {
      onLoadExample();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      setFormError('Please add at least one area need before generating the role sheet.');
      return;
    }
    setFormError(null);
    onGenerate(formData);
  };

  return (
    <div id="roster-generator-container" className="max-w-5xl mx-auto pb-20">
      {/* Header Card */}
      <div id="generator-header-card" className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                <Sparkles className="w-3.5 h-3.5" />
                Schedule-to-Role Sheet Generator
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Enter your event notes & area needs → Auto-generate role sheet
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Event Schedule & Role Needs Form
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Enter the schedule times, what areas need coverage, and how many people are needed. You don't need to assign people here—the generated sheet will lay out all role spots ready to be assigned or printed.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <button
              id="btn-paste-schedule-toggle"
              type="button"
              onClick={() => setShowRawPaste(!showRawPaste)}
              className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200 cursor-pointer"
            >
              <ClipboardPaste className="w-3.5 h-3.5 text-slate-600" />
              {showRawPaste ? 'Hide Paste Box' : 'Quick Paste Schedule'}
            </button>

            <button
              id="btn-load-example-schedule"
              type="button"
              onClick={handleLoadExampleLocal}
              className="min-h-[38px] inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-xl transition-colors border border-slate-300 shadow-2xs cursor-pointer"
              title="Load sample 2026 Called Rally schedule for demonstration"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Load Example Schedule
            </button>

            {(formData.eventName || formData.items.length > 0 || formData.studentVolunteerPool) && (
              <button
                id="btn-clear-fresh"
                type="button"
                onClick={handleStartFreshLocal}
                className="min-h-[38px] inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-200 cursor-pointer"
                title="Clear all fields and start completely blank"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Start Fresh
              </button>
            )}

            {hasExistingRoster && onCancelPreview && (
              <button
                id="btn-view-current-sheet"
                type="button"
                onClick={onCancelPreview}
                className="min-h-[38px] inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                View Current Sheet
              </button>
            )}
          </div>
        </div>

        {/* Quick Paste Raw Schedule Drawer (Optional) */}
        {showRawPaste && (
          <div className="p-4 bg-slate-50 border border-blue-200 rounded-xl mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ClipboardPaste className="w-4 h-4 text-blue-600" />
                Paste Schedule Text (From Notes, Email, or Doc)
              </span>
              <span className="text-[11px] text-slate-500">
                Auto-extracts Sessions, Times, and (X students) notes
              </span>
            </div>
            <textarea
              rows={6}
              value={rawPastedText}
              onChange={(e) => setRawPastedText(e.target.value)}
              placeholder="Paste schedule notes like:&#10;Friday&#10;Evening Session&#10;Open Doors – 6:30pm&#10;&#10;Saturday&#10;Morning Session&#10;VFLC Arrival - 8:30 (Restock green room...)&#10;Open Doors – 9:30am (Two students on merch tables)..."
              className="w-full text-xs font-mono p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRawPaste(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleParsePastedText}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
              >
                Import Schedule Lines Into Form
              </button>
            </div>
          </div>
        )}

        {/* Summary Metric Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <span className="text-slate-500 block text-[11px]">Event Title</span>
            <span className="font-semibold text-slate-900 truncate block">
              {formData.eventName || 'Ready for Event Title'}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <span className="text-slate-500 block text-[11px]">Venue & Location</span>
            <span className="font-semibold text-slate-900 truncate block">
              {formData.venueName || 'Ready for Venue'}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <span className="text-slate-500 block text-[11px]">Days Covered</span>
            <span className="font-semibold text-slate-900 block">
              {distinctDays.length > 0 ? distinctDays.join(' & ') : '0 Days'}
            </span>
          </div>
          <div className="p-3 bg-blue-50/80 rounded-lg border border-blue-200/80">
            <span className="text-blue-700 block text-[11px] font-medium">Total Role Spots Needed</span>
            <span className="font-bold text-blue-900 text-base block">
              {totalSpotsNeeded} Student Spots
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Event & Venue Details */}
        <div id="section-venue-info" className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Event, Venue & Contact Info
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Event Schedule Title
              </label>
              <input
                id="input-event-name"
                type="text"
                required
                value={formData.eventName}
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                placeholder="e.g. 2026 Called Rally VFLC Schedule"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Venue / Host Church Name
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  id="input-venue-name"
                  type="text"
                  required
                  value={formData.venueName}
                  onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                  placeholder="e.g. Owasso First"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Venue Street Address & City
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  id="input-venue-address"
                  type="text"
                  value={formData.venueAddress}
                  onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                  placeholder="e.g. 9341 N 129th E Ave, Owasso, OK, 74055"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Coordinator Phone / Contact Note
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  id="input-coordinator-contact"
                  type="text"
                  value={formData.coordinatorContact}
                  onChange={(e) =>
                    setFormData({ ...formData, coordinatorContact: e.target.value })
                  }
                  placeholder="e.g. Feel free to give VFLC students my number while at the event! 405.538.8474"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Area Coverage Needs & Schedule Times */}
        <div id="section-area-needs" className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  What Areas Need Roles & How Many Spots to Fill
                </h2>
                <p className="text-xs text-slate-500">
                  Specify each session block, the area or station needing help, and the number of students required.
                </p>
              </div>
            </div>

            <button
              id="btn-add-schedule-item"
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Area Need
            </button>
          </div>

          <div className="space-y-3 mt-4">
            {formData.items.length === 0 ? (
              <div className="p-8 text-center bg-slate-50/70 rounded-xl border border-dashed border-slate-300 my-2">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2.5">
                  <Plus className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-slate-800 mb-1">
                  No area needs added yet
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                  Add stations, greeting doors, or service areas needed for your event schedule. Each area can have a designated time slot and required number of student spots.
                </p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add First Area Need
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRawPaste(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 shadow-2xs transition-colors cursor-pointer"
                  >
                    <ClipboardPaste className="w-3.5 h-3.5 text-slate-500" />
                    Paste Schedule Notes
                  </button>
                </div>
              </div>
            ) : (
              formData.items.map((item, index) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 bg-slate-50/90 rounded-lg border border-slate-200 text-xs space-y-2.5 transition-all hover:border-slate-300"
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {item.day} • {item.sessionName}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200 font-semibold text-[11px]">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      <span>{item.neededCount} Needed</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-1 transition-colors cursor-pointer"
                      title="Remove this schedule area"
                      aria-label="Remove schedule area"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-1">
                  {/* Day */}
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                      Day
                    </label>
                    <input
                      type="text"
                      value={item.day}
                      onChange={(e) => handleUpdateItem(item.id, 'day', e.target.value)}
                      placeholder="Friday / Saturday"
                      className="w-full px-3 py-2 text-sm sm:text-xs bg-white border border-slate-300 rounded-xl sm:rounded-lg font-medium text-slate-800 min-h-[40px]"
                    />
                  </div>

                  {/* Session Block */}
                  <div className="sm:col-span-3">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                      Session Block
                    </label>
                    <input
                      type="text"
                      value={item.sessionName}
                      onChange={(e) => handleUpdateItem(item.id, 'sessionName', e.target.value)}
                      placeholder="e.g. Morning Session"
                      className="w-full px-3 py-2 text-sm sm:text-xs bg-white border border-slate-300 rounded-xl sm:rounded-lg font-medium text-slate-800 min-h-[40px]"
                    />
                  </div>

                  {/* Time Slot */}
                  <div className="sm:col-span-3">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                      Time Slot
                    </label>
                    <input
                      type="text"
                      value={item.timeSlot}
                      onChange={(e) => handleUpdateItem(item.id, 'timeSlot', e.target.value)}
                      placeholder="e.g. 9:30am - 10:00am"
                      className="w-full px-3 py-2 text-sm sm:text-xs bg-white border border-slate-300 rounded-xl sm:rounded-lg font-mono text-slate-800 min-h-[40px]"
                    />
                  </div>

                  {/* Area / Station */}
                  <div className="sm:col-span-3">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                      Area / Station
                    </label>
                    <input
                      type="text"
                      value={item.area}
                      onChange={(e) => handleUpdateItem(item.id, 'area', e.target.value)}
                      placeholder="e.g. Merch Tables"
                      className="w-full px-3 py-2 text-sm sm:text-xs bg-white border border-slate-300 rounded-xl sm:rounded-lg font-medium text-slate-900 min-h-[40px]"
                    />
                  </div>

                  {/* How Many Needed */}
                  <div className="sm:col-span-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                      Needed
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={item.neededCount}
                      onChange={(e) =>
                        handleUpdateItem(item.id, 'neededCount', parseInt(e.target.value, 10) || 1)
                      }
                      className="w-full px-2 py-2 text-sm sm:text-xs bg-white border border-slate-300 rounded-xl sm:rounded-lg font-bold text-center text-blue-700 min-h-[40px]"
                    />
                  </div>
                </div>

                {/* Specific Notes & Instructions */}
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                    Schedule Notes / Instructions
                  </label>
                  <input
                    type="text"
                    value={item.notes}
                    onChange={(e) => handleUpdateItem(item.id, 'notes', e.target.value)}
                    placeholder="e.g. (Two students on merch tables, the rest can be greeting at the entrance)"
                    className="w-full px-3 py-2 text-sm sm:text-xs bg-white border border-slate-300 rounded-xl sm:rounded-lg text-slate-700 placeholder:text-slate-400 min-h-[40px]"
                  />
                </div>
              </div>
            ))
          )}
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            className="w-full mt-4 min-h-[44px] py-2.5 border border-dashed border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Another Area / Station
          </button>
        </div>

        {/* Section 3: Optional Student & Volunteer Pool */}
        <div id="section-volunteer-pool" className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                3
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  VFLC Student Names Pool (Optional)
                </h2>
                <p className="text-xs text-slate-500">
                  Paste student names here so you can easily pick them from a dropdown when filling spots on the sheet. (Or leave blank to print lines).
                </p>
              </div>
            </div>
          </div>

          <textarea
            id="textarea-volunteer-pool"
            rows={4}
            value={formData.studentVolunteerPool}
            onChange={(e) =>
              setFormData({ ...formData, studentVolunteerPool: e.target.value })
            }
            placeholder="Paste student names (one per line):&#10;Sarah Jenkins&#10;Marcus Chen&#10;Devon Vance&#10;Elena Rostova..."
            className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Error Alert if validation fails */}
        {formError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Floating Action Bar */}
        <div id="generator-action-bar" className="sticky bottom-3 sm:bottom-4 z-20 bg-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
              {formData.items.length > 0 ? 'Ready to generate Role & Coverage Sheet' : 'Add area needs above to generate sheet'}
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {formData.items.length > 0 ? (
                <>
                  Will generate <span className="font-bold text-white">{totalSpotsNeeded} spots</span> across{' '}
                  <span className="font-bold text-white">{formData.items.length} schedule areas</span>
                  {formData.venueName ? ` for ${formData.venueName}` : ''}.
                </>
              ) : (
                'Specify your event title, stations, and required student spot counts to build your schedule.'
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            {hasExistingRoster && onCancelPreview && (
              <button
                type="button"
                onClick={onCancelPreview}
                className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Cancel & Return
              </button>
            )}

            <button
              id="btn-generate-role-sheet"
              type="submit"
              className="min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-sm transition-all active:scale-98 cursor-pointer w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Role Sheet</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
