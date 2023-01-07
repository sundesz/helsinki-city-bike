import { NextFunction, RequestHandler } from 'express';
import { sequelize } from '../../db';
import Journey from '../../db/models/journey_list';
import Station from '../../db/models/station_list';
import { getPagination, getPagingData } from './helper';

/**
 * Get a data of a station
 * @param req
 * @param res
 * @param next
 */
const get: RequestHandler = async (req, res, next: NextFunction) => {
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
        'departure',
        'departureStationName',
        stationData.dataValues.nameFi
      );

      // The average distance of a journey ending at the station
      const returnStationData = await getStationDistanceAndJourney(
        'return',
        'returnStationName',
        stationData.dataValues.nameFi
      );

      // Top 5 most popular departure stations for journeys ending at the station
      const departureStationTop5 = await getTopFiveStation(
        'departureStationName',
        'returnStationName',
        stationData.dataValues.nameFi
      );

      // Top 5 most popular return stations for journeys starting from the station
      const returnStationTop5 = await getTopFiveStation(
        'returnStationName',
        'departureStationName',
        stationData.dataValues.nameFi
      );

      res.json({
        data: {
          stationId: stationData.dataValues.stationId,
          name: stationData.dataValues.nameFi,
          address: stationData.dataValues.addressFi,
          city: stationData.dataValues.cityFi,
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
    const body = req.query as { page: string };

    const { limit, offset } = getPagination(Number(body.page));

    const data = await Station.findAndCountAll({
      order: [['stationId', 'DESC']],
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

/**
 * Get the average distance covered from the station
 * @param columnName
 * @param whereColumn
 * @param whereValue
 * @returns
 */
const getStationDistanceAndJourney = async (
  columnName: string,
  whereColumn: string,
  whereValue: string
) => {
  return await Journey.findAll({
    attributes: [
      [
        sequelize.fn('COUNT', sequelize.col('journey_id')),
        `total_journey_${columnName}`,
      ],
      [
        sequelize.fn('AVG', sequelize.col('distance_covered')),
        `avg_distance_covered_${columnName}`,
      ],
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
  const columnId = columnName.replace('Name', 'Id');

  return await Journey.findAll({
    attributes: [
      `${columnId}`,
      `${columnName}`,
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
