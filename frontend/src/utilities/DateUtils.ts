
export function yyyymmdd(year: number, month: number, day: number) {
  return `${('0000' + year).slice(-4)}-${('00' + month).slice(-2)}-${('00' + day).slice(-2)}`
}

export function formatUtcYYYYMMDD(date: Date) {
  return yyyymmdd(date.getUTCFullYear(), date.getUTCMonth()+1, date.getUTCDate());
}
export function formatYYYYMMDD(date: Date) {
  return yyyymmdd(date.getFullYear(), date.getMonth()+1, date.getDate());
}

export function formatDateForDay(date: string) {
  const d = new Date(date);
  const dayOfWeek = getFullDayOfWeek(d.getUTCDay());
  const month = getMonthString(d.getUTCMonth()+1);
  return `${dayOfWeek}, ${month} ${d.getUTCDate()}`;
}

export function extractYear(date: string)  { return parseInt(date.split('-')[0], 10); }
export function extractMonth(date: string) { return parseInt(date.split('-')[1], 10); }
export function extractDay(date: string)   { return parseInt(date.split('-')[2], 10); }

export function getMonthString(month: number) {
  switch (month) {
    case 1: return 'January';
    case 2: return 'February';
    case 3: return 'March';
    case 4: return 'April';
    case 5: return 'May';
    case 6: return 'June';
    case 7: return 'July';
    case 8: return 'August';
    case 9: return 'September';
    case 10: return 'October';
    case 11: return 'November';
    case 12: return 'December';
  }
}

export function getDayOfWeek(dow: number) {
  switch (dow) {
    case 0: return 'Su';
    case 1: return 'Mo';
    case 2: return 'Tu';
    case 3: return 'We';
    case 4: return 'Th';
    case 5: return 'Fr';
    case 6: return 'Sa';
  }
}

export function getFullDayOfWeek(dow: number) {
  switch (dow) {
    case 0: return 'Sunday';
    case 1: return 'Monday';
    case 2: return 'Tuesday';
    case 3: return 'Wednesday';
    case 4: return 'Thursday';
    case 5: return 'Friday';
    case 6: return 'Saturday';
  }
}

export function getNumDays(month: number, year: number) {
  switch (month) {
    case 9:
    case 4:
    case 6:
    case 11:
      return 30;

    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31;

    case 2:
      return year % 4 === 0 ? 29 : 28;
  }
  return 0;
}

/** Start and end are both inclusive to the generated range. */
export function generateDateRange(startDate: string, endDate: string) {
  const [startYear, startMonth, startDay] = startDate.split('-').map(n => parseInt(n, 10));
  const [endYear, endMonth, endDay] = endDate.split('-').map(n => parseInt(n, 10));
  const dates = [];
  for (let y = startYear; y <= endYear; y++) {
    for (
      let m = (y === startYear ? startMonth : 1);
      m <= (y === endYear ? endMonth : 12);
      m++
    ) {
      for (
        let d = ((y === startYear && m === startMonth) ? startDay : 1);
        d <= ((y === endYear && m === endMonth) ? endDay : getNumDays(m, y));
        d++
      ) {
        dates.push(yyyymmdd(y, m, d));
      }
    }
  }
  return dates;
}
