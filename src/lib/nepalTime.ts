// Nepal Timezone utility (UTC+5:45)
const NEPAL_OFFSET = 5 * 60 + 45; // 5 hours 45 minutes in minutes

export function getNepalTime(date: Date = new Date()): Date {
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  return new Date(utc + (NEPAL_OFFSET * 60000));
}

export function formatNepalDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const nepal = getNepalTime(d);
  
  const year = nepal.getFullYear();
  const month = String(nepal.getMonth() + 1).padStart(2, '0');
  const day = String(nepal.getDate()).padStart(2, '0');
  const hours = String(nepal.getHours()).padStart(2, '0');
  const minutes = String(nepal.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function formatNepalDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const nepal = getNepalTime(d);
  
  const year = nepal.getFullYear();
  const month = String(nepal.getMonth() + 1).padStart(2, '0');
  const day = String(nepal.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

export function formatNepalTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const nepal = getNepalTime(d);
  
  let hours = nepal.getHours();
  const minutes = String(nepal.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  
  return `${hours}:${minutes} ${ampm}`;
}

export function formatNepalDateReadable(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const nepal = getNepalTime(d);
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const day = nepal.getDate();
  const month = months[nepal.getMonth()];
  const year = nepal.getFullYear();
  
  return `${day} ${month} ${year}`;
}

export function getNepalTimestamp(): string {
  return new Date().toISOString();
}

// Get today's date in Nepal timezone as YYYY-MM-DD string
export function getNepalTodayString(): string {
  const nepal = getNepalTime();
  const year = nepal.getFullYear();
  const month = String(nepal.getMonth() + 1).padStart(2, '0');
  const day = String(nepal.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get a date N days ago in Nepal timezone as YYYY-MM-DD string
export function getNepalDateDaysAgo(days: number): string {
  const nepal = getNepalTime();
  nepal.setDate(nepal.getDate() - days);
  const year = nepal.getFullYear();
  const month = String(nepal.getMonth() + 1).padStart(2, '0');
  const day = String(nepal.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get transaction date in Nepal timezone for comparison
export function getTransactionDateInNepal(isoString: string): string {
  const d = new Date(isoString);
  const nepal = getNepalTime(d);
  const year = nepal.getFullYear();
  const month = String(nepal.getMonth() + 1).padStart(2, '0');
  const day = String(nepal.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = getNepalTime();
  const compareDate = getNepalTime(d);
  
  return (
    today.getDate() === compareDate.getDate() &&
    today.getMonth() === compareDate.getMonth() &&
    today.getFullYear() === compareDate.getFullYear()
  );
}
