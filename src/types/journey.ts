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

export interface IJourneyAttribute {
  journeyId: string;
  departure: string;
  departureStationId: number;
  departureStationName: string;
  return: string;
  returnStationId: number;
  returnStationName: string;
  distanceCovered: number;
  duration: number;
}

// defines the type of the object passed to Sequelize’s model.create
export type JourneyInputType = Omit<IJourneyAttribute, 'journeyId'>;

// export interface IJourney {
//   departure: unknown;
//   return: unknown;
//   departure_station_id: unknown;
//   departure_station_name: unknown;
//   return_station_id: unknown;
//   return_station_name: unknown;
//   covered_distance: unknown;
//   duration: unknown;
// }
