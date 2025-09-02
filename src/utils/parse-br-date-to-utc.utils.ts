export function parseBrDateToUTC(dateStr?: string | null): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const [dd, mm, yyyy] = dateStr.split('/').map(Number);
  if (!dd || !mm || !yyyy) return null;
  return new Date(Date.UTC(yyyy, mm - 1, dd));
}
