import http from 'http';
import app from './app';
import { PORT } from './config';
// import { connectToDB } from './db';
import fs, { opendirSync } from 'fs';
import readline from 'readline';
import { FileTypes } from './types';
import { getFileType, parseRow } from './utils';

const server = http.createServer(app);

// fileName with path
const readFile = (fileName: string) => {
  const stream = fs.createReadStream(fileName);
  const rl = readline.createInterface({ input: stream });

  const data: string[][] = [];
  let firstLine = true;
  let fileType: FileTypes | undefined = undefined;

  rl.on('line', (row) => {
    if (firstLine) {
      fileType = getFileType(row);
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
    console.log(data.length);
    console.log(fileName);
    console.log(fileType);
    firstLine = true;

    // fs.unlink(fileName, (err) => {
    //   if (err) {
    //     throw err;
    //   }

    //   console.log('Delete File successfully.');
    // });
  });
};

const listAllCSVFiles = async () => {
  const PATH_FOR_DATA = './src/data';
  const dir = opendirSync(PATH_FOR_DATA);

  for await (const entry of dir) {
    if (entry.isFile() && entry.name.endsWith('.csv')) {
      // console.log('Found File: ', entry.name);
      readFile(`${PATH_FOR_DATA}/${entry.name}`);
    }
  }
};

const start = async () => {
  try {
    // await connectToDB();
    await listAllCSVFiles();
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

void start();
