import { NextFunction, RequestHandler } from 'express';
import { Op } from 'sequelize';
import Journey from '../../db/models/journey_list';
import Station from '../../db/models/station_list';
import { INewJourney } from '../../types/journey';
import { getDateInSecond, getPagination, getPagingData } from './helper';

/**
 * Get a data of a station
 * @param req
 * @param res
 * @param next
 */
const getOne: RequestHandler = async (req, res, next: NextFunction) => {
  const { id: journeyId } = req.params as { id: string };
  try {
    const journeyData = await Journey.findByPk(journeyId, {});

    if (journeyData) {
      res.json({
        data: journeyData,
      });
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get all journey list
 * @param req
 * @param res
 * @param next
 */
const getAll: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const body = req.query as {
      page: string;
      name: string;
      value: string;
      orderBy: string;
      orderDir: string;
    };
    const { limit, offset } = getPagination(Number(body.page));

    const whereColumnName = body.name;
    const whereValue = body.value;
    const orderBy = body.orderBy;
    const orderDir = body.orderDir;

    let where = {};
    let order: [[string, string]] = [['returnDateTime', 'desc']];

    if (whereColumnName && whereValue) {
      where = {
        [whereColumnName]: { [Op.iLike]: `%${whereValue}%` },
      };
    }

    if (orderBy && orderDir) {
      order = [[orderBy, orderDir]];
    }

    const data = await Journey.findAndCountAll({
      where,
      order,
      offset,
      limit,
    });

    res.json(getPagingData(data, Number(body.page)));
  } catch (error) {
    next(error);
  }
};

/**
 *
 */
const create: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const {
      departureStationId,
      departureDateTime,
      returnStationId,
      returnDateTime,
      distanceCovered,
    } = req.body as INewJourney;

    const stationData = await Station.findAll({
      where: { stationId: { [Op.in]: [departureStationId, returnStationId] } },
    });

    // check if both departure station and return station exists
    if (stationData.length != 2) {
      throw new Error('Station not found');
    }

    const journeyExists = await Journey.findOne({
      where: {
        departureStationId,
        departureDateTime,
        returnStationId,
        returnDateTime,
      },
    });

    // check if journey detail already exists
    if (journeyExists) {
      throw new Error('Journey detail already exits');
    }

    const departureStation = stationData.find(
      (station) => station.stationId === departureStationId
    );
    const returnStation = stationData.find(
      (station) => station.stationId === returnStationId
    );

    const journey = await Journey.create({
      departureStationId: departureStation?.dataValues.stationId as number,
      departureStationName: departureStation?.dataValues.nameFi as string,
      departureDateTime,
      returnStationId: returnStation?.dataValues.stationId as number,
      returnStationName: returnStation?.dataValues.nameFi as string,
      returnDateTime,
      duration:
        getDateInSecond(returnDateTime) - getDateInSecond(departureDateTime),
      distanceCovered,
    });
    res.json({ journey });
  } catch (error) {
    next(error);
  }
};

export default {
  getOne,
  getAll,
  create,
};
