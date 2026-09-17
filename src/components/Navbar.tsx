import React from 'react';
import { ActiveView, OverlapConflict, Shift } from '../types';
import {
  Table2,
  CalendarDays,
  Printer,
  Copy,
  Plus,
  AlertTriangle,
  Users,
  Building2,
  Sparkles,
  FileEdit,
  RotateCcw,
} from 'lucide-react';

interface NavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  shifts: Shift[];
  conflicts: OverlapConflict[];
  eventTitle: string;
  eventDate: string;
  venueName: string;
  onOpenAddShift: () => void;
  onCopyMarkdown: () => void;
  onResetDemoData: () => void;
  onFilterConflicts: () => void;
  onStartFresh?: () => void;
  onLoadExample?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  shifts,
  conflicts,
  eventTitle,
  eventDate,
  venueName,
  onOpenAddShift,
  onCopyMarkdown,
  onResetDemoData,
  onFilterConflicts,
  onStartFresh,
  onLoadExample,
}) => {
  const needsCoverageCount = shifts.filter(
    (s) => s.mc.status === 'unassigned' || s.doorMonitor.status === 'unassigned' || s.status === 'needs_coverage'
  ).length;

  const uniqueVolunteersCount = new Set(
    shifts.flatMap((s) => [
      s.mc.status === 'assigned' ? s.mc.volunteerName : null,
      s.doorMonitor.status === 'assigned' ? s.doorMonitor.volunteerName : null,
    ]).filter(Boolean)
  ).size;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs print:hidden">
      {/* Top Banner with Event Title & Main Controls */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-2.5 sm:py-3.5 gap-3">
          {/* Brand & Context */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs shrink-0">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-100" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
                  {eventTitle || 'VFLC Student Schedule & Area Roster'}
                </h1>
                <span className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 shrink-0">
                  {shifts.length > 0 ? 'Live Schedule' : 'Schedule Builder'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1.5 font-medium flex-wrap">
                <span className="truncate">
                  {eventDate && eventDate.trim() !== '•'
                    ? eventDate
                    : 'Configure your event schedule and student area needs below'}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar (Shown when shifts exist) */}
          {shifts.length > 0 && (
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs overflow-x-auto scrollbar-none py-0.5">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60 font-medium shrink-0">
                <Table2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{shifts.length} Shifts</span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60 font-medium shrink-0">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>{uniqueVolunteersCount} Active Students</span>
              </div>

              {needsCoverageCount > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-medium shrink-0">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>{needsCoverageCount} Need Coverage</span>
                </div>
              )}

              {conflicts.length > 0 ? (
                <button
                  id="btn-conflicts-alert"
                  type="button"
                  onClick={onFilterConflicts}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-medium hover:bg-rose-100 transition-colors cursor-pointer shrink-0"
                  title="Click to view student timeline with schedule conflicts"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>{conflicts.length} Overlap Conflicts</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>No Conflicts</span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-wrap">
            <button
              id="btn-nav-generator-form"
              type="button"
              onClick={() => setActiveView('generator_form')}
              className={`min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer shadow-2xs ${
                activeView === 'generator_form'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{activeView === 'generator_form' ? 'Schedule Form' : 'Edit Schedule'}</span>
            </button>

            {onLoadExample && (
              <button
                id="btn-nav-load-example"
                type="button"
                onClick={onLoadExample}
                className="min-h-[38px] inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                title="Load 2026 Called Rally sample schedule"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Load Example</span>
              </button>
            )}

            {onStartFresh && (shifts.length > 0 || eventTitle) && (
              <button
                id="btn-nav-start-fresh"
                type="button"
                onClick={onStartFresh}
                className="min-h-[38px] inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer shadow-2xs"
                title="Clear all data and start completely fresh"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Start Fresh</span>
              </button>
            )}

            {shifts.length > 0 && (
              <>
                <button
                  id="btn-copy-markdown"
                  type="button"
                  onClick={onCopyMarkdown}
                  className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer shadow-2xs"
                  title="Copy the master room schedule as a Markdown table"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden md:inline">Copy Markdown</span>
                </button>

                <button
                  id="btn-print-view"
                  type="button"
                  onClick={() => setActiveView('print_roster')}
                  className={`min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer shadow-2xs ${
                    activeView === 'print_roster'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Print View</span>
                </button>

                <button
                  id="btn-add-shift"
                  type="button"
                  onClick={onOpenAddShift}
                  className="min-h-[38px] inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Shift</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* View Switcher Tabs (Touch-optimized with min-height >= 44px) */}
        <div className="flex items-center space-x-1.5 border-t border-slate-100 pt-1.5 pb-1.5 overflow-x-auto scrollbar-none">
          <button
            id="tab-generator-form"
            type="button"
            onClick={() => setActiveView('generator_form')}
            className={`min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeView === 'generator_form'
                ? 'bg-blue-50 text-blue-800 border border-blue-200/80 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>1. Generator Form</span>
          </button>

          <button
            id="tab-master-room"
            type="button"
            onClick={() => setActiveView('master_room')}
            className={`min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeView === 'master_room'
                ? 'bg-slate-100 text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Table2 className="w-4 h-4" />
            <span>2. Master Room Sheet</span>
            <span className="ml-1 text-[11px] font-mono px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-600">
              {shifts.length}
            </span>
          </button>

          <button
            id="tab-volunteer-timeline"
            type="button"
            onClick={() => setActiveView('volunteer_timeline')}
            className={`min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeView === 'volunteer_timeline'
                ? 'bg-slate-100 text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>3. Student Timeline</span>
            {conflicts.length > 0 && (
              <span className="ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 border border-rose-200 text-rose-700">
                {conflicts.length} Overlaps
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

