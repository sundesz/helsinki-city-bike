import { Model, DataTypes } from 'sequelize';
import { sequelize } from '..';
import { IJourneyAttribute, JourneyInputType } from '../../types/journey';

class Journey
  extends Model<IJourneyAttribute, JourneyInputType>
  implements IJourneyAttribute
{
  public journeyId!: string;

  public departureDateTime!: string;
  public departureStationId!: number;
  public departureStationName!: string;

  public returnDateTime!: string;
  public returnStationId!: number;
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
    departureDateTime: {
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
    returnDateTime: {
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
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'journey_list',
  }
);

export default Journey;
