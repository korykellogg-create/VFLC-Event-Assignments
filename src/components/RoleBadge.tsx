import React from 'react';
import { AssignedRole } from '../types';
import { UserCheck, AlertCircle, MinusCircle } from 'lucide-react';

interface RoleBadgeProps {
  role: AssignedRole;
  roleType: 'MC' | 'Door Monitor / Staff';
  onQuickAssign?: () => void;
  onVolunteerClick?: (volunteerId: string) => void;
  hasConflict?: boolean;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({
  role,
  roleType,
  onQuickAssign,
  onVolunteerClick,
  hasConflict = false,
}) => {
  if (role.status === 'not_needed') {
    return (
      <span
        id={`badge-not-needed-${roleType.toLowerCase().replace(/\s+/g, '-')}`}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200/80 select-none"
        title="Role is not required for this session"
      >
        <MinusCircle className="w-3.5 h-3.5 text-slate-400" />
        Not Needed
      </span>
    );
  }

  if (role.status === 'unassigned' || !role.volunteerName) {
    return (
      <button
        id={`badge-unassigned-${roleType.toLowerCase().replace(/\s+/g, '-')}`}
        type="button"
        onClick={onQuickAssign}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 hover:border-amber-300 transition-colors cursor-pointer group"
        title="Click to assign a volunteer"
      >
        <AlertCircle className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
        <span>Unassigned</span>
        <span className="text-[10px] uppercase font-semibold text-amber-600 bg-amber-100/80 px-1 py-0.5 rounded">
          Open
        </span>
      </button>
    );
  }

  // Assigned state
  return (
    <div className="inline-flex items-center gap-2">
      <button
        id={`badge-volunteer-${role.volunteerId || 'assigned'}`}
        type="button"
        onClick={() => role.volunteerId && onVolunteerClick?.(role.volunteerId)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
          hasConflict
            ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
            : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 cursor-pointer'
        }`}
        title={hasConflict ? 'Warning: Volunteer has a schedule conflict!' : `Assigned volunteer: ${role.volunteerName}`}
      >
        <span
          className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 ${
            hasConflict ? 'bg-rose-600' : 'bg-slate-700'
          }`}
        >
          {role.volunteerName.charAt(0)}
        </span>
        <span className="truncate max-w-[140px]">{role.volunteerName}</span>
        {hasConflict && (
          <span className="text-[10px] text-rose-600 font-semibold uppercase bg-rose-100 px-1 rounded">
            Overlap
          </span>
        )}
      </button>
    </div>
  );
};
