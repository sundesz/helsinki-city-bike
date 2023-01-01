import { DataTypes, Model } from 'sequelize';
import { sequelize } from '..';

export interface IStationAttribute {
  stationId: number;
  fid: number;
  nameEn: string;
  nameFi: string;
  nameSe: string;
  addressFi: string;
  addressSe: string;
  cityFi: string;
  citySe: string;
  operator: string;
  capacity: number;
  posX: number;
  posY: number;
  createdAt?: string;
  updatedAt?: string;
}

export type IStationInput = Omit<IStationAttribute, 'stationId'>;

class StationList
  extends Model<IStationAttribute, IStationInput>
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

StationList.init(
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
      allowNull: false,
    },
    nameSe: {
      type: DataTypes.STRING,
    },
    addressFi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addressSe: {
      type: DataTypes.STRING,
    },
    cityFi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    citySe: {
      type: DataTypes.STRING,
    },
    operator: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    posX: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    posY: {
      type: DataTypes.DECIMAL,
      allowNull: false,
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

export default StationList;
