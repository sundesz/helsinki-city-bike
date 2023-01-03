import { NextFunction, RequestHandler } from 'express';
import Journey from '../../db/models/journey_list';
import { getPagination, getPagingData } from './helper';

/**
 * Get all journey list
 * @param req
 * @param res
 * @param next
 */
const getAll: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const body = req.query as { page: string };
    const { limit, offset } = getPagination(Number(body.page));

    const data = await Journey.findAndCountAll({
      order: [['return', 'DESC']],
      offset,
      limit,
    });

    res.json(getPagingData(data, Number(body.page)));
  } catch (error) {
    next(error);
  }
};

export default {
  getAll,
};
