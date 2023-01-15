import { NextFunction, RequestHandler } from 'express';
import { Op } from 'sequelize';
import Journey from '../../db/models/journey_list';
import { INewJourneyField, UpdateJourneyFieldType } from '../../types/journey';
import { toNewJourney, toUpdateJourney } from '../../utils';
import { getDateInSecond, getPagination, getPagingData } from './helper';
import { getStationData } from './stationController';

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
 * Create a station
 */
const create: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const body = req.body as INewJourneyField;

    const {
      departureStationId,
      departureDateTime,
      returnStationId,
      returnDateTime,
      distanceCovered,
    } = toNewJourney(body);

    if (departureStationId === returnStationId) {
      throw new Error('Departure and return station should be different.');
    }

    if (getDateInSecond(departureDateTime) >= getDateInSecond(returnDateTime)) {
      throw new Error('Return date should be after departure.');
    }

    const { departureStation, returnStation } = await getStationData(
      departureStationId,
      returnStationId
    );

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
      throw new Error('Journey detail already exits.');
    }

    const journey = await Journey.create({
      departureStationId: departureStation!.dataValues.stationId,
      departureStationName: departureStation!.dataValues.nameFi,
      departureDateTime,
      returnStationId: returnStation!.dataValues.stationId,
      returnStationName: returnStation!.dataValues.nameFi,
      returnDateTime,
      duration:
        getDateInSecond(returnDateTime) - getDateInSecond(departureDateTime),
      distanceCovered,
    });
    res.json({ ...journey.dataValues });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a station
 * @param res
 * @param req
 * @param next
 */
const update: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const { id: journeyId } = req.params as { id: string };
    const dataBeforeUpdate = toUpdateJourney(
      req.body as UpdateJourneyFieldType
    );

    const isJourneyExists = await Journey.findByPk(journeyId);

    if (!isJourneyExists) {
      throw new Error('Station not found');
    }

    const departureStationId = dataBeforeUpdate.departureStationId ?? 0;
    const returnStationId = dataBeforeUpdate.returnStationId;
    const departureDateTime =
      dataBeforeUpdate.departureDateTime ?? isJourneyExists.departureDateTime;

    const { departureStation, returnStation } = await getStationData(
      departureStationId,
      returnStationId
    );

    isJourneyExists.returnStationId = dataBeforeUpdate.returnStationId;
    isJourneyExists.returnStationName = returnStation!.dataValues.nameFi;
    isJourneyExists.returnDateTime = dataBeforeUpdate.returnDateTime;
    isJourneyExists.duration =
      getDateInSecond(dataBeforeUpdate.returnDateTime) -
      getDateInSecond(departureDateTime);
    isJourneyExists.departureStationId =
      dataBeforeUpdate.departureStationId ?? isJourneyExists.departureStationId;
    isJourneyExists.departureStationName = dataBeforeUpdate.departureStationId
      ? departureStation!.dataValues.nameFi
      : isJourneyExists.departureStationName;
    isJourneyExists.departureDateTime = departureDateTime;

    await isJourneyExists.save();

    res.json(isJourneyExists);
  } catch (error: unknown) {
    next(error);
  }
};

export default {
  getOne,
  getAll,
  create,
  update,
};
