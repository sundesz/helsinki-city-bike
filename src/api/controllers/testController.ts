import { RequestHandler } from 'express';
import { Journey, Station } from '../../db/models';

const resetDatabase: RequestHandler = async (_req, res) => {
  await Journey.sync({ force: true });
  await Station.sync({ force: true });

  res.status(204).end();
};

export default { resetDatabase };
