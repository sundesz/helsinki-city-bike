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

// export interface IStation {
//   fid: unknown;
//   id: unknown;
//   nimi: unknown;
//   namn: unknown;
//   name: unknown;
//   osoite: unknown;
//   adress: unknown;
//   kaupunki: unknown;
//   stad: unknown;
//   operaattor: unknown;
//   kapasiteet: unknown;
//   x: unknown;
//   y: unknown;
// }

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

export type StationInputType = Omit<IStationAttribute, 'stationId'>;
