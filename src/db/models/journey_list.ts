import { Model, DataTypes } from 'sequelize';
import { sequelize } from '..';

export interface IJourneyAttribute {
  journeyId: string;
  departure: string;
  departureStationId: string;
  departureStationName: string;
  return: string;
  returnStationId: string;
  returnStationName: string;
  distanceCovered: number;
  duration: number;
}

// defines the type of the object passed to Sequelize’s model.create
export type IJourneyInput = Omit<IJourneyAttribute, 'journeyId'>;

class Journey
  extends Model<IJourneyAttribute, IJourneyInput>
  implements IJourneyAttribute
{
  public journeyId!: string;

  public departure!: string;
  public departureStationId!: string;
  public departureStationName!: string;

  public return!: string;
  public returnStationId!: string;
  public returnStationName!: string;

  public distanceCovered!: number;
  public duration!: number;
}

Journey.init(
  {
    journeyId: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    departure: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    departureStationId: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    departureStationName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    return: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    returnStationId: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      // references: { model: 'station_list', key: 'station_id' },
    },
    returnStationName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    distanceCovered: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    freezeTableName: true,
    tableName: 'journey_list',
  }
);

export default Journey;
