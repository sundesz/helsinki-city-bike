import { DataTypes, Sequelize } from 'sequelize';
import { Migration } from '..';
import { logErrorMessage } from '../../utils';

export const up: Migration = async ({ context: queryInterface }) => {
  try {
    await queryInterface.createTable('station_list', {
      station_id: {
        type: DataTypes.SMALLINT,
        autoIncrement: true,
        primaryKey: true,
      },
      fid: {
        type: DataTypes.SMALLINT,
      },
      name_en: {
        type: DataTypes.STRING,
      },
      name_fi: {
        type: DataTypes.STRING,
      },
      name_se: {
        type: DataTypes.STRING,
      },
      address_fi: {
        type: DataTypes.STRING,
      },
      address_se: {
        type: DataTypes.STRING,
      },
      city_fi: {
        type: DataTypes.STRING,
      },
      city_se: {
        type: DataTypes.STRING,
      },
      operator: {
        type: DataTypes.STRING,
      },
      capacity: {
        type: DataTypes.SMALLINT,
      },
      pos_x: {
        type: DataTypes.DECIMAL,
      },
      pos_y: {
        type: DataTypes.DECIMAL,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  } catch (error: unknown) {
    logErrorMessage(error);
    console.log(error);
  }
};

export const down: Migration = async ({ context: QueryInterface }) => {
  try {
    await QueryInterface.dropTable('station_list');
  } catch (error: unknown) {
    logErrorMessage(error);
    console.log(error);
  }
};
