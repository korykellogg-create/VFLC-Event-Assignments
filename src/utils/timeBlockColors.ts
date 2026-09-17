export interface TimeBlockTheme {
  name: string;
  badgeClass: string;
  borderLeftClass: string;
  dotClass: string;
  textClass: string;
  lightBg: string;
  pillClass: string;
  softBorder: string;
}

export const TIME_BLOCK_PALETTES: TimeBlockTheme[] = [
  {
    name: 'Indigo',
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    borderLeftClass: 'border-l-4 border-l-indigo-500',
    dotClass: 'bg-indigo-500',
    textClass: 'text-indigo-700',
    lightBg: 'bg-indigo-50/30',
    pillClass: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    softBorder: 'border-indigo-200',
  },
  {
    name: 'Amber',
    badgeClass: 'bg-amber-50 text-amber-900 border-amber-200',
    borderLeftClass: 'border-l-4 border-l-amber-500',
    dotClass: 'bg-amber-500',
    textClass: 'text-amber-800',
    lightBg: 'bg-amber-50/30',
    pillClass: 'bg-amber-100 text-amber-900 border-amber-200',
    softBorder: 'border-amber-200',
  },
  {
    name: 'Teal',
    badgeClass: 'bg-teal-50 text-teal-900 border-teal-200',
    borderLeftClass: 'border-l-4 border-l-teal-500',
    dotClass: 'bg-teal-500',
    textClass: 'text-teal-700',
    lightBg: 'bg-teal-50/30',
    pillClass: 'bg-teal-100 text-teal-900 border-teal-200',
    softBorder: 'border-teal-200',
  },
  {
    name: 'Sky',
    badgeClass: 'bg-sky-50 text-sky-900 border-sky-200',
    borderLeftClass: 'border-l-4 border-l-sky-500',
    dotClass: 'bg-sky-500',
    textClass: 'text-sky-700',
    lightBg: 'bg-sky-50/30',
    pillClass: 'bg-sky-100 text-sky-900 border-sky-200',
    softBorder: 'border-sky-200',
  },
  {
    name: 'Purple',
    badgeClass: 'bg-purple-50 text-purple-900 border-purple-200',
    borderLeftClass: 'border-l-4 border-l-purple-500',
    dotClass: 'bg-purple-500',
    textClass: 'text-purple-700',
    lightBg: 'bg-purple-50/30',
    pillClass: 'bg-purple-100 text-purple-900 border-purple-200',
    softBorder: 'border-purple-200',
  },
  {
    name: 'Rose',
    badgeClass: 'bg-rose-50 text-rose-900 border-rose-200',
    borderLeftClass: 'border-l-4 border-l-rose-500',
    dotClass: 'bg-rose-500',
    textClass: 'text-rose-700',
    lightBg: 'bg-rose-50/30',
    pillClass: 'bg-rose-100 text-rose-900 border-rose-200',
    softBorder: 'border-rose-200',
  },
  {
    name: 'Emerald',
    badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    borderLeftClass: 'border-l-4 border-l-emerald-500',
    dotClass: 'bg-emerald-500',
    textClass: 'text-emerald-700',
    lightBg: 'bg-emerald-50/30',
    pillClass: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    softBorder: 'border-emerald-200',
  },
  {
    name: 'Orange',
    badgeClass: 'bg-orange-50 text-orange-950 border-orange-200',
    borderLeftClass: 'border-l-4 border-l-orange-500',
    dotClass: 'bg-orange-500',
    textClass: 'text-orange-800',
    lightBg: 'bg-orange-50/30',
    pillClass: 'bg-orange-100 text-orange-900 border-orange-200',
    softBorder: 'border-orange-200',
  },
  {
    name: 'Cyan',
    badgeClass: 'bg-cyan-50 text-cyan-900 border-cyan-200',
    borderLeftClass: 'border-l-4 border-l-cyan-500',
    dotClass: 'bg-cyan-500',
    textClass: 'text-cyan-700',
    lightBg: 'bg-cyan-50/30',
    pillClass: 'bg-cyan-100 text-cyan-900 border-cyan-200',
    softBorder: 'border-cyan-200',
  },
];

/**
 * Deterministically maps a time block string (e.g. "Friday 6:30pm - 7:30pm" or "9:30am - 10:00am")
 * to the exact same color theme every time, ensuring identical time blocks share the same highlight.
 */
export function getTimeBlockTheme(timeSlot: string, day?: string): TimeBlockTheme {
  const normalized = `${(day || '').trim().toLowerCase()}_${(timeSlot || '').trim().toLowerCase().replace(/\s+/g, '')}`;
  
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0;
  }
  
  const index = Math.abs(hash) % TIME_BLOCK_PALETTES.length;
  return TIME_BLOCK_PALETTES[index];
}
