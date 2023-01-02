import { NextFunction, RequestHandler } from 'express';
import Station from '../../db/models/station_list';
import { getPagination, getPagingData } from './helper';

const getAll: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const body = req.query as { page: string };
    const { limit, offset } = getPagination(Number(body.page));

    const data = await Station.findAndCountAll({
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
