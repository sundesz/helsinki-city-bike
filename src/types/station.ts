export const STATION_FIELDS = [
  'fid',
  'id',
  'nimi',
  'namn',
  'name',
  'osoite',
  'adress',
  'kaupunki',
  'stad',
  'operaattor',
  'kapasiteet',
  'x',
  'y',
];

export const STATION_TABLE_FIELDS = [
  'station_id',
  'fid',
  'name_en',
  'name_fi',
  'name_se',
  'address_fi',
  'address_se',
  'city_fi',
  'city_se',
  'operator',
  'capacity',
  'pos_x',
  'pos_y',
];

export interface IStationCSVRow {
  fid: unknown;
  id: unknown;
  nimi: unknown;
  namn: unknown;
  name: unknown;
  osoite: unknown;
  adress: unknown;
  kaupunki: unknown;
  stad: unknown;
  operaattor: unknown;
  kapasiteet: unknown;
  x: unknown;
  y: unknown;
}

export interface IStationAttribute {
  stationId: number;
  fid: number;
  nameEn: string;
  nameFi: string;
  nameSe: string;
  addressFi: string;
  addressSe: string;
  cityFi: string;
  citySe: string;
  operator: string;
  capacity: number;
  posX: number;
  posY: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface INewStation {
  fid?: unknown;
  nameEn?: unknown;
  nameFi: unknown;
  nameSe?: unknown;
  addressFi: unknown;
  addressSe?: unknown;
  cityFi: unknown;
  citySe?: unknown;
  operator?: unknown;
  capacity: unknown;
  posX: unknown;
  posY: unknown;
}

export type StationInputType = Omit<IStationAttribute, 'stationId'>;
