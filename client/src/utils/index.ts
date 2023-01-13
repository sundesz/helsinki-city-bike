import { PageType } from '../types';

/**
 * Display second in hour
 * @param sec
 * @returns
 */
export const secondsToHour = (sec: number): string => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor((sec % 3600) % 60);

  const hDisplay = h > 0 ? `${h}h` : '';
  const mDisplay = m > 0 ? `${m}m` : '';
  const sDisplay = s > 0 ? `${s}s` : '';
  return `${hDisplay}${mDisplay}${sDisplay}`;
};

/**
 *
 * @param date
 * @returns
 */
export const getDateInLocal = (date: string) => {
  return new Intl.DateTimeFormat('fi-FI', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    timeZone: 'Europe/Helsinki',
  }).format(new Date(date));
};

/**
 *
 * @param meter
 * @returns
 */
export const meterToKm = (meter: number) => {
  return `${(meter / 1000).toFixed(2)} km`;
};

/**
 *
 * @param pageType
 * @param id
 * @returns
 */
export const getUrl = (pageType: PageType, id: string) => {
  return `/${pageType}/${id}`;
};

/**
 *
 * @param currentPage
 * @param totalPage
 * @returns
 */
export const generatePagination = (currentPage: number, totalPage: number) => {
  const pages: (number | string)[] = [];

  if (totalPage < 8) {
    // less than 7 pages
    for (let i = 1; i <= totalPage; i++) {
      pages.push(i);
    }
  } else {
    // Eg: 1 2 3(first part) ... 8 9 10(second part)
    let checkCondition: boolean;
    let initValue: number;
    let checkValue: number;

    // more than 7 pages
    // first part
    checkCondition = currentPage + 4 > totalPage;
    initValue = checkCondition
      ? 2
      : currentPage + 6 > totalPage
      ? currentPage - 2
      : currentPage;
    checkValue = checkCondition
      ? 5
      : currentPage + 6 > totalPage
      ? currentPage + 1
      : currentPage + 3;
    for (let i = initValue; i < checkValue; i++) {
      pages.push(i);
    }

    pages.push('...');

    // second part
    checkCondition = currentPage === totalPage;
    initValue = checkCondition ? totalPage - 2 : totalPage - 3;
    checkValue = checkCondition ? totalPage + 1 : totalPage;
    for (let j = initValue; j < checkValue; j++) {
      pages.push(j);
    }
  }

  return pages;
};

/**
 * Get date in second
 * @param date
 * @returns
 */
export const getDateInSecond = (date: string) => {
  return new Date(date).getTime() / 1000;
};
