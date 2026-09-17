import React from 'react';
import { Shift, EventScheduleFormData } from '../types';
import { ArrowLeft, Printer, MapPin, Phone, Calendar, Users } from 'lucide-react';

interface PrintRosterViewProps {
  shifts: Shift[];
  formData: EventScheduleFormData;
  onBack: () => void;
}

export const PrintRosterView: React.FC<PrintRosterViewProps> = ({ shifts, formData, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  const totalSpots = shifts.reduce((sum, s) => sum + s.neededCount, 0);
  const filledSpots = shifts.reduce(
    (sum, s) => sum + s.assignments.filter((a) => Boolean(a.volunteerName)).length,
    0
  );

  return (
    <div className="min-h-screen bg-slate-100 py-4 sm:py-8 px-2 sm:px-6 print:p-0 print:bg-white text-slate-900">
      {/* Top Non-Print Controls */}
      <div className="max-w-5xl mx-auto mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs w-full sm:w-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sheet</span>
        </button>

        <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Formatted for standard paper handout
          </span>
          <button
            type="button"
            onClick={handlePrint}
            className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer shadow-xs w-full sm:w-auto"
          >
            <Printer className="w-4 h-4" />
            <span>Print Role Handout</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="max-w-5xl mx-auto bg-white border border-slate-300 shadow-sm p-4 sm:p-8 rounded-xl sm:rounded-none print:border-none print:shadow-none print:p-2 overflow-hidden">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                {formData.eventName || 'Event Role & Coverage Sheet'}
              </h1>
              <div className="flex items-center gap-3 sm:gap-4 text-xs text-slate-700 font-medium mt-1 flex-wrap">
                <span className="flex items-center gap-1 font-bold">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  {formData.venueName || 'Host Venue'} — {formData.venueAddress || ''}
                </span>
                {formData.coordinatorContact && (
                  <span className="flex items-center gap-1 text-slate-800 font-semibold">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    {formData.coordinatorContact}
                  </span>
                )}
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-500 font-mono shrink-0">
              <div>Date Printed: {new Date().toLocaleDateString()}</div>
              <div>
                Student Coverage: {filledSpots} / {totalSpots} spots filled
              </div>
            </div>
          </div>
        </div>

        {/* Master Schedule Table with responsive horizontal scroll on mobile */}
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full text-left border-collapse text-xs print:text-[11px] mb-8 min-w-[650px] sm:min-w-full">
          <thead>
            <tr className="border-b-2 border-slate-400 bg-slate-100 text-slate-900 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3 border border-slate-300 w-32">Day & Time</th>
              <th className="py-2.5 px-3 border border-slate-300 w-36">Session</th>
              <th className="py-2.5 px-3 border border-slate-300 w-44">Area / Station</th>
              <th className="py-2.5 px-3 border border-slate-300 w-16 text-center">Needed</th>
              <th className="py-2.5 px-3 border border-slate-300">
                Assigned Students
              </th>
              <th className="py-2.5 px-3 border border-slate-300 w-52">
                Notes & Instructions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300 text-slate-800">
            {shifts.map((shift) => (
              <tr key={shift.id} className="border border-slate-300 print-break-inside-avoid">
                {/* Day & Time */}
                <td className="py-2.5 px-3 border border-slate-300 align-top">
                  <div className="font-bold text-slate-900">{shift.day}</div>
                  <div className="font-mono text-[11px] text-slate-700">{shift.timeSlot}</div>
                </td>

                {/* Session */}
                <td className="py-2.5 px-3 border border-slate-300 align-top font-medium text-slate-900">
                  {shift.sessionName}
                </td>

                {/* Area / Station */}
                <td className="py-2.5 px-3 border border-slate-300 align-top font-bold text-slate-950">
                  {shift.area}
                </td>

                {/* Needed */}
                <td className="py-2.5 px-3 border border-slate-300 align-top text-center font-bold text-slate-900">
                  {shift.neededCount}
                </td>

                {/* Assigned Slots / Write-in lines */}
                <td className="py-2.5 px-3 border border-slate-300 align-top">
                  <div className="space-y-1.5">
                    {shift.assignments.map((spot, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs border-b border-dotted border-slate-300 pb-1 last:border-b-0"
                      >
                        <span className="font-mono text-[10px] text-slate-400 w-12">
                          Spot #{spot.spotIndex}:
                        </span>
                        {spot.volunteerName ? (
                          <span className="font-bold text-slate-900">{spot.volunteerName}</span>
                        ) : (
                          <span className="text-slate-400 font-mono tracking-widest">
                            __________________________
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </td>

                {/* Notes */}
                <td className="py-2.5 px-3 border border-slate-300 align-top text-slate-700 italic text-[11px]">
                  {shift.notes || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {/* Footer Notes */}
        <div className="border-t border-slate-300 pt-3 flex items-center justify-between text-xs text-slate-500 print:text-[10px]">
          <div>
            {formData.coordinatorContact && (
              <span className="font-medium text-slate-800">
                Notice: {formData.coordinatorContact}
              </span>
            )}
          </div>
          <div>Page 1 of 1</div>
        </div>
      </div>
    </div>
  );
};
