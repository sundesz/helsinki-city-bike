import http from "http";
import app from "./app";
import { PORT } from "./config";

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
