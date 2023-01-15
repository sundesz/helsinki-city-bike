import fs, { opendirSync } from 'fs';
import { parse, ParserHeaderArray } from 'fast-csv';

import path from 'path';

import { SRC_DIR } from '..';
import { sequelize } from '../db';
import ImportCsv from '../db/models/import_csv';
import { FileTypes } from '../types';
import {
  IJourneyCSVRow,
  JourneyInputType,
  JOURNEY_FIELDS,
  JOURNEY_TABLE_FIELDS,
} from '../types/journey';
import {
  IStationCSVRow,
  StationInputType,
  STATION_FIELDS,
  STATION_TABLE_FIELDS,
} from '../types/station';
import { logErrorMessage, parseNumber, parseString } from '.';
import { QueryTypes } from 'sequelize';

// Set the batch size for csv rows
const batchSize = 100;

// Set the counter to 0 for batch update
let i = 0;

/**
 * A function to insert the of rows to database
 * @param fileType
 * @param data
 * @returns
 */
export const insertBatch = async (fileType: FileTypes, data) => {
  const { tableName, tableFields, insertTemplate, conflictTemplate } =
    getTableNameAndField(fileType);

  // Create a new array with the next batch of rows
  const batch: StationInputType[] = data.slice(i, i + batchSize);
  // Increment the counter by the batch size
  i += batchSize;

  // insert rows
  await sequelize.query(
    `INSERT INTO "${tableName}" (${tableFields}) VALUES ${
      batch.map(() => `(${insertTemplate})`).join(',') + conflictTemplate
    }`,
    { replacements: batch.flatMap((row) => Object.values(row)) }
  );

  // if condition match call function again
  if (i < data.length) {
    await insertBatch(fileType, data);
  }
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
      record['covered distance (m)'],
      'covered distance (m)'
    );
    const duration = parseNumber(record['duration (sec.)'], 'duration (sec.)');

    // Don't import journeys that covered distances shorter than 10 meters
    if (distanceCovered < 10) {
      return null;
    }
    // Don't import journeys that lasted for less than ten seconds
    if (duration < 10) {
      return null;
    }

    const journeyRecord = {
      departureDateTime: parseString(record.departure, 'departure'),
      departureStationId: parseNumber(
        record['departure station id'],
        'departure station id'
      ),
      departureStationName: parseString(
        record['departure station name'],
        'departure station name'
      ),
      returnDateTime: parseString(record.return, 'return'),
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
  let conflictTemplate = '';

  if (fileType === 'journey') {
    tableName = 'journey_list';
    tableFields = `"${JOURNEY_TABLE_FIELDS.join('","')}"`;
    insertTemplate = JOURNEY_TABLE_FIELDS.map(() => '?').toString();
  } else {
    tableName = 'station_list';
    tableFields = `"${STATION_TABLE_FIELDS.join('","')}"`;
    insertTemplate = STATION_TABLE_FIELDS.map(() => '?').toString();
    conflictTemplate = ' ON CONFLICT (station_id) DO NOTHING;';
  }

  return { tableName, tableFields, insertTemplate, conflictTemplate };
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
          console.log(`Start to read ${fileName}`);
          headers = headers.map((h) => h?.toLowerCase());
          fileType = getFileType(headers);
          return headers;
        },
      })
    )
    .on('error', (error: unknown) => {
      logErrorMessage(error);
      console.log(error);
    })
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
          await insertBatch(fileType, data);

          await ImportCsv.create({
            fileName,
            fileType: typeof fileType === 'undefined' ? 'undefined' : fileType,
            isSuccess: true,
          });

          if (fileType === 'station') {
            await resetSeqForJourney();
          }

          deleteFile(fileName);
          console.log(`End to read ${fileName}`);
        } catch (error: unknown) {
          if (error instanceof Error) {
            logErrorMessage(`${fileName} - ${error}`);
          }
          console.log(error);
        }
      })();
    });
};

/**
 * List all csv file from the "src/data" directory to parse
 */
export const listAllCSVFiles = async () => {
  const fsPromises = fs.promises;

  if (!fs.existsSync(path.join(SRC_DIR, '..', 'data'))) {
    await fsPromises.mkdir(path.join(SRC_DIR, '..', 'data'));
  }

  const PATH_FOR_DATA = `${SRC_DIR}/../data`;
  const dir = opendirSync(PATH_FOR_DATA);

  for await (const entry of dir) {
    if (entry.isFile() && entry.name.endsWith('.csv')) {
      // TODO:: Before read file check if file is already read (get data from 'import_csv_list' table)
      readFile(`${PATH_FOR_DATA}/${entry.name}`);
    }
  }
};

/**
 * Reset sequence number for station_list
 * @returns
 */
export const resetSeqForJourney = async () => {
  const record: undefined | { station_id: number }[] = await sequelize.query(
    `SELECT station_id from station_list order by station_id desc limit 1;`,
    {
      type: QueryTypes.SELECT,
    }
  );

  if (record === undefined) {
    return;
  }

  await sequelize.query(
    `SELECT SETVAL('station_list_station_id_seq', ${record[0].station_id}, true);`
  );
};
