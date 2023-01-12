import { NextFunction, RequestHandler } from 'express';
import { Op } from 'sequelize';
import { sequelize } from '../../db';
import Journey from '../../db/models/journey_list';
import Station from '../../db/models/station_list';
import { INewStation } from '../../types/station';
import { parseNumber, parseString } from '../../utils';
import { getPagination, getPagingData } from './helper';

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
      [`${columnName}`, 'name'],
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
 *
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
      attributes: ['stationId', ['name_fi', 'name']],
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
 *
 * @param req
 * @param res
 * @param next
 */
const create: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const {
      fid,
      nameEn,
      nameFi,
      nameSe,
      addressFi,
      addressSe,
      cityFi,
      citySe,
      operator,
      capacity,
      posX,
      posY,
    } = req.body as INewStation;

    console.log(req.body);

    const positionX = posX ? parseNumber(posX) : 0;
    const positionY = posY ? parseNumber(posY) : 0;
    const name = nameFi ? parseString(nameFi) : '';
    const city = cityFi ? parseString(cityFi) : '';
    const address = addressFi ? parseString(addressFi) : '';

    // check if required field have value or not
    if (!positionX || !positionY || !name || !city || !address) {
      throw new Error(
        'Fields nameFi, cityFi, addressFi, posX and posY are required'
      );
    }

    // check if station already exists
    const checkStation = await Station.findOne({
      where: { posX: positionX, posY: positionY },
    });

    if (checkStation) {
      throw new Error('Station already exists');
    }

    const station = await Station.create({
      fid: fid ? parseNumber(fid) : 0,
      nameEn: nameEn ? parseString(nameEn) : '',
      nameFi: name,
      nameSe: nameSe ? parseString(nameSe) : '',
      addressFi: address,
      addressSe: addressSe ? parseString(addressSe) : '',
      cityFi: city,
      citySe: citySe ? parseString(citySe) : '',
      operator: operator ? parseString(operator) : '',
      capacity: parseNumber(capacity),
      posX: positionX,
      posY: positionY,
    });

    res.json(station);
  } catch (error: unknown) {
    return next(error);
  }
};

export default {
  getOne,
  getAll,
  getStationList,
  create,
};
