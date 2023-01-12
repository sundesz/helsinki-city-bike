export interface IJourney {
  journeyId: string;
  departureDateTime: string;
  departureStationId: number;
  departureStationName: string;
  returnDateTime: string;
  returnStationId: number;
  returnStationName: string;
  distanceCovered: number;
  duration: string;
}

export const JourneyOrder = {
  'Departure station': 'departure_station_name',
  'Departure datetime': 'departure_date_time',
  'Return station': 'return_station_name',
  'Return datetime': 'return_date_time',
  Distance: 'distance_covered',
  Duration: 'duration',
};

export interface IJourneyDetail {
  stationId: string;
  dateTime: string;
}

export interface INewJourneyRequestQuery {
  departureDetail: IJourneyDetail;
  returnDetail: IJourneyDetail;
  distanceCovered: number;
}

export interface IJourneyResponse {
  journey: IJourney;
}
