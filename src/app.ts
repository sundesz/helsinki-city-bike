import express, { Application, Request, Response } from 'express';
// import cors from 'cors';
import journeyRouter from './api/routes/journeyRoutes';
import stationRouter from './api/routes/stationRoutes';
import testRouter from './api/routes/testRoutes';
import generalRouter from './api/routes';
import { errorHandler, unknownEndpoint } from './middleware';

const app: Application = express();

// app.use(
//   (cors as (options: cors.CorsOptions) => express.RequestHandler)({
//     credentials: true,
//     origin: 'http://localhost:5173',
//   })
// );
app.use(express.json());
app.use(express.static('dist'));

app.get('/', (_req: Request, res: Response) => {
  res.send('<h1>Project HSL Bike app</h1>');
});

app.use('/api/v1/journey', journeyRouter);
app.use('/api/v1/station', stationRouter);
app.use('/api/v1/', generalRouter);

if (process.env.NODE_ENV === 'test') {
  app.use('/api/v1/test', testRouter);
}

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
