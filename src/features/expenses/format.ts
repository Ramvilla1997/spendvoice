export function formatMoney(cents: number, currency: string): string {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(cents / 100);
}

/** Local calendar date as YYYY-MM-DD. toISOString would give the UTC date instead. */
export function localIsoDate(date: Date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function utcDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00Z`);
}

export function dayLabel(isoDate: string, today: string): string {
  if (isoDate === today) {
    return 'Today';
  }
  const yesterday = utcDate(today);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  if (isoDate === yesterday.toISOString().slice(0, 10)) {
    return 'Yesterday';
  }
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(
    utcDate(isoDate),
  );
}

export function monthName(month: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(utcDate(`${month}-01`));
}
