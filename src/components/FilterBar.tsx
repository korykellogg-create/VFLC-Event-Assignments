import React from 'react';
import { FilterState, TimeBlockFilter, CoverageStatusFilter } from '../types';
import { Search, MapPin, Calendar, Filter, X } from 'lucide-react';

interface FilterBarProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  availableLocations: string[];
  availableDays: string[];
  totalMatches: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  setFilter,
  availableLocations,
  availableDays,
  totalMatches,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter((prev) => ({ ...prev, location: e.target.value }));
  };

  const handleDayChange = (day: string) => {
    setFilter((prev) => ({ ...prev, day }));
  };

  const handleCoverageChange = (coverageStatus: CoverageStatusFilter) => {
    setFilter((prev) => ({ ...prev, coverageStatus }));
  };

  const hasActiveFilters =
    filter.searchQuery.trim() !== '' ||
    filter.day !== 'all' ||
    filter.location !== 'all' ||
    filter.timeBlock !== 'all' ||
    filter.coverageStatus !== 'all';

  const resetFilters = () => {
    setFilter({
      searchQuery: '',
      day: 'all',
      location: 'all',
      timeBlock: 'all',
      coverageStatus: 'all',
    });
  };

  return (
    <div className="bg-white border-b border-slate-200 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 print:hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3">
        {/* Search input */}
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="input-roster-search"
            type="text"
            value={filter.searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by area, student name, session, or notes..."
            className="w-full pl-9 pr-9 py-2 text-sm sm:text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-900 placeholder:text-slate-400 font-medium min-h-[42px]"
          />
          {filter.searchQuery && (
            <button
              type="button"
              onClick={() => setFilter((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 min-w-[36px] min-h-[42px] justify-center cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Group */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Day Selector Pills */}
          {availableDays.length > 1 && (
            <div className="flex items-center border border-slate-200 rounded-xl overflow-x-auto scrollbar-none bg-slate-50 p-0.5 max-w-full">
              <button
                type="button"
                onClick={() => handleDayChange('all')}
                className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
                  filter.day === 'all'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Days
              </button>
              {availableDays.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleDayChange(d)}
                  className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
                    filter.day === d
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          )}

          {/* Area / Station Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 min-h-[40px] flex-1 sm:flex-initial">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              id="select-filter-location"
              value={filter.location}
              onChange={handleLocationChange}
              className="bg-transparent text-slate-700 text-xs sm:text-xs focus:outline-hidden cursor-pointer font-medium w-full sm:w-auto"
            >
              <option value="all">All Stations & Areas ({availableLocations.length})</option>
              {availableLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 min-h-[40px] flex-1 sm:flex-initial">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              id="select-filter-status"
              value={filter.coverageStatus}
              onChange={(e) => handleCoverageChange(e.target.value as CoverageStatusFilter)}
              className="bg-transparent text-slate-700 text-xs sm:text-xs focus:outline-hidden cursor-pointer font-medium w-full sm:w-auto"
            >
              <option value="all">All Coverage</option>
              <option value="needs_coverage">Needs Coverage (Open Spots)</option>
              <option value="fully_staffed">Fully Covered (All Spots Filled)</option>
              <option value="conflicts_only">Has Double Bookings</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              id="btn-clear-filters"
              type="button"
              onClick={resetFilters}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <span className="text-[11px] text-slate-500 pl-1 font-mono shrink-0">
            {totalMatches} matching
          </span>
        </div>
      </div>
    </div>
  );
};
