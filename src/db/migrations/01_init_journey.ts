import { DataTypes, Sequelize } from 'sequelize';
import { Migration } from '..';

export const up: Migration = async ({ context: queryInterface }) => {
  try {
    await queryInterface.createTable('journey_list', {
      journey_id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      departure_date_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      departure_station_id: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        // references: { model: 'station_list', key: 'station_id' },
      },
      departure_station_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      return_date_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      return_station_id: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        // references: { model: 'station_list', key: 'station_id' },
      },
      return_station_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      distance_covered: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
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
