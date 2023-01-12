export const JOURNEY_FIELDS = [
  'departure',
  'return',
  'departure station id',
  'departure station name',
  'return station id',
  'return station name',
  'covered distance (m)',
  'duration (sec.)',
];

export const JOURNEY_TABLE_FIELDS = [
  'departure_date_time',
  'departure_station_id',
  'departure_station_name',
  'return_date_time',
  'return_station_id',
  'return_station_name',
  'distance_covered',
  'duration',
];

export interface IJourneyAttribute {
  journeyId: string;
  departureDateTime: string;
  departureStationId: number;
  departureStationName: string;
  returnDateTime: string;
  returnStationId: number;
  returnStationName: string;
  distanceCovered: number;
  duration: number;
}

// defines the type of the object passed to Sequelize’s model.create
export type JourneyInputType = Omit<IJourneyAttribute, 'journeyId'>;

export interface IJourneyCSVRow {
  departure: unknown;
  return: unknown;
  'departure station id': unknown;
  'departure station name': unknown;
  'return station id': unknown;
  'return station name': unknown;
  'covered distance (m)': unknown;
  'duration (sec.)': unknown;
}

export interface INewJourneyField {
  departureStationId: unknown;
  departureDateTime: unknown;
  returnStationId?: unknown;
  returnDateTime?: unknown;
  distanceCovered?: unknown;
}

export type UpdateJourneyFieldType = Partial<
  Pick<INewJourneyField, 'departureStationId' | 'departureDateTime'>
> &
  Required<Omit<INewJourneyField, 'departureStationId' | 'departureDateTime'>>;

export interface INewJourney {
  departureStationId: number;
  departureDateTime: string;
  returnStationId: number;
  returnDateTime: string;
  distanceCovered: number;
}

export type UpdateJourneyType = Partial<
  Pick<INewJourney, 'departureStationId' | 'departureDateTime'>
> &
  Required<Omit<INewJourney, 'departureStationId' | 'departureDateTime'>>;
