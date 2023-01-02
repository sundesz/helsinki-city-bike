import { NextFunction, RequestHandler } from 'express';
import Journey from '../../db/models/journey_list';
import { getPagination, getPagingData } from './helper';

const get: RequestHandler = async (req, res, next: NextFunction) => {
  const { id: journeyId } = req.params as { id: string };
  try {
    const journeyData = await Journey.findByPk(journeyId);
    if (journeyData) {
      res.json({ data: journeyData });
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
};

const getAll: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const body = req.query as { page: string };
    const { limit, offset } = getPagination(Number(body.page));

    const data = await Journey.findAndCountAll({
      offset,
      limit,
    });

    res.json(getPagingData(data, Number(body.page)));
  } catch (error) {
    next(error);
  }
};

export default {
  get,
  getAll,
};
