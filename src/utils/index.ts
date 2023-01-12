import fs, { opendirSync } from 'fs';
import { parse, ParserHeaderArray } from 'fast-csv';
import { SRC_DIR } from '..';
import { sequelize } from '../db';
import ImportCsv from '../db/models/import_csv';
import { logEvents } from '../middleware/logger';
import { FileTypes } from '../types';
import {
  IJourneyCSVRow,
  INewJourney,
  INewJourneyField,
  JourneyInputType,
  JOURNEY_FIELDS,
  JOURNEY_TABLE_FIELDS,
  UpdateJourneyFieldType,
  UpdateJourneyType,
} from '../types/journey';
import {
  INewStationField,
  IStationCSVRow,
  NewStationType,
  StationInputType,
  STATION_FIELDS,
  STATION_TABLE_FIELDS,
  UpdateStationFieldType,
  UpdateStationType,
} from '../types/station';

// Set the batch size
const batchSize = 100;

// Set the counter to 0
let i = 0;

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
const parseDate = (date: unknown, field = ''): string => {
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
    throw new Error(`${field ? field : text} is not a number`);
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
 * Get CSV file type. Is it Journey file or Station File?
 * @param header
 * @returns
 */
export const getFileType = (
  header: ParserHeaderArray
): FileTypes | undefined => {
  const headerString = header.toString();

  switch (true) {
    case headerString === JOURNEY_FIELDS.toString():
      return 'journey';
    case headerString === STATION_FIELDS.toString():
      return 'station';
    default:
      return undefined;
  }
};

/**
 * Parse CSV row
 * @param fileType
 * @param row
 * @returns
 */
export const parseRow = (
  fileType: FileTypes,
  row: IJourneyCSVRow | IStationCSVRow
): StationInputType | JourneyInputType | null => {
  try {
    if (fileType === 'journey') {
      return parseJourneyFile(row as IJourneyCSVRow);
    }

    if (fileType === 'station') {
      return parseStationFile(row as IStationCSVRow);
    }

    return null;
  } catch (error: unknown) {
    logErrorMessage(error);
    return null;
  }
};

/**
 * Parse Station CSV file
 * @param record
 * @returns
 */
export const parseStationFile = (
  record: IStationCSVRow
): StationInputType | null => {
  try {
    const stationRecord = {
      stationId: parseNumber(record.id, 'id'),
      fid: parseNumber(record.fid, 'fid'),
      nameEn: parseString(record.name, 'name'),
      nameFi: parseString(record.nimi, 'nimi'),
      nameSe: parseString(record.namn, 'namn'),
      addressFi: parseString(record.osoite, 'osoite'),
      addressSe: parseString(record.adress, 'adress'),
      cityFi: parseString(record.kaupunki, 'kaupunki'),
      citySe: parseString(record.stad, 'stad'),
      operator: parseString(record.operaattor, 'operaattor'),
      capacity: parseNumber(record.kapasiteet, 'kapasiteet'),
      posX: parseNumber(record.x, 'x'),
      posY: parseNumber(record.y, 'y'),
    };

    return stationRecord;
  } catch (error: unknown) {
    logErrorMessage(error);
    return null;
  }
};

/**
 * Parse Journey CSV file
 * @param record
 * @returns
 */
const parseJourneyFile = (record: IJourneyCSVRow): JourneyInputType | null => {
  try {
    const distanceCovered = parseNumber(
      Number(record['covered distance (m)']),
      'covered distance (m)'
    );
    const duration = parseNumber(
      Number(record['duration (sec.)']),
      'duration (sec.)'
    );

    // Don't import journeys that covered distances shorter than 10 meters
    if (distanceCovered < 10) {
      return null;
    }
    // Don't import journeys that lasted for less than ten seconds
    if (duration < 10) {
      return null;
    }

    const journeyRecord = {
      departureDateTime: parseDate(record.departure, 'departure'),
      departureStationId: parseNumber(
        record['departure station id'],
        'departure station id'
      ),
      departureStationName: parseString(
        record['departure station name'],
        'departure station name'
      ),
      returnDateTime: parseDate(record.return, 'return'),
      returnStationId: parseNumber(
        record['return station id'],
        'return station id'
      ),
      returnStationName: parseString(
        record['return station name'],
        'return station name'
      ),
      distanceCovered,
      duration,
    };

    return journeyRecord;
  } catch (error: unknown) {
    logErrorMessage(error);
    return null;
  }
};

/**
 * Delete file
 * @param fileName
 */
const deleteFile = (fileName: string): void => {
  fs.unlink(fileName, (err) => {
    if (err) {
      throw err;
    }
  });
};

/**
 * Get table name, table fields and column template to insert row in database
 * @param fileType
 * @returns
 */
const getTableNameAndField = (fileType: FileTypes) => {
  let tableName: string;
  let tableFields: string;
  let insertTemplate: string;

  if (fileType === 'journey') {
    tableName = 'journey_list';
    tableFields = `"${JOURNEY_TABLE_FIELDS.join('","')}"`;
    insertTemplate = JOURNEY_TABLE_FIELDS.map(() => '?').toString();
  } else {
    tableName = 'station_list';
    tableFields = `"${STATION_TABLE_FIELDS.join('","')}"`;
    insertTemplate = STATION_TABLE_FIELDS.map(() => '?').toString();
  }

  return { tableName, tableFields, insertTemplate };
};

/**
 * A function to insert the next batch of rows
 * @param fileType
 * @param data
 * @returns
 */
export const insertBatch = (fileType: FileTypes, data) => {
  const { tableName, tableFields, insertTemplate } =
    getTableNameAndField(fileType);

  // Create a new array with the next batch of rows
  const batch: StationInputType[] = data.slice(i, i + batchSize);
  // Increment the counter by the batch size
  i += batchSize;

  // Insert the rows
  return sequelize
    .query(
      `INSERT INTO "${tableName}" (${tableFields}) VALUES ${batch
        .map(() => `(${insertTemplate})`)
        .join(',')}`,
      { replacements: batch.flatMap((row) => Object.values(row)) }
    )
    .then(() => {
      // Check if there are more rows to insert
      if (i < data.length) {
        // Insert the next batch
        return insertBatch(fileType, data);
      }
    });
};

/**
 * Check i file is already import or not
 * @param fileName
 * @param fileType
 * @returns
 */
export const isFileAlreadyImport = async (
  fileName: string,
  fileType: FileTypes
) => {
  const alreadyImported = await ImportCsv.count({
    where: { fileName, fileType },
  });

  return alreadyImported;
};

/**
 * Parse csv file and insert the row to database
 * @param fileName
 */
export const readFile = (fileName: string) => {
  const data: (StationInputType | JourneyInputType)[] = [];
  let fileType: FileTypes | undefined = undefined;

  fs.createReadStream(fileName)
    .pipe(
      parse({
        headers: (headers) => {
          headers = headers.map((h) => h?.toLowerCase());
          fileType = getFileType(headers);
          return headers;
        },
      })
    )
    .on('error', (error) => console.log(error))
    .on('data', (row) => {
      if (fileType === undefined) {
        return;
      }
      const parsedRow = parseRow(fileType, row);

      if (parsedRow) {
        data.push(parsedRow);
      }
    })

    .on('end', () => {
      if (fileType === undefined) return;

      void (async () => {
        try {
          // Start the insertion
          insertBatch(fileType, data)
            .then(() => {
              // console.log('Rows inserted successfully');
            })
            .catch((error: unknown) => {
              logErrorMessage(error);
            });

          await ImportCsv.create({
            fileName,
            fileType: typeof fileType === 'undefined' ? 'undefined' : fileType,
            isSuccess: true,
          });

          deleteFile(fileName);
        } catch (error: unknown) {
          logErrorMessage(error);
        }
      })();
    });
};

/**
 * List all csv file from the "src/data" directory to parse
 */
export const listAllCSVFiles = async () => {
  const PATH_FOR_DATA = `${SRC_DIR}/data`;
  const dir = opendirSync(PATH_FOR_DATA);

  for await (const entry of dir) {
    if (entry.isFile() && entry.name.endsWith('.csv')) {
      readFile(`${PATH_FOR_DATA}/${entry.name}`);
    }
  }
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
 *
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
 *
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
 *
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
 *
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
