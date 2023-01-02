import { DataTypes, Model } from 'sequelize';
import { sequelize } from '..';
import { IStationAttribute, StationInputType } from '../../types/station';

class Station
  extends Model<IStationAttribute, StationInputType>
  implements IStationAttribute
{
  public stationId!: number;
  public fid!: number;
  public nameEn!: string;
  public nameFi!: string;
  public nameSe!: string;
  public addressFi!: string;
  public addressSe!: string;
  public cityFi!: string;
  public citySe!: string;
  public operator!: string;
  public capacity!: number;
  public posX!: number;
  public posY!: number;

  public readonly createdAt!: string;
  public readonly updatedAt!: string;
}

Station.init(
  {
    stationId: {
      type: DataTypes.SMALLINT,
      autoIncrement: true,
      primaryKey: true,
    },
    fid: {
      type: DataTypes.SMALLINT,
    },
    nameEn: {
      type: DataTypes.STRING,
    },
    nameFi: {
      type: DataTypes.STRING,
    },
    nameSe: {
      type: DataTypes.STRING,
    },
    addressFi: {
      type: DataTypes.STRING,
    },
    addressSe: {
      type: DataTypes.STRING,
    },
    cityFi: {
      type: DataTypes.STRING,
    },
    citySe: {
      type: DataTypes.STRING,
    },
    operator: {
      type: DataTypes.STRING,
    },
    capacity: {
      type: DataTypes.SMALLINT,
    },
    posX: {
      type: DataTypes.DECIMAL,
    },
    posY: {
      type: DataTypes.DECIMAL,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    freezeTableName: true,
    tableName: 'station_list',
  }
);

export default Station;
