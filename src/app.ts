import express, { Application, Request, Response } from "express";

const app: Application = express();

app.use(express.json());

app.get("/ping", (_req: Request, res: Response) => {
  res.send("pong");
});

export default app;
