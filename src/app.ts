import express, { Application, Request, Response } from 'express';
// import cors from 'cors';
import journeyRouter from './api/routes/journeyRoutes';
import stationRouter from './api/routes/stationRoutes';
import testRouter from './api/routes/testRoutes';
import { errorHandler, unknownEndpoint } from './middleware';

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

app.use('/api/v1/journey', journeyRouter);
app.use('/api/v1/station', stationRouter);

if (process.env.NODE_ENV === 'test') {
  app.use('/api/v1/test', testRouter);
}

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
