import express, { Application, Request, Response } from 'express';
// import cors from 'cors';
import journeyRoutes from './api/routes/journeyRoutes';
import stationRoutes from './api/routes/stationRoutes';

const app: Application = express();

// app.use(
//   (cors as (options: cors.CorsOptions) => express.RequestHandler)({
//     credentials: true,
//     origin: 'http://localhost:5173',
//   })
// );
app.use(express.json());

app.get('/ping', (_req: Request, res: Response) => {
  res.send('pong');
});

app.use('/api/v1/journey', journeyRoutes);
app.use('/api/v1/station', stationRoutes);

export default app;
