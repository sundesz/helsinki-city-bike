import express, { Application, Request, Response } from 'express';
import journeyRoutes from './api/routes/journeyRoutes';
import stationRoutes from './api/routes/stationRoutes';

const app: Application = express();

app.use(express.json());

app.get('/ping', (_req: Request, res: Response) => {
  res.send('pong');
});

app.use('/journey', journeyRoutes);
app.use('/station', stationRoutes);

export default app;
