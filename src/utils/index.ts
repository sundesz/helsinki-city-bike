import fs, { opendirSync } from 'fs';
import readline from 'readline';
import { SRC_DIR } from '..';
import { sequelize } from '../db';
import ImportCsv from '../db/models/import_csv';
import { logEvents } from '../middleware/logger';
import { FileTypes } from '../types';
import { JourneyInputType, JOURNEY_FIELDS } from '../types/journey';
import { StationInputType, STATION_FIELDS } from '../types/station';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error(`Invalid or missing date: ${date}`);
  }

  return date;
};

export const parseNumber = (text: unknown): number => {
  const num = Number(text);
  if (!text || Number.isNaN(num)) {
    throw new Error(`${text} is not a number`);
  }

  return num;
};

export const parseString = (text: unknown): string => {
  if (!text || !isString(text)) {
    throw new Error('not a string');
  }

  return text;
};

/**
 * Get CSV file type. Is it Journey file or Station File?
 * @param line
 * @returns
 */
export const getFileType = (line: string): FileTypes | undefined => {
  const fields = line.toLowerCase().trim();
  switch (true) {
    case fields === JOURNEY_FIELDS.join(','):
      return 'journey';
    case fields === STATION_FIELDS.join(','):
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
  row: string
): StationInputType | JourneyInputType | null => {
  try {
    // https://stackoverflow.com/questions/23582276/split-string-by-comma-but-ignore-commas-inside-quotes
    const record = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    if (fileType === 'journey') {
      return parseJourneyFile(record);
    }

    if (fileType === 'station') {
      return parseStationFile(record);
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
const parseStationFile = (record: string[]): StationInputType | null => {
  if (record.length !== STATION_FIELDS.length) {
    return null;
  }

  try {
    const stationRecord = {
      stationId: parseNumber(record[1]),
      fid: parseNumber(record[0]),
      nameEn: parseString(record[2]),
      nameFi: parseString(record[3]),
      nameSe: parseString(record[4]),
      addressFi: parseString(record[5]),
      addressSe: parseString(record[6]),
      cityFi: parseString(record[7]),
      citySe: parseString(record[8]),
      operator: parseString(record[9]),
      capacity: parseNumber(record[10]),
      posX: parseNumber(record[11]),
      posY: parseNumber(record[12]),
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
const parseJourneyFile = (record: string[]): JourneyInputType | null => {
  try {
    if (record.length !== JOURNEY_FIELDS.length) {
      return null;
    }

    const distanceCovered = Number(record[6]);
    const duration = Number(record[7]);

    // Don't import journeys that covered distances shorter than 10 meters
    if (distanceCovered < 10) {
      return null;
    }
    // Don't import journeys that lasted for less than ten seconds
    if (duration < 10) {
      return null;
    }

    const journeyRecord = {
      departure: parseDate(record[0]),
      departureStationId: parseNumber(record[2]),
      departureStationName: parseString(record[3]),
      return: parseDate(record[1]),
      returnStationId: parseNumber(record[4]),
      returnStationName: parseString(record[5]),
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

// Set the batch size
const batchSize = 100;

// Set the counter to 0
let i = 0;

// Create a function to insert the next batch of rows
export const insertBatchJourney = (data) => {
  // Create a new array with the next batch of rows
  const batch: JourneyInputType[] = data.slice(i, i + batchSize);
  // Increment the counter by the batch size
  i += batchSize;

  // Insert the rows
  return sequelize
    .query(
      `INSERT INTO "journey_list" ("departure","departure_station_id","departure_station_name","return","return_station_id","return_station_name","distance_covered","duration") VALUES ${batch
        .map(() => '(?, ?, ?, ?, ?, ?, ?, ?)')
        .join(',')}`,
      { replacements: batch.flatMap((row) => Object.values(row)) }
    )
    .then(() => {
      // Check if there are more rows to insert
      if (i < data.length) {
        // Insert the next batch
        return insertBatchJourney(data);
      }
    });
};

// Create a function to insert the next batch of rows
export const insertBatchStation = (data) => {
  // Create a new array with the next batch of rows
  const batch: StationInputType[] = data.slice(i, i + batchSize);
  // Increment the counter by the batch size
  i += batchSize;

  // Insert the rows
  return sequelize
    .query(
      `INSERT INTO "station_list" ("station_id", "fid", "name_en","name_fi","name_se","address_fi","address_se","city_fi","city_se","operator","capacity","pos_x","pos_y") VALUES ${batch
        .map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .join(',')}`,
      { replacements: batch.flatMap((row) => Object.values(row)) }
    )
    .then(() => {
      // Check if there are more rows to insert
      if (i < data.length) {
        // Insert the next batch
        return insertBatchStation(data);
      }
    });
};

export const isFileAlreadyImport = async (
  fileName: string,
  fileType: FileTypes
) => {
  const alreadyImported = await ImportCsv.count({
    where: { fileName, fileType },
  });

  return alreadyImported;
};

// fileName with path
const readFile = (fileName: string) => {
  const stream = fs.createReadStream(fileName);
  const rl = readline.createInterface({ input: stream });

  const data: (StationInputType | JourneyInputType)[] = [];

  let firstLine = true;
  let fileType: FileTypes | undefined = undefined;
  // let isError = false;
  // let fileAlreadyImported = false;

  rl.on('line', (row) => {
    if (firstLine) {
      fileType = getFileType(row);

      // if (fileType) {
      //   fileAlreadyImported = Boolean(
      //     await isFileAlreadyImport(fileName, fileType)
      //   );
      // }
      firstLine = false;
      return;
    }

    if (fileType === undefined) {
      return;
    }

    const parsedRow = parseRow(fileType, row);

    if (parsedRow) {
      data.push(parsedRow);
    }
  });

  rl.on('close', () => {
    firstLine = true;
    if (fileType) {
      void (async () => {
        try {
          // Start the insertion
          if (fileType === 'journey') {
            insertBatchJourney(data)
              .then(() => {
                // console.log('Rows inserted successfully');
              })
              .catch((error: unknown) => {
                logErrorMessage(error);
              });
          }

          if (fileType === 'station') {
            insertBatchStation(data)
              .then(() => {
                // console.log('Rows inserted successfully');
              })
              .catch((error: unknown) => {
                logErrorMessage(error);
              });
          }

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
    }
  });
};

export const listAllCSVFiles = async () => {
  const PATH_FOR_DATA = `${SRC_DIR}/data`;
  const dir = opendirSync(PATH_FOR_DATA);

  for await (const entry of dir) {
    if (entry.isFile() && entry.name.endsWith('.csv')) {
      // console.log('Found File: ', entry.name);
      readFile(`${PATH_FOR_DATA}/${entry.name}`);
    }
  }
};

const logErrorMessage = (err: unknown) => {
  if (err instanceof Error) {
    void (async () => {
      await logEvents(err.message);
    })();
  }
};
