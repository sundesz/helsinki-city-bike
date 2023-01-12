export interface IBaseStation {
  stationId: number;
  nameFi: string;
}

export interface IStationExtraInfo {
  totalJourney: number; // total journey made from the station
  avgDistance: number; // average distance covered from the station
}

export type ITopStation = IBaseStation & {
  totalJourney: number; // total journey made from the station
};

interface ILocationCoordinate {
  posX: number;
  posY: number;
}

interface IOperatorAndCapacity {
  operator: string;
  capacity: number;
}

interface IDate {
  createdAt?: string;
  updatedAt?: string;
}

export type IStation = IBaseStation &
  ILocationCoordinate &
  Partial<IOperatorAndCapacity> &
  IDate & {
    addressFi: string;
    cityFi: string;

    departureStation?: IStationExtraInfo;
    returnStation?: IStationExtraInfo;

    top5Departure?: ITopStation[];
    top5Return?: ITopStation[];
  };

export const StationOrder = {
  'Station id': 'station_id',
  Name: 'name_fi',
  Address: 'address_fi',
  City: 'city_fi',
};

export interface IStationResponse {
  station: IStation;
}

export type NewStationRequestQueryType = Omit<IStation, 'stationId'>;
