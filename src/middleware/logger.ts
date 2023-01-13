import fs from 'fs';
import path from 'path';
import { NextFunction, RequestHandler } from 'express';
import { SRC_DIR } from '..';

const fsPromises = fs.promises;

const logEvents = async (message: string, logFileName = '') => {
  const dateTime = new Date();

  logFileName = logFileName
    ? logFileName
    : dateTime.toISOString().substring(0, 10);

  const logItem = `${dateTime.toISOString()}\t${message}`;

  try {
    if (!fs.existsSync(path.join(SRC_DIR, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(SRC_DIR, '..', 'logs'));
    }

    await fsPromises.appendFile(
      path.join(SRC_DIR, '..', 'logs', `${logFileName}.log`),
      `\n${logItem}`
    );
  } catch (error) {
    console.log(error);
  }
};

const logger: RequestHandler = (req, _res, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  logEvents(`${req.method}\t{req.url}\t${req.headers.origin}`, 'reqLog');
  next();
};

export { logEvents, logger };
