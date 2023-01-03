import { IJourneyAttribute } from '../../types/journey';
import { IStationAttribute } from '../../types/station';

const LIMIT = 50;

export const getPagination = (page: number) => {
  page = Number.isNaN(page) ? 0 : page;
  const offset = page <= 1 ? 0 : (page - 1) * LIMIT;
  return { limit: LIMIT, offset };
};

export const getPagingData = (
  data: { count: number; rows: (IJourneyAttribute | IStationAttribute)[] },
  page: number
) => {
  const { count: totalItems, rows: journeys } = data;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalItems / LIMIT);

  return { totalItems, journeys, totalPages, currentPage };
};
