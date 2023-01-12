export interface IListResponse<T> {
  totalItem: number;
  perPage: number;
  totalPage: number;
  currentPage: number;
  data: T[];
}

export type PageType = 'journey' | 'station';
export type JourneyType = 'departure' | 'return';

export interface IGetAllRequestQuery {
  page: number | void;
  orderBy: string | void;
  orderDir: string | void;
  filterName: string | void;
  filterValue: string | void;
}

export interface IOrderAndFilter {
  orderBy: string | void;
  orderDir: string | void;
  filterName: string | void;
  filterValue: string | void;
}

export type OrderDir = 'asc' | 'desc';
