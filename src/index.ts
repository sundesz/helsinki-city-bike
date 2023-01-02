import http from 'http';
import app from './app';
import { PORT } from './config';
import { connectToDB } from './db';
import { listAllCSVFiles } from './utils';

const server = http.createServer(app);

export const SRC_DIR = __dirname;

const start = async () => {
  try {
    await connectToDB();
    await listAllCSVFiles();
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

void start();
