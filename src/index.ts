import http from 'http';
import app from './app';
import { PORT } from './config';
import { connectToDB } from './db';

const server = http.createServer(app);

const start = async () => {
  try {
    await connectToDB();
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

void start();
