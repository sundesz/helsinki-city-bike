import { DataTypes, Sequelize } from 'sequelize';
import { Migration } from '..';

export const up: Migration = async ({ context: queryInterface }) => {
  try {
    await queryInterface.createTable('journey_list', {
      journey_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      departure_station_id: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        references: { model: 'station_list', key: 'station_id' },
      },
      departure_timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      return_station_id: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        references: { model: 'station_list', key: 'station_id' },
      },
      return_timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      distance_covered: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      duration: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const down: Migration = async ({ context: QueryInterface }) => {
  try {
    await QueryInterface.dropTable('journey_list');
  } catch (error) {
    console.log(error);
  }
};
