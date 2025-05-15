// Adapter untuk date-fns v4 ke react-day-picker yang membutuhkan v2/v3
import * as dateFns from 'date-fns';

// Mengadaptasi fungsi date-fns v4 untuk kompatibilitas dengan react-day-picker
export const adapter = {
  // Core functions yang digunakan react-day-picker
  addDays: dateFns.add,
  format: dateFns.format,
  getMonth: (date: Date) => dateFns.getMonth(date),
  getYear: (date: Date) => dateFns.getYear(date),
  isAfter: dateFns.isAfter,
  isBefore: dateFns.isBefore,
  isEqual: dateFns.isEqual,
  isSameDay: dateFns.isSameDay,
  isSameMonth: dateFns.isSameMonth,
  setMonth: (date: Date, month: number) => {
    return dateFns.set(date, { month });
  },
  setYear: (date: Date, year: number) => {
    return dateFns.set(date, { year });
  },
  startOfWeek: dateFns.startOfWeek,
  endOfWeek: dateFns.endOfWeek,
  getWeeksInMonth: (date: Date) => {
    const start = dateFns.startOfMonth(date);
    const end = dateFns.endOfMonth(date);
    return Math.ceil(dateFns.differenceInDays(end, start) / 7);
  },
  startOfMonth: dateFns.startOfMonth,
  endOfMonth: dateFns.endOfMonth,
  getDate: (date: Date) => dateFns.getDate(date),
  getDaysInMonth: (date: Date) => dateFns.getDaysInMonth(date),
  parse: dateFns.parse,
};

export default adapter; 