import http from 'http';
import app from './app';
import { PORT } from './config';
import { connectToDB } from './db';
import { logErrorMessage } from './utils';
import { listAllCSVFiles } from './utils/csv';

const server = http.createServer(app);

export const SRC_DIR = __dirname;

const start = async () => {
  try {
    await connectToDB();

    if (process.env.NODE_ENV !== 'test') {
      await listAllCSVFiles();
    }

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error: unknown) {
    logErrorMessage(error);
    // console.log(error);
  }
};

void start();
