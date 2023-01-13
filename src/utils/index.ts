import { logEvents } from '../middleware/logger';

import {
  INewJourney,
  INewJourneyField,
  UpdateJourneyFieldType,
  UpdateJourneyType,
} from '../types/journey';
import {
  INewStationField,
  NewStationType,
  UpdateStationFieldType,
  UpdateStationType,
} from '../types/station';

/**
 * Check if text is string
 * @param text
 * @returns
 */
const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

/**
 * Check if text is date
 * @param date
 * @returns
 */
const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

/**
 * Parse Date
 * @param date
 * @returns
 */
export const parseDate = (date: unknown, field = ''): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error(`${field ? field : date} is not a date`);
  }

  return date;
};

/**
 * Parse number
 * @param text
 * @returns
 */
export const parseNumber = (text: unknown, field = ''): number => {
  const num = Number(text);
  if (!text || Number.isNaN(num)) {
    throw new Error(`${field ? `${field} (${text})` : text} is not a number`);
  }

  return num;
};

/**
 * Parse string
 * @param text
 * @returns
 */
export const parseString = (text: unknown, field = ''): string => {
  if (!text || !isString(text)) {
    throw new Error(`${field ? field : text} is not a number`);
  }

  return text;
};

/**
 * Log error message to file
 * @param err
 */
export const logErrorMessage = (err: unknown | string) => {
  let errorMessage = '';
  if (err instanceof Error) {
    errorMessage = err.message;
  }

  if (typeof err === 'string') {
    errorMessage = err;
  }

  void (async () => {
    await logEvents(errorMessage);
  })();
};

/**
 * Return the correct type for journey update parameter
 * @param journey
 * @returns
 */
export const toNewJourney = (journey: INewJourneyField): INewJourney => {
  const departureStationId = parseNumber(
    journey.departureStationId,
    'departureStationId'
  );
  const departureDateTime = parseString(
    journey.departureDateTime,
    'departureDateTime'
  );

  return {
    departureStationId,
    departureDateTime,
    returnStationId: journey.returnStationId
      ? parseNumber(journey.returnStationId, 'returnStationId')
      : departureStationId,
    returnDateTime: journey.returnDateTime
      ? parseString(journey.returnDateTime, 'returnDateTime')
      : departureDateTime,
    distanceCovered: journey.distanceCovered
      ? parseNumber(journey.distanceCovered, 'distanceCovered')
      : 0,
  };
};

/**
 * Return the correct type for journey update parameter
 * @param journey
 * @returns
 */
export const toUpdateJourney = (
  journey: UpdateJourneyFieldType
): UpdateJourneyType => {
  const returnJourney: UpdateJourneyType = {
    returnStationId: parseNumber(journey.returnStationId, 'returnStationId'),
    returnDateTime: parseString(journey.returnDateTime, 'returnDateTime'),
    distanceCovered: parseNumber(journey.distanceCovered, 'distanceCovered'),
  };

  if (journey.departureStationId) {
    returnJourney.departureStationId = parseNumber(
      journey.departureStationId,
      'departureStationId'
    );
  }

  if (journey.departureDateTime) {
    returnJourney.departureDateTime = parseString(
      journey.departureDateTime,
      'departureDateTime'
    );
  }

  return returnJourney;
};

/**
 * Return the correct type for station new parameter
 * @param station
 */
export const toNewStation = (station: INewStationField): NewStationType => {
  const returnStation: NewStationType = {
    nameFi: parseString(station.nameFi, 'nameFi'),
    addressFi: parseString(station.addressFi, 'addressFi'),
    cityFi: parseString(station.cityFi, 'cityFi'),
    operator: parseString(station.operator, 'operator'),
    capacity: parseNumber(station.capacity, 'capacity'),
    posX: parseNumber(station.posX, 'posX'),
    posY: parseNumber(station.posY, 'posY'),
  };

  if (station.fid) {
    returnStation.fid = parseNumber(station.fid, 'fid');
  }

  if (station.nameEn) {
    returnStation.nameEn = parseString(station.nameEn, 'nameEn');
  }

  if (station.nameSe) {
    returnStation.nameSe = parseString(station.nameSe, 'nameSe');
  }

  if (station.addressSe) {
    returnStation.addressSe = parseString(station.addressSe, 'addressSe');
  }

  if (station.citySe) {
    returnStation.citySe = parseString(station.citySe, 'citySe');
  }

  return returnStation;
};

/**
 * Return the correct type for station update parameter
 * @param station
 */
export const toUpdateStation = (
  station: UpdateStationFieldType
): UpdateStationType => {
  const returnStation: UpdateStationType = {};

  if (station.nameFi) {
    (returnStation.nameFi = parseString(station.nameFi)), 'nameFi';
  }

  if (station.addressFi) {
    returnStation.addressFi = parseString(station.addressFi, 'addressFi');
  }

  if (station.cityFi) {
    returnStation.cityFi = parseString(station.cityFi, 'cityFi');
  }

  if (station.operator) {
    returnStation.operator = parseString(station.operator, 'operator');
  }

  if (station.capacity) {
    returnStation.capacity = parseNumber(station.capacity, 'capacity');
  }

  if (station.fid) {
    returnStation.fid = parseNumber(station.fid, 'fid');
  }

  if (station.nameEn) {
    returnStation.nameEn = parseString(station.nameEn, 'nameEn');
  }

  if (station.nameSe) {
    returnStation.nameSe = parseString(station.nameSe, 'nameSe');
  }

  if (station.addressSe) {
    returnStation.addressSe = parseString(station.addressSe, 'addressSe');
  }

  if (station.citySe) {
    returnStation.citySe = parseString(station.citySe, 'citySe');
  }

  return returnStation;
};
