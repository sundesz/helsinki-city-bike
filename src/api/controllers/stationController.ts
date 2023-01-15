import { NextFunction, RequestHandler } from 'express';
import { Op } from 'sequelize';
import { sequelize } from '../../db';
import Journey from '../../db/models/journey_list';
import Station from '../../db/models/station_list';
import { INewStationField, UpdateStationFieldType } from '../../types/station';
import { toNewStation, toUpdateStation } from '../../utils';
import { getPagination, getPagingData } from './helper';

/**
 * Helper function for Journey to get departure stationid and return station id
 * @param departureStationId
 * @param returnStationId
 * @returns
 */
export const getStationData = async (
  departureStationId: number,
  returnStationId: number
) => {
  const stationData = await Station.findAll({
    where: { stationId: { [Op.in]: [departureStationId, returnStationId] } },
  });

  // count the number of stationId (departurestationid and returnstationid)
  const countIds = departureStationId ? 2 : 1;

  // check if both departure station and return station exists
  if (stationData.length != countIds) {
    throw new Error('Station not found');
  }

  const departureStation = departureStationId
    ? stationData.find((station) => station.stationId === departureStationId)
    : undefined;
  const returnStation = stationData.find(
    (station) => station.stationId === returnStationId
  );

  return { departureStation, returnStation };
};

/**
 * Get the average distance covered from the station
 * @param columnName
 * @param whereColumn
 * @param whereValue
 * @returns
 */
const getStationDistanceAndJourney = async (
  whereColumn: string,
  whereValue: string
) => {
  return await Journey.findAll({
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('journey_id')), `totalJourney`],
      [sequelize.fn('AVG', sequelize.col('distance_covered')), `avgDistance`],
    ],
    where: {
      [whereColumn]: whereValue,
    },
  });
};

/**
 * Get most used top five station
 * @param columnName
 * @param whereColumn
 * @param whereValue
 * @returns
 */
export const getTopFiveStation = async (
  columnName: string,
  whereColumn: string,
  whereValue: string
) => {
  const columnId = columnName.toLowerCase().replace('name', 'id');

  return await Journey.findAll({
    attributes: [
      [`${columnId}`, 'stationId'],
      [`${columnName}`, 'nameFi'],
      [sequelize.fn('COUNT', sequelize.col('journey_id')), 'totalJourney'],
    ],
    where: {
      [whereColumn]: whereValue,
    },
    group: [columnName, columnId],
    order: [['totalJourney', 'desc']],
    limit: 5,
  });
};

/**
 * Get station list (id and name)
 * @param req
 * @param res
 * @param next
 */
const getStationList: RequestHandler = async (
  _req,
  res,
  next: NextFunction
) => {
  try {
    const stations = await Station.findAll({
      attributes: ['stationId', 'nameFi'],
      where: { nameFi: { [Op.ne]: '' } },
      order: [['nameFi', 'asc']],
    });

    res.json(stations);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Get a data of a station
 * @param req
 * @param res
 * @param next
 */
const getOne: RequestHandler = async (req, res, next: NextFunction) => {
  const { id: stationId } = req.params as { id: string };
  try {
    const stationData = await Station.findByPk(stationId, {
      attributes: [
        'stationId',
        'nameFi',
        'addressFi',
        'cityFi',
        'posX',
        'posY',
      ],
    });

    if (stationData) {
      // The average distance of a journey starting from the station
      const departureStationData = await getStationDistanceAndJourney(
        'departureStationName',
        stationData.dataValues.nameFi
      );

      // The average distance of a journey ending at the station
      const returnStationData = await getStationDistanceAndJourney(
        'returnStationName',
        stationData.dataValues.nameFi
      );

      // Top 5 most popular departure stations for journeys ending at the station
      const departureStationTop5 = await getTopFiveStation(
        'departure_station_name',
        'returnStationName',
        stationData.dataValues.nameFi
      );

      // Top 5 most popular return stations for journeys starting from the station
      const returnStationTop5 = await getTopFiveStation(
        'return_station_name',
        'departureStationName',
        stationData.dataValues.nameFi
      );

      res.json({
        data: {
          stationId: stationData.dataValues.stationId,
          nameFi: stationData.dataValues.nameFi,
          addressFi: stationData.dataValues.addressFi,
          cityFi: stationData.dataValues.cityFi,
          posX: stationData.dataValues.posX,
          posY: stationData.dataValues.posY,
          departureStation: departureStationData[0],
          returnStation: returnStationData[0],
          top5Departure: departureStationTop5,
          top5Return: returnStationTop5,
        },
      });
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get all station data
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
    let order: [[string, string]] = [['stationId', 'desc']];

    if (whereColumnName && whereValue) {
      where = {
        [whereColumnName]: { [Op.iLike]: `%${whereValue}%` },
      };
    }

    if (orderBy && orderDir) {
      order = [[orderBy, orderDir]];
    }

    const data = await Station.findAndCountAll({
      attributes: [
        'stationId',
        'nameFi',
        'addressFi',
        'cityFi',
        'posX',
        'posY',
      ],
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
 * @param req
 * @param res
 * @param next
 */
const create: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const dataBeforeCreate = toNewStation(req.body as INewStationField);

    // // check if required field have value or not
    // if (!dataBeforeCreate.posX || !dataBeforeCreate.posY || !dataBeforeCreate.name || !dataBeforeCreate.city || !dataBeforeCreate.address) {
    //   throw new Error(
    //     'Fields nameFi, cityFi, addressFi, posX and posY are required'
    //   );
    // }

    // check if station already exists
    const checkStation = await Station.findOne({
      where: { posX: dataBeforeCreate.posX, posY: dataBeforeCreate.posY },
    });

    if (checkStation) {
      throw new Error('Station already exists.');
    }

    const station = await Station.create({ ...dataBeforeCreate });

    res.json({ ...station.dataValues });
  } catch (error: unknown) {
    return next(error);
  }
};

/**
 * Update a station
 * @param req
 * @param res
 * @param next
 */
const update: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const { id: stationId } = req.params as { id: string };
    const dataBeforeUpdate = toUpdateStation(
      req.body as UpdateStationFieldType
    );

    const updatedStation = await Station.update(
      { ...dataBeforeUpdate },
      { where: { stationId }, returning: true }
    );

    if (updatedStation[0]) {
      res.json(updatedStation[1][0]);
    } else {
      res.status(404).end();
    }
  } catch (error: unknown) {
    next(error);
  }
};

export default {
  getOne,
  getAll,
  getStationList,
  create,
  update,
};
