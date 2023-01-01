import { Model, DataTypes } from 'sequelize';
import { sequelize } from '..';

export interface IJourneyAttribute {
  journeyId: string;
  departureStationId: string;
  departureTimestamp: string;
  returnStationId: string;
  returnTimestamp: string;
  distanceCovered: number;
  duration: number;
}

// defines the type of the object passed to Sequelize’s model.create
export type IJourneyInput = Omit<IJourneyAttribute, 'journeyId'>;

class JourneyList
  extends Model<IJourneyAttribute, IJourneyInput>
  implements IJourneyAttribute
{
  public journeyId!: string;
  public departureStationId!: string;
  public departureTimestamp!: string;
  public returnStationId!: string;
  public returnTimestamp!: string;
  public distanceCovered!: number;
  public duration!: number;
}

JourneyList.init(
  {
    journeyId: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    departureStationId: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: { model: 'station_list', key: 'station_id' },
    },
    departureTimestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    returnStationId: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: { model: 'station_list', key: 'station_id' },
    },
    returnTimestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    distanceCovered: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    duration: {
      type: DataTypes.SMALLINT,
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

export default JourneyList;
